import { Router } from "express";
import { z } from "zod";
import { productController } from "../controllers/product.controller";
import { validate } from "../middleware/validate";

const router = Router();

const createProductSchema = z.object({
  // Basic
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")).transform(v => v === "" ? undefined : v),

  // Condition
  condition: z.enum(["New", "Used"]).optional(),
  conditionRating: z.number().min(0).max(10).optional(),

  // Physical dimensions
  length: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),

  // Pricing
  pricingFormat: z.enum(["Fixed Price", "Auctions"]).optional(),
  quantity: z.number().int().min(1).optional(),

  // Shipping & Location
  shippingMethod: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  domesticReturns: z.boolean().optional(),
  internationalReturns: z.boolean().optional(),
});

const updateProductSchema = createProductSchema.partial();

router.get("/categories", productController.getCategories);
router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", validate(createProductSchema), productController.create);
router.put("/:id", validate(updateProductSchema), productController.update);
router.delete("/:id", productController.remove);

export default router;
