import { PrismaClient } from "@prisma/client";
import * as Minio from "minio";

declare global {
   var prisma: PrismaClient | undefined;
   var minio: Minio.Client | undefined;
}

const s3 =
   globalThis.minio ||
   new Minio.Client({
      endPoint: String(process.env.MINIO_ENDPOINT),
      port: Number(process.env.MINIO_PORT),
      useSSL: false,
      accessKey: String(process.env.MINIO_ACCESS_KEY),
      secretKey: String(process.env.MINIO_SECRET_KEY),
   });

if (process.env.NODE_ENV !== "production") globalThis.minio = s3;

export default s3;
