# Phase 2: Authentication & Authorization

## Objective
To design and implement a secure, production-ready Authentication and Authorization system capable of replacing mocked frontend contexts. The system must support role-based access control, utilize secure password hashing, and implement robust JWT-based session management with refresh token rotation.

## Key Accomplishments

### 1. Database Schema & Data Access Layer
*   **Authentication Models:** Designed the Prisma schema to include a `User` model (with `Role` enum for CUSTOMER/ADMIN) and a `RefreshToken` model to track active user sessions.
*   **Database Migration:** Generated and applied the initial authentication migration (`add-auth-models`) to the live Supabase development database.
*   **Repository Pattern Implementation:** Created `user.repository.ts` and `token.repository.ts` to cleanly isolate database access logic. Implemented a `SafeUser` type to guarantee that sensitive fields (like `passwordHash`) are never accidentally leaked from the data layer to the business logic layer.

### 2. Business Logic & Security Algorithms
*   **Authentication Service (`auth.service.ts`):** Developed a centralized service to handle all authentication business logic, including registration, login, token rotation, and password modification.
*   **Secure Password Management:** Integrated `bcrypt` (12 salt rounds) for cryptographically secure, timing-safe password hashing and comparison.
*   **Advanced Session Management:**
    *   **JWT Strategy:** Implemented a dual-token architecture using separate, highly secure 64-byte secrets for Access Tokens (15-minute expiry) and Refresh Tokens (7-day expiry).
    *   **Token Storage & Revocation:** Designed the system to store only SHA-256 hashes of refresh tokens in the database, preventing compromise even in the event of a database breach.
    *   **Token Rotation & Reuse Detection:** Built a mechanism that revokes and replaces the refresh token upon every use. If an old, already-revoked refresh token is presented, the system detects a potential replay attack and automatically invalidates all active sessions for that user.

### 3. API Endpoints & Request Validation
*   **Strict Zod Validation:** Developed exhaustive Zod schemas (`auth.validator.ts`) to validate all incoming authentication requests, including enforcing strict password complexity rules (length, uppercase, lowercase, numbers, special characters).
*   **Authentication Controllers:** Implemented thin controller layers delegating to the `auth.service`, exposing the following endpoints:
    *   `POST /api/v1/auth/register`
    *   `POST /api/v1/auth/login`
    *   `POST /api/v1/auth/logout`
    *   `POST /api/v1/auth/refresh`
    *   `GET /api/v1/auth/me` (Protected)
    *   `POST /api/v1/auth/change-password` (Protected)
*   **Dedicated Rate Limiting:** Applied a stricter rate-limiting policy specifically to authentication routes (10 requests per 15 minutes) to mitigate brute-force and credential stuffing attacks.

### 4. Authorization Middleware
*   **Route Protection:** Created `requireAuth` middleware to verify Bearer JWTs and attach the authenticated user context to the Express Request object (`src/types/express.d.ts`).
*   **Role-Based Access Control (RBAC):** Developed `requireRole` middleware to restrict access to specific endpoints based on the user's role (e.g., ADMIN only).

## Outcome
Phase 2 successfully delivered a highly secure, scalable authentication framework. It provides complete protection against common web vulnerabilities, implements modern session management best practices, and establishes a secure foundation for the forthcoming Phase 3 (Product Catalog and Business Logic) development.
