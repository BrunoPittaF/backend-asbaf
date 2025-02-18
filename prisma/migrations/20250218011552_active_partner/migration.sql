/*
  Warnings:

  - Added the required column `isPartner` to the `Partner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Partner" ADD COLUMN     "isPartner" BOOLEAN NOT NULL;
