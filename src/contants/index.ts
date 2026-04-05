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