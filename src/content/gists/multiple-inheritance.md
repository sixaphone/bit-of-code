---
title: "JavaScript multiple inheritance"
description: "A helper method to allow classes to extend multiple classes at once"
publishedAt: 2025-01-09
category: "TypeScript"
---

```typescript
const merge = (...classes) => {
  class M {}
  
  const prototypes = classes.map((cls) => {
  	const keys = Object.getOwnPropertyNames(cls.prototype).filter((key) => key !== 'constructor');
    
    keys.forEach((key) => {
    	M.prototype[key] = cls.prototype[key];
    });
  });
  
  return M;
};

class A {
  foo() {
    console.log('A');
  }
}

class B {
  bar() {
    console.log('B');
  }
}

class C extends merge(A, B) {}

console.log(C);
new C().foo();
new C().bar();
```