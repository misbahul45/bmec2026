import { Link } from '@tanstack/react-router'
import { NAV_ITEMS } from '~/contants'
import { InstagramLogoIcon, WhatsappLogoIcon, GoogleDriveLogoIcon } from '@phosphor-icons/react'

const socials = [
  {
    Icon: InstagramLogoIcon,
    href: 'https://instagram.com/bmec_unair',
    label: 'Instagram BMEC',
    tooltip: 'Instagram BMEC',
  },
  {
    Icon: WhatsappLogoIcon,
    href: 'https://wa.me/6281234567890',
    label: 'WhatsApp BMEC',
    tooltip: 'WA BMEC',
  },
  {
    Icon: GoogleDriveLogoIcon,
    href: 'https://drive.google.com',
    label: 'Guidebook BMEC',
    tooltip: 'Guidebook',
  },
]

const Footer = () => {
  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-12 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex flex-col gap-2 max-w-xs">
            <h2 className="text-base font-bold tracking-wide">BMEC 2026</h2>
            <p className="text-sm text-background/55 leading-relaxed">
              Kompetisi tahunan Teknik Biomedis oleh HMTB Universitas Airlangga. Bangun ide, kembangkan solusi, jadilah inovator.
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-background/40 mb-1">
              Navigasi
            </span>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="text-sm text-background/60 hover:text-background transition-colors duration-200"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-between flex-col md:flex-row gap-4 pt-6 border-t border-background/10">
          <div className="flex items-center gap-3">
            {socials.map(({ Icon, href, label, tooltip }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group relative p-2.5 rounded-xl bg-background/8 hover:bg-background/15 transition-colors duration-200"
              >
                <Icon size={18} className="text-background/70 group-hover:text-background transition-colors duration-200" />
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-background text-foreground text-[10px] font-semibold px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
                  {tooltip}
                </span>
              </a>
            ))}
          </div>

          <p className="text-xs text-background/35">
            © {new Date().getFullYear()} BMEC · HMTB Universitas Airlangga
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
