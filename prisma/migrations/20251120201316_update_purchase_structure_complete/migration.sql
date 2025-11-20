/*
  Warnings:

  - The values [COMPLETED] on the enum `Purchase_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `totalAmount` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceAtPurchase` to the `PurchaseItem` table without a default value. This is not possible if the table is not empty.

*/

-- Primeiro, adicionar a coluna priceAtPurchase com valor default baseado no totalPrice/quantity
ALTER TABLE `purchaseitem` ADD COLUMN `priceAtPurchase` DOUBLE NOT NULL DEFAULT 0;

-- Atualizar priceAtPurchase com o valor calculado (totalPrice / quantity)
UPDATE `purchaseitem` SET `priceAtPurchase` = `totalPrice` / `quantity`;

-- Adicionar totalAmount calculando a soma dos items
ALTER TABLE `purchase` ADD COLUMN `totalAmount` DOUBLE NOT NULL DEFAULT 0;

-- Atualizar totalAmount somando os totalPrice dos items
UPDATE `purchase` p
SET p.totalAmount = (
    SELECT SUM(pi.totalPrice)
    FROM `purchaseitem` pi
    WHERE pi.purchaseId = p.id
);

-- Atualizar enum do status (remover COMPLETED e adicionar novos status)
ALTER TABLE `purchase` 
    MODIFY `status` ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
