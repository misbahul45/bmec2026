import React from 'react'
import { Link } from '@tanstack/react-router'
import { NAV_ITEMS } from '~/contants'
import { cn } from '~/lib/utils'
import { InstagramLogoIcon, WhatsappLogoIcon } from '@phosphor-icons/react'

const Footer = () => {
  return (
    <footer className="relative bg-black text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-12 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">BMEC 2026</h2>
            <p className="text-sm text-white/60 max-w-xs">
              Kompetisi modern untuk generasi inovatif. Bangun ide, kembangkan solusi, dan jadilah bagian dari masa depan.
            </p>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="text-white/60 hover:text-white transition"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-between flex-col md:flex-row gap-6">
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <InstagramLogoIcon size={18} />
            </a>

            <a
              href="https://wa.me/628123456789"
              target="_blank"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <WhatsappLogoIcon size={18} />
            </a>
          </div>

          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} BMEC 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer