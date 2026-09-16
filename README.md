# Compliance On Demand: static site

Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Structure

```
index.html            Home
why_us.html           Why us
services.html         Services (ten service lines, tabbed)
aml_dealcheck.html    AML Dealcheck
people.html           People
clients.html          Clients
insights.html         Insights
contact.html          Contact, with the live enquiry form
terms.html            Terms and conditions
notice.html           Legal and regulatory notice
cookies.html          Manage cookie consent
robots.txt
sitemap.xml
assets/               Images, logos, portraits, hero photographs
css/site.css          The whole stylesheet: tokens, components, one 1060px breakpoint
js/site.js            Nav drawer, hero crossfade, service tabs, FAQ accordion,
                      bio modals, cookie preferences, enquiry form
```

## Editing

- Shared header and footer markup is duplicated in every page. Change it in one
  page, then copy the `<header>` / `<footer>` block into the others.
- The active nav link is driven by `<body data-page="...">`; the values are listed
  at the top of `css/site.css`.
- All design tokens (colour, gutter, shadow) are CSS custom properties in
  `:root` at the top of `css/site.css`.
- The enquiry form posts to Web3Forms. The access key lives in
  `data-key` on `#enquiry` in contact.html. Web3Forms keys are public
  identifiers, not secrets; restrict the key to the live domain in the
  Web3Forms dashboard.

## Deploying

Upload the folder as-is. On Cloudflare Pages / Netlify / any static host, set the
output directory to the folder itself and leave the build command empty.
