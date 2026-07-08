# TeleCalc — Hackathon Presentation Script

> **Total Time:** ~8–10 minutes  
> **Team Size:** 4 members  
> **App:** TeleCalc — Telecom Call Charge Calculator  
> **Live Demo URL:** http://localhost:5173

---

## 🗂️ Presentation Flow Overview

| Slide | Speaker    | Topic                                    | Duration |
|-------|-----------|------------------------------------------|----------|
| 1     | Member 1  | Introduction & Problem Statement         | ~2 min   |
| 2     | Member 2  | Architecture & Tech Stack                | ~2 min   |
| 3     | Member 3  | Live Demo (Agent + Admin Flows)          | ~3 min   |
| 4     | Member 4  | Key Features, Challenges & Conclusion    | ~2 min   |

---

---

## 🎤 MEMBER 1 — Introduction & Problem Statement

### Opening (Slide: Title)

> "Good [morning/afternoon], everyone! We are **Team [YOUR TEAM NAME]**, and today we're presenting **TeleCalc** — an intelligent Telecom Call Charge Calculator."
>
> "Let me quickly introduce the team:"
> - "I'm **[Name]** — I'll walk you through the problem and motivation."
> - "**[Member 2 Name]** will cover the architecture and tech stack."
> - "**[Member 3 Name]** will give a live demo of the application."
> - "And **[Member 4 Name]** will wrap up with key features and takeaways."

### Problem Statement (Slide: The Problem)

> "In the telecom industry, calculating call charges is **not as simple as multiplying minutes by a rate**. Real-world billing involves:"
>
> 1. "**Peak vs. Off-Peak rates** — calls during business hours cost more."
> 2. "**Free minute bundles** — subscribers get free minutes that need to be deducted smartly."
> 3. "**Pulse-based billing** — calls are billed in pulses of 30 or 60 seconds, not per-second."
> 4. "**Holiday overrides** — on public holidays, the entire call should be billed at the cheaper off-peak rate."
> 5. "**Calls crossing time zones** — a call can start during peak hours and end during off-peak."
>
> "Existing tools are either internal mainframe systems or Excel sheets. There is **no modern, web-based tool** that call center agents can use in real time to give customers accurate charge estimates."

### Our Solution

> "**TeleCalc** solves this with a clean, modern web application where:"
> - "**Agents** log in, select a calling plan, enter the call time and duration, and instantly get a detailed charge breakdown."
> - "**Admins** manage plans, view analytics, and monitor call volume across the day — all from a dashboard."
> - "The system is **live-aware** — it shows whether we're currently in peak or off-peak hours with a real-time countdown."
>
> "Now I'll hand it over to **[Member 2]** to explain how we built this."

---

---

## 🎤 MEMBER 2 — Architecture & Tech Stack

### Architecture Overview (Slide: Architecture Diagram)

> "Thank you, [Member 1]. Let me walk you through the technical architecture."
>
> "TeleCalc follows a **modern full-stack architecture** with a clear separation of concerns:"

> "**Frontend** — Built with **React 18** + **Vite** for a blazing-fast single-page application."
> - "We use React Context for auth state management."
> - "The UI is fully custom CSS — no framework like Tailwind or Bootstrap — giving us complete design control."
> - "It features a dark-themed, glassmorphic design with animated backgrounds."

> "**Backend** — Built with **Spring Boot 3** (Java 21) and **Spring Security**."
> - "Authentication uses **JWT tokens** — fully stateless, no server-side sessions."
> - "Password hashing uses **BCrypt** with 12 rounds."
> - "Data is stored in an **H2 embedded database** — file-based, so it persists across restarts. Zero configuration needed."

> "**External APIs** — We integrate with two live APIs:"
> - "**Nager.Date API** — fetches real Indian public holidays. On a holiday, the system automatically overrides all charges to off-peak rates."
> - "**WorldTimeAPI** — provides accurate timezone-aware time, used by the live peak/off-peak indicator."

### The Billing Engine (Slide: How Charges Are Calculated)

