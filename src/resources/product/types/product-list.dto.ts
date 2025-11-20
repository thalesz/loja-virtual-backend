import Joi from "joi";

/**
 * DTO para parâmetros de paginação na listagem de produtos
 */
export interface ListProductsDTO {
  page?: number;
  limit?: number;
}

/**
 * Schema de validação Joi para listagem paginada de produtos
 * Valida query parameters (page e limit)
 */
export const listProductsSchema = Joi.object<ListProductsDTO>({
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
