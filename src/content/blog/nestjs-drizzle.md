---
title: "Drizzle with NestJS"
description: "A deep dive into using drizzle-orm with NestJS and a bonus"
publishedAt: 2025-01-09
tags: ["node", "database", "drizzle", "orm", "nestjs"]
---

# NestJS + DrizzleORM: A Perfect Match

I've been a long-time NestJS user and absolutely love its features. The framework's modularity makes spinning up new applications a breeze. Of course, every application needs a database, and I typically relied on TypeORM with @nestjs/typeorm to quickly set up database connections.

## The ORM Landscape

Developers today have plenty of ORM options: TypeORM, Prisma, Sequelize, MikroORM, and many others. Recently, I've fallen in love with DrizzleORM. The combination of Drizzle with SQLite is incredibly fun to work with and surprisingly easy to set up. However, coming from TypeORM, I noticed we didn't have a similar integration for NestJS. While setting up Drizzle wasn't particularly difficult, something felt missing.

Enter @sixaphone/nestjs-drizzle – a wrapper that helps you set up DrizzleORM with multiple connections in NestJS, similar to how you'd use TypeORM.

## Do We Need Another Node.js Library?

Yes, yes we do. There can never be enough! 😄

## Why This Library?

Working with NestJS means working with modules. Since Drizzle isn't a NestJS module out of the box, we need to adapt it for different connections and database types. This typically means writing custom logic that bloats our codebase and adds another dependency to maintain. This library creates a reusable way to work with Drizzle using multiple connections, letting you focus on building features rather than configuring your ORM.

## Getting Started

Let's build a URL redirector using a local SQLite database and a Turso connection. Here's how to set it up:

1. Create a new NestJS project:
```bash
nest new url-redirect
```

2. Generate the URL module:
```bash
nest g module url
```

3. Install dependencies:
```bash
npm i @sixaphone/nestjs-drizzle
npm i -D drizzle-kit
```

## Setting Up the Database Structure

Create a `database` folder in your `src` directory with this structure:

```
src/
  |__database/
  |            |__url.entity.ts
  |            |__schema.ts
  |__url/
  |__app.module.ts
  |__main.ts
```

### Define Your Entity

```typescript
// url.entity.ts
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const urls = sqliteTable('urls', {
  id: integer('id').primaryKey(),
  target: text('target').notNull(),
  slug: text('slug').unique().notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export type UrlEntity = typeof urls;
export type CreateUrl = typeof urls.$inferInsert;
export type SelectUrl = typeof urls.$inferSelect;
```

### Schema Configuration

```typescript
// schema.ts
import { urls } from './url.entity';

export const schema = {
  urls,
};

export type Schema = typeof schema;
```

## Configuring Multiple Connections

First, let's define our database constants:

```typescript
// constants.ts
export const DBS = {
  LOCAL: 'local',
  TURSO: 'turso',
};
```

Then set up the module with both SQLite and Turso connections:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { DrizzleModule } from '@sixaphone/nestjs-drizzle';
import { ConfigModule } from '@nestjs/config';
import { schema } from './database/schema';
import tursoConfig from './config/turso.config';
import { DBS } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    DrizzleModule.forRoot({
      type: 'sqlite',
      name: DBS.LOCAL,
      url: 'file:url.db',
      schema,
    }),
    DrizzleModule.forRootAsync({
      name: DBS.TURSO,
      useFactory: (tursoConfig) => ({
        type: 'sqlite',
        url: tursoConfig.databaseUrl!,
        authToken: tursoConfig.authToken!,
        schema,
      }),
      imports: [ConfigModule.forFeature(tursoConfig)],
      inject: [tursoConfig.KEY],
    }),
    UrlModule,
  ],
})
export class AppModule {}
```

## Using the Repository and Client

Here's how to use both the repository and client in your service:

```typescript
@Injectable()
export class UrlService {
  constructor(
    @InjectClient(DBS.LOCAL)
    private readonly drizzleLocal: DrizzleDatabase<'sqlite', Schema>,
    @InjectClient(DBS.TURSO)
    private readonly drizzleTurso: DrizzleDatabase<'sqlite', Schema>,
    @InjectRepository(urls, DBS.LOCAL)
    private readonly urlLocalRepository: DrizzleRepository<Schema, 'urls', 'sqlite'>,
    @InjectRepository(urls, DBS.TURSO)
    private readonly urlTursoRepository: DrizzleRepository<Schema, 'urls', 'sqlite'>,
  ) {}

  async getUrlBySlug(slug: string) {
    const [local] = await this.urlLocalRepository.selectWhere(eq(urls.slug, slug));
    const [turso] = await this.urlTursoRepository.selectWhere(eq(urls.slug, slug));
    return local || turso;
  }

  async createUrl(url: string) {
    const local = await this.drizzleLocal.transaction((tx) => {
      return tx
        .insert(urls)
        .values({
          target: url,
          slug: new Date().getTime().toString(36),
        })
        .returning();
    });

    await this.drizzleTurso.transaction((tx) => {
      return tx
        .insert(urls)
        .values({
          target: url,
          slug: new Date().getTime().toString(36),
        })
        .returning();
    });

    return local;
  }
}
```

## Wrapping Up

This library makes using Drizzle with NestJS a breeze. If you're already familiar with Drizzle, you can jump right in. If you're new to it, you can rely on Drizzle's excellent documentation for building queries without learning another ORM syntax.

Want to chat about this? Hit me up on Twitter [@sixaphone](https://twitter.com/sixaphone)!