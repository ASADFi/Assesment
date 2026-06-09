import { Request, Response, NextFunction } from "express";
import { productService } from "../services/product.service";
import { sendSuccess, sendError } from "../utils/response";
import { ProductFilters } from "../types";

export const productController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.create(req.body);
      sendSuccess(res, product, "Product created successfully", 201);
    } catch (err) {
      next(err);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: ProductFilters = {
        category: req.query.category as string | undefined,
        search: req.query.search as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 12,
        sortBy: req.query.sortBy as ProductFilters["sortBy"],
        sortOrder: req.query.sortOrder as ProductFilters["sortOrder"],
        condition: req.query.condition as string | undefined,
        country: req.query.country as string | undefined,
      };

      const { products, meta } = await productService.findAll(filters);
      sendSuccess(res, products, undefined, 200, meta);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.findById(req.params.id);
      if (!product) {
        sendError(res, "Product not found", 404);
        return;
      }
      sendSuccess(res, product);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.update(req.params.id, req.body);
      sendSuccess(res, product, "Product updated successfully");
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productService.delete(req.params.id);
      sendSuccess(res, null, "Product deleted successfully");
    } catch (err) {
      next(err);
    }
  },

  async getCategories(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const categories = await productService.getCategories();
      sendSuccess(res, categories);
    } catch (err) {
      next(err);
    }
  },
};
