export default function manifest() {
  return {
    name: 'Peteora Headless Shopify Store',
    short_name: 'Peteora',
    description: 'A premium headless Shopify store for Peteora.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#198e7a',
    icons: [
      {
        src: '/peteora.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
