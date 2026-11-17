# ROOTS – Rebuilding Our Outdoors Through Sustainability
### Community-Driven Afforestation, Pedology & Silvicultural Tracking Platform

ROOTS is a professional, production-ready web application engineered to bridge the gap between academic soil chemistry, native botanical science, community plantation drives, and verified 365-day tree survival tracking.

Built for environmental organizations, universities, chemistry/environmental science project exhibitions, and grassroots restoration collectives.

---

## 1. Core Architecture & Feature Matrix

- **Soil & Plant Explorer**:
  - Comprehensive pedological breakdown of the 7 primary Indian soil orders: **Alluvial**, **Black (Regur)**, **Red**, **Laterite**, **Sandy**, **Clay**, and **Loamy**.
  - Detailed silvicultural profiles for 10 keystone endemic trees: **Neem**, **Banyan**, **Peepal**, **Mango**, **Jackfruit**, **Teak**, **Coconut**, **Tamarind**, **Arjun**, and **Indian Gooseberry (Amla)**.
  - Granular parameters: chemical composition, macronutrient availability (NPK), water retention mechanics, internal drainage, pH spectrum, and agronomic limitations.

- **"Discover Your Soil" Diagnostic Tool**:
  - 5-step macroscopic field test assessing ribbon texture feel, colorimetric daylight tone, infiltration drainage velocity, and desiccation consistency.
  - Automated classification engine matching suitable endemic trees and required pit soil amendments.
  - Clear scientific disclaimer stating that macroscopic tests are educational estimates and laboratory potentiometric analysis is mandatory for official CEC/pH certification.

- **Educational Knowledge Hub**:
  - Deep-dive structured learning modules covering:
    1. *Afforestation vs. Reforestation vs. Deforestation* (avoiding grassland destruction).
    2. *Native vs. Invasive Species* (addressing the ecological risks of *Prosopis juliflora* and *Eucalyptus*).
    3. *Soil Chemistry, pH Scale & Essential Macronutrients (NPK)*.
    4. *Scientific 5-Step Tree Plantation Field Technique* (pit aeration, root ball teasing, collar alignment, basin construction).
    5. *Bioclimatic Planting Windows in India* (South-West Monsoon vs North-East Retreating Monsoon).
    6. *The Crucial First 100 Days* (deep soaking vs shallow sprinkling, organic mulching rings, weed competition suppression).

- **Community Plantation Drives**:
  - Complete event discovery system with state filtering, search, and capacity tracking.
  - Robust duplicate registration prevention and capacity barrier checks.
  - Instant volunteer RSVP and self-service cancellation with live roster adjustments.

- **Nearby Drives Geospatial Discovery (Leaflet & OpenStreetMap)**:
  - Interactive map plotting community drives across India with custom botanical pins.
  - Great-circle distance calculations via the Haversine formula.
  - **Privacy First**: Volunteer device coordinates are evaluated strictly in-browser and are never stored or transmitted.

- **Host a Drive (Organizer Portal)**:
  - Multi-step event creation form for coordinators: GPS coordinates, volunteer capacity, target species selection, and soil type matching.
  - Organizer management console for roster inspection, event cancellation, and recording verified trees planted.

- **Tree Adoption & 365-Day Survival Tracking**:
  - Unique Tree ID Generation (e.g. `ROOTS-KA-2026-0101`).
  - Milestone checkpoint timeline: **Day 1**, **Day 30**, **Day 90**, **Day 180**, and **Day 365**.
  - Quantitative metrics: stem height (cm), canopy diameter (cm), maintenance log, and physical health status (*Healthy*, *Needs Attention*, *Under Observation*, *Dead or Replaced*).
  - Individual tree profiles with dynamic stem growth trajectory charts (Recharts).
  - **Strict Survival Calculation**: Survival rates are derived mathematically **only** from trees with physical recorded assessments.

- **Environmental Impact Audit Dashboard**:
  - Live charts evaluating survival rates across endemic species, planned vs realized monthly sapling volume, and soil category distribution.
  - Clear labeling distinguishing verified field audit metrics and demonstration baseline cohorts.

- **Role-Based Access Control (RBAC)**:
  - **Volunteer**: RSVP to drives, adopt trees, submit growth checkpoints, earn milestone recognition (*First Sapling*, *Green Guardian*, *Nature Champion*, *Forest Builder*).
  - **Organizer**: Host drives, manage rosters, verify field counts.
  - **Administrator**: Global audit, registry oversight, and species catalogue curation.

---

## 2. Strict Design System

ROOTS enforces a restrained, editorial nature aesthetic inspired by world-class botanical research institutions and conservation publications:

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **Primary** | `#244C3A` | Deep forest green for branding, primary CTAs, active states |
| **Secondary** | `#819783` | Muted sage for supportive badges, secondary chart metrics |
| **Background** | `#F7F7F2` | Warm off-white reducing eye strain and artificial glare |
| **Surface** | `#FFFFFF` | Pure white for high-contrast informational cards and tables |
| **Main Text** | `#252B27` | Dark charcoal for maximum readability (WCAG AAA compliant) |
| **Secondary Text** | `#747B75` | Muted grey for metadata, timestamps, and scientific labels |
| **Borders** | `#E3E8E2` | Light grey-green subtle borders replacing heavy drop shadows |
| **Subtle Accent** | `#A3A77A` | Earthy olive for alerts and observation indicators |

> **Prohibited UI Attributes**: Zero emojis in the UI, zero purple/neon gradients, zero glassmorphism, zero floating animated particles. The design communicates scientific credibility, trust, and calm authority.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Routing**: React Router DOM (v7)
- **Icons**: Lucide React (Clean botanical, navigational, and scientific icons)
- **Geospatial Mapping**: Leaflet & React-Leaflet with OpenStreetMap tile layers
- **Data Visualization**: Recharts (Customized with the restrained nature palette)
- **Backend / Database**: PostgreSQL via Supabase with complete Row Level Security (RLS)
- **Local Persistence Layer**: Built-in reactive storage engine providing complete interactive CRUD capabilities out-of-the-box before cloud configuration

---

## 4. Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 5. Production Database & Supabase Deployment

The complete database schema with Row Level Security (RLS), custom types, constraints, and indexes is provided in `supabase/schema.sql`.

To link your live Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and execute the contents of `supabase/schema.sql`.
3. Copy your project URL and Anon Key into `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## 6. Academic Chemistry Project Suitability

For college chemistry and environmental engineering exhibitions, ROOTS demonstrates:
1. **Soil Reaction & Buffering Dynamics**: The biochemical mechanisms of soil pH on macro- and micro-element bioavailability.
2. **Pedological Weathering Cycles**: Mineral decomposition from Deccan basalt traps (black soil) versus ancient crystalline granite (red soil).
3. **Cation Exchange Capacity (CEC)**: Humus accumulation through leaf litter composting and root exudate symbioses.
4. **Hydrological Filtration**: Riparian buffer species (*Terminalia arjuna*) arresting silt runoff and reducing turbidity in aquatic water tables.

---

## License
MIT License. Open-source infrastructure for planetary restoration.
