# fonts/

The site currently loads Manrope and IBM Plex Mono from the Google Fonts CDN
(see the `<link>` in each page's `<head>`).

To self-host instead, drop these files here and switch the head links for
`<link rel="stylesheet" href="css/fonts.css">`:

- Manrope-Regular.woff2 (400)
- Manrope-Medium.woff2 (500)
- Manrope-SemiBold.woff2 (600)
- Manrope-Bold.woff2 (700)
- Manrope-ExtraBold.woff2 (800)
- IBMPlexMono-Regular.woff2 (400)
- IBMPlexMono-Medium.woff2 (500)

Both families are Open Font License and downloadable from fonts.google.com.
`css/fonts.css` already declares the matching @font-face rules.
