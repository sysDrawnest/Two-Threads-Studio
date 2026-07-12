import prisma from '../prisma';
import type { CreateCollectionDto, UpdateCollectionDto } from '../validators/collection.validator';
import { generateSlug } from '../utils/slug';

export const collectionRepository = {
  findAll: async () => {
    return prisma.collection.findMany({
      where:   { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: { select: { products: { where: { status: 'ACTIVE' } } } },
      },
    });
  },

  findBySlug: async (slug: string) => {
    return prisma.collection.findUnique({
      where: { slug },
      include: {
        _count: { select: { products: { where: { status: 'ACTIVE' } } } },
      },
    });
  },

  findById: async (id: string) => {
    return prisma.collection.findUnique({ where: { id } });
  },

  slugExists: async (slug: string, excludeId?: string): Promise<boolean> => {
    const col = await prisma.collection.findUnique({ where: { slug }, select: { id: true } });
    if (!col) return false;
    if (excludeId && col.id === excludeId) return false;
    return true;
  },

  create: async (dto: CreateCollectionDto) => {
    const slug = generateSlug(dto.name);
    return prisma.collection.create({
      data: {
        name:        dto.name,
        slug,
        description: dto.description,
        bannerImage: dto.bannerImage,
        isActive:    dto.isActive ?? true,
        sortOrder:   dto.sortOrder ?? 0,
      },
    });
  },

  update: async (id: string, dto: UpdateCollectionDto) => {
    const updateData: Record<string, unknown> = { ...dto };

    if (dto.name) {
      updateData.slug = generateSlug(dto.name);
    }

    return prisma.collection.update({
      where: { id },
      data:  updateData,
    });
  },

  delete: async (id: string) => {
    return prisma.collection.delete({ where: { id } });
  },
};
