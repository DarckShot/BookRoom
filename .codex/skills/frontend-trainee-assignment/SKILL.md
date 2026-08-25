---
name: frontend-trainee-assignment
description: Requirements, implementation workflow, and review checklist for the Autumn 2026 frontend trainee meeting-room booking assignment.
---

# Frontend Trainee Assignment

Use this skill when implementing, reviewing, testing, refactoring, or documenting
the Autumn 2026 frontend trainee assignment.

The original assignment specification is stored in:

`Frontend-trainee-assignment-autumn-2026.md`

The original assignment is the primary source of truth.

If this skill conflicts with the original assignment, follow the original assignment.

---

# Project Goal

Build a frontend web application for booking meeting rooms.

An employee must be able to:

- select an office;
- find available meeting rooms;
- inspect a room schedule;
- create a booking;
- view their bookings;
- cancel their own future bookings;
- receive real-time booking and availability updates.

Backend API, real-time API, documentation, test data, and UI mockups are provided.

Do not implement:

- backend;
- authentication;
- admin panel;
- office management;
- room management;
- participant invitations;
- corporate calendar integration.

---

# Required Technology

The application must use:

- Node.js 20+
- React 18+
- TypeScript
- `react-router-dom`
- provided backend API
- provided WebSocket real-time API
- public Git repository

The repository must contain a `README.md`.

Other libraries may be chosen when they provide clear value.

Avoid introducing libraries without a concrete need.

---

# Recommended Engineering Approach

Prefer a simple modern frontend stack.

Recommended tools when appropriate:

- Vite for build tooling;
- TanStack Query for server state;
- React Hook Form for forms if forms become complex enough;
- Zod for client-side validation if schema validation provides clear value;
- date-fns for date/time manipulation;
- Vitest for unit tests;
- React Testing Library for component tests.

Do not add a global state manager unless genuinely shared client state requires it.

If Zustand is used, use it only for client state that cannot reasonably remain local.

Do not duplicate API data from TanStack Query in Zustand.

---

# Required Routes

Implement:

- `/` → redirect to `/rooms`
- `/rooms` → meeting room list
- `/rooms/:roomId` → room details and schedule
- `/bookings` → current user's bookings

Unknown routes must display:

`Ничего не найдено`

Do not silently redirect unknown routes to `/rooms`.

---

# Booking Business Rules

The frontend must respect the following rules.

## Office

An office is required before displaying meeting rooms.

## Future bookings

Bookings may only be created for future time.

## Working hours

All offices operate from:

`09:00` to `20:00`

Use office-local time.

Do not assume browser-local time and office-local time are always identical if the API
provides timezone information.

## Minimum duration

Minimum booking duration:

`15 minutes`

## Time increments

Booking start time must use 15-minute increments.

Booking duration must use 15-minute increments.

Examples of valid values:

- 09:00
- 09:15
- 09:30
- 09:45

Examples of invalid values:

- 09:05
- 09:20
- 09:37

## Maximum booking horizon

A booking may be created no more than 30 days in advance.

## Overlap

Bookings for the same room may not overlap.

Frontend validation may help prevent obvious conflicts, but the backend is the final
source of truth.

## Cancellation

A booking may only be cancelled when:

- it belongs to the current user;
- it is still in the future.

## Backend validation

The backend is the authoritative source of truth.

Never assume that successful frontend validation guarantees successful booking creation.

Always handle backend validation failures.

---

# Required Functionality

The following functionality is mandatory.

Do not begin optional tasks until all mandatory functionality works correctly.

## 1. Rooms list

Implement `/rooms`.

It must include:

- office selection;
- meeting room list;
- required primary filters;
- room availability for the selected interval;
- navigation to room details.

## 2. Room schedule

Implement `/rooms/:roomId`.

It must include:

- room information;
- room schedule;
- occupied intervals;
- ability to initiate booking creation;
- real-time schedule updates.

## 3. Create booking

The user must be able to create a booking while respecting all booking constraints.

Frontend validation should provide useful feedback before submission where reasonable.

The backend result remains authoritative.

