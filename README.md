# EcoDash — African Logistics Simulation

EcoDash is an HTML5 Canvas logistics simulation set in Johannesburg, South Africa. You drive an electric delivery van, complete package deliveries, and manage battery power while navigating load-shedding blackouts, potholes, traffic, and other infrastructure challenges.

## Project Description

This project models the real-world impact of **Eskom load-shedding** on electric last-mile delivery fleets. Solar microgrid zones allow battery recharge, but scheduled blackout stages disable specific grids — forcing route planning under energy constraints. The simulation uses trigonometry, vector movement, collision detection, and object-oriented JavaScript to create an interactive African-inspired delivery experience.

**Theme:** Load-shedding affecting EV deliveries in South Africa  
**Player vehicle:** Electric delivery van (ground movement)  
**Technologies:** HTML5 Canvas, CSS3, Vanilla JavaScript

## Installation / Setup

No build tools or dependencies are required.

1. Clone the repository:
   ```bash
   git clone https://github.com/juniorvelapi/EcoDash-African-Logistics.git
   cd EcoDash-African-Logistics
   ```
2. Open `index.html` in a modern web browser (Chrome, Firefox, Edge, or Safari).
3. Click **Start Delivery** and use the controls below.

### Controls

| Key | Action |
|-----|--------|
| W / ↑ | Accelerate |
| S / ↓ | Brake |
| A / ← | Turn left |
| D / → | Turn right |
| P | Pause / Resume |
| M | Mute / Unmute sound |

## Project Folder Structure

```
EcoDash-African-Logistics/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── Game.js
│   ├── Player.js
│   ├── Physics.js
│   ├── Collision.js
│   ├── Obstacle.js
│   ├── SolarZone.js
│   ├── Environment.js
│   ├── LoadSheddingSchedule.js
│   ├── UI.js
│   ├── Storage.js
│   └── Audio.js
├── docs/
│   ├── african-problem-report.md
│   ├── ai-reflection.md
│   └── wireframe.svg
└── assets/
    ├── audio/
    └── images/
```

## Original Feature (No Generative AI)

**Dynamic Load-Shedding Schedule Panel** — implemented in [`js/LoadSheddingSchedule.js`](js/LoadSheddingSchedule.js)

This feature displays a live timetable on the HUD showing:
- The currently active load-shedding zone
- The next zone in the rotation queue
- A countdown timer with progress bar until the next stage switch

It uses a circular buffer of zone names, frame-based countdown logic, and canvas-drawn UI — written without AI assistance. See [`docs/ai-reflection.md`](docs/ai-reflection.md) for details.

## Game Features

- Smooth EV movement with velocity, acceleration, and trigonometric direction (`Math.sin`, `Math.cos`)
- Battery drain while driving and recharge inside Solar Microgrid Zones
- Load-shedding zones that disable nearby solar chargers on a rotating schedule
- Obstacles: potholes, rivers, wildlife, fallen trees, traffic, construction zones
- AABB and circle-based collision detection
- Rain reduces visibility; wind applies lateral force
- Mission score, distance travelled, and energy efficiency metrics
- High scores saved to `localStorage`
- Start, Pause, and Game Over screens with restart (no page refresh)
- Web Audio API sound effects and African-inspired visual theme

## AI Usage Disclosure Table

| Date | Tool | Purpose | How Modified |
|------|------|---------|--------------|
| 2026-09-06 | Cursor AI | Project structure and file scaffolding | Renamed classes/variables, adjusted module boundaries to match my design |
| 2026-09-06 | Cursor AI | Player movement physics draft | Tuned acceleration, friction, and battery drain after manual play-testing |
| 2026-09-06 | Cursor AI | Collision detection boilerplate | Added obstacle-specific responses and African-themed obstacle types |
| 2026-09-06 | Cursor AI | README section outline | Rewrote all content in my own words; filled assignment-specific sections |
| 2026-09-06 | Cursor AI | CSS layout suggestions | Changed colours to African palette; adjusted responsive canvas container |

Full reflection: [`docs/ai-reflection.md`](docs/ai-reflection.md)

## Documentation

- [African Problem Investigation Report](docs/african-problem-report.md)
- [AI Reflection Log](docs/ai-reflection.md)
- [Wireframe](docs/wireframe.svg)

## Author

Junior Velapi — WAS262 Web Animation Scripting
