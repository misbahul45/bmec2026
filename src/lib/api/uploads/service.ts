export const uploadToImageKit = async (file: File) => {
  const authRes = await fetch("/api/imagekit-auth")
  const auth = await authRes.json()

  const formData = new FormData()

  formData.append("file", file)
  formData.append("fileName", file.name)
  formData.append("token", auth.token)
  formData.append("expire", auth.expire)
  formData.append("signature", auth.signature)
  formData.append("publicKey", auth.publicKey)

  const res = await fetch(
    "https://upload.imagekit.io/api/v1/files/upload",
    {
      method: "POST",
      body: formData,
    }
  )

  const data = await res.json()

  return data.url
}