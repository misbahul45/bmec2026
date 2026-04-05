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
      aria-label={item.title}
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-linear-to-t from-foreground/60 to-transparent" />
      {isActive && (
        <div className="absolute bottom-2 left-2 right-2">
          <span className="text-[9px] font-bold text-white uppercase tracking-widest truncate block">
            {item.category}
          </span>
        </div>
      )}
    </button>
  )
}
