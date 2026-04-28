import type { GalleryItem } from './bmecGallery'

interface Props {
  item: GalleryItem
  index: number
  isActive: boolean
  onClick: (index: number) => void
}

export function GalleryCard({ item, index, isActive, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(index)}
      className={`gallery-thumb relative shrink-0 rounded-2xl overflow-hidden cursor-pointer outline-none transition-all duration-300 ${
        isActive
          ? 'w-40 md:w-52 ring-2 ring-primary shadow-lg'
          : 'w-28 md:w-36 hover:opacity-80'
      }`}
      style={{ height: '88px' }}
    >
      <img
        src={item.image}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-linear-to-t from-foreground/60 to-transparent" />
    </button>
  )
}
