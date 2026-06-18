import { BaseRepository } from './BaseRepository';
import { prisma } from '@/lib/prisma';
import { Product, Prisma } from '@prisma/client';

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

// [OOP Principle: Inheritance]
// ProductRepository inherits all methods (create, delete, etc.) from BaseRepository.
// We don't need to write them again!
export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    // [OOP Principle: Polymorphism]
    // We pass the specific model (prisma.product) to the parent class.
    // The parent class treats it generically, but it acts specifically for Products.
    super(prisma.product);
  }

  async findAllWithCategory(): Promise<ProductWithCategory[]> {
    return this.model.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string): Promise<ProductWithCategory | null> {
    return this.model.findUnique({
      where: { slug },
      include: { category: true },
    });
  }

  async findLatest(limit: number = 20): Promise<ProductWithCategory[]> {
    return this.model.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
  }
}
