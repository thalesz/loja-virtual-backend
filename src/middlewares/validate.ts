import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

/**
 * Middleware de validação genérico usando Joi
 * @param schema - Schema Joi para validação
 * @returns Middleware Express
 */
export function validate(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Garante que req.body existe
    if (!req.body || typeof req.body !== "object") {
      res.status(400).json({
        message: "Erro de validação",
        errors: [
          { field: "body", message: "Corpo da requisição inválido ou ausente" },
        ],
      });
      return;
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Retorna todos os erros, não apenas o primeiro
      stripUnknown: true, // Remove campos não definidos no schema
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      res.status(400).json({
        message: "Erro de validação",
        errors,
      });
      return;
    }

    // Substitui req.body pelos dados validados e sanitizados
    req.body = value;
    next();
  };
}
