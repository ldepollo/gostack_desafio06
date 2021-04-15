import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface Request {
  category: string;
}

export default class CheckAndCreateCategoryService {
  public async execute({ category }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const categoryAlreadyExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (categoryAlreadyExists) {
      return categoryAlreadyExists;
    }

    const newCategory = categoryRepository.create({
      title: category,
    });

    await categoryRepository.save(newCategory);

    return newCategory;
  }
}