## 4. Cancel booking

The user must be able to cancel their own future booking.

Do not allow cancelling:

- another user's booking;
- a booking that has already started;
- a booking in the past.

## 5. HTTP 409 handling

HTTP `409 Conflict` is expected business behavior.

Do not treat it as an unknown generic server error.

When the backend returns `409` during booking creation:

- inform the user that the selected time is no longer available;
- preserve enough UI state for the user to choose another interval;
- refresh or invalidate relevant availability/schedule data.

Avoid vague messages such as:

`Something went wrong`

Prefer a specific user-facing explanation.

## 6. Basic real-time updates

Use the provided WebSocket API.

Handle events related to:

- booking creation;
- booking cancellation;
- room availability changes.

Without a full page reload, update:

- room availability for the currently selected interval;
- schedule of the currently opened room.

Prefer updating or invalidating existing server-state queries.

Do not create a second independent copy of server state solely for WebSocket data.

## 7. Loading states

Important asynchronous screens and actions must expose appropriate loading states.

Examples:

- rooms loading;
- room details loading;
- schedule loading;
- bookings loading;
- booking submission;
- cancellation.

Avoid blocking the entire application for unrelated requests.

## 8. Error states

Important API requests must have meaningful error states.

Provide retry where it is useful.

Do not expose raw stack traces or technical backend details to the user.

## 9. Empty states

Handle meaningful empty states.

Examples:

- no rooms match filters;
- room has no bookings for selected period;
- user has no bookings.

Do not render a blank screen.

## 10. Unit tests

The project must include unit tests.

Tests should focus on behavior and business rules rather than implementation details.

---

# Real-Time Architecture

The provided WebSocket API is required.

Basic WebSocket support belongs to the mandatory part of the assignment.

At minimum, real-time events must update:

1. availability of rooms for the currently selected interval;
2. schedule of the currently opened room.

Recommended approach when using TanStack Query:

- REST fetches initial server state;
- query cache owns REST server state;
- WebSocket events indicate that server state changed;
- update the relevant cache directly when event payload is sufficient;
- otherwise invalidate the appropriate query;
- backend remains source of truth.

Do not put all WebSocket events into a global store merely because they are real-time.

---

# Server State vs Client State

Keep server state and client UI state conceptually separate.

## Server state examples

- offices;
- rooms;
- room availability;
- bookings;
- room schedule.

Prefer TanStack Query or an equivalent server-state solution.

## Client state examples

- selected filter values;
- open modal state;
- current form values;
- temporary UI selection;
- connection indicator if optional reconnect is implemented.

Keep client state local when possible.

Use a global store only when state is genuinely shared across distant parts of the
application and cannot reasonably be represented by URL state, query state, or local state.

---

# URL State

When useful, prefer storing meaningful filter state in URL search parameters.

Examples may include:

- selected office;
- selected date;
- availability interval;
- capacity filter.

Do not force every transient UI value into the URL.

Use URL state when it improves:

- navigation;
- refresh behavior;
- reproducibility;
- sharing;
- browser back/forward behavior.

---

# Date and Time Rules

Date/time logic is a high-risk area in this assignment.

Centralize reusable booking date/time logic rather than scattering calculations across
components.

Pay particular attention to:

- office-local timezone;
- future-time validation;
- 09:00–20:00 working hours;
- 15-minute increments;
- minimum 15-minute duration;
- maximum 30-day booking horizon;
- end time crossing office closing time;
- date boundaries.

Do not compare formatted date strings when actual date/time comparison is required.

Do not manually implement timezone conversion if a reliable library or API data already
provides the required information.

---

# Validation Strategy

Client-side validation exists for UX.

Backend validation exists for correctness.

Do not duplicate backend business logic excessively.

Frontend should validate rules that improve user experience, such as:

- required office;
- start time is in the future;
- valid 15-minute increment;
- minimum duration;
- booking ends before or at office closing;
- maximum 30-day horizon.

Still submit to the backend and handle rejected requests correctly.

---

# TypeScript

Use TypeScript meaningfully.

Requirements:

