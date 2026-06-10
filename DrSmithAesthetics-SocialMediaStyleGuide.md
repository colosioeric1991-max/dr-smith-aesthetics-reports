# Dr Smith Aesthetics — Brand & Style Guide

Use this as context when asking Claude to create social media posts, graphics, email content, or any other branded material.

---

## 1. Brand Identity

**Clinic:** Dr Smith Aesthetics at Ink Beauty Skin Clinic
**Location:** 341 Kennington Road, London, SE11 4QE
**Website:** www.lsmithaesthetics.com
**Phone:** +44 7835 959075
**Email:** info@lsmithaesthetics.com

**Who Dr Smith is:** Dr Lee Smith is a GMC-registered medical doctor (MBBS, BSc Hons), NHS-trained, who specialises in aesthetic medicine. He runs his own clinic in South London and also teaches botox, filler and skin rejuvenation to doctors, nurses and other medical professionals (at Cosmetic Courses). Key credentials: MBBS · BSc (Hons) · NHS Trained · GMC Registered · Medical Educator.

**Positioning:** Premium, medically-led aesthetics. Not a beauty salon — a clinic run by a qualified doctor. The brand sits between clinical authority and warm approachability: elevated and confident without being cold or corporate.

---

## 2. Colour Palette

| Name        | Hex       | Usage                                              |
|-------------|-----------|-----------------------------------------------------|
| Deep Teal   | `#0D3B4F` | Primary — text, dark section backgrounds, buttons  |
| Mid Teal    | `#1A5068` | Hover states, secondary dark surfaces               |
| Light Teal  | `#2A7090` | Italic emphasis text on light backgrounds           |
| Gold        | `#C9A96E` | Accent — labels, dividers, icons, highlight lines   |
| Cream       | `#F5F1EB` | Soft background (treatment pages, intro sections)   |
| Warm White  | `#FDFAF6` | Clean background (hero, about section)              |
| Muted Grey  | `#6B7280` | Body text on light backgrounds, captions            |
| Charcoal    | `#4A5568` | Body copy (slightly darker variant of muted)        |

**On dark (teal) backgrounds:** body text uses `rgba(248,244,238,0.65)` — a warm near-white at reduced opacity, never pure white.

---

## 3. Typography

### Fonts
- **Cormorant Garamond** — headings and display text. Elegant serif. Used at light (300) or regular (400) weight. Italic is a key stylistic feature.
  - Google Fonts: `Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400`
- **DM Sans** — body and UI text. Clean modern sans-serif. Used at light (300), regular (400), or medium (500) weight.
  - Google Fonts: `DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500`

### Type Scale & Styles

**Eyebrow label** (above headings)
- Font: DM Sans, 0.68–0.7rem, weight 500, uppercase, letter-spacing 0.20–0.22em
- Colour: Gold `#C9A96E`
- Always preceded by a short gold rule line (26–30px × 1px)
- Example: `— ANTI-WRINKLE · KENNINGTON, LONDON`

**Hero / Display heading**
- Font: Cormorant Garamond, ~5rem (clamp 2.8rem → 5.2rem), weight 300
- Line-height: 1.06, letter-spacing: -0.025em
- Key italic word(s) in `<em>`: weight 400, colour Light Teal `#2A7090`
- Example: *Precision aesthetics,* naturally.

**Section heading**
- Font: Cormorant Garamond, ~3.4rem (clamp 2.2rem → 3.4rem), weight 300
- Line-height: 1.1, letter-spacing: -0.02em
- Colour: Deep Teal (light bg) or Warm White (dark bg)

**Card / component title**
- Font: Cormorant Garamond, ~1.35rem, weight 500
- Colour: Deep Teal or Warm White depending on background

**Body text**
- Font: DM Sans, 0.85–1rem, weight 300
- Line-height: 1.75–1.85

**Small label / caption**
- Font: DM Sans, 0.68–0.75rem, weight 500, uppercase or regular
- Letter-spacing: 0.09–0.16em
- Colour: Gold or Muted Grey

**Stat / large number**
- Font: Cormorant Garamond, ~2.2–2.6rem, weight 300, line-height 1
- Colour: Deep Teal

---

## 4. Design Patterns

### Gold Rule Lines
Used as section borders and decorative accents throughout the site. Always gradient — never a solid line.
```
background: linear-gradient(to right, transparent, rgba(201,169,110,0.35), transparent);
height: 1px;
```

### Radial Glow
Subtle gold atmospheric glow on section corners/backgrounds:
```
background: radial-gradient(ellipse at 80% 50%, rgba(201,169,110,0.08) 0%, transparent 65%);
```

