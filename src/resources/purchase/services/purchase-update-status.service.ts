import prisma from "../../../prisma/prisma.client";
import { PurchaseStatus } from "@prisma/client";
import { UpdatePurchaseStatusDTO } from "../types/purchase-update-status.dto";

export const updatePurchaseStatusService = async (
  id: number,
  data: UpdatePurchaseStatusDTO,
) => {
  const purchase = await prisma.purchase.findUnique({
    where: { id },
  });

  if (!purchase) {
    throw new Error("Compra não encontrada");
  }

  const currentStatus = purchase.status;
  const newStatus = data.status;

  if (currentStatus === newStatus) {
    return purchase;
  }

  // Validação de transição
  if (newStatus === PurchaseStatus.CANCELLED) {
    if (currentStatus === PurchaseStatus.DELIVERED) {
      throw new Error("Não é possível cancelar uma compra entregue");
    }
  } else {
    // Fluxo normal
    if (currentStatus === PurchaseStatus.CANCELLED) {
      throw new Error(
        "Não é possível alterar o status de uma compra cancelada",
      );
    }

    if (currentStatus === PurchaseStatus.DELIVERED) {
      throw new Error("Compra já foi entregue");
    }

    // PENDING -> PROCESSING -> SHIPPED -> DELIVERED
    const flow: Record<string, PurchaseStatus[]> = {
      [PurchaseStatus.PENDING]: [PurchaseStatus.PROCESSING],
      [PurchaseStatus.PROCESSING]: [PurchaseStatus.SHIPPED],
      [PurchaseStatus.SHIPPED]: [PurchaseStatus.DELIVERED],
      [PurchaseStatus.DELIVERED]: [],
    };

    const allowedNextStatuses = flow[currentStatus] || [];
    if (!allowedNextStatuses.includes(newStatus)) {
      throw new Error(
        `Transição de status inválida de ${currentStatus} para ${newStatus}`,
      );
    }
  }

  const updateData: any = {
    status: newStatus,
  };

  if (newStatus === PurchaseStatus.CANCELLED) {
    updateData.cancelledAt = new Date();
  }

  const updatedPurchase = await prisma.purchase.update({
    where: { id },
    data: updateData,
  });

  return updatedPurchase;
};
