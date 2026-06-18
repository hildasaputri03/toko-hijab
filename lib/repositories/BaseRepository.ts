import { prisma } from '@/lib/prisma';

// [OOP Principle: Abstraction]
// Interface defines the contract (what methods must exist) without showing implementation details.
export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: number | string): Promise<T | null>;
  create(data: any): Promise<T>;
  update(id: number | string, data: any): Promise<T>;
  delete(id: number | string): Promise<T>;
}

// [OOP Principle: Inheritance]
// This abstract class serves as a parent class. Other repositories will inherit from this
// to reuse the common logic (findAll, findById, etc.) without rewriting it.
export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected model: any;

  constructor(model: any) {
    this.model = model;
  }

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  async findById(id: number | string): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
    });
  }

  async create(data: any): Promise<T> {
    return this.model.create({
      data,
    });
  }

  async update(id: number | string, data: any): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: number | string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }
}
