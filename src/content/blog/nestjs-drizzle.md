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

Enter _@sixaphone/nestjs-drizzle_ – a wrapper that helps you set up DrizzleORM with multiple connections in NestJS, similar to how you'd use TypeORM.

## What is Drizzle?

Before we dive into NestJS and the drizzle module, let's take a step back and clarify what drizzle is. Drizzle is a TypeScript-first ORM (Object-Relational Mapping) that provides type-safe database queries with minimal overhead. Its syntax is very SQL-like and if you know SQL you know drizzle. They provide a variety of tools for developers to define their schemas, handle migrations and make use of a large number of databases like PostgreSQL, MySQL, SQLite, as well as external providers like Turso and Neon. Unlike other ORMs where you define entities or have a separate schema file, drizzle allows you to define a schema-object on how your database table should look like and from there it allows you to manage the schema and records related to it. It acts more as a library to help you build your migrations/schema and write queries in a fluent way, rather than to constrain you in a way a fully fledged ORM would.

## Why Drizzle?

With so many ORMs on the market one could ask why drizzle? TypeORM has been around for a long time and is well used and liked by developers. Prisma too is very common. So why would someone use drizzle for their project? Well there are a few, how about we have a look

### Drizzle VS Prisma

Prisma uses its own query engine and requires a separate Prisma Client process, while Drizzle runs directly on Node.js. Another thing is that when you use prisma you ship the entire prisma client which is heavy while drizzle aims to be leight-weight.

When defining a schema in Prisma you have to learn their syntax for the `schema.prisma` file and generate the types while drizzle opts to use pure objects for your definitions.

Due to their implementation Prisma has to run all results trough their engine while drizzle does not, causing less overhead and faster queries.

Prisma does offer a large toolset like prisma studio and a huge ecosystem of supported providers. However, while drizzle does not have the same support as prisma, together with `drizzle-kit` you can use migrations, drizzle studio and other features that are not in the base package.

### Drizzle VS TypeORM

TypeORM prefers to use classes for their entity definition. If you come from an Object-oriented language then it will make you feel right at home. It also has a large list of providers and supported databases. However because they use classes they have to instantiate them which is a heavier tool on memory. 

It is also worth to note that drizzle is easier to setup and use typescript inference. While TypeORM does not have a fancy studio built in, they do provide migration support and complex query syntax and complex relation and inheritance patterns. One can see that TypeORM, because it was around for so long, is a very mature and feature rich ORM for more experienced developers and larger, more complex projects. However, this does not mean that drizzle cannot compete, it only needs more time and love to get to the same maturity.

### General Drizzle advantages

Both Prisma and TypeORM require you to use a dedicated syntax to define your entities. Be it a class in javascript or in a `schema.prisma` file. Drizzle on the other hand just requires an object with the definition to work with your entity. This makes it a lot more easier to include in your project as it works around your project rather than the other way. While TypeORM has a great query builder and can be both SQL-like and not SQL-like, drizzle too offers both forms of syntax for simpler and more advanced queries. Prisma on the other hand has only non SQL-like syntax due to their custom client. And perhpas the biggest advantage of drizzle is the fact that in todays ecosystem it has great support for edge and serverless applications. It is also great to use as a standalone tool for migrations. Where prisma and typeorm require you incorporate them in your code. drizzle is much more flexible there.

## Do We Need Another Node.js Library?

Yes, yes we do. There can never be enough! 😄

## Why This Library?

Working with NestJS means working with modules. Drizzle is a breeze to setup, but there is no NestJS module out of the box, we need to adapt it for different connections and database types. This typically means writing custom logic that bloats our codebase and adds another dependency to maintain. This library creates a reusable way to work with Drizzle using multiple connections, letting you focus on building features rather than configuring your ORM making the processing of setting up drizzle even easier.

## Getting Started

Hands on is a good way to get a graps so let's build a URL redirector using a local SQLite database and a Turso connection. We will start by creating a new nestjs project and by adding all required dependencies including the library.

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

## Getting set up

Drizzle is not opinionated so you can setup your schema however you like. For this post I will create a `database` folder `src` directory with this structure:

```
src/
  |__database/
  |      |__url.entity.ts
  |      |__schema.ts
  |__url/
  |__app.module.ts
  |__main.ts
```

### Defining Schema and Entities

The way we define entities is how we would usually define a drizzle entity. Its just a POJO (plain old javascript object), but it uses a helper method to adjust it to the underlying connection. Now this means that we would have to re-define our entities for different databases, but it is not a challengine task, as we usually stick to the first database we choose until a very critical point.

```typescript
// url.entity.ts
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
```

So all we do here is just import some required methods from drizzle and the specific database methods.

```typescript
export const urls = sqliteTable('urls', {
  id: integer('id').primaryKey(),
  target: text('target').notNull(),
  slug: text('slug').unique().notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
```

Then we define our actual entity by calling the method. Here we use sqliteTable, but depending on our connection that would change. The first parameter is the actual name of the table and then our POJO for how our schema should look like.

