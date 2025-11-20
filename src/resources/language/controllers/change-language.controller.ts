import { Request, Response } from "express";

export function changeLanguageController(req: Request, res: Response) {
  const { lang } = req.query;

  if (!lang || typeof lang !== "string") {
    return res
      .status(400)
      .json({ message: "Idioma não especificado ou inválido" });
  }

  res.cookie("lang", lang, {
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 ano
    httpOnly: true,
  });

  return res.status(200).json({ message: `Idioma alterado para ${lang}` });
}
