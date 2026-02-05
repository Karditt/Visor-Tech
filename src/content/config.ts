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
  }),
});

export const collections = {
  landing: landingCollection,
};