```typescript
export type CreateUrl = typeof urls.$inferInsert;
export type SelectUrl = typeof urls.$inferSelect;
```

As mentioned before drizzle offers great type inference. In TypeORM you would have to defined what a create or select model should have. In Prisma you are baraged with a bunch of types that I dont even want to name. Drizzle just has two. A select and a create. From those you can build out all other types.

```typescript
// schema.ts
import { urls } from './url.entity';

export const schema = {
  urls,
};

export type Schema = typeof schema;
```

Now we just define a single entry point for all our entities and export them. What I also do is export the type of schema, because we will need it for later.

## Connecting with ourselves and the database

As it is the case in some applications we can have multiple connections. Could be a read-write replicase or similar cases.. And trough the `DrizzleModule` of the library we can easily instantiate multiple of those connections at once and re-use them. Every connection we make is named and we can make constants for those names to re-use them much more efficent.

```typescript
// constants.ts
export const DBS = {
  LOCAL: 'local',
  TURSO: 'turso',
};
```

To setup a local SQLite connection we can do the following:

```typescript
DrizzleModule.forRoot({
  name: DBS.LOCAL,
  type: 'sqlite',
  url: 'file:url.db',
  schema,
})
```

The `schema` and `DBS` come from the respective files, but you can se we are utilyzing NestJS's `DynamicModule` builder `forRoot` to create a global connection to our database. Type has a nice autocomplete for us to know what values we can use, and url, since we are using SQLite is going to be a local file path that we named `url.db`.

If we want to add Turso we can do

```typescript
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
```

Again we are using the `DynamicModule` methods, but this time, since we want to read from config we make use of the async builder to inject our config and return the relevant data.

All in all our `AppModule` would be

```typescript
// app.module.ts
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
  ],
})
export class AppModule {}
```

Where we import the `ConfigModule` and then create our two connections with `DrizzleModule`. Thanks to the `name` property on the config it will create a named connection to that database and allow us to reference it by that name. That way we can create multiple connections with clients, as well as repositories.

## Using the Repository and Client

Drizzle out of the box does not really have repositories. They are more related to typeorm, while prisma does not have repositories at all. The repository in question here, is just a helper wrapper for a single instance of a entity in our schema.

### Using the client

The client is the more straight-forward way to use the library. It gives you access to the underlying connection, while not needing to know what connection it is, well somewhat.
Trough the client we can do all operations we need for our app, and the library gives a neat util type to infer the database under the hood.

So if we want to use the client in our service it would look like this.

```typescript
@Injectable()
export class UrlService {
  constructor(
    @InjectClient(DBS.LOCAL)
    private readonly drizzleClient: DrizzleDatabase<'sqlite', Schema>,
  ) {}

  public get(url: string) {
    const urls = await this.drizzleClient.select().from(urls);

    return urls;
  }

  async create(url: string) {
    const url = await this.drizzleClient.transaction((tx) => {
      return tx
        .insert(urls)
        .values({
          target: url,
          slug: new Date().getTime().toString(36),
        })
        .returning();
    });

    return url;
  }
}
```

Let's break this down a bit so we know what is happening.

#### Injecting client

```ts
constructor(
  @InjectClient(DBS.LOCAL)
  private readonly drizzleClient: DrizzleDatabase<'sqlite', Schema>,
) {}
```

Here we are using the helper decorator from the library `InjectClient` and passing it a name. If we specified a name for our connection, like we did above, the we need to reference that connection trough the same name when trying to use it. As for the `DrizzleDatabase<'sqlite', Schema>`. The first param `sqlite` just tells us that we will be using the sqlite dialect for out client. Trough that drizzle will limit the methods and query builder to work using sqlite syntax. Why is that? Well for example methods like `returning()` work with sqlite and postgresql, but `mysql` will have `.$returningId()`. It is trough that first param we can have a nice typesafe way to tell our client what methods it will have. As for the second param of `Schema`. Before we did `export type Schema = typeof schema;`. This will help us with better autocomplete, when doing queries:

```ts
this.drizzleClient.query.urls.findMany({});
this.drizzleClient.query.urls.findFirst({});
```

We already registered our schema, when we setup the `DrizzleModule`, but we need to do this if we want to have type-safe query usage. In case you will not use `this.drizzleClient.query` you do not need to setup the `Schema` and can omit the type.


#### The syntax

Here is an example of how drizzle docs say we can do a select query


```ts
const result = await drizzleClient.select().from(urls);
```

And here is how we do it with our injected client.

```ts
const urls = await this.drizzleClient.select().from(urls);
```

Corporate wants you to find the difference between the two code snippets, but there are none. Why because the drizzleClient in the example above is created in the same way as the one below, just that the one below is abstracted for simplicity. The rest of the syntax is just how you would write any drizzle query. 

Here is a comparison for fetching specific fields

```ts
// vanilla
const result = await drizzleClient.select({
  field1: urls.id,
  field2: urls.name,
}).from(urls);

// vs

// nestjs
const result = await this.drizzleClient.select({
  field1: urls.id,
  field2: urls.name,
}).from(urls);
```

