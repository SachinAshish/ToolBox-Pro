import { PrismaClient } from "@prisma/client";
import * as Minio from "minio";

declare global {
   var prisma: PrismaClient | undefined;
   var minio: Minio.Client | undefined;
}

const db = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

export default db;
