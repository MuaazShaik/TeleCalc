# 📡 TeleCalc — Telecom Call Charge Calculator

A full-stack web application that accurately calculates telecom call charges with peak/off-peak segmentation, free-minute bundles, pulse-based rounding, and an **AI-Powered Plan Recommendation Engine**.

Built with **React 19 + Vite** (frontend) and **Spring Boot 3 + Java 17** (backend).

---

## ✨ Key Features

| # | Feature | Description |
|---|---------|-------------|
| 🧮 | **Accurate Billing Engine** | Second-by-second peak/off-peak splitting with midnight crossing support |
| 🤖 | **AI Plan Recommendation** | Simulates the same call across all plans and recommends the cheapest one with savings breakdown |
| 🎉 | **Live Holiday Integration** | Connects to Nager.Date API for real Indian public holidays — auto off-peak override |
| ⏰ | **Real-Time Zone Indicator** | Live peak/off-peak pill with countdown timer powered by WorldTimeAPI |
| 🔐 | **Role-Based Access Control** | JWT authentication with Admin and Agent roles |
| 📊 | **Admin Analytics Dashboard** | Real-time stats, revenue tracking, and 24-hour call volume heatmap |
| 🎁 | **Smart Free-Minute Deduction** | Free minutes deducted from peak (costlier) segment first to maximize savings |
| ⏱️ | **Per-Segment Pulse Rounding** | Pulse rounding applied per-segment, not per-call, preventing billing errors |
| 📜 | **Full Audit Trail** | Every calculation saved with all intermediate values |
| 🚀 | **One-Command Launch** | Single `run.bat` script starts both backend and frontend |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 6, Custom CSS (Dark Mode, Glassmorphism) |
| **Backend** | Spring Boot 3.4, Java 17, Spring Security |
| **Database** | H2 (embedded, file-based persistence) |
| **Authentication** | JWT (stateless) + BCrypt password hashing |
| **External APIs** | Nager.Date (holidays), WorldTimeAPI (timezone) |
| **Build Tools** | Maven (backend), npm (frontend) |

---

## 📁 Project Structure

```
TeleCalc/
├── backend/                          # Spring Boot API
│   └── src/main/java/com/telecom/
│       ├── config/                   # SecurityConfig, JwtUtil, DataSeeder
│       ├── controller/               # REST controllers (Auth, Calc, Plan, Analytics)
│       ├── dto/                      # Request/Response DTOs
│       ├── model/                    # JPA Entities (User, Plan, CallRecord)
│       ├── repo/                     # Spring Data JPA Repositories
│       └── service/                  # Business logic (ChargeService, HolidayService)
├── frontend/                         # React SPA
│   └── src/
│       ├── components/
│       │   ├── admin/                # AdminDashboard, PlanManager, UserManager, etc.
│       │   ├── agent/                # Calculator, ChargeResult (with AI Recommendation), History
│       │   ├── AppShell.jsx          # Main layout with sidebar
│       │   ├── LoginPage.jsx         # Auth page with glassmorphic design
│       │   └── LiveZoneIndicator.jsx # Real-time peak/off-peak pill
│       ├── api.js                    # Fetch wrapper with JWT
│       ├── AuthContext.jsx           # React context for auth state
│       └── index.css                 # Full design system (dark theme)
├── run.bat                           # One-command launcher
├── BRD_Telecom_Call_Charge_Calculator.md
└── PRESENTATION_SCRIPT.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17+** (JDK)
- **Node.js 18+** (with npm)
- **Maven** (or use the included `mvnw` wrapper)

### Quick Start (Windows)

```bash
# Clone the repository
git clone https://github.com/MuaazShaik/TeleCalc.git
cd TeleCalc

# Run both servers with one command
run.bat
```

### Manual Start

**Backend** (runs on `http://localhost:8080`):
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend** (runs on `http://localhost:5173`):
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Agent | `agent` | `agent123` |

---

## 📋 Pre-Seeded Plans

