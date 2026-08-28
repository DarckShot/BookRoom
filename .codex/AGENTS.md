# Project Instructions

This repository contains the Autumn 2026 frontend trainee assignment.

The original task specification is:

`Frontend-trainee-assignment-autumn-2026.md`

Treat the original assignment as the primary source of truth.

Project-specific assignment guidance is available in:

`.codex/skills/frontend-trainee-assignment/SKILL.md`

If instructions conflict, use this priority:

1. original assignment specification;
2. provided API / WebSocket documentation;
3. `AGENTS.md`;
4. project skill;
5. general coding preferences.

---

# Primary Goal

Produce a correct, maintainable, well-tested frontend solution that can be clearly
explained during a technical interview.

Optimize for:

1. correctness;
2. mandatory assignment requirements;
3. simplicity;
4. maintainability;
5. explainability;
6. type safety;
7. user experience;
8. visual polish.

Do not optimize for architectural sophistication.

---

# Mandatory Before Optional

Do not implement optional assignment tasks until all mandatory functionality:

- works correctly;
- has appropriate loading/error/empty states;
- passes tests;
- has been manually checked.

If mandatory functionality is incomplete, prioritize it over any bonus feature.

---

# Do Not Overengineer

Use the simplest architecture that cleanly solves the problem.

Avoid:

- unnecessary abstraction layers;
- enterprise patterns without a concrete need;
- generic frameworks built for hypothetical future requirements;
- premature optimization;
- unnecessary global state;
- unnecessary custom hooks;
- unnecessary wrapper components;
- unnecessary dependency additions.

Do not create abstractions for code used only once unless the abstraction materially
improves readability or testability.

Prefer duplication of two trivial lines over a confusing abstraction.

Refactor when a real pattern emerges.

---

# Explainability

AI-generated code must remain understandable to the candidate.

Do not introduce code that would be difficult to explain in an interview.

For non-trivial implementation choices, prefer:

- explicit control flow;
- clear naming;
- conventional React patterns;
- small focused functions;
- obvious data ownership.

Avoid clever one-liners and obscure language tricks.

When generating a complex solution, simplify it if a simpler correct solution exists.

---

# Architecture

Use a simple classic React project structure.

Prefer responsibility-based folders such as:

```text
src/
├── api/
├── assets/
│   ├── ui/
│   │   └── icons/
│   ├── layout/
│   │   └── icons/
│   ├── rooms/
│   │   └── icons/
│   └── bookings/
│       └── icons/
├── components/
│   ├── ui/
│   │   └── Button/
│   │       ├── Button.tsx
│   │       └── Button.module.css
│   ├── layout/
│   ├── rooms/
│   │   └── RoomCard/
│   │       ├── RoomCard.tsx
│   │       └── RoomCard.module.css
│   └── bookings/
├── hooks/
├── pages/
│   └── RoomsPage/
│       ├── RoomsPage.tsx
│       └── RoomsPage.module.css
├── router/
├── test/
├── types/
├── utils/
├── App.tsx
├── index.css
└── main.tsx
```

Do not introduce Feature-Sliced Design or another large architectural methodology unless
there is a concrete requirement for it.

Keep reusable components in `components/`.

Group reusable components by purpose or domain when useful.

Keep route-level components in `pages/`.

Keep API communication in `api/`.

Keep reusable hooks in `hooks/`.

Keep shared domain types in `types/`.

Keep pure helper functions and reusable business logic in `utils/`.

Keep components close to the simplest location that makes their responsibility obvious.

Do not create empty architectural layers or folders merely to follow a pattern.

---

# Server State

Backend is the source of truth.

Treat API data as server state.

Examples:

- offices;
- rooms;
- bookings;
- availability;
- room schedule.

Prefer TanStack Query if it is already part of the project.

Do not copy server data into Zustand or another global store without a strong reason.

Do not manually synchronize multiple copies of the same server state.

---

# Client State

Keep temporary UI state local where possible.

Examples:

- modal state;
- form state;
- currently selected UI option;
- temporary user input.

Use URL search parameters for meaningful navigational/filter state when doing so improves
refresh, sharing, or back/forward navigation.

Use global client state only when genuinely necessary.

---

# React

Use React functional components and hooks.

Prefer derived values over duplicated state.

Avoid `useEffect` when data can be:

