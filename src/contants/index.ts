export const NAV_ITEMS = [
  { title: 'Home', href:'#home'},
  { title: 'About', href: '#about' },
  { title: 'Benefits', href: '#benefits' },
  { title: 'Timeline', href: '#timeline' },
  { title: 'Competition', href: '#competition' },
  { title: 'Gallery', href: '#gallery' },
]

export const ABOUT_IMAGES =  [
    {
      src: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&q=80",
      size: 120,
      style: {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -140%)",
      },
    },
    {
      src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
      size: 120,
      style: {
        top: "50%",
        left: "50%",
        transform: "translate(40%, -50%)",
      },
    },
    {
      src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80",
      size: 140,
      style: {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, 40%)",
      },
    },
    {
      src: "https://plus.unsplash.com/premium_photo-1673953509975-576678fa6710?w=500",
      size: 120,
      style: {
        top: "50%",
        left: "50%",
        transform: "translate(-140%, -50%)",
      },
    },
  ] as const;



  export const COMPETITIONS = [
  {
    label: "OLIMPIADE",
    title: "Olimpiade Teknik Biomedis",
    description:
      "Uji kemampuan Matematika, Fisika, Kimia, Biologi, dan Teknik Biomedis dasar dengan soal bertingkat dan tryout eksklusif.",
    img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop",
    accent: "primary" as const,
    className: "rounded-xl overflow-hidden bg-card border border-border shadow-sm"
  },
  {
    label: "LKTI",
    title: "Lomba Karya Tulis Ilmiah",
    description:
      "Tuangkan ide inovatif Teknik Biomedis berbasis keberlanjutan dan presentasikan karya terbaikmu di babak final.",
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    accent: "secondary" as const,
    className: "rounded-xl overflow-hidden bg-card border border-border shadow-sm"
  },
  {
    label: "INFOGRAFIS",
    title: "Lomba Infografis Biomedis",
    description:
      "Kembangkan kreativitasmu dalam menyampaikan informasi Teknik Biomedis melalui desain infografis yang inovatif.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    accent: "accent" as const,
    className: "rounded-xl overflow-hidden bg-card border border-border shadow-sm"
  }
]