import { Request, Response, NextFunction } from "express";

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Você precisa estar logado" });
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session.userType !== "admin") {
    return res
      .status(403)
      .json({ error: "Acesso permitido somente para admin" });
  }
  next();
}
