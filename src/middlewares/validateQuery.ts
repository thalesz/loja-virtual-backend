import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

/**
 * Middleware de validação para query parameters usando Joi
 * @param schema - Schema Joi para validação
 * @returns Middleware Express
 */
export function validateQuery(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      res.status(400).json({
        message: "Erro de validação nos parâmetros",
        errors,
      });
      return;
    }

    // Armazena os dados validados em uma propriedade customizada
    (req as any).validatedQuery = value;
    next();
  };
}
