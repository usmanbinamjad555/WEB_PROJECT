import { z } from 'zod';

export const CreateOrderSchema = z.object({
  shippingAddress: z.object({
    street: z.string().min(3, "Street path validation failure (min 3 chars required)."),
    city: z.string().min(2, "City designation invalid."),
    state: z.string().min(2, "State string context invalid."),
    country: z.string().min(2, "Country ISO identity invalid."),
    zipCode: z.string().min(4, "Postal context mapping is too short.")
  }),
  items: z.array(
    z.object({
      productId: z.string().uuid("Product cross-reference identifier must be absolute UUID version 4."),
      quantity: z.number().int().positive("Item unit requests require continuous positive natural integers.")
    })
  ).min(1, "Order structure must contain at least 1 discrete commercial item.")
});