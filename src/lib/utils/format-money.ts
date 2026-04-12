export const formatMoney = (value: number | string) => {
  const amount =
    typeof value === "string" ? Number(value) : value

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}


