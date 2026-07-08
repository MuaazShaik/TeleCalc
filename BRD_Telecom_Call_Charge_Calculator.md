# Business Requirements Document (BRD)
# Telecom Call-Charge Calculator — Peak / Off-Peak Rules

| Field | Value |
|---|---|
| **Project** | Telecom Call-Charge Calculator |
| **Module** | Module A — Java Fundamentals, Data Types, Operators & Control Flow |
| **Version** | 1.0 |
| **Date** | 04 July 2026 |
| **Status** | Draft |

---

## 1. Executive Summary

A telecom operator requires a web-based call-charge calculator that correctly handles peak/off-peak rate windows, free-minute bundles, pulse-based rounding, and calls that span the peak/off-peak boundary. The system must eliminate billing disputes caused by inconsistent charge computation on boundary-spanning calls.

---

## 2. Business Problem

Today, billing disputes arise when:

- A call starts during **peak hours** and ends during **off-peak hours** (or vice-versa).
- Free-minute bundles are exhausted **mid-call** across two rate zones.
- Duration rounding (pulse) is applied inconsistently — per-call vs. per-segment.
- Time arithmetic **crosses midnight** (23:50 → 00:20).

The operator needs a **deterministic, auditable** calculator that resolves every edge case identically, regardless of the CSR or system that invokes it.

---

## 3. Scope

### 3.1 In Scope

| # | Capability |
|---|---|
| 1 | Compute charge for a single call given start time, duration, and customer plan |
| 2 | Split a boundary-spanning call into peak and off-peak segments |
| 3 | Deduct free-bundle minutes before charging the remainder |
| 4 | Round duration up to the next configured pulse (e.g., 30-second pulse) |
| 5 | Role-based web dashboard (Admin, CSR / Agent) with login |
| 6 | Call history log per user session |
| 7 | Plan configuration management (Admin only) |

### 3.2 Out of Scope

- Real-time CDR (Call Detail Record) integration
- Payment gateway / invoice generation
- International / roaming call rate tables
- SMS / data charge calculation

---

## 4. Stakeholders

| Role | Responsibility |
|---|---|
| **Product Owner** | Approve requirements, accept deliverables |
| **Telecom Admin** | Configure plans, peak windows, pulse length |
| **Customer Service Rep (CSR)** | Calculate charges on behalf of customers |
| **Developer Team** | Design, build, test the application |

---

## 5. Functional Requirements

### FR-01: Call Charge Computation

| ID | Requirement |
|---|---|
| FR-01.1 | The system shall accept **start time** (HH:mm:ss), **duration** (seconds), and **plan ID** as inputs. |
| FR-01.2 | The system shall convert all times to **seconds-since-midnight** for arithmetic. |
| FR-01.3 | The system shall detect whether a call crosses the peak/off-peak boundary. |
| FR-01.4 | The system shall compute `end_time = start_time + duration`, handling **midnight wrap-around**. |

### FR-02: Peak / Off-Peak Segmentation

| ID | Requirement |
|---|---|
| FR-02.1 | The system shall define **peak window** as a configurable time range (default: 09:00–21:00). |
| FR-02.2 | Any call that starts in one zone and ends in another shall be **split into two segments** at the boundary. |
| FR-02.3 | Each segment shall be independently rated at its zone's rate. |
| FR-02.4 | Calls entirely within one zone shall not be split. |

### FR-03: Free-Minute Bundle Deduction

| ID | Requirement |
|---|---|
| FR-03.1 | Each plan shall define a **free minutes balance** (in seconds). |
| FR-03.2 | Free minutes shall be deducted **before** pulse rounding and rate application. |
| FR-03.3 | If free minutes are exhausted **mid-call** during a boundary-spanning call, the system shall deduct free minutes from the **peak segment first** (higher cost), then from off-peak. |
| FR-03.4 | Remaining billable seconds (after free deduction) proceed to pulse rounding. |

### FR-04: Pulse Rounding

| ID | Requirement |
|---|---|
| FR-04.1 | The plan shall define a **pulse length** in seconds (e.g., 30s). |
| FR-04.2 | Rounding shall be applied **per-segment** (not per-call) to prevent under-billing on split calls. |
| FR-04.3 | Formula: `rounded = ceil(segment_seconds / pulse) * pulse`. |
| FR-04.4 | A segment of 0 seconds (fully covered by free minutes) shall result in 0 charge. |

### FR-05: User Authentication & Role-Based Dashboards

| ID | Requirement |
|---|---|
| FR-05.1 | The system shall provide a login page with username/password authentication. |
| FR-05.2 | Two roles shall exist: **ADMIN** and **AGENT** (CSR). |
| FR-05.3 | **Admin Dashboard**: plan management (CRUD), peak window config, pulse config, user management, call history of all agents. |
| FR-05.4 | **Agent Dashboard**: call charge calculator form, personal call history log, plan viewer (read-only). |

### FR-06: Plan Management (Admin)

| ID | Requirement |
|---|---|
| FR-06.1 | A **Plan** entity shall contain: plan name, peak rate (₹/min), off-peak rate (₹/min), free minutes (seconds), pulse length (seconds), peak start time, peak end time. |
| FR-06.2 | Admin shall be able to Create, Read, Update, and Delete plans. |
| FR-06.3 | Changing a plan's parameters shall take effect on **new calculations only** (no retroactive recomputation). |

