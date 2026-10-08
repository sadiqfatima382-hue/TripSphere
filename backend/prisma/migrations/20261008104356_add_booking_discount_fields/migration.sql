-- Add columns as nullable first
ALTER TABLE "bookings"
ADD COLUMN "discountAmount" DECIMAL(12,2),
ADD COLUMN "subtotal" DECIMAL(12,2);

-- Fill existing bookings
UPDATE "bookings"
SET
  "subtotal" = "totalPrice",
  "discountAmount" = 0;

-- Make the columns required
ALTER TABLE "bookings"
ALTER COLUMN "subtotal" SET NOT NULL,
ALTER COLUMN "discountAmount" SET NOT NULL;