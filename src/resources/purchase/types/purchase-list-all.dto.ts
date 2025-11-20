import Joi from "joi";

/**
 * DTO para parâmetros de listagem de todas as compras (admin)
 */
export interface ListAllPurchasesDTO {
  page?: number;
  limit?: number;
  status?: string;
  userId?: number;
  startDate?: string;
  endDate?: string;
}

/**
 * Schema de validação Joi para listagem de todas as compras
 */
export const listAllPurchasesSchema = Joi.object<ListAllPurchasesDTO>({
  page: Joi.number().integer().min(1).optional().default(1).messages({
    "number.base": "O número da página deve ser um número",
    "number.integer": "O número da página deve ser um número inteiro",
    "number.min": "O número da página deve ser no mínimo {#limit}",
  }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(10)
    .messages({
      "number.base": "O limite deve ser um número",
      "number.integer": "O limite deve ser um número inteiro",
      "number.min": "O limite deve ser no mínimo {#limit}",
      "number.max": "O limite deve ser no máximo {#limit}",
    }),

  status: Joi.string()
    .valid("PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED")
    .optional()
    .messages({
      "string.base": "O status deve ser uma string",
      "any.only":
        "O status deve ser um dos seguintes: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED",
    }),

  userId: Joi.number().integer().min(1).optional().messages({
    "number.base": "O ID do usuário deve ser um número",
    "number.integer": "O ID do usuário deve ser um número inteiro",
    "number.min": "O ID do usuário deve ser no mínimo {#limit}",
  }),

  startDate: Joi.date().iso().optional().messages({
    "date.base": "A data inicial deve ser uma data válida",
    "date.format": "A data inicial deve estar no formato ISO 8601",
  }),

  endDate: Joi.date().iso().optional().messages({
    "date.base": "A data final deve ser uma data válida",
    "date.format": "A data final deve estar no formato ISO 8601",
  }),
});
