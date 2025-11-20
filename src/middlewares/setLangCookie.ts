import { Request, Response, NextFunction } from "express";

export function setLangCookie(req: Request, res: Response, next: NextFunction) {
  if (!req.cookies.lang) {
    res.cookie("lang", "pt-BR", {
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 ano
      httpOnly: true,
    });
  }
  next();
}
