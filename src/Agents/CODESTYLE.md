Purpose

This document defines the engineering standards and architectural principles the AI agent must follow when generating, modifying, or reviewing code.

The goal is simple:

Clean code

Clear structure

Maintainable systems

Industry-level standards

No unnecessary complexity

1. Core Philosophy
1.1 Clarity Over Cleverness

Prefer readable code over clever optimizations.

Avoid “smart” one-liners if they reduce readability.

Code should be understandable by a mid-level engineer without explanation.

1.2 Simplicity First

Avoid over-engineering.

Do not introduce abstractions unless they solve a real problem.

Do not add design patterns unless clearly justified.

1.3 Maintainability > Speed of Writing

Code must be easy to modify.

Code must be easy to debug.

Code must be easy to test.

2. Code Style Standards
2.1 Formatting

Use consistent indentation (2 or 4 spaces depending on language standard).

Keep line length under 100–120 characters.

Add whitespace between logical sections.

Separate responsibilities visually with spacing.

2.2 Naming Conventions

Use descriptive variable names.

Avoid single-letter variables (except loop counters like i, j).

Functions should use verbs.

Classes should use nouns.

Boolean variables should read clearly:

isActive

hasPermission

shouldRetry

2.3 Comments

Do not comment obvious code.

Comment:

Why something exists

Non-obvious business logic

Edge cases

Avoid redundant comments.

Bad:

// increment i
i++;


Good:

// Prevent infinite retry loop if upstream service fails
retryCount++;

3. Function Design Rules
3.1 Function Length

A function must not exceed ~2 pages (roughly 60–80 lines).

If it grows too large:

Extract smaller helper functions.

Separate responsibilities.

3.2 Single Responsibility Principle

Each function must do one thing well.

Bad:

Fetch data

Transform data

Validate data

Send email

Log metrics

Good:

fetchUser()

validateUser()

transformUser()

sendWelcomeEmail()

3.3 Parameter Limits

No more than 4 parameters per function.

If more are required, use:

A configuration object

A domain object

3.4 Pure Functions Preferred

Avoid side effects unless necessary.

Prefer deterministic outputs.

4. Architecture Principles
4.1 Clean Architecture

Separate code into layers:

Controllers (I/O handling)

Services (business logic)

Repositories (data access)

Models (data structures)

Business logic must not depend on:

UI

Framework-specific details

Database implementation

4.2 Dependency Direction

High-level modules must not depend on low-level modules.

Depend on abstractions.

Use dependency injection when appropriate.

4.3 Separation of Concerns

Never mix:

Database logic inside controllers

Business rules inside routing

UI logic inside services

5. Error Handling

Always handle errors explicitly.

Do not silently swallow exceptions.

Provide meaningful error messages.

Log errors in a structured way.

Prefer:

Early returns

Guard clauses

Example:

if (!user) {
  throw new Error("User not found");
}

6. Testing Standards
6.1 Testable Code

Code must be unit-test friendly.

Avoid tight coupling.

Avoid hidden dependencies.

6.2 Coverage Expectations

Core business logic must be tested.

Edge cases must be tested.

Happy path alone is not sufficient.

7. Avoid Over-Complex Patterns

Do NOT introduce:

Unnecessary generics

Excessive inheritance

Deep nesting

Complex functional chains

Metaprogramming unless explicitly required

Avoid nesting beyond 3 levels.

Prefer:

Early returns

Small functions

Clear control flow

8. Performance Considerations

Optimize only when necessary.

Avoid premature optimization.

Prefer readable O(n) solutions over obscure micro-optimizations.

Clearly document when performance trade-offs are made.

9. Security Standards

Never trust user input.

Validate all external data.

Avoid exposing sensitive information.

Follow principle of least privilege.

10. Logging & Observability

Log meaningful events.

Avoid excessive logging.

Never log secrets.

Structure logs for machine parsing when possible.

11. Documentation Expectations

Public functions must include short descriptions.

Complex workflows require high-level explanation.

Architecture decisions should be documented.

12. Refactoring Rules

When modifying existing code:

Improve clarity if possible.

Do not introduce breaking changes without reason.

Reduce duplication.

Leave the code cleaner than you found it.

13. Red Flags

The AI agent must avoid:

Functions over 80 lines

Files over 500 lines (unless justified)

More than 3 levels of nested conditionals

God classes

Hidden side effects

Mixing multiple responsibilities

14. Default Mindset

Before finalizing code, the agent must ask internally:

Is this the simplest solution?

Is this readable?

Can this be broken into smaller parts?

Would another engineer understand this quickly?

Is this easy to test?

If not, refactor.