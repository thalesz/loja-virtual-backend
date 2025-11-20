import Joi from "joi";

/**
 * DTO para parâmetros da rota de buscar compra específica
 */
export interface GetPurchaseDTO {
  id: number;
}

/**
 * Schema de validação Joi para parâmetros da rota
 */
export const getPurchaseSchema = Joi.object<GetPurchaseDTO>({
  id: Joi.number().integer().min(1).required().messages({
    "number.base": "O ID deve ser um número",
    "number.integer": "O ID deve ser um número inteiro",
    "number.min": "O ID deve ser no mínimo {#limit}",
    "any.required": "O ID é obrigatório",
  }),
});