- calculated during render;
- handled in an event;
- represented by query state;
- represented by route/search params.

Do not use effects to synchronize two copies of the same state.

Do not use `useMemo`, `useCallback`, or `React.memo` by default.

Use memoization only when there is a concrete reason.

Keep components focused.

Split components when doing so improves readability or reuse.

Do not split components purely to make files artificially small.

---

# Function Style

Use arrow functions everywhere in application and test code.

Use arrow functions for:

- React components;
- custom hooks;
- event handlers;
- API functions;
- utility functions;
- validation functions;
- callbacks;
- test helpers;
- test cases when a callback is required.

Prefer:

```ts
const getRooms = async () => {
  // ...
};

const RoomCard = () => {
  // ...
};
```

Do not use function declarations such as:

```ts
function getRooms() {
  // ...
}

function RoomCard() {
  // ...
}
```

Do not mix function declaration styles without a concrete external API or tooling
requirement.

---

# TypeScript

Use strict, meaningful typing.

Avoid `any`.

If data is truly unknown, prefer `unknown` and narrow it.

Type:

- API responses;
- API request payloads;
- domain models;
- WebSocket events;
- component props;
- reusable utility functions.

Prefer domain-specific types over loose objects.

Avoid unnecessary type assertions.

Do not silence TypeScript errors instead of fixing the underlying problem.

---

# API

Do not invent backend behavior.

Before implementing an API interaction:

1. inspect provided API documentation;
2. inspect existing server/test data if useful;
3. use the documented contract.

Do not invent:

- endpoints;
- request properties;
- response properties;
- status codes;
- permissions;
- server-side behavior.

Backend validation is authoritative.

Frontend validation exists to improve UX, not to replace backend validation.

---

# HTTP 409

Treat HTTP `409 Conflict` as expected booking-domain behavior.

It requires dedicated handling.

When booking creation receives 409:

- explain that the selected interval is no longer available;
- refresh or invalidate relevant schedule/availability state;
- allow the user to select another interval.

Do not display a generic unknown-error message for a known booking conflict.

---

# Date and Time

Treat date/time code as critical business logic.

Respect:

- office-local time;
- bookings only in the future;
- working hours 09:00–20:00;
- minimum duration 15 minutes;
- 15-minute increments;
- maximum 30 days in advance.

Centralize reusable booking time logic.

Do not scatter duplicated date calculations across components.

Do not compare formatted strings when actual time comparison is required.

Do not assume browser timezone equals office timezone when timezone data is available.

---

# WebSocket

Use the provided WebSocket API for required real-time behavior.

REST/server state remains authoritative.

When WebSocket events arrive:

- update relevant query cache if the payload is sufficient;
- otherwise invalidate/refetch the appropriate query.

Do not maintain a separate full duplicate dataset just for WebSocket state.

Mandatory real-time behavior:

- selected-interval room availability updates without reload;
- currently opened room schedule updates without reload.

Reconnect/resync is optional and must not be implemented before mandatory behavior is complete.

---

# Forms and Validation

Keep validation rules separate from purely visual concerns when practical.

Show actionable validation messages.

Do not prevent backend submission based solely on assumptions that are not documented.

Keep form behavior predictable.

Do not reset user input unnecessarily after recoverable API errors such as HTTP 409.

---

# Loading, Error, and Empty States

Every important asynchronous view must account for:

- loading;
- error;
- empty data where meaningful;
- success.

Do not leave screens blank.

Do not use one global loading spinner for unrelated operations.

Errors shown to users should be understandable.

Technical debugging information belongs in development tooling, not user-facing text.

---

# Testing

Tests are mandatory.

Prefer Vitest + React Testing Library if already configured.

All test files must be stored inside `src/test/`.

Do not colocate test files next to production components, hooks, utilities, pages, or API
modules.

Do not create `*.test.ts`, `*.test.tsx`, `*.spec.ts`, or `*.spec.tsx` files outside
`src/test/`.

Organize `src/test/` by responsibility when the number of tests grows. For example:

```text
src/test/
├── components/
├── hooks/
├── pages/
├── utils/
├── api/
└── setup.ts
```

The test folder may mirror the relevant parts of `src/` when that improves navigation.

Keep test-only helpers, fixtures, mocks, and factories inside `src/test/` as well.

