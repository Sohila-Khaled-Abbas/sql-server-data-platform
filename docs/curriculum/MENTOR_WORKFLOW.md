# Mentor Workflow — How to Study With This Repository

Use this repo as an engineering lab, not a passive notebook.

## Before a video

Ask yourself:

- What problem do I think this feature solves?
- What alternative might solve the same problem?
- What could go wrong?

## During the video

Pause at demonstrations and predict the result before the instructor runs the command. Capture only details that change your understanding:

- syntax you did not know
- SSMS workflow that matters operationally
- important configuration choice
- error message and why it happened
- performance/security/recovery implication

## After the video

Complete the four-part loop:

**1. Reproduce** — rebuild the example from scratch.

**2. Modify** — change one meaningful part.

**3. Break** — intentionally create one failure or edge case.

**4. Explain** — teach the concept in 3–5 sentences without opening SSMS.

## Mentor review questions

For every lesson, challenge yourself with:

1. What problem does this solve?
2. Why does it work?
3. What does it cost?
4. What can fail?
5. How would I monitor or test it?
6. What would I choose in a new production system?

## GitHub standard

A good learning commit contains:

```text
video note + working SQL + test evidence + one takeaway
```

Avoid commits that contain only copied code.

## How to use an AI mentor

After completing a lesson, paste your answer to the checkpoint plus your SQL and ask:

> Act as my SQL Server/Data Engineering mentor. Review my solution for correctness, set-based thinking, performance, security, maintainability, and production suitability. Do not rewrite everything immediately. First identify what I understand, what I misunderstand, and give me one targeted exercise to prove the concept.

## Monthly consolidation

After each chapter, create one page called `CHxx-MASTER-NOTES.md` containing:

- 5 concepts I can explain
- 3 patterns I can implement
- 2 mistakes I made
- 1 performance lesson
- 1 production-design lesson
- 5 interview questions

This prevents the repo from becoming 100 disconnected notes.
