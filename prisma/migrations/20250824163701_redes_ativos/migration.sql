-- CreateTable
CREATE TABLE "Rede" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rede" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Ativo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ip" TEXT NOT NULL,
    "mac" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "redeId" INTEGER NOT NULL,
    CONSTRAINT "Ativo_redeId_fkey" FOREIGN KEY ("redeId") REFERENCES "Rede" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