- type API responses;
- type API request payloads;
- type important domain models;
- type WebSocket events;
- prefer discriminated unions for different WebSocket event types when appropriate;
- avoid unnecessary type assertions.

Do not use `any` unless there is a specific justified reason.

Prefer `unknown` when receiving untrusted data whose shape has not yet been established.

Do not duplicate equivalent domain types unnecessarily.

---

# React

Use functional React components and hooks.

Prefer:

- composition;
- derived state;
- small focused components;
- clear data flow.

Avoid:

- unnecessary `useEffect`;
- storing derived values in state;
- synchronizing two copies of the same state;
- giant page components;
- premature generic abstractions;
- custom hooks that merely wrap one line without improving semantics;
- memoization without a demonstrated reason.

Do not use `useMemo`, `useCallback`, or `React.memo` automatically.

Use them when there is an actual benefit.

---

# API Layer

Keep backend interaction reasonably centralized.

Avoid scattering raw API URLs throughout UI components.

Prefer a clear API layer or feature-specific API functions.

API code should make it easy to understand:

- endpoint;
- request payload;
- response type;
- error behavior.

Do not invent endpoints.

Do not invent request fields.

Do not invent response fields.

Consult the provided backend documentation before implementing API behavior.

---

# UI and Figma

The application should generally correspond to the provided Figma mockups.

Pixel-perfect reproduction is not required.

Priority order:

1. required functionality;
2. correct states and behavior;
3. understandable UX;
4. consistency with Figma;
5. visual polish.

Do not sacrifice functionality for pixel-perfect styling.

Do not redesign the application without a clear reason.

Required screens, forms, states, and navigation shown in the mockups should be preserved.

---

# Accessibility

Use semantic HTML where practical.

Interactive elements should be keyboard accessible.

Form fields should have labels.

Buttons should have understandable accessible names.

Do not create clickable `<div>` elements when a `<button>` or `<a>` is appropriate.

Ensure meaningful focus behavior for dialogs and important interactions where practical.

---

# Testing Strategy

Unit tests are mandatory.

Prioritize tests for logic that could realistically fail.

Important candidates include:

- future-time validation;
- 09:00–20:00 working hours;
- 15-minute interval validation;
- minimum duration;
- maximum 30-day horizon;
- booking end-time validation;
- HTTP 409 handling;
- cancellation eligibility;
- relevant transformation of WebSocket events;
- important loading/error/empty UI behavior.

For components, prefer testing user-visible behavior.

Avoid tests that only assert:

- internal state;
- private implementation details;
- exact hook calls;
- meaningless snapshots.

A smaller number of meaningful tests is preferable to many weak tests.

---

# Mandatory Completion Order

Implement the project approximately in this order:

1. inspect assignment documentation;
2. inspect provided API documentation;
3. inspect provided WebSocket documentation;
4. inspect Figma/static mockups;
5. establish project structure and routing;
6. implement shared API infrastructure;
7. implement office selection;
8. implement rooms list;
9. implement room filters;
10. implement room details and schedule;
11. implement booking creation;
12. implement HTTP 409 handling;
13. implement bookings page;
14. implement cancellation;
15. implement basic WebSocket updates;
16. complete loading/error/empty states;
17. add and complete unit tests;
18. update README;
19. manually verify mandatory flows;
20. only then consider optional tasks.

Do not begin optional features while mandatory functionality is incomplete or unstable.

---

# Optional Tasks

Only start these after all mandatory requirements work and tests pass.

Optional tasks:

1. reconnect with resync and connection state;
2. real-time updates for the entire rooms list;
3. optimistic cancellation with rollback;
4. `.ics` export;
5. recurring bookings.

Do not implement optional tasks at the cost of mandatory stability.

---

# Reconnect Optional Task

If implementing reconnect:

- detect connection loss;
- display connection status;
- reconnect with a sensible delay/backoff;
- after reconnect, reload authoritative server state;
- do not assume all events during disconnection were received.

Resync with REST after reconnection.

---

# Optimistic Cancellation Optional Task

If implementing optimistic cancellation:

