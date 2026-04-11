import { imagekitAuth, saveUpload } from "~/server/image-kit.auth"

export const uploadToImageKit = async (file: File) => {
  const auth = await imagekitAuth()

  const formData = new FormData()
  formData.append("file", file)
  formData.append("fileName", file.name)
  formData.append("token", auth.token)
  formData.append("expire", auth.expire.toString())
  formData.append("signature", auth.signature)
  formData.append("publicKey", auth.publicKey!)

  const res = await fetch(
    "https://upload.imagekit.io/api/v1/files/upload",
    {
      method: "POST",
      body: formData,
    }
  )

  const data = await res.json()

  console.log(data)

  await saveUpload({
    data: {
      url: data.url,
      fileId: data.fileId,
    },
  })

  return data.url
}