| Plan | Peak Rate | Off-Peak Rate | Free Minutes | Pulse | Peak Window |
|------|-----------|---------------|-------------|-------|-------------|
| Basic | ₹1.50/min | ₹0.50/min | 5 min | 30s | 09:00 – 21:00 |
| Premium | ₹2.00/min | ₹0.80/min | 10 min | 60s | 09:00 – 21:00 |
| Enterprise | ₹3.00/min | ₹1.00/min | 30 min | 1s | 08:00 – 22:00 |

---

## 🤖 AI Plan Recommendation Engine

After every charge calculation, TeleCalc automatically:

1. **Simulates** the exact same call (same start time, duration) across **all available plans**
2. **Ranks** plans by total cost (cheapest first)
3. **Calculates savings** — how much the customer would save (or overpay) compared to their current plan
4. **Displays** a visual recommendation widget with:
   - 🏆 Trophy for the cheapest plan
   - Green **"Recommended"** badge and savings banner
   - Per-plan charge comparison with cost differences

This transforms TeleCalc from a passive billing calculator into an **intelligent advisor** that helps agents proactively suggest better plans to customers.

---

## 🧮 How the Billing Engine Works

```
Call Input (start time, duration, plan)
         │
         ▼
┌─────────────────────┐
│  Holiday Check       │ ── If holiday → entire call = off-peak
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  Peak/Off-Peak Split │ ── Second-by-second iteration
│  (midnight-aware)    │    handles boundary crossings
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  Free Minute         │ ── Deduct from PEAK first
│  Deduction           │    (saves customer more ₹)
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  Pulse Rounding      │ ── Per-SEGMENT, not per-call
│  (ceil to pulse)     │    e.g., 47s → 60s at 30s pulse
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  Charge Calculation  │ ── (billed_sec / 60) × rate
│  Peak + Off-Peak     │    for each segment
└────────┬────────────┘
         ▼
    Total Charge ₹
```

---

## 🏗️ Architecture

```
┌───────────────┐         ┌──────────────────┐
│  React SPA    │  REST   │  Spring Boot API  │
│  (Vite 6)     │◄──────►│  (Port 8080)      │
│  Port 5173    │  JWT    │                   │
└───────────────┘         ├──────────────────┤
                          │  ChargeService   │ ◄── Billing Engine
                          │  AuthService     │ ◄── JWT + BCrypt
                          │  HolidayService  │ ◄── Nager.Date API
                          │  TimeZoneService │ ◄── WorldTimeAPI
                          ├──────────────────┤
                          │  H2 Database     │ ◄── File-based
                          │  (JPA/Hibernate) │    persistence
                          └──────────────────┘
```

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Login with username/password |
| POST | `/api/auth/register` | ❌ | Register a new user |
| POST | `/api/calculate` | ✅ | Calculate call charge |
| POST | `/api/recommend` | ✅ | AI plan recommendation for a call |
| GET | `/api/history` | ✅ | Get call history (agent: own, admin: all) |
| GET | `/api/plans` | ✅ | List all plans |
| POST | `/api/admin/plans` | 🔒 Admin | Create a plan |
| PUT | `/api/admin/plans/{id}` | 🔒 Admin | Update a plan |
| DELETE | `/api/admin/plans/{id}` | 🔒 Admin | Delete a plan |
| GET | `/api/admin/users` | 🔒 Admin | List all users |
| GET | `/api/admin/analytics` | 🔒 Admin | Dashboard stats & heatmap data |
| GET | `/api/time/zone-status` | ✅ | Current peak/off-peak status |
| GET | `/api/time/current` | ✅ | Current server time |
| GET | `/api/time/holidays` | ✅ | Upcoming Indian holidays |

---

## 🧪 Edge Cases Handled

- ✅ Calls crossing the **peak/off-peak boundary** (e.g., 20:45 → 21:15)
- ✅ Calls crossing **midnight** (e.g., 23:50 → 00:10)
- ✅ **Inverted peak windows** (e.g., peak = 22:00–06:00)
- ✅ Free minutes **exhausted mid-call** across two rate zones
- ✅ **Zero-duration** segments after free deduction (no phantom charges)
- ✅ **Public holiday** automatic off-peak override
- ✅ Per-segment pulse rounding (not per-call)

---

## 📄 License

This project was built as part of a hackathon. For educational purposes.