> "The heart of TeleCalc is the **ChargeService** — let me walk you through the algorithm:"
>
> 1. "We take the **call start time** and **duration** in seconds."
> 2. "We check if today is a **public holiday** — if yes, the entire call is off-peak. Done."
> 3. "If it's a regular day, we iterate **second by second** through the call duration, checking if each second falls within the plan's peak window. This correctly handles **calls that cross the peak/off-peak boundary** and even **midnight crossings**."
> 4. "We then apply **free minute deduction** — free minutes are deducted from peak seconds first (since peak is costlier), then from off-peak. This **maximizes savings** for the customer."
> 5. "After free deduction, remaining seconds are **pulse-rounded** — rounded up to the next pulse unit. For example, with a 30-second pulse, a 45-second call segment becomes 60 seconds."
> 6. "Finally, we compute the charge: `billed seconds ÷ 60 × rate per minute`, separately for peak and off-peak, then sum them."
>
> "Every calculation is **saved as a CallRecord** in the database with full audit trail — peak seconds, off-peak seconds, free deduction, pulse rounding, and final charge."
>
> "Let me hand it over to **[Member 3]** for a live demo."

---

---

## 🎤 MEMBER 3 — Live Demo

> "Thanks, [Member 2]. Let me show you TeleCalc in action."

### Demo Step 1: Login Page

> "Here's our login page. You can see the **animated background** with floating orbs and a glassmorphic card."
>
> "We have two pre-seeded accounts — Admin and Agent. Let me first log in as an **Agent**."
>
> *(Click the "Agent" quick-fill button, then click "Sign In")*

### Demo Step 2: Agent Dashboard

> "This is the Agent dashboard. At the top, you can see the **live zone indicator** — it shows whether we're currently in peak or off-peak hours, with a **real-time countdown** to the next zone switch."
>
> "On the left sidebar, we have: Calculator, My History, and Available Plans."

### Demo Step 3: Calculate a Call Charge

> "Let me calculate a charge. I'll select the **Basic plan** — you can see it shows ₹1.50/min peak, ₹0.50/min off-peak."
>
> "Below the plan selector, we can see the plan details at a glance — 5 minutes free, 30-second pulse, peak hours from 09:00 to 21:00."
>
> "I'll set the call start time to the current time using the '⏰ Use Now' button, and let's say the call was **30 minutes** long."
>
> *(Select 30 min preset, click "Calculate Charge")*
>
> "Here's the **detailed charge breakdown**:"
> - "It splits the call into peak and off-peak segments."
> - "Shows how many **free seconds were deducted** from each segment."
> - "Shows the **pulse-rounded** billed seconds."
> - "And the final charges for each segment, summing to the **total charge**."
>
> "If today were a public holiday, you'd see a **'🎉 Holiday Override' badge** and the entire call would be billed at off-peak rates."

### Demo Step 4: Call History

> "If I go to **My History**, I can see all my past calculations with timestamps, plan names, and charges."

### Demo Step 5: Admin Dashboard

> "Now let me log out and log in as **Admin** to show the admin features."
>
> *(Log out → Login as Admin)*
>
> "The Admin dashboard shows **real-time stats**: calls today, revenue today, active plans, and registered agents."
>
> "Below that, we have a **24-hour call volume heatmap** — it visualizes which hours have the most call calculations, color-coded from green (low) to red (high)."

### Demo Step 6: Plan Management

> "In **Plan Management**, the admin can create, edit, and delete calling plans. Each plan has:"
> - "Peak and off-peak rates per minute"
> - "Free minute bundle"
> - "Pulse length (30s or 60s or even per-second billing)"
> - "Configurable peak window (e.g., 09:00–21:00)"
>
> "We pre-seeded three plans: Basic, Premium, and Enterprise — each with different rate structures."

### Demo Step 7: User Management

> "In **User Management**, the admin can see all registered users, their roles, and creation dates."
>
> "Now I'll pass it to **[Member 4]** for the wrap-up."

---

---

## 🎤 MEMBER 4 — Key Features, Challenges & Conclusion

### Key Features Summary (Slide: Features)

> "Thank you, [Member 3]. Let me summarize the key features of TeleCalc:"

