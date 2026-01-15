
# Problem Statement

## 1. Background

Modern web applications commonly use **JWT (JSON Web Tokens)** for authentication because they are:

* stateless
* easy to scale
* simple to integrate with HTTP APIs

Most tutorials and starter projects implement JWT in a minimal way:

* issue a token on login
* verify it on protected routes
* expire it after some time

While this works for demos, it **breaks down in real systems**.

This project exists to explore **why**.

---

## 2. The Core Problem

JWTs are **stateless by design**.
Once issued, the server has **no built-in control** over them until they expire.

This creates several practical problems:

* How does logout work?
* What happens if a token is stolen?
* How do we revoke access immediately?
* How do we maintain user sessions without server-side state?
* How do we balance security with performance?

Naive JWT implementations do not answer these questions.

---

## 3. Limitations of Basic JWT Authentication

### 3.1 No real logout

In a simple JWT system:

* the server does not remember issued tokens
* logout on the client does nothing on the server
* stolen tokens remain valid until expiry

This makes “logout” mostly symbolic.

---

### 3.2 Long-lived tokens are dangerous

To avoid frequent logins, developers often:

* increase token expiry time

This increases risk:

* stolen tokens remain usable longer
* no way to revoke them early

---

### 3.3 Short-lived tokens hurt usability

Reducing token lifetime improves security, but:

* users are forced to log in frequently
* sessions feel unreliable

This creates a **security vs usability trade-off**.

---

### 3.4 Token verification is not enough

Verifying a JWT only answers:

> “Is this token cryptographically valid?”

It does **not** answer:

* Should this token still be allowed?
* Was it revoked?
* Was the user logged out elsewhere?

---

## 4. Why Refresh Tokens Exist

To address these problems, real systems introduce **refresh tokens**.

* Access tokens become short-lived
* Refresh tokens are long-lived
* Access tokens are reissued using refresh tokens

This improves usability, but introduces **new complexity**:

* refresh token storage
* refresh token theft
* rotation
* invalidation on logout

This project focuses heavily on understanding **those trade-offs**.

---

## 5. Problems This Project Intentionally Explores

This project is not just about “making JWT work”.

It aims to understand:

* Why access tokens should remain stateless
* Why refresh tokens require server-side tracking
* Why logout cannot be implemented purely client-side
* Why blacklisting access tokens is usually a bad idea
* Why token lifecycle design matters more than syntax

Several parts of the code are intentionally left incomplete or under revision to surface these issues clearly.

---

## 6. Non-Goals of This Project

This project is **not** intended to be:

* a drop-in authentication library
* a fully hardened production system
* a framework replacement

The goal is **clarity and learning**, not abstraction or polish.

---

## 7. Outcome

By working through this project, the developer aims to:

* deeply understand JWT-based authentication
* identify common mistakes in auth design
* build intuition around token lifecycle decisions
* document errors, trade-offs, and improvements honestly

This understanding is more valuable than a “perfect-looking” implementation.

---


