import { Button } from '../ui/button'

type Accent = 'primary' | 'secondary' | 'accent'

const labelColors: Record<Accent, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary-foreground',
  accent: 'text-accent-foreground',
}

const buttonVariants: Record<Accent, 'default' | 'secondary' | 'outline'> = {
  primary: 'default',
  secondary: 'secondary',
  accent: 'outline',
}

interface CompetitionCardProps {
  label: string
  title: string
  description: string
  img: string
  className: string
  accent: Accent
  isActive?: boolean
  onClick?: () => void
}

const CompetitionCard = ({ label, title, description, img, className, accent, isActive, onClick }: CompetitionCardProps) => {
  return (
    <div
      className={`${className} cursor-pointer select-none`}
      onClick={onClick}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="px-4 py-4 flex flex-col gap-2">
        <span className={`text-[10px] font-bold uppercase tracking-widest ${labelColors[accent]}`}>
          {label}
        </span>
        <h3 className="text-sm font-bold text-foreground leading-tight">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{description}</p>
        {isActive && (
          <Button
            variant={buttonVariants[accent]}
            size="sm"
            className="w-fit rounded-lg mt-1 text-xs"
          >
            Daftar Lomba
          </Button>
        )}
      </div>
      <img
        src={img}
        alt={title}
        width={320}
        height={160}
        className="w-full object-cover"
        style={{ height: '120px' }}
      />
    </div>
  )
}

export default CompetitionCard
