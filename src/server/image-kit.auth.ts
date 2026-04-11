import { createServerFn } from "@tanstack/react-start"
import crypto from "crypto"

export const imagekitAuth = createServerFn().handler(async () => {
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