- update UI immediately;
- preserve previous state;
- send cancellation request;
- rollback if the request fails;
- reconcile with backend state after completion.

Do not implement optimistic cancellation before normal cancellation is stable.

---

# README Requirements

README must include:

- project description;
- requirements;
- installation instructions;
- startup instructions;
- test instructions;
- chosen technologies;
- architecture overview;
- relevant technical decisions.

Also maintain a section:

## Принятые решения

Whenever the assignment leaves important behavior unspecified:

1. choose the simplest reasonable behavior;
2. document the decision;
3. briefly explain why that option was chosen.

Do not fill this section with trivial implementation details.

Document decisions that a reviewer might reasonably question.

Examples:

- how timezone is interpreted;
- which filter values are represented in URL;
- how WebSocket events synchronize query cache;
- behavior after HTTP 409;
- assumptions made because API documentation is ambiguous.

---

# Architecture Documentation

README architecture documentation should explain the actual implementation.

Do not write architecture claims that do not match the code.

It should be possible for a reviewer to quickly understand:

- feature/module organization;
- API layer;
- server-state strategy;
- client-state strategy;
- routing;
- date/time handling;
- WebSocket synchronization;
- testing approach.

---

# Explainability Requirement

AI tools are allowed, but the candidate may be asked to explain any code.

Therefore:

- prefer straightforward code;
- avoid clever tricks;
- avoid unnecessary abstractions;
- avoid architecture copied from large enterprise systems;
- do not introduce patterns that are difficult to justify;
- ensure generated code is understandable by a frontend trainee candidate.

Before accepting generated code, ask:

`Could the candidate explain why this exists and how it works during a technical interview?`

If not, simplify it.

---

# Ambiguous Requirements

When a requirement is ambiguous:

1. consult `Frontend-trainee-assignment-autumn-2026.md`;
2. consult provided API and WebSocket documentation;
3. choose the simplest reasonable behavior;
4. do not invent backend capabilities;
5. add important decisions to README under `Принятые решения`.

Do not block progress by asking unnecessary clarification questions when a reasonable,
documentable decision can be made independently.

---

# Review Checklist

When asked to review the project, check all of the following.

## Routing

- [ ] `/` redirects to `/rooms`
- [ ] `/rooms` works
- [ ] `/rooms/:roomId` works
- [ ] `/bookings` works
- [ ] unknown route shows `Ничего не найдено`

## Rooms

- [ ] office is required
- [ ] rooms list loads correctly
- [ ] primary filters work
- [ ] room availability is shown for selected interval
- [ ] empty state exists
- [ ] loading state exists
- [ ] error state exists

## Booking

- [ ] only future time is allowed
- [ ] working hours are 09:00–20:00
- [ ] minimum duration is 15 minutes
- [ ] 15-minute increments are enforced
- [ ] 30-day maximum is enforced
- [ ] room overlap is handled
- [ ] backend remains authoritative
- [ ] HTTP 409 has dedicated handling

## Cancellation

- [ ] only own booking can be cancelled
- [ ] only future booking can be cancelled
- [ ] error handling exists

## Real-time

- [ ] booking-created event handled
- [ ] booking-cancelled event handled
- [ ] room availability event handled
- [ ] opened room schedule updates without reload
- [ ] room list availability updates without reload for selected interval

## States

- [ ] loading states
- [ ] error states
- [ ] empty states
- [ ] meaningful user messages

## Tests

- [ ] tests run successfully
- [ ] important business rules covered
- [ ] tests focus on behavior
- [ ] no meaningless test inflation

## Documentation

- [ ] startup instructions
- [ ] test instructions
- [ ] architecture description
- [ ] technology choices
- [ ] `Принятые решения`
- [ ] documentation matches actual code

## Code Quality

- [ ] no unnecessary `any`
- [ ] no duplicated server state
- [ ] no unnecessary effects
- [ ] no unnecessary global state
- [ ] no overengineering
- [ ] API contracts are typed
- [ ] WebSocket events are typed
- [ ] important date/time logic is centralized
- [ ] implementation is explainable in an interview
