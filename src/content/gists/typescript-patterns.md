---
title: "Advanced TypeScript Patterns"
description: "A collection of useful TypeScript patterns and when to use them"
publishedAt: 2025-01-02
category: "TypeScript"
featured: true
---

Here are some TypeScript patterns I've found particularly useful:

## Type Predicates

Type predicates are functions that narrow down types:

```typescript
function isError(value: unknown): value is Error {
  return value instanceof Error;
}
```

## Discriminated Unions

Perfect for handling different states:

```typescript
type State = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: string }
  | { status: 'error', error: Error }
``` 