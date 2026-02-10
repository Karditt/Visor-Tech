export interface HeaderData {
  nav: { label: string; href: string }[];
  phone: string;
  phoneHref: string;
  ctaButton: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  benefits: string[];
  ctaButton: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

export interface ServicesData {
  title: string;
  items: ServiceItem[];
}

export interface CaseItem {
  title: string;
  description: string;
  tags: string[];
  image?: string;
}

export interface CasesData {
  title: string;
  subtitle: string;
  items: CaseItem[];
}

export interface BenefitItem {
  title: string;
  description: string;
  icon: string;
}

export interface BenefitsData {
  title: string;
  items: BenefitItem[];
}

export interface AboutData {
  title: string;
  subtitle: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  mapEmbedUrl: string;
}

export interface ContactFormData {
  title: string;
  subtitle: string;
}

export interface FooterData {
  slogan: string;
  legal: {
    name: string;
    inn: string;
    kpp: string;
    ogrn: string;
    privacyPolicy: string;
    userAgreement: string;
  };
  copyright: string;
}

export interface LandingPageData {
  header: HeaderData;
  hero: HeroData;
  services: ServicesData;
  cases: CasesData;
  benefits: BenefitsData;
  about: AboutData;
  contactForm: ContactFormData;
  footer: FooterData;
}
