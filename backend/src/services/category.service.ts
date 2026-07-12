import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { categoryRepository } from '../repositories/category.repository';
import type { CreateCategoryDto, UpdateCategoryDto } from '../validators/category.validator';
import { generateSlug } from '../utils/slug';

export const categoryService = {
  getAll: async () => {
    return categoryRepository.findAll();
  },

  getBySlug: async (slug: string) => {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) {
      throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
    }
    return category;
  },

  create: async (dto: CreateCategoryDto) => {
    // Check slug collision
    const slug = generateSlug(dto.name);
    const exists = await categoryRepository.slugExists(slug);
    if (exists) {
      throw new AppError(
        `A category with the name "${dto.name}" already exists`,
        HTTP_STATUS.CONFLICT
      );
    }
    return categoryRepository.create(dto);
  },

  update: async (id: string, dto: UpdateCategoryDto) => {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
    }

    // Check slug collision if name changed
    if (dto.name && dto.name !== existing.name) {
      const newSlug = generateSlug(dto.name);
      const slugTaken = await categoryRepository.slugExists(newSlug, id);
      if (slugTaken) {
        throw new AppError(
          `A category with the name "${dto.name}" already exists`,
          HTTP_STATUS.CONFLICT
        );
      }
    }

    return categoryRepository.update(id, dto);
  },

  delete: async (id: string) => {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
    }
    return categoryRepository.delete(id);
  },
};
