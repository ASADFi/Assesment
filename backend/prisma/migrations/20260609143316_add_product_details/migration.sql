-- AlterTable
ALTER TABLE "products" ADD COLUMN     "city" TEXT,
ADD COLUMN     "condition" TEXT,
ADD COLUMN     "conditionRating" DOUBLE PRECISION,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "domesticReturns" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "internationalReturns" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "length" DOUBLE PRECISION,
ADD COLUMN     "pricingFormat" TEXT DEFAULT 'Fixed Price',
ADD COLUMN     "quantity" INTEGER DEFAULT 1,
ADD COLUMN     "shippingMethod" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION,
ADD COLUMN     "width" DOUBLE PRECISION;
