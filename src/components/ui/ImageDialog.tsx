import { Image } from "@unpic/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./dialog"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  url: string
  title: string
}

const ImageDialog: React.FC<Props> = ({
  open,
  setOpen,
  url,
  title
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
        </DialogHeader>

        <Image
          src={url}
          alt={title}
          layout="fullWidth"
          className="rounded-lg"
        />
      </DialogContent>
    </Dialog>
  )
}

export default ImageDialog