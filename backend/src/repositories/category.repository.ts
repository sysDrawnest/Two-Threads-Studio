import prisma from '../prisma';
import type { CreateCategoryDto, UpdateCategoryDto } from '../validators/category.validator';
import { generateSlug } from '../utils/slug';

export const categoryRepository = {
  findAll: async () => {
    return prisma.category.findMany({
      where:   { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: { select: { products: { where: { status: 'ACTIVE' } } } },
      },
    });
  },

  findBySlug: async (slug: string) => {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        _count: { select: { products: { where: { status: 'ACTIVE' } } } },
      },
    });
  },

  findById: async (id: string) => {
    return prisma.category.findUnique({ where: { id } });
  },

  slugExists: async (slug: string, excludeId?: string): Promise<boolean> => {
    const cat = await prisma.category.findUnique({ where: { slug }, select: { id: true } });
    if (!cat) return false;
    if (excludeId && cat.id === excludeId) return false;
    return true;
  },

  create: async (dto: CreateCategoryDto) => {
    const slug = generateSlug(dto.name);
    return prisma.category.create({
      data: {
        name:        dto.name,
        slug,
        description: dto.description,
        image:       dto.image,
        isActive:    dto.isActive ?? true,
        sortOrder:   dto.sortOrder ?? 0,
      },
    });
  },

  update: async (id: string, dto: UpdateCategoryDto) => {
    const updateData: Record<string, unknown> = { ...dto };

    // Regenerate slug if name changed
    if (dto.name) {
      updateData.slug = generateSlug(dto.name);
    }

    return prisma.category.update({
      where: { id },
      data:  updateData,
    });
  },

  delete: async (id: string) => {
    return prisma.category.delete({ where: { id } });
  },
};
