import Joi from "joi";

/**
 * DTO para criação de produto
 */
export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
}

/**
 * Schema de validação Joi para criação de produto
 */
export const createProductSchema = Joi.object<CreateProductDTO>({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "O nome deve ser um texto",
    "string.empty": "O nome não pode estar vazio",
    "string.min": "O nome deve ter pelo menos {#limit} caracteres",
    "string.max": "O nome deve ter no máximo {#limit} caracteres",
    "any.required": "O nome é obrigatório",
  }),

  description: Joi.string().min(10).max(500).required().messages({
    "string.base": "A descrição deve ser um texto",
    "string.empty": "A descrição não pode estar vazia",
    "string.min": "A descrição deve ter pelo menos {#limit} caracteres",
    "string.max": "A descrição deve ter no máximo {#limit} caracteres",
    "any.required": "A descrição é obrigatória",
  }),

  price: Joi.number().positive().precision(2).required().messages({
    "number.base": "O preço deve ser um número",
    "number.positive": "O preço deve ser positivo",
    "any.required": "O preço é obrigatório",
  }),

  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "O estoque deve ser um número",
    "number.integer": "O estoque deve ser um número inteiro",
    "number.min": "O estoque não pode ser negativo",
    "any.required": "O estoque é obrigatório",
  }),
});
