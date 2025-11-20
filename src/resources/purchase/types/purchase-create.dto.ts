import Joi from "joi";

/**
 * DTO para item de compra
 */
export interface PurchaseItemDTO {
  productId: number;
  quantity: number;
}

/**
 * DTO para criação de compra
 */
export interface CreatePurchaseDTO {
  items: PurchaseItemDTO[];
}

/**
 * Schema de validação Joi para criação de compra
 */
export const createPurchaseSchema = Joi.object<CreatePurchaseDTO>({
  items: Joi.array()
    .items(
      Joi.object<PurchaseItemDTO>({
        productId: Joi.number().integer().positive().required().messages({
          "number.base": "O ID do produto deve ser um número",
          "number.integer": "O ID do produto deve ser um número inteiro",
          "number.positive": "O ID do produto deve ser positivo",
          "any.required": "O ID do produto é obrigatório",
        }),

        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": "A quantidade deve ser um número",
          "number.integer": "A quantidade deve ser um número inteiro",
          "number.min": "A quantidade deve ser no mínimo {#limit}",
          "any.required": "A quantidade é obrigatória",
        }),
      }),
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Os itens devem ser um array",
      "array.min": "Pelo menos um item deve ser fornecido",
      "any.required": "Os itens são obrigatórios",
    }),
});