Use arrow functions in all tests and test helpers.

Test behavior and business rules.

Prioritize:

- booking time validation;
- working hours;
- minimum duration;
- 15-minute increments;
- 30-day horizon;
- cancellation eligibility;
- HTTP 409 behavior;
- important loading/error/empty states;
- WebSocket-to-server-state synchronization logic where practical.

Do not write tests solely to inflate coverage.

Avoid testing implementation details.

Do not assert internal React state.

Prefer queries and assertions based on what the user sees and does.

Run relevant tests after significant changes.

Do not claim a task is complete while tests are failing.

---

# Styling and File Colocation

Use CSS Modules for component, page, and layout styles.

Rules:

- use `*.module.css` for all component-specific, page-specific, and layout-specific styles;
- keep styles next to the component or page that uses them;
- each UI component, page, or layout unit must live in its own directory;
- keep the component `.tsx` file and its `.module.css` file in the same directory;
- do not create a central folder for component styles;
- do not place unrelated component styles in `index.css`;
- `src/index.css` is reserved for global styles such as reset, base typography, root-level defaults,
  and truly global CSS variables;
- do not use plain `.css` files for local component styles;
- do not use inline styles for ordinary static styling when the same styling belongs in a CSS Module;
- avoid `!important` unless there is a concrete unavoidable reason;
- prefer clear class names that describe the role of the element inside the component;
- keep styles scoped to the component instead of relying on global selectors;
- when a component is moved, its styles must move with it;
- if a component has no styles, do not create an empty `.module.css` file.

Preferred structure:

```text
src/components/ui/Button/
├── Button.tsx
└── Button.module.css

src/components/rooms/RoomCard/
├── RoomCard.tsx
└── RoomCard.module.css

src/pages/RoomsPage/
├── RoomsPage.tsx
└── RoomsPage.module.css
```

Import CSS Modules directly from the colocated file:

```tsx
import styles from './Button.module.css';

export const Button = () => (
  <button className={styles.button}>
    Забронировать
  </button>
);
```

Do not create structures such as:

```text
src/styles/Button.css
src/styles/RoomCard.css
src/components/Button.tsx
```

when the styles belong only to those components.

---

# Icons and Visual Assets

Store project-owned SVG icons as reusable React components inside `src/assets/`,
grouped by domain.

Preferred structure:

```text
src/assets/
├── ui/
│   └── icons/
│       ├── CloseIcon.tsx
│       ├── ChevronDownIcon.tsx
│       └── SearchIcon.tsx
├── layout/
│   └── icons/
│       ├── LogoIcon.tsx
│       └── MenuIcon.tsx
├── rooms/
│   └── icons/
│       ├── CapacityIcon.tsx
│       ├── ProjectorIcon.tsx
│       └── WhiteboardIcon.tsx
└── bookings/
    └── icons/
        ├── CalendarIcon.tsx
        └── ClockIcon.tsx
```

Rules:

- keep icons inside `src/assets/`, grouped by the domain they belong to;
- use domain folders such as `rooms`, `bookings`, `layout`, and `ui`;
- keep truly generic icons under `src/assets/ui/icons/`;
- each reusable SVG icon must be implemented as a separate `.tsx` React component;
- use arrow functions for icon components;
- do not create one large global `icons/` directory containing unrelated icons from all domains;
- do not duplicate SVG markup across the codebase;
- reuse an existing icon component whenever the same visual asset is needed again;
- prefer `currentColor` when the design allows icon color to be controlled externally;
- accept `SVGProps<SVGSVGElement>` when standard SVG props should be configurable;
- preserve SVG paths, proportions, and visual appearance from Figma;
- do not replace provided Figma icons with visually different third-party icons without a concrete reason;
- do not install an icon library when the required icons are already available in the design;
- keep icon components presentation-only and free of business logic;
- if an icon clearly belongs to one domain, keep it in that domain instead of moving it to `ui`;
- move an icon to `ui` only when it becomes genuinely generic and is reused across multiple domains.


---

# Accessibility

Use semantic HTML.

Prefer:

- `<button>` for actions;
- `<a>` / router links for navigation;
- proper form labels;
- keyboard-accessible controls.

Do not use clickable `<div>` elements when semantic elements are appropriate.

Preserve visible focus behavior.

