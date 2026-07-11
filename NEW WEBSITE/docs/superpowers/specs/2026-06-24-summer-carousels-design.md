# Summer Carousels Design Spec
Date: 2026-06-24

## Overview
Two Instagram carousels using the approved Dr Smith Aesthetics template (Sculptra/HarmonyCa system). No product image on slide 1 — large Cormorant Garamond text reveal instead (Option A, user-approved).

## Design System
Inherits from `/NEW WEBSITE/export-carousel-sculptra.mjs`:
- Canvas: 1080×1080px
- Palette: --teal #0D3B4F, --gold #C9A96E, --cream #F5F1EB, --warm #FDFAF6
- Fonts: Cormorant Garamond (headings) + DM Sans (body/UI)
- Alternating cream/teal slides, progress bar, 3-column footer
- 5 slides per carousel

## Carousel 1: Summer Skin Guide
Output: `/Summer-Skin-Carousel/`
Script: `export-carousel-summer-skin.mjs`

| Slide | Bg | Content |
|-------|-----|---------|
| 1 | Cream | Eyebrow: "Summer Skin · Dr Smith Aesthetics" / Title: "Your Summer Skin Guide" / Sub: "Five things your skin needs right now." |
| 2 | Teal | Hook: "The heat is doing more damage to your skin than you realise." |
| 3 | Cream | "The non-negotiables" — SPF Daily, Hydration Inside and Out, Vitamin C in the Morning, Double Cleanse at Night |
| 4 | Teal | "Summer mistakes that age your skin" — Skipping SPF Indoors, Over-Exfoliating, Using Heavy Moisturisers, Forgetting Your Neck and Hands |
| 5 | Cream | CTA: "Ready to protect your skin this summer?" + Book a Consultation |

## Carousel 2: Heat and Aesthetic Treatments
Output: `/Summer-Treatments-Carousel/`
Script: `export-carousel-summer-treatments.mjs`

| Slide | Bg | Content |
|-------|-----|---------|
| 1 | Cream | Eyebrow: "Aesthetics in Summer · Dr Smith Aesthetics" / Title: "Heat and Your Treatment" / Sub: "What to know before and after your appointment." |
| 2 | Teal | Hook: "Heat doesn't just affect your skin. It affects how your treatments perform." |
| 3 | Cream | "How to prepare in the heat" — Avoid Heat 24 Hours Before, Arrive Cooled Down, Stay Hydrated, No Fresh Sunburn |
| 4 | Teal | "Protecting your results from the heat" — No Direct Sun for Two Weeks, Skip the Sauna, Hold Off on Beach Holidays, SPF is Non-Negotiable |
| 5 | Cream | CTA: "Planning a treatment this summer?" + Book a Consultation |
