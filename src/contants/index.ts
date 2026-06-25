export const NAV_ITEMS = [
  { title: 'Home', href:'#home'},
  { title: 'About', href: '#about' },
  { title: 'Benefits', href: '#benefits' },
  { title: 'Timeline', href: '#timeline' },
  { title: 'Competition', href: '#competition' },
  { title: 'Gallery', href: '#gallery' },
  { title: 'FAQ', href: '#faq' },
]

export const ADMIN_NAV_ITEMS = [
  { title: 'Home', href: '/dashboard/admin' },
  { title: 'Teams', href: '/dashboard/admin/teams' },
  { title: 'Exams', href: '/dashboard/admin/exams' },
  { title: 'Submissions', href: '/dashboard/admin/submissions' },
  { title: 'Scoreboard', href: '/dashboard/admin/scoreboard' },
  { title: 'Batch', href: '/dashboard/admin/competitions' },
]

export const ABOUT_IMAGES =  [
    {
      src: "https://xltn7i57i8.ufs.sh/f/KPvneZksE9vwwust5PbXK06jdSMipmk3tVOgQzBx9yP2TuEh",
      size: 120,
      style: {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -140%)",
      },
    },
    {
      src: "https://xltn7i57i8.ufs.sh/f/KPvneZksE9vwAytrtp72gEIYKarU9Zpcbw8HoeFhLn5SG4Xi",
      size: 120,
      style: {
        top: "50%",
        left: "50%",
        transform: "translate(40%, -50%)",
      },
    },
    {
      src: "https://xltn7i57i8.ufs.sh/f/KPvneZksE9vw8sQYX6xamD65zudQYUSvqLGclo1tHA4rieOT",
      size: 140,
      style: {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, 40%)",
      },
    },
    {
      src: "https://xltn7i57i8.ufs.sh/f/KPvneZksE9vwhkCuiTZauBKi0FzCW4LGnbxj59MrXwfDJTdY",
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
    img: "https://xltn7i57i8.ufs.sh/f/KPvneZksE9vw9a4jOiAMJsfcyitZ3x0ouB5Oq8T7zaHGY6FI",
    accent: "primary" as const,
    className: "rounded-xl overflow-hidden bg-card border border-border shadow-sm"
  },
  {
    label: "LKTI",
    title: "Lomba Karya Tulis Ilmiah",
    description:
      "Tuangkan ide inovatif Teknik Biomedis berbasis keberlanjutan dan presentasikan karya terbaikmu di babak final.",
    img: "https://xltn7i57i8.ufs.sh/f/KPvneZksE9vwKS0480ksE9vwf3YCnRM7S8FT6ZadrIztbkDU",
    accent: "secondary" as const,
    className: "rounded-xl overflow-hidden bg-card border border-border shadow-sm"
  },
  {
    label: "INFOGRAFIS",
    title: "Lomba Infografis Biomedis",
    description:
      "Kembangkan kreativitasmu dalam menyampaikan informasi Teknik Biomedis melalui desain infografis yang inovatif.",
    img: "https://xltn7i57i8.ufs.sh/f/KPvneZksE9vwChs5vvNQqSI5PrhU89ceMmoyp0nxDTFak27b",
    accent: "accent" as const,
    className: "rounded-xl overflow-hidden bg-card border border-border shadow-sm"
  }
]

export const allowedRegisterPaths = (id: string) => [
  `/auth/register/${id}`,
  `/auth/register/${id}/completed`,
  '/'
]

export const WA_GROUP_LINKS: Record<'OLIMPIADE' | 'LKTI' | 'INFOGRAFIS', string> = {
  OLIMPIADE: 'https://chat.whatsapp.com/H12itJmZMtqGmhX0cQI8Uu?mode=gi_t',
  LKTI: 'https://chat.whatsapp.com/Ed3YvD4bAxmFnx0vc86Fae?mode=gi_t ',
  INFOGRAFIS: 'https://chat.whatsapp.com/FdW6eAzUshtBp5tjNr0YO1?mode=gi_t',
}