What about inserts? Well...

```ts
const url = {
  // data here
};
const record = await drizzleClient.insert(urls).values(url); // vanilla
const record = await this.drizzleClient.insert(urls).values(url); // nestjs
```

So by know you can see the pattern. After you setup the connection and inject it. You use it as if it were the vanilla drizzle client, which it in fact is. And in the code snipped above we could also do `.returning()` or `.$returningId()` depending on our dialect.

If we look at our `UrlService#create` method we can see another really useful thing, a 🌈 `transaction`🌈. That is a neat and handy tool.

```ts
async create(url: string) {
  const url = await this.drizzleClient.transaction((tx) => {
    return tx
      .insert(urls)
      .values({
        target: url,
        slug: new Date().getTime().toString(36),
      })
    .returning(); 
  });

  return url;
}
```

Now when you look at this code snipper above, where we start a transaction, insert a new record and then return the new record (which we can because we are using sqlite), how do you think it would look like using vanilla drizzle? I will let you figure that out.


#### Another connection

So we used one client for one connection. What if we want another one? Well if we named it properly then it is as simple as:

```ts
constructor(
  @InjectClient(DBS.LOCAL)
  private readonly drizzleClient: DrizzleDatabase<'sqlite', Schema>,
  @InjectClient(DBS.Turso)
  private readonly drizzleClientTurso: DrizzleDatabase<'sqlite', Schema>,
) {}
```

And it is that easy. As for usage, you just saw us make a select and insert, and there was no need to learn any new syntax. If you know drizzle, or just sql. Then you are right at home. And in case of not then drizzle has really amazing docs for each dialect 👉 https://orm.drizzle.team/docs/rqb


### Utilize the repository

Now drizzle does not have repositories. It does not work that way, and it is not your standard repository either. All this repository is, is a little wrapper to make using the client easier and locked to a specific entity.

#### Setup for repo

Now in typeorm you know that you have to register your entities `forFeature`. Well we kinda need to do the same.

```ts
@Module({
  imports: [
    DrizzleModule.forFeature({
      entities: [urls],
      name: DBS.LOCAL,
    }),
  ],
  // ...
})
export class UrlModule {}
```

So we just go to the moduel we will be using the repo in, and we register them. Also keep in mind that if you used a custom name for your connection it is important to register your entities to that connection, else the repository will not work properly. Every connection can have its set of exposed repositories.

#### Using the url repository

Now we had the `UrlService` for the client. Let's see how that would look like if we were to use a repository

```ts
@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(urls, DBS.LOCAL)
    private readonly urlRepository: DrizzleRepository<Schema, 'urls', 'sqlite'>,
  ) {}

  public async get(slug: string) {
    const [url] = await this.urlRepository.selectWhere(eq(urls.slug, slug));

    return url;
  }

  public async create(target: string) {
    const url = await this.urlRepository
      .insert({
        target,
        slug: new Date().getTime().toString(36),
      })
      .returning();

    return url;
  }
}
```

Not much changed. Under the hood a repository still uses the client, it just limits the usage to one single entity, like urls in this case. If we check the constructor we will see that we use the `InjectRepository` helper decorator to get the repository of an entity, and the first parameter is the entity type we want to use, which is the table defined by drizzle while the second param is the connection name, if you specified a custom connection of course. We can use the `DrizzleRepository` to register the repository. We pass it the whole schema (unfortunately 😔) and the name of the entity we defined. The last parameter is the dialect we will use for our repo.

The `selectWhere` method does not exist on drizzle, under the hood it is just doing `.select().from(urls).where(query)`. It removes a lot of code we would have to type ourselves, and there in lies the usefulness. If we check insert we can see now we don't have to call `values`, that is because the repo will call it for us. And what about that `.returning()` part?
Well as mention depending on the dialect we will have different options available. Those options are better explained by the drizzle team, in the docs I linked to previously.

The return of any method exposed in the repository will be a query builder of the dialect type. What that means is we can chain methods like with the client. For example:

```ts
const entities = await this.urlRepository.select().orderBy(urls.id);
```

The `orderBy` is not exposed by the repository. Once we call a method of the repo from there we build on like we would usually with a drizzle client.

## Wrapping Up


Drizzle is a really cool tool for working with the DB. It gives you more control over how you want to use it rather than to force a lot of new syntaxes and paradigms down your throat.
There is no syntax language like in prisma, there are not entity decorators. You create an object and define it, boom entity done. 

Want a migration? Here it is. 
Need a UI for viewing data? Boom drizzle studio.
Want to access your data or mutate it and only know SQL? Drizzle don't really care.

This library aims to make using Drizzle with NestJS a breeze. If you're already familiar with Drizzle, you can jump right in. If you're new to it, you can rely on Drizzle's excellent documentation for building queries without learning another ORM syntax.

Want to chat about this? Hit me up on Twitter [@sixaphone](https://twitter.com/sixaphone)!