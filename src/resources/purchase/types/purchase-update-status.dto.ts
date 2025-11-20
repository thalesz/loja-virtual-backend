import Joi from "joi";
import { PurchaseStatus } from "@prisma/client";

export interface UpdatePurchaseStatusDTO {
  status: PurchaseStatus;
}

export const updatePurchaseStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(PurchaseStatus))
    .required(),
});
