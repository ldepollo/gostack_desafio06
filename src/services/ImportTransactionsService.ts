/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import csvParse from 'csv-parse';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();

    async function loadCSV(): Promise<any[]> {
      const readCSVStream = fs.createReadStream(filePath);

      const parseStream = csvParse({
        from_line: 2,
        ltrim: true,
        rtrim: true,
      });

      const parseCSV = readCSVStream.pipe(parseStream);

      const lines: any[] | PromiseLike<any[]> = [];

      parseCSV.on('data', line => {
        lines.push(line);
      });

      await new Promise(resolve => {
        parseCSV.on('end', resolve);
      });

      return lines;
    }

    const data = await loadCSV();

    const transactions: Transaction[] = [];

    for (var i = 0; i < data.length; i++) {
      const eachTransaction = await createTransactionService.execute({
        title: data[i][0],
        value: data[i][2],
        type: data[i][1],
        category: data[i][3],
      });

      transactions.push(eachTransaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
