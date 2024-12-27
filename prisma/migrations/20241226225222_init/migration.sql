-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
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
    "position" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "numberAssociated" TEXT NOT NULL,
    "userCpf" TEXT NOT NULL,

    CONSTRAINT "Relatives_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Notices" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Notices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Relatives_cpf_key" ON "Relatives"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_cnpj_key" ON "Partner"("cnpj");

-- AddForeignKey
ALTER TABLE "Relatives" ADD CONSTRAINT "Relatives_userCpf_fkey" FOREIGN KEY ("userCpf") REFERENCES "User"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;