### Cards on Dark Backgrounds
Cards/panels sitting on the deep teal background use translucent layering:
- Default: `background: rgba(255,255,255,0.04)`
- Hover: `background: rgba(255,255,255,0.10)`
- Border: `1.5px solid rgba(255,255,255,0.07)`

### Frosted / Floating Card
Used for badges and floating info panels:
```
background: rgba(253,250,246,0.92);
backdrop-filter: blur(12px);
border: 1px solid rgba(201,169,110,0.35);
box-shadow: 0 8px 28px rgba(13,59,79,0.14);
border-radius: 3px;
```

### Buttons
**Primary button**
- Background: Deep Teal `#0D3B4F`, text: Warm White
- Font: DM Sans, 0.76rem, weight 500, uppercase, letter-spacing 0.14em
- Border-radius: 2px
- Shadow: `0 2px 0 rgba(13,59,79,0.3), 0 6px 24px rgba(13,59,79,0.18)`
- Hover: Mid Teal background, `translateY(-2px)`, deeper shadow

**Ghost / text button**
- Teal text, uppercase, small right-arrow that shifts right on hover
- Transition: spring cubic-bezier `cubic-bezier(0.34, 1.56, 0.64, 1)`

### Dividers (light backgrounds)
```
border-top: 1px solid rgba(13,59,79,0.1);
```

### Shadows
Layered and teal-tinted — never flat grey:
```
box-shadow: 0 2px 0 rgba(13,59,79,0.3), 0 6px 24px rgba(13,59,79,0.18);
```

### Border Radius
Very subtle: `2px` for buttons, `3–4px` for cards and images, `6px` for large containers. Not soft or pill-shaped.

---

## 5. Layout Principles

- **Section padding:** 4–6rem vertical, 5.5rem horizontal on desktop. Reduces on tablet/mobile.
- **Max content width:** 860px for content pages, 400px for subtitle text blocks.
- **Grid-based:** 2-col (55/45 hero), 3-col (features, stats), 4-col (cards grid).
- **Transitions:** Only `transform` and `opacity`. Duration 0.2–0.3s. Spring easing for movement.
- **Never use `transition: all`.**

---

## 6. Treatments & Products

**Treatments offered:**
Anti-wrinkle injections · Dermal fillers · Skin boosters · Polynucleotides (PNYN) · PRP & PRF · Microneedling · Obagi Medical skincare

**Product brands:**
Allergan · Teoxane · Juvederm · Skinvive · Obagi Medical · Plinest · Sunekos · Dermapen

---

## 7. Voice & Tone (Copy)

- Calm, informed, and reassuring. Never hype or exaggeration.
- Confident but never arrogant. Let credentials speak quietly, not loudly.
- Warm without being casual. No slang, no excessive exclamation marks.
- Educational — posts should leave the reader knowing something they didn't before.
- "Natural results" is a core brand value. Avoid language that implies dramatic transformation.
- Never use: "Are you ready to glow?", "treat yourself!", "babe", "queen", "anti-ageing".
- Instead of "anti-ageing": use "softening lines", "refreshed appearance", "subtle rejuvenation".
- No bullet lists in narrative copy — write in flowing prose paragraphs.
- Emojis: one or two maximum, placed naturally, never decorative.

---

## 8. Social Media Caption Structure

1. **Opening line:** a quiet hook — an observation, a fact, a gentle question. Not a shout.
2. **Body:** 2–3 short prose paragraphs. No bullet points.
3. **Close:** a gentle CTA — "Book a consultation via the link in bio."

**Hashtags:** 5–8, specific and professional. Mix of treatment, location, and credential tags.
```
#DrSmithAesthetics #MedicalAesthetics #AestheticDoctor #SouthLondon #Kennington
#AntiWrinkle #DermalFillers #NaturalResults #MedicalDoctor #LondonClinic
```

---

## 9. Image & Graphic Direction

- **Palette on graphics:** Deep Teal backgrounds with Warm White text, or Cream backgrounds with Deep Teal text. Gold used as accent only — never dominant.
- **Text hierarchy on graphics:** Eyebrow label (gold, small caps) → Main heading (Cormorant Garamond, light/italic) → Subtext (DM Sans, light weight).
- **Photography style:** Clean, clinical but warm. Natural light. Neutral backgrounds. No heavy filters.
- **Image treatments:** Gradient overlays `linear-gradient(to top, rgba(13,59,79,0.5), transparent)` for text legibility. Subtle colour tint with `mix-blend-multiply`.
- **Avoid:** stock photo aesthetics, overly saturated edits, bright white clinical sterility, anything that looks like a spa or beauty salon.
