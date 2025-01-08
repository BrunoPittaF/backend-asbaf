-- AlterTable
ALTER TABLE "Notices" ALTER COLUMN "image" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "filepath" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "userCpf" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_filepath_key" ON "Image"("filepath");

-- CreateIndex
CREATE UNIQUE INDEX "Image_userCpf_key" ON "Image"("userCpf");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userCpf_fkey" FOREIGN KEY ("userCpf") REFERENCES "User"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;
