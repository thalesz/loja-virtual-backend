import Joi from "joi";

/**
 * DTO para parâmetros de paginação na listagem de compras
 */
export interface ListMyPurchasesDTO {
  page?: number;
  limit?: number;
}

/**
 * Schema de validação Joi para listagem paginada de compras
 */
export const listMyPurchasesSchema = Joi.object<ListMyPurchasesDTO>({
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
});
