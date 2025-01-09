import { NAVIGATION as NAVIGATION_ITEMS } from "./navigation";

export type NavigationItem = {
  name: string;
  path: string;
};

export const SITE = {
  name: "BitOfCode",
  title: "Software Engineering & Tinkering",
  description:
    "Personal showcase of software engineering projects, gists, and some writtings.",
  url: "https://bit-of-code.netlify.app",
  defaultImage: "/og-image.png",
} as const;

export const NAVIGATION: {
  main: NavigationItem[];
} = {
  main: NAVIGATION_ITEMS,
} as const;

export const CONTENT = {
  postsPerPage: 10,
  recentPostsLimit: 3,
  featuredProjectsLimit: 3,
} as const;

export const META = {
  openGraph: {
    type: "website",
    locale: "en_US",
  },
  twitter: {
    cardType: "summary_large_image",
  },
} as const;
