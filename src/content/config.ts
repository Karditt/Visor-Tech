import { defineCollection, z } from "astro:content";

const landingCollection = defineCollection({
  type: "content",
  schema: z.object({
    header: z.object({
      nav: z.array(
        z.object({
          label: z.string(),
          href: z.string(),
        }),
      ),
      phone: z.string(),
      phoneHref: z.string(),
      ctaButton: z.string(),
    }),
    hero: z.object({
      title: z.string(),
      subtitle: z.string(),
      benefits: z.array(z.string()),
      ctaButton: z.string(),
    }),
    services: z.object({
      title: z.string(),
      items: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string(), // We'll store the icon name/identifier here
        }),
      ),
    }),
    cases: z.object({
      title: z.string(),
      subtitle: z.string(),
      items: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          image: z.string().optional(),
          tags: z.array(z.string()),
        }),
      ),
    }),
    benefits: z.object({
      title: z.string(),
      items: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string(),
        }),
      ),
    }),
  }),
});

export const collections = {
  landing: landingCollection,
};
