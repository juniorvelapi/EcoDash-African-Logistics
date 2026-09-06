# AI Reflection Log — EcoDash

## Ethical AI Use Statement

AI tools were used as **assistants for structure and drafting**, not as a substitute for understanding. Every suggestion was reviewed, modified, tested in the browser, and integrated to match the load-shedding EV delivery concept.

## How AI Suggestions Were Evaluated and Improved

| Area | AI suggestion | My evaluation / modification |
|---|---|---|
| Project structure | Suggested splitting code into separate JS files by responsibility | Accepted the modular layout but renamed classes and variables to match my naming style (`missionScore`, `batteryLevel`, `ElectricVehicle`) |
| Player physics | Provided basic sin/cos movement snippet | Adjusted acceleration, friction, and battery drain values after play-testing; added terrain drag and wind force from `Environment.js` |
| Collision handling | Generic AABB overlap function | Extended with obstacle-specific responses (pothole slowdown, traffic bounce, wildlife penalty) tied to African infrastructure types |
| UI screens | HTML overlay panel pattern | Rewrote copy to describe Johannesburg load-shedding context; styled with African colour palette in CSS |
| README template | Standard sections list | Completed all assignment-required sections manually and filled the AI disclosure table honestly |
| Original feature | AI suggested a day/night cycle | **Rejected** — implemented my own `LoadSheddingSchedule` class with rotating zone queue and countdown bar instead |

## What I Wrote Without AI

- **`LoadSheddingSchedule.js`** — Original feature: rotating timetable panel with countdown progress bar and zone queue logic
- **Game balance tuning** — Battery drain rates, recharge rates, and penalty values after manual testing
- **African problem report** — Problem context and physics mapping written from my own research on Eskom load-shedding
- **Wireframe** — Layout sketch in `docs/wireframe.svg`

## Lessons Learned

Using AI sped up boilerplate generation, but understanding the physics and collision code was essential for the live coding defence. I treated AI output as a first draft and always verified behaviour in the running application before committing.