---

## 6. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | **Performance**: Charge computation shall complete in < 100 ms. |
| NFR-02 | **Auditability**: Every calculation shall be logged with inputs, intermediate values (segments, free deducted, rounded), and final charge. |
| NFR-03 | **Configurability**: Peak windows and pulse length shall be editable without code changes (one-line config edits in the admin panel). |
| NFR-04 | **Security**: Passwords shall be hashed (BCrypt). JWT-based stateless authentication. |
| NFR-05 | **Responsive UI**: The dashboard shall work on desktop and tablet viewports. |

---

## 7. Use Cases

### UC-01: Compute Charge for a Simple Call

| | |
|---|---|
| **Actor** | Agent |
| **Precondition** | Agent is logged in; at least one plan exists |
| **Flow** | 1. Agent selects a plan → 2. Enters start time and duration → 3. Clicks "Calculate" → 4. System returns itemised charge breakdown |
| **Postcondition** | Charge is displayed and logged in call history |

### UC-02: Boundary-Spanning Call

| | |
|---|---|
| **Actor** | Agent |
| **Flow** | 1. Agent enters a call starting at 20:45 for 30 min → 2. System detects boundary at 21:00 → 3. Splits into 15 min peak + 15 min off-peak → 4. Rates each segment independently |

### UC-03: Free Minutes Exhaustion Mid-Call

| | |
|---|---|
| **Actor** | Agent |
| **Flow** | 1. Plan has 10 min free, call is 25 min → 2. System deducts 10 min from peak segment first → 3. Charges remaining 5 min peak + 10 min off-peak |

### UC-04: Admin Configures a New Plan

| | |
|---|---|
| **Actor** | Admin |
| **Flow** | 1. Admin navigates to Plan Management → 2. Clicks "Add Plan" → 3. Fills form fields → 4. Saves → 5. Plan is available for agents |

---

## 8. Business Rules Summary

| # | Rule |
|---|---|
| BR-01 | Peak window default: 09:00:00 – 21:00:00 (configurable per plan). |
| BR-02 | Boundary calls are **split**, never double-charged or wholly peak-rated. |
| BR-03 | Free minutes deducted from **peak segment first** (saves customer the most money). |
| BR-04 | Pulse rounding applied **per-segment**, not per-call. |
| BR-05 | Midnight wrap: `end_time = (start + duration) % 86400`. |
| BR-06 | Charge formula per segment: `charge = (rounded_seconds / 60) × rate_per_minute`. |

---

## 9. Data Model (Logical)

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│     User     │       │       Plan       │       │   CallRecord     │
├──────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)      │       │ id (PK)          │       │ id (PK)          │
│ username     │       │ name             │       │ user_id (FK)     │
│ password     │       │ peakRate         │       │ plan_id (FK)     │
│ role (ENUM)  │       │ offPeakRate      │       │ startTime        │
│ fullName     │       │ freeSeconds      │       │ durationSec      │
│ createdAt    │       │ pulseSec         │       │ peakSec          │
└──────────────┘       │ peakStartTime    │       │ offPeakSec       │
                       │ peakEndTime      │       │ freeDeducted     │
                       │ createdAt        │       │ totalCharge      │
                       └──────────────────┘       │ breakdown (JSON) │
                                                  │ calculatedAt     │
                                                  └──────────────────┘
```

---

## 10. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + Vite (matching CareerOS pattern), Vanilla CSS |
| **Backend** | Spring Boot 3.x (Java 17+) |
| **Database** | H2 (in-memory, dev) / MySQL (prod) |
| **Auth** | Spring Security + JWT |
| **Build** | Maven (backend), npm (frontend) |

---

## 11. Acceptance Criteria

| # | Criterion |
|---|---|
| AC-01 | A call from 20:45 for 1800s on a plan with peak 09:00–21:00 produces two segments: 900s peak + 900s off-peak. |
| AC-02 | A plan with 600s free minutes on a 1500s call deducts 600s from peak first, charges remainder. |
| AC-03 | Pulse rounding of 47s at 30s pulse = 60s billed. |
| AC-04 | A call from 23:50 for 1200s (20 min) correctly wraps past midnight. |
| AC-05 | Admin can create/edit/delete plans; changes reflect immediately for new calculations. |
| AC-06 | Agent cannot access Admin pages; proper 403 returned. |

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Midnight-crossing logic bug | Incorrect charge | Unit tests for 23:xx → 00:xx scenarios |
| Free minutes applied to wrong segment | Customer overcharged | Business rule: always deduct from costlier segment first |
| Pulse rounding confusion (per-call vs per-segment) | Billing dispute | BRD explicitly mandates per-segment; enforced in code |

---

## 13. Glossary

| Term | Definition |
|---|---|
| **Peak Hours** | Configurable high-rate time window (default 09:00–21:00) |
| **Off-Peak Hours** | All hours outside the peak window |
| **Pulse** | Minimum billing increment (e.g., 30 seconds) |
| **Free Bundle** | Pre-paid minutes included in a plan, deducted before billing |
| **Boundary-Spanning Call** | A call that starts in one rate zone and ends in another |
| **CSR / Agent** | Customer Service Representative who uses the calculator |

---

*End of Document*