> 1. "**Accurate Billing Engine** — second-by-second peak/off-peak splitting, handling midnight crossings, free minute deduction (peak-first), and pulse rounding."
> 2. "**Live Holiday Integration** — connects to Nager.Date API for real Indian public holidays. Automatic off-peak override on holidays."
> 3. "**Real-Time Zone Indicator** — a live peak/off-peak pill with a countdown timer, powered by the WorldTime API."
> 4. "**Role-Based Access Control** — JWT authentication with Admin and Agent roles. Admins manage plans and users; Agents calculate charges."
> 5. "**Admin Analytics Dashboard** — real-time stats (calls today, revenue, active plans) and a 24-hour call volume heatmap."
> 6. "**Full Audit Trail** — every calculation is saved with all intermediate values: peak/off-peak breakdown, free deduction, pulse rounding, and final charge."
> 7. "**Self-Registration** — new users can sign up. The first registered user automatically becomes an Admin."
> 8. "**One-Command Launch** — a single `run.bat` script starts both backend and frontend."

### Technical Challenges (Slide: Challenges)

> "Some challenges we tackled:"
>
> 1. "**Peak window crossing midnight** — for example, if peak hours are 22:00 to 06:00, a simple range check fails. We handle this by checking if a second is **≥ peakStart OR < peakEnd** when the window wraps around midnight."
>
> 2. "**Optimal free minute deduction** — we deduct free minutes from **peak seconds first**, because peak rates are higher. This ensures the customer gets maximum value from their free bundle."
>
> 3. "**Pulse rounding after free deduction** — free minutes are deducted from raw seconds, and pulse rounding is applied **only to the remaining billable seconds**. This avoids double-billing."
>
> 4. "**Stateless authentication** — using JWT tokens with Spring Security's filter chain, we validate every request without server-side sessions, making the app horizontally scalable."

### Future Scope (Slide: What's Next)

> "If we had more time, we'd love to add:"
> - "**International roaming surcharges** and multi-currency support."
> - "**Bulk CSV upload** — upload hundreds of call records and get batch billing."
> - "**PDF invoice generation** — downloadable charge reports."
> - "**Graph-based analytics** — revenue trends, plan popularity charts."
> - "**SMS/WhatsApp notifications** — send charge summaries to customers."

### Closing

> "To wrap up — **TeleCalc** is a production-ready, full-stack telecom billing tool that handles the complexity of real-world call charge calculation. It's **accurate, user-friendly, and extensible**."
>
> "We built it with **React + Spring Boot**, integrated **live holiday and timezone APIs**, and packed in an **admin dashboard with analytics** — all in a hackathon sprint."
>
> "Thank you! We'd love to take any questions."

---

---

## 📋 Quick Reference: Demo Credentials

| Role   | Username | Password   |
|--------|----------|------------|
| Admin  | `admin`  | `admin123` |
| Agent  | `agent`  | `agent123` |

## 📋 Quick Reference: Pre-Seeded Plans

| Plan       | Peak Rate | Off-Peak Rate | Free    | Pulse | Peak Window    |
|------------|-----------|---------------|---------|-------|----------------|
| Basic      | ₹1.50/min | ₹0.50/min     | 5 min   | 30s   | 09:00 – 21:00  |
| Premium    | ₹2.00/min | ₹0.80/min     | 10 min  | 60s   | 09:00 – 21:00  |
| Enterprise | ₹3.00/min | ₹1.00/min     | 30 min  | 1s    | 08:00 – 22:00  |

## 📋 Quick Reference: Tech Stack

| Layer      | Technology                               |
|------------|------------------------------------------|
| Frontend   | React 18, Vite 6, Custom CSS (Dark Mode) |
| Backend    | Spring Boot 3, Java 21, Spring Security  |
| Database   | H2 (embedded, file-based persistence)    |
| Auth       | JWT (stateless), BCrypt password hashing  |
| APIs       | Nager.Date (Holidays), WorldTimeAPI (TZ)  |

---

## 💡 Tips for the Presentation

1. **Start the app beforehand** — run `run.bat` and make sure both servers are up before you present.
2. **Pre-calculate a few calls** so the heatmap and history have data during the demo.
3. **Practice the handoffs** — each member should end with "I'll hand it to [next person]" for smooth transitions.
4. **Keep the demo moving** — don't get stuck on forms. Have inputs pre-planned.
5. **If asked about scalability** — mention JWT is stateless (scales horizontally) and H2 can be swapped for PostgreSQL/MySQL in production.
6. **If asked about testing** — mention the pulse rounding and peak-overlap algorithms were tested with edge cases (midnight crossing, zero-duration calls, 100% free calls).