Use accessible names for icon-only actions.

---

# UI

Follow provided Figma/mockups in overall structure and behavior.

Pixel-perfect matching is not required.

Functionality is more important than visual precision.

Do not redesign screens unnecessarily.

Preserve:

- required screens;
- forms;
- important states;
- navigation;
- expected interaction structure.

---

# Dependencies

Before adding a dependency, ask whether the problem can reasonably be solved with the
existing stack.

Add a dependency only when it provides clear value.

Prefer mature, common libraries over obscure alternatives.

Do not add multiple libraries that solve the same problem.

Do not add a global state library merely because it is popular.

---

# README

Keep README synchronized with the actual application.

README must include:

- what the project is;
- prerequisites;
- installation;
- development startup;
- test commands;
- architecture overview;
- technology choices;
- important assumptions and decisions.

Maintain a section:

## Принятые решения

Whenever an important requirement is ambiguous:

1. check the original assignment;
2. check provided API/WebSocket documentation;
3. choose the simplest reasonable behavior;
4. do not invent backend capabilities;
5. document the decision in `Принятые решения`.

Document the reason briefly.

Do not add trivial implementation details to this section.

---

# Ambiguous Requirements

Whenever a requirement is ambiguous:

1. Read `Frontend-trainee-assignment-autumn-2026.md`.
2. Inspect relevant API or WebSocket documentation.
3. Prefer the simplest behavior consistent with the assignment.
4. Do not invent backend capabilities.
5. Add an important decision to README `Принятые решения`.
6. Continue implementation without unnecessary blocking questions when a reasonable
   documented decision can be made.

---

# Refactoring

Do not refactor unrelated code while implementing a focused task unless necessary.

Prefer small, reviewable changes.

Before large refactors:

- identify the actual problem;
- explain the benefit;
- preserve working behavior;
- keep tests passing.

Do not rewrite working architecture solely because another pattern is more fashionable.

---

# Code Quality

Before considering work complete, check:

- TypeScript has no relevant errors;
- linting passes if configured;
- relevant tests pass;
- no debug code remains;
- no unused imports remain;
- no obvious duplicated state exists;
- API errors are handled;
- important UI states exist;
- code is understandable;
- application and test functions use arrow-function syntax;
- all test files are located under `src/test/`;
- local UI styles use CSS Modules;
- component/page styles are colocated with the code that uses them.

Do not mark work complete merely because it compiles.

---

# Git Changes

Keep changes focused on the requested task.

Do not modify unrelated files unnecessarily.

Do not commit:

- secrets;
- tokens;
- local credentials;
- generated local cache;
- IDE-specific personal state.

Do not rewrite repository history.

Do not create commits unless explicitly asked.

---

# Security

Never place secrets or tokens in frontend source code.

Do not commit:

- personal access tokens;
- API secrets;
- credentials;
- private keys.

Values intended to be public frontend configuration may use environment variables as
appropriate.

Do not treat frontend environment variables as secret storage.

---

# Working Method

For a non-trivial task:

1. inspect relevant existing code;
2. inspect assignment requirements;
3. inspect relevant API documentation;
4. identify the smallest coherent implementation;
5. implement mandatory behavior;
6. handle loading/error/empty states;
7. add or update tests;
8. run checks;
9. update README if an architectural or ambiguous decision was made;
10. summarize what changed.

Do not start coding from assumptions when the repository already contains the answer.

---

# Final Assignment Review

Before declaring the assignment ready for submission, verify:

- `/` redirects to `/rooms`;
- `/rooms` works;
- `/rooms/:roomId` works;
- `/bookings` works;
- unknown routes show `Ничего не найдено`;
- office is required;
- filters work;
- room schedule works;
- booking creation works;
- cancellation works;
- HTTP 409 is handled;
- basic WebSocket updates work;
- room availability updates without reload;
- opened room schedule updates without reload;
- loading states exist;
- error states exist;
- empty states exist;
- unit tests pass;
- all tests are stored under `src/test/`;
- arrow functions are used consistently;
- local styles use CSS Modules;
- component/page styles are stored next to their implementation;
- README contains startup instructions;
- README contains test instructions;
- README describes architecture;
- README explains technology choices;
- README contains `Принятые решения` when relevant;
- no optional feature broke mandatory functionality;
- code can be explained during an interview.
