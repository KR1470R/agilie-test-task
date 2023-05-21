-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "pair" TEXT NOT NULL,
    "rate" TEXT NOT NULL,
    "balanceCrypto" INTEGER NOT NULL,
    "balanceFiat" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
