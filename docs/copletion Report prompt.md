# MASTER DOCUMENTATION GENERATION PROMPT
## Enterprise Phase Completion Report Generator (Universal)

You are a Principal Software Architect, Enterprise Technical Writer, Solution Architect, DevOps Engineer, QA Lead, and Engineering Manager.

Your task is to generate a comprehensive, professional, enterprise-grade documentation report for the completed phase of my project.

The documentation should be written as if it were official engineering documentation for a production software company such as Shopify, Stripe, Notion, Apple, Google, Microsoft, or Amazon.

The report must be extremely detailed, technically accurate, well organized, visually clean, and future-proof.

Do NOT summarize.

Instead, thoroughly analyze everything that was implemented and explain it professionally.

Assume this document will be used by:

• Future developers
• New team members
• Investors
• QA engineers
• DevOps engineers
• Technical auditors
• AI assistants
• Future versions of ChatGPT
• Myself months or years later

The document should be self-contained.

Someone reading only this report should completely understand what was built.

------------------------------------------------------------

## Documentation Requirements

Generate the report using Markdown.

Use clear headings.

Use tables wherever appropriate.

Use diagrams using Mermaid whenever architecture or flow can be better explained visually.

Use professional language.

Never leave vague statements.

Explain implementation decisions.

Explain architecture.

Explain why something exists.

Explain how it works.

Explain how components interact.

Explain what remains for future phases.

------------------------------------------------------------

# Report Structure

Generate all of the following sections.

---

# 1. Cover Page

Include

Project Name

Phase Name

Version

Completion Date

Status

Overall Completion %

Production Readiness

Author

---

# 2. Executive Summary

Describe

Purpose of this phase

Business objectives

Technical objectives

Problems solved

Major achievements

Architecture improvements

Overall impact

Production readiness

---

# 3. Goals of the Phase

Explain

Original objectives

Expected deliverables

Success criteria

Scope

Out of Scope

Dependencies

---

# 4. Scope Completed

Break everything into logical modules.

For each module explain

Purpose

Features implemented

Files affected

Backend changes

Frontend changes

Database changes

API changes

UI changes

Validation

Security

Performance

Testing

---

# 5. Complete Feature Inventory

Generate a table

Module

Feature

Description

Status

Complexity

Production Ready

Dependencies

Notes

Nothing should be skipped.

---

# 6. Architecture Overview

Generate Mermaid diagrams showing

Overall architecture

Frontend

Backend

Database

Services

External APIs

Authentication

Event flow

Data flow

Request lifecycle

Folder hierarchy

Dependency graph

Only include diagrams that make sense.

---

# 7. Technical Implementation

Describe every important implementation.

Explain

How it works

Why it was implemented

Benefits

Tradeoffs

Alternative approaches

Future scalability

Potential improvements

Include

Database

Prisma

React

Express

Node

TypeScript

Authentication

State management

Caching

Services

Controllers

Routes

Middleware

Validation

Utilities

Hooks

Shared Components

Architecture patterns

Repository structure

Dependency Injection (if applicable)

Background Jobs

Event Driven Architecture

etc.

---

# 8. Folder Structure

Generate updated folder trees.

Only include relevant folders.

Explain purpose of every major folder.

---

# 9. Database Changes

List

Models

Enums

Relations

Indexes

Constraints

Migrations

Cascade rules

Soft delete

Audit fields

Validation

Performance optimizations

Provide tables.

---

# 10. API Documentation

List every endpoint.

Method

Route

Authentication

Request

Response

Validation

Errors

Notes

Organize by module.

---

# 11. Frontend

Explain

Pages

Layouts

Components

Hooks

Services

Context

State Management

React Query

Zustand

Forms

Routing

Navigation

UI flows

Loading states

Error handling

Accessibility

Responsive design

Performance

---

# 12. Backend

Explain

Controllers

Services

Routes

Repositories

Business logic

Validation

Middleware

Authentication

Authorization

Logging

Events

Cron Jobs

Queues

Utilities

Configuration

Performance

Caching

---

# 13. Security

Explain

Authentication

Authorization

