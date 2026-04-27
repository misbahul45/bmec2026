import { createServerFn } from "@tanstack/react-start"
import crypto from "crypto"
import { prisma } from "~/lib/utils/prisma"
import { authMiddleware } from "~/middleware/auth.middleware"
import { fileSchema } from "~/schemas/general.schema"
import { z } from "zod"

export const imagekitAuth = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const token = crypto.randomBytes(16).toString("hex")
    const expire = Math.floor(Date.now() / 1000) + 2400

    const signature = crypto
      .createHmac("sha1", process.env.IMAGEKIT_PRIVATE_KEY!)
      .update(token + expire)
      .digest("hex")

    return {
      token,
      expire,
      signature,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    }
  })

export const saveUpload = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(fileSchema)
  .handler(async ({ data }) => {
    const file = await prisma.file.upsert({
      where: { fileId: data.fileId },
      update: { url: data.url },
      create: {
        url: data.url,
        fileId: data.fileId,
      },
    })

    return file
  })

export const deleteUpload = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.object({ url: z.string() }))
  .handler(async ({ data }) => {
    const file = await prisma.file.findFirst({ where: { url: data.url } })

    if (!file) return { success: false }

    await fetch(`https://api.imagekit.io/v1/files/${file.fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.IMAGEKIT_PRIVATE_KEY! + ":").toString("base64")}`,
      },
    })

    await prisma.file.delete({ where: { fileId: file.fileId } })

    return { success: true }
  })