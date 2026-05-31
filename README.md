# Asset performance management system

> One screen to run a country's worth of solar, batteries, and EVs.

An interactive prototype for operating an energy portfolio across Indonesia — from the boardroom down to the technician standing in front of a broken inverter.

---

## The problem

Renewable operators don't lose money because the sun stops shining. They lose it in the **gaps between people**:

- The **CEO** sees a healthy-looking portfolio while a single site quietly bleeds revenue.
- The **control room** drowns in 200 alarms when *one* part fails — and misses the real cause.
- The **field technician** drives out with no context, no SLA clock, and no proof the job got done.
- The **finance team** can't turn clean megawatts into sellable **Renewable Energy Certificates** because a PPA scan is missing from a folder.

Each team has its own spreadsheet. None of them agree. **makes them share one source of truth.**

---

## What it does

Five connected views, one data model:

| View | Who it's for | The problem it kills |
|------|-------------|----------------------|
| 🗺️ **Executive Dashboard** | Leadership | Portfolio map + **Revenue-at-Risk gauge** + a financial simulator that turns "what if we fix this site?" into a number. |
| 🛰️ **Performance Digital Twin** | Operations | Live solar + battery + EV-fleet twin with a **timeline scrubber** to rewind to the moment an anomaly began. |
| 🔕 **Alarm Suppression** | Control room | Collapses an alarm storm into **one root cause** instead of 200 notifications. |
| 📱 **Technician Mobile App** | Field crews | SLA countdown timers, camera **proof-of-service**, and slide-to-complete job flow. |
| 📜 **REC Portfolio** | Finance / ESG | Tracks every certificate from **Generated → Registered → Issued → Sold**, flagging the exact missing document. |

The thread that ties them together: an anomaly spotted in the **Digital Twin** becomes a **ticket**, the ticket hits a **technician's phone**, the fix restores **revenue** on the **Executive** gauge, and the recovered output rolls into a sellable **REC**. One incident, followed end to end.

---

## Quick start

```bash
npm install
npm run dev
```

Then open the local URL Vite prints. Navigate between modules via the hash routes:

| Route | View |
|-------|------|
| `#/` | Executive Dashboard *(default)* |
| `#/digital-twin` | Performance Digital Twin |
| `#/technician` | Mobile Technician App |
| `#/recs` | REC Portfolio Dashboard |
| `#/dashboard` | Design-system overview |

---

## Built with

React 18 · Vite · Tailwind CSS · Framer Motion · Recharts · React Three Fiber (3D) · Lucide icons

> ⚠️ This is a **design-system prototype**. The metrics are realistic mock data, built to demonstrate the workflow — not a production telemetry backend.
