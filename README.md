# Shiftora — Professional Packers & Movers

A modern, trustworthy, lead-generation-focused web application for **Shiftora**, a professional relocation and logistics service provider. Built with original branding, a clean component hierarchy, centralized configuration, and responsive mobile-first architecture.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom `@theme` tokens
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Code Quality**: TypeScript compiler strict type checking (`tsc -b --noEmit`)

---

## Design System & Palette

- **Primary Brand Navy**: Deep navy tones (`#080e1e`, `#0d1833`, `#14244c`) denoting security and stability.
- **Accent Amber/Orange**: High-visibility call-to-action color (`#ff6b00`, `#e85900`) for primary conversion buttons ("Get a Free Quote", "Call Now").
- **Neutrals**: Crisp white `#ffffff` and subtle slate backgrounds (`#f8fafc`, `#f1f5f9`).
- **Typography**: Inter (Google Fonts) with clean sans-serif system fallbacks.

---

## Project Structure

```text
shiftora-website/
├── public/
│   ├── favicon.svg          # Custom brand SVG icon
│   └── shiftora-hero-truck.jpg # Custom Shiftora branded logistics photography
├── src/
│   ├── assets/              # Static media assets & icons
│   ├── components/
│   │   ├── common/          # Shared reusable UI primitives
│   │   │   ├── Button.tsx   # Polymorphic button (variants: primary, secondary, outline, ghost, white)
│   │   │   ├── Container.tsx# Responsive container max-width wrapper
│   │   │   ├── Header.tsx   # Responsive topbar & header with call/quote CTAs & mobile drawer
│   │   │   └── Footer.tsx   # Comprehensive footer with contact info & coverage links
│   │   └── home/            # Homepage sections (Phase 2)
│   │       ├── HeroSection.tsx        # Hero with headline "Moving Made Simple. Every Step of the Way.", CTAs, and photography
│   │       ├── TrustStrip.tsx         # 4 service benefits (Careful Packing, Transparent Quotes, Move Support, Planned Delivery)
│   │       ├── ServicesSection.tsx    # 6 responsive cards (Household, Office, Domestic, Vehicle, Packing, Storage)
│   │       ├── WhyShiftoraSection.tsx # Honest values (Careful Handling, Organized Planning, Clear Estimates, Communication)
│   │       ├── HowItWorksSection.tsx  # 4-step workflow (Requirements, Quote, Packing & Pickup, Delivery & Placement)
│   │       ├── ServiceAreasSection.tsx# Verified metropolitan hubs & route inquiries
│   │       └── QuoteCtaSection.tsx    # High-conversion moving quote form with transparent backend notice
│   ├── config/
│   │   └── siteConfig.ts    # Centralized configuration (contact, 6 services, verified hubs, trust pillars)
│   ├── pages/
│   │   └── HomePage.tsx     # Homepage composition of all 7 sections
│   ├── types/
│   │   └── index.ts         # TypeScript definitions
│   ├── App.tsx              # Main application shell
│   ├── index.css            # Tailwind v4 import & custom tokens
│   └── main.tsx             # React DOM entry point
├── index.html               # Semantic HTML shell with SEO meta tags & font preconnect
├── package.json
├── tsconfig.json
├── vite.config.ts           # Vite configuration with React and Tailwind v4 plugins
└── README.md
```

---

## Centralized Configuration

All business contact details, operational hours, services, and geographic coverage areas are stored in a single source of truth at [`src/config/siteConfig.ts`](file:///c:/Users/Admin/Desktop/shiftora-website/src/config/siteConfig.ts):

- **Hotline & Tel Link**: `contact.phoneDisplay` and `contact.phoneRaw`
- **Email**: `contact.email`
- **Operating Hours**: `contact.operatingHours`
- **Service Hubs**: `serviceAreas` (Mumbai, Bengaluru, Delhi NCR, Hyderabad, Pune, Chennai, etc.)
- **Service Offerings**: `services` (Household, Office Shifting, Vehicle Moving, Storage)

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher (v24.x tested)
- **npm**: v9.0.0 or higher

> **Windows PowerShell Note**: If running into PowerShell script execution policy restrictions with `npm`, invoke commands using `npm.cmd` or run inside `cmd.exe`.

### 1. Installation

Install all dependencies:

```bash
npm install
# Or on Windows PowerShell:
npm.cmd install
```

### 2. Development Server

Start both the backend API server and frontend client concurrently:

```bash
npm run dev
# Or on Windows PowerShell:
npm.cmd run dev
```

- **Frontend Client**: [http://localhost:5173/](http://localhost:5173/) (proxies `/api` to backend)
- **Backend API**: `http://127.0.0.1:5000/api/health`

Individual service runners:
- Frontend only: `npm run dev:client`
- Backend only: `npm run dev:server`

### 3. Backend API & Database

- **Database**: Native `node:sqlite` in `server/data/shiftora.db` with WAL mode and prepared statements.
- **Health Check**: `GET /api/health` -> `{ status: "ok", timestamp: ... }`
- **Enquiry Endpoint**: `POST /api/enquiries`
  - Body: `{ customerName, originCity, destinationCity, serviceType, moveDate, phone, website_url }`
  - Validates required fields, service allowlist, date ranges, and normalized Indian mobile numbers (`+91XXXXXXXXXX`).
  - Honeypot anti-spam protection via hidden `website_url` field.
  - Rate limiting: max 10 requests / 15 minutes per IP address.
  - Generates unguessable reference codes (`SHF-YYMM-XXXXXX`).

### 4. Type Checking & Verification

Run strict TypeScript type verification across all frontend modules:

```bash
npm run lint
# Or on Windows PowerShell:
npm.cmd run lint
```

### 5. Production Build

Compile TypeScript and build the optimized production bundle with Vite:

```bash
npm run build
# Or on Windows PowerShell:
npm.cmd run build
```

Production output will be generated in the `dist/` folder.

### 6. Preview Production Build

Locally preview the built application:

```bash
npm run preview
# Or on Windows PowerShell:
npm.cmd run preview
```

---

## Phase 1 Deliverables Summary

- [x] Initialized clean React 19 + TypeScript + Vite 6 + Tailwind CSS v4 environment.
- [x] Configured Lucide React icons.
- [x] Created centralized business contact & service area configuration (`siteConfig.ts`).
- [x] Created shared responsive `Header` with phone hotlines, quote action, and mobile hamburger drawer.
- [x] Created shared `Footer` with service links, operating hours, and location coverage.
- [x] Built responsive homepage shell with original Shiftora branding, core services, 4-step process, trust pillars, and honest quote estimation preview (no simulated fake submissions).
- [x] Verified zero security vulnerabilities (`npm audit`) and clean production build with 0 TypeScript/compilation errors.

---

## Next Steps (Awaiting Approval)

1. Dedicated service detail pages (`/services/household-relocation`, etc.).
2. Interactive quote estimator / volumetric calculator.
3. Production lead capture API integration with email/SMS notifications.
4. Comprehensive SEO metadata & JSON-LD schema generation (LocalBusiness / MovingCompany).
