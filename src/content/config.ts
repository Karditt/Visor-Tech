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
    about: z.object({
      title: z.string(),
      subtitle: z.string().optional(), // Added optional subtitle just in case
      address: z.string(),
      phone: z.string(),
      email: z.string(),
      workingHours: z.string(),
      mapEmbedUrl: z.string(),
    }),
    footer: z.object({
      slogan: z.string(),
      legal: z.object({
        name: z.string(),
        inn: z.string(),
        kpp: z.string(),
        ogrn: z.string(),
        privacyPolicy: z.string(),
        userAgreement: z.string(),
      }),
      copyright: z.string(),
    }),
  }),
});

export const collections = {
  landing: landingCollection,
};
