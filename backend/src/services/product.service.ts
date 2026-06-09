import { prisma } from "../config/prisma";
import {
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
  PaginationMeta,
} from "../types";
import { Product, Prisma } from "@prisma/client";

export const productService = {
  async create(data: CreateProductDto): Promise<Product> {
    return prisma.product.create({ data });
  },

  async findAll(filters: ProductFilters): Promise<{
    products: Product[];
    meta: PaginationMeta;
  }> {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      sortOrder = "desc",
      condition,
      country,
    } = filters;

    const where: Prisma.ProductWhereInput = {
      ...(category && { category }),
      ...(condition && { condition }),
      ...(country && { country }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {}),
    };

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } });
  },

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    return prisma.product.update({ where: { id }, data });
  },

  async delete(id: string): Promise<Product> {
    return prisma.product.delete({ where: { id } });
  },

  async getCategories(): Promise<string[]> {
    const results = await prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    return results.map((r) => r.category);
  },
};
