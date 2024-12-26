-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "cellphone" TEXT NOT NULL,
    "cellMobile" TEXT NOT NULL,
    "cellSefaz" TEXT,
    "sectorSefaz" TEXT,
    "numberAssociated" TEXT NOT NULL,
    "instagram" TEXT,
    "threads" TEXT,
    "facebook" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relatives" (
    "id" SERIAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "numberAssociated" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Relatives_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Relatives_cpf_key" ON "Relatives"("cpf");

-- AddForeignKey
ALTER TABLE "Relatives" ADD CONSTRAINT "Relatives_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
