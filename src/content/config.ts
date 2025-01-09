import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/blog",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    draft: z.boolean().optional().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/projects",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url(),
    source: z.string().url(),
    featured: z.boolean().optional().default(false),
    techs: z.array(z.string()).optional(),
  }),
});

const site = defineCollection({
  loader: file("./src/content/site/config.json"),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    introduction: z.string(),
    sections: z.object({
      blog: z.object({
        title: z.string(),
        viewAllText: z.string(),
      }),
      projects: z.object({
        title: z.string(),
        viewAllText: z.string(),
      }),
      experience: z.object({
        title: z.string(),
        viewAllText: z.string(),
      }),
    }),
    socialLinks: z
      .array(
        z.object({
          platform: z.string(),
          url: z.string().url(),
        })
      )
      .optional(),
  }),
});

const gists = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/gists",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    category: z.string(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  blog,
  gists,
  projects,
  site,
};
