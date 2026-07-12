import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { collectionRepository } from '../repositories/collection.repository';
import type { CreateCollectionDto, UpdateCollectionDto } from '../validators/collection.validator';
import { generateSlug } from '../utils/slug';

export const collectionService = {
  getAll: async () => {
    return collectionRepository.findAll();
  },

  getBySlug: async (slug: string) => {
    const collection = await collectionRepository.findBySlug(slug);
    if (!collection) {
      throw new AppError('Collection not found', HTTP_STATUS.NOT_FOUND);
    }
    return collection;
  },

  create: async (dto: CreateCollectionDto) => {
    const slug = generateSlug(dto.name);
    const exists = await collectionRepository.slugExists(slug);
    if (exists) {
      throw new AppError(
        `A collection with the name "${dto.name}" already exists`,
        HTTP_STATUS.CONFLICT
      );
    }
    return collectionRepository.create(dto);
  },

  update: async (id: string, dto: UpdateCollectionDto) => {
    const existing = await collectionRepository.findById(id);
    if (!existing) {
      throw new AppError('Collection not found', HTTP_STATUS.NOT_FOUND);
    }

    if (dto.name && dto.name !== existing.name) {
      const newSlug = generateSlug(dto.name);
      const slugTaken = await collectionRepository.slugExists(newSlug, id);
      if (slugTaken) {
        throw new AppError(
          `A collection with the name "${dto.name}" already exists`,
          HTTP_STATUS.CONFLICT
        );
      }
    }

    return collectionRepository.update(id, dto);
  },

  delete: async (id: string) => {
    const existing = await collectionRepository.findById(id);
    if (!existing) {
      throw new AppError('Collection not found', HTTP_STATUS.NOT_FOUND);
    }
    return collectionRepository.delete(id);
  },
};
