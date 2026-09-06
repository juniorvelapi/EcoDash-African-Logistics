# African Problem Investigation — EcoDash

## Problem Context

Last-mile delivery fleets in South African cities such as Johannesburg face a dual infrastructure challenge: unreliable road surfaces and scheduled **Eskom load-shedding**. Electric delivery vehicles depend on grid-connected and solar-assisted charging stations. When a suburb enters a load-shedding stage, nearby chargers go offline, forcing drivers to reroute under time pressure while managing limited battery reserves.

EcoDash models this scenario. The player navigates an electric delivery van through suburban routes filled with potholes, traffic, construction zones, flooded sections, and wildlife crossings. Solar microgrid zones provide recharge opportunities, but a rotating load-shedding schedule disables specific grids at timed intervals — mirroring real staged blackout timetables published for South African municipalities.

## Physics Mapping

| Real-world factor | Mathematical model in EcoDash |
|---|---|
| Vehicle direction | Heading stored as `angleRadians`; displacement uses `Math.cos(angleRadians)` and `Math.sin(angleRadians)` |
| Velocity & acceleration | `speed` increases/decreases by `accelerationRate`; capped by `maxSpeed` |
| Friction & terrain drag | `speed *= frictionCoefficient * (1 - terrainDrag)` after each frame |
| Wind gusts | Lateral force applied via `velocity + Math.cos(windAngle) * windForce` |
| Battery drain | `batteryLevel -= baseBatteryDrain + (speed² × speedDrainFactor)` while moving |
| Solar recharge | `batteryLevel += rechargeRate` when player circle overlaps an active solar zone |
| Load-shedding | Boolean `isActive` flag on solar zones toggled by schedule; inactive zones cannot recharge |
| Rain visibility | Canvas overlay alpha reduced (`globalAlpha = 0.72`) and extra terrain drag applied |
| Collision detection | AABB rectangle overlap for obstacles; circle distance for delivery checkpoints and solar zones |

These calculations run each animation frame inside the HTML5 Canvas game loop, converting real infrastructure constraints into interactive gameplay mechanics.
