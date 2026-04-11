import { formatMoney } from "~/lib/utils/format-money"

type Props = {
  name: string
  batch: {
    name: string
    price: number
  }
}

const CompetitionPriceCard = ({ name, batch }: Props) => {
  return (
    <div className="rounded-lg border bg-muted/40 p-4 mb-4 space-y-3">
      <div>
        <p className="text-sm text-muted-foreground">
          Anda mendaftar pada
        </p>

        <div className="mt-1 flex items-center justify-between">
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">
              {batch.name}
            </p>
          </div>

          <p className="text-lg font-bold">
            {formatMoney(batch.price)}
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-background p-3">
        <p className="text-xs text-muted-foreground mb-1">
          Transfer pembayaran ke:
        </p>

        <p className="font-semibold">
          BCA • 091891981 (Nayla)
        </p>
      </div>
    </div>
  )
}

export default CompetitionPriceCard