RBAC

JWT

Rate limiting

Input validation

XSS protection

CSRF

SQL Injection prevention

Prisma safety

Secrets

Environment variables

Webhook verification

Payment verification

Server-authoritative calculations

Fraud prevention

Audit logs

Compliance considerations

---

# 14. Performance

Explain

Optimization strategies

Caching

Lazy loading

Code splitting

Indexes

Query optimization

Batch operations

Pagination

Compression

Memoization

Image optimization

API optimization

Bundle optimization

Response times

Scalability considerations

---

# 15. User Experience

Explain

Design system

User flow

Admin flow

Customer flow

Accessibility

Loading

Animations

Error handling

Feedback

Forms

Validation

Mobile responsiveness

Consistency

---

# 16. Business Logic

Explain every major workflow.

Examples

Checkout

Orders

Coupons

Payments

Shipping

Reviews

Inventory

Authentication

Notifications

Risk Engine

Anything implemented in this phase.

Provide flow diagrams where useful.

---

# 17. Testing & Verification

Generate tables.

Include

TypeScript

Lint

Build

Unit Tests

Integration Tests

E2E

Manual Tests

Performance Tests

Security Tests

Database Tests

API Tests

UI Tests

Edge Cases

Provide

Result

Status

Notes

---

# 18. Configuration

Document

Environment Variables

Feature Flags

Configuration files

Secrets required

Deployment configuration

Production requirements

Third-party services

API keys

---

# 19. Known Limitations

List

Current limitations

Technical debt

Temporary implementations

Mock services

Future improvements

Things intentionally postponed

Potential risks

---

# 20. Future Roadmap

Explain

Immediate next phase

Recommended improvements

Nice-to-have features

Long-term scalability

Architecture evolution

Potential refactoring

Infrastructure improvements

Monitoring

Observability

CI/CD

Cloud

Containers

Microservices (if applicable)

---

# 21. Statistics

Generate metrics.

Examples

Lines of code

Files created

Files modified

Components added

Pages

Hooks

Services

Controllers

Routes

Database Models

API Endpoints

Tables

Migrations

Tests

Documentation size

Approximate percentages

If exact values are unavailable, clearly mark them as estimates.

---

# 22. Production Readiness Assessment

Generate a scorecard.

Examples

Architecture

Security

Scalability

Maintainability

Performance

Code Quality

Documentation

Testing

UX

Deployment

Monitoring

Overall Readiness

Provide ratings

Excellent

Good

Average

Needs Improvement

Explain every rating.

---

# 23. Deployment Checklist

Generate a production checklist.

Include

Database

Environment variables

API keys

Secrets

Domains

SSL

Payments

Emails

Storage

Monitoring

Logging

Analytics

CI/CD

Backups

Disaster recovery

Health checks

Cron jobs

Queues

Admin accounts

Testing

Everything required before production.

---

# 24. Final Assessment

Provide

Overall summary

Major accomplishments

Technical highlights

Business value

Scalability analysis

Maintainability analysis

Recommendations

Readiness for next phase

Overall engineering quality

Final score out of 10

Production readiness percentage

Enterprise maturity level

Examples

Prototype

MVP

Production Ready

Enterprise Ready

Shopify-Level

Enterprise SaaS

World-Class

------------------------------------------------------------

# Writing Rules

• Never use placeholder explanations.

• Never omit sections.

• Never produce generic summaries.

• Use professional engineering language.

• Use tables whenever useful.

• Use Mermaid diagrams where architecture benefits from visualization.

• Be extremely detailed.

• Explain implementation rationale.

• Explain tradeoffs.

• Mention assumptions when necessary.

• Clearly separate implemented features from future work.

• Keep formatting clean and consistent.

• The final document should be suitable for GitHub, internal engineering documentation, client handoff, technical audits, and long-term project maintenance.

• If information is unavailable, explicitly state "Not Implemented", "Not Applicable", or "Estimated" rather than making unsupported assumptions.

------------------------------------------------------------

# Expected Output

Produce a polished, enterprise-grade phase completion report that feels like official technical documentation from a world-class software engineering organization.