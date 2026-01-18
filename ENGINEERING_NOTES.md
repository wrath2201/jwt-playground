
# Engineering Notes

This document tracks **design mistakes, implementation gaps, and future improvements** discovered during the development and review of this project.

It is intentionally direct and unpolished.

The goal is:

* to understand *why* certain approaches fail
* to document lessons learned
* to guide refactoring in a logical order

---

## 1. Current Status

The project implements a basic JWT-based authentication flow with:

* user registration and login
* access tokens and refresh tokens
* route protection via middleware
* Redis integration (partial)

However, the implementation contains **multiple design and security flaws**, most of which stem from **incomplete token lifecycle design**.

These notes document those issues before fixes are applied.

---

## 2. Error Ledger (Tracked Issues)

### 🔴 Layer 1: Token Design (Foundation)

**E21 — `tokenService.js` is empty**

* Token logic is scattered across routes
* No single source of truth for token creation or verification
* Makes future changes risky and inconsistent

Status: Resolved  
Fix: Introduced a centralized tokenService to handle access and refresh token creation and verification.  
Lesson: Token logic must have a single source of truth to avoid inconsistent behavior.


**E18 — JWT logic duplicated across routes**

* `jwt.sign` and `jwt.verify` used directly in multiple files
* Leads to inconsistent expiry, secrets, and behavior

Status: Resolved  
Fix: Removed direct usage of jsonwebtoken from routes and delegated all token logic to tokenService.  
Lesson: Centralization simplifies changes and prevents subtle auth bugs.


**E3 — No clear distinction between token types**

* Access and refresh tokens are treated similarly
* Middleware assumes every token is an access token

Status: Resolved  
Fix: Embedded explicit token type (access / refresh) into JWT payload and enforced it during verification.  
Lesson: Tokens must self-identify to prevent accidental misuse.


---

### 🔴 Layer 2: Refresh Token Lifecycle

**E11 — Refresh tokens are not stored**

* Server cannot revoke refresh tokens
* Stateless refresh tokens remain valid until expiry

Status: Resolved  
Fix: Refresh tokens are now stored in Redis with TTL and validated against server-side state.  
Lesson: Refresh tokens represent sessions and must be stateful.


**E12 — Refresh token endpoint does not validate server-side state**

* Cryptographic validity is checked
* Authorization is not checked

Status: Resolved  
Fix: Refresh endpoint now checks Redis to ensure the token was actually issued by the server.  
Lesson: Cryptographic validity alone is insufficient for session control.


**E13 — No refresh token rotation**

* Same refresh token can be reused repeatedly
* Increases risk of replay attacks

### E13 — No refresh token rotation ✅ RESOLVED

Status: Resolved  
Fix: Implemented refresh token rotation by invalidating old refresh tokens and issuing a new one on each refresh.  
Lesson: Rotation prevents replay attacks and ensures only one active refresh token per session.



**E15 — Refresh token accepted from request body**

* Unsafe transport decision
* No consistent policy for token handling

---

### 🔴 Layer 3: Logout & Invalidation

**E14 — Logout invalidates the wrong token**

* Access tokens are blacklisted
* Refresh tokens remain valid
* Logout is ineffective

**E1 — Redis used to blacklist access tokens**

* Access tokens are short-lived
* Blacklisting compensates for poor token design

**E5 — Redis used in access-token verification path**

* Every protected request depends on Redis
* Increases latency and failure surface

---

### 🔴 Layer 4: Middleware Issues

**E2 — Multiple token sources accepted**

* Authorization header and custom headers both allowed
* Increases ambiguity and bugs

**E4 — Generic JWT error handling**

* No distinction between expired, invalid, or malformed tokens
* Harder to debug and reason about failures

---

### 🔴 Layer 5: Redis Client Design

**E6 — Redis client has no configuration**

* No environment-based setup
* Works only in local default setups

**E7 — Redis connects on import**

* Side effects during module loading
* No lifecycle control

**E8 — No reconnect strategy**

* Redis failure leads to unstable behavior

**E9 — No graceful shutdown**

* Open connections on server termination

**E10 — No Redis abstraction**

* Business logic tightly coupled to Redis API

---

### 🔴 Layer 6: Authorization (Not Authentication)

**E25 — User model has no role field**

* Cannot express permissions

**E16 — Delete user endpoint lacks authorization**

* Any authenticated user can delete any user

**E17 — Get-members endpoint lacks access control**

* Any authenticated user can fetch all users

---

### 🔴 Layer 7: Data Model Weaknesses

**E22 — User model has no timestamps**

* Hard to audit or debug user lifecycle

**E24 — Email is not normalized**

* Case-sensitive inconsistencies possible

**E23 — No password constraints**

* Weak passwords allowed

**E27 — No schema-level hooks**

* Password hashing handled entirely in routes
* Business rules leak into controllers

---

### 🔴 Layer 8: Input & Structure

**E19 — No input validation**

* Routes trust incoming request bodies blindly

**E20 — Auth routes mix responsibilities**

* Token logic, Redis, auth, and routing combined
* Hard to reason about and refactor safely

---

## 3. Fix Strategy

Issues will be fixed **layer by layer**, not file by file.

Order of resolution:

1. Token design (`tokenService`)
2. Refresh token lifecycle
3. Logout correctness
4. Middleware strictness
5. Redis lifecycle & abstraction
6. Authorization rules
7. Data model hardening
8. Input validation & cleanup

Skipping layers leads to patchy and fragile fixes.

---

## 4. Intentional Design Choices

Some things are intentionally postponed:

* OAuth cleanup
* Frontend token handling
* Advanced security hardening

The focus is correctness and understanding, not feature breadth.

---

## 5. Living Document

This file will be updated as:

* errors are fixed
* assumptions change
* design decisions are revised

The goal is not to look perfect —
the goal is to **avoid repeating the same mistakes**.

---


