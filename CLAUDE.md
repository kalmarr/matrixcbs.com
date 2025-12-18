# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static HTML website for MATRIX CBS Kft., a Hungarian adult education institution (felnőttképzési intézmény) based in Szeged. The site is hosted via ISPConfig and contains no build system or dynamic backend.

## Repository Structure

```
ispconfig/web/           # Web root directory
├── index.html           # Homepage
├── rolunk.html          # About page
├── trening.html         # Training offerings page
├── szolgaltasok.html    # Services page
├── contact.html         # Contact page with Google Maps and company details
├── css/style.css        # Custom styles (referenced but not in repo)
├── img/                 # Training-related images
├── error/               # Custom HTTP error pages (400-503)
├── stats/               # AWStats generated analytics reports
├── .htaccess            # Apache configuration (Drupal-style rules)
└── FontAwesome/         # Font Awesome icons (referenced but not in repo)
```

## Technology Stack

- **Frontend**: Static HTML5, Bootstrap 4.0.0 (CDN), Font Awesome
- **Server**: Apache with mod_rewrite (ISPConfig hosting)
- **Analytics**: Google Analytics (G-4H0BCH8311)
- **Social Integration**: Facebook Messenger chat plugin on contact page

## Development Notes

- All pages use Bootstrap 4.0.0 via CDN with SRI hashes
- Custom CSS expected at `css/style.css` (file not present in repo)
- Font Awesome expected at `FontAwesome/` directory (not present in repo)
- The `.htaccess` contains Drupal-style rules but this is a static site
- Site language is Hungarian (lang="hu")
- Pages share common navigation structure that must be manually synchronized

## Page Structure Pattern

Each HTML page follows this pattern:
1. Head section with Bootstrap CSS, custom CSS, Font Awesome, and Google Analytics
2. Fixed navbar with logo and navigation links
3. Container-based content area with Bootstrap grid
4. Orange footer (#f68616) with social media links and registration number
5. jQuery, Popper.js, Bootstrap JS at the end

## External Dependencies

- Bootstrap 4.0.0 CSS/JS from maxcdn.bootstrapcdn.com
- jQuery 3.2.1 from code.jquery.com
- Popper.js 1.12.9 from cdnjs.cloudflare.com
- Google Analytics gtag.js
- Facebook SDK for customer chat

## Notes

- The training page (trening.html) is missing footer and closing scripts
- Navigation must be updated across all 5 HTML files when changed
- Company registration number: B/2020/000668
