-- CreateTable
CREATE TABLE "Partner" (
    "id" SERIAL NOT NULL,
    "cnpj" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cellphone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "instagram" TEXT,
    "website" TEXT,
    "note" TEXT,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Partner_cnpj_key" ON "Partner"("cnpj");
