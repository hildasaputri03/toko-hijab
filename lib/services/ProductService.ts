import { ProductRepository, ProductWithCategory } from '@/lib/repositories/ProductRepository';
import { Product } from '@prisma/client';

// [OOP Principle: Encapsulation]
// This Service class bundles data and methods that operate on the data.
// It hides the complex logic (like how to fetch data from DB) from the outside world (the UI components).
export class ProductService {
  // We keep the repository private so no one outside can mess with it directly.
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getLatestProducts(limit: number = 20): Promise<ProductWithCategory[]> {
    return this.productRepository.findLatest(limit);
  }

  async getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
    return this.productRepository.findBySlug(slug);
  }
}
