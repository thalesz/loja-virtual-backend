import Joi from "joi";

/**
 * DTO para atualização de produto
 * Todos os campos são opcionais para permitir atualização parcial
 */
export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

/**
 * Schema de validação Joi para atualização de produto
 * Permite atualização parcial - todos os campos são opcionais
 * Mas pelo menos um campo deve ser fornecido
 */
export const updateProductSchema = Joi.object<UpdateProductDTO>({
  name: Joi.string().min(3).max(100).optional().messages({
    "string.base": "O nome deve ser um texto",
    "string.empty": "O nome não pode estar vazio",
    "string.min": "O nome deve ter pelo menos {#limit} caracteres",
    "string.max": "O nome deve ter no máximo {#limit} caracteres",
  }),

  description: Joi.string().min(10).max(500).optional().messages({
    "string.base": "A descrição deve ser um texto",
    "string.empty": "A descrição não pode estar vazia",
    "string.min": "A descrição deve ter pelo menos {#limit} caracteres",
    "string.max": "A descrição deve ter no máximo {#limit} caracteres",
  }),

  price: Joi.number().positive().precision(2).optional().messages({
    "number.base": "O preço deve ser um número",
    "number.positive": "O preço deve ser positivo",
  }),

  stock: Joi.number().integer().min(0).optional().messages({
    "number.base": "O estoque deve ser um número",
    "number.integer": "O estoque deve ser um número inteiro",
    "number.min": "O estoque não pode ser negativo",
  }),
})
  .min(1)
  .messages({
    "object.min": "Pelo menos um campo deve ser fornecido para atualização",
  });
