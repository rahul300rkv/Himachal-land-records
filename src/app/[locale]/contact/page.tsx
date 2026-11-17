import type { Metadata } from 'next';
import { Clock3, Mail, ShieldAlert } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { SITE } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

const COPY = {
  en: {
    eyebrow: 'Contact Himland Check', title: 'Questions, corrections or partnership enquiries?',
    description: 'Reach the Himland Check team about the platform, educational content, data corrections, accessibility or business enquiries.',
    intro: 'Himland Check is an independent information platform. We welcome clear, specific messages that help us improve the accuracy, accessibility and usefulness of our land due-diligence tools and guides.',
    emailTitle: 'Email us directly', emailBody: 'The fastest way to reach the team is by email. Include a concise subject and enough context for us to route your message correctly.',
    responseTitle: 'Response time', responseBody: 'We aim to acknowledge genuine enquiries within three working days. Complex corrections may take longer while we verify the cited public source.',
    includeTitle: 'What to include', includeBody: 'For a website problem, share the page URL, language, device and a screenshot of the error. For a content correction, identify the exact paragraph and link to the current official source. For a partnership or press enquiry, include your organisation, role and intended use.',
    privacyTitle: 'Please protect personal information', privacyBody: 'Do not email Aadhaar numbers, unredacted identity documents, bank details, signatures, passwords, CAPTCHA codes or complete private land-record files. If a screenshot is necessary, cover personal identifiers that are not relevant to the issue.',
    limitsTitle: 'What we cannot do', limitsBody: 'We cannot issue a certified Jamabandi, mutate ownership, approve Section 118 permission, decide a boundary, remove a mortgage or provide a government status update. Those matters must be handled by the competent Revenue Department, Sub-Registrar, court or other authority. We also do not replace advice from an advocate, survey professional, architect or tax adviser.',
    officialTitle: 'Government and legal matters', officialBody: 'If your request concerns an official record, quote the relevant receipt or case number when contacting the appropriate government office—but do not send that sensitive material to us unless it is essential and safely redacted. For an active transaction or dispute, obtain transaction-specific professional advice before paying money or signing documents.',
  },
  hi: {
    eyebrow: 'हिमलैंड चेक से संपर्क', title: 'प्रश्न, सुधार या साझेदारी संबंधी संदेश?',
    description: 'प्लेटफ़ॉर्म, शैक्षिक सामग्री, डेटा सुधार, सुगम्यता या व्यावसायिक पूछताछ के लिए हिमलैंड चेक टीम से संपर्क करें।',
    intro: 'हिमलैंड चेक एक स्वतंत्र सूचना मंच है। भूमि जाँच उपकरणों और मार्गदर्शिकाओं की सटीकता, सुगम्यता तथा उपयोगिता सुधारने वाले स्पष्ट और विशेष संदेशों का स्वागत है।',
    emailTitle: 'सीधे ईमेल करें', emailBody: 'टीम तक पहुँचने का सबसे तेज तरीका ईमेल है। स्पष्ट विषय लिखें और संदेश को सही व्यक्ति तक पहुँचाने के लिए पर्याप्त संदर्भ दें।',
    responseTitle: 'उत्तर का समय', responseBody: 'हम वास्तविक पूछताछ की प्राप्ति तीन कार्य दिवसों में स्वीकार करने का प्रयास करते हैं। आधिकारिक स्रोत सत्यापित करने वाले सुधारों में अधिक समय लग सकता है।',
    includeTitle: 'क्या जानकारी दें', includeBody: 'वेबसाइट समस्या के लिए पेज URL, भाषा, डिवाइस और त्रुटि का स्क्रीनशॉट दें। सामग्री सुधार में सही अनुच्छेद और वर्तमान आधिकारिक स्रोत का लिंक बताएँ। साझेदारी या मीडिया पूछताछ में संस्था, भूमिका और उद्देश्य लिखें।',
    privacyTitle: 'व्यक्तिगत जानकारी सुरक्षित रखें', privacyBody: 'आधार नंबर, बिना ढके पहचान दस्तावेज़, बैंक विवरण, हस्ताक्षर, पासवर्ड, कैप्चा कोड या पूरी निजी भूमि फाइल ईमेल न करें। स्क्रीनशॉट में असंबंधित व्यक्तिगत पहचान ढक दें।',
    limitsTitle: 'हम क्या नहीं कर सकते', limitsBody: 'हम प्रमाणित जमाबंदी जारी, स्वामित्व इंतकाल, धारा 118 अनुमति, सीमा निर्णय, बंधक समाप्त या सरकारी स्थिति अपडेट नहीं कर सकते। इन विषयों के लिए सक्षम राजस्व विभाग, उप-पंजीयक, न्यायालय या अन्य प्राधिकरण से संपर्क करें। हम वकील, सर्वे पेशेवर, वास्तुकार या कर सलाहकार का स्थान नहीं लेते।',
    officialTitle: 'सरकारी और कानूनी विषय', officialBody: 'आधिकारिक अभिलेख के लिए संबंधित सरकारी कार्यालय को रसीद या केस नंबर दें, पर आवश्यक और सुरक्षित रूप से संपादित किए बिना संवेदनशील सामग्री हमें न भेजें। सक्रिय सौदे या विवाद में भुगतान अथवा हस्ताक्षर से पहले विशेष पेशेवर सलाह लें।',
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = COPY[locale === 'hi' ? 'hi' : 'en'];
  return pageMetadata({ locale, path: '/contact', title: copy.title, description: copy.description });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const copy = COPY[locale === 'hi' ? 'hi' : 'en'];
  return <article className="container max-w-4xl py-10 sm:py-14">
    <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">{copy.eyebrow}</p><h1 className="mt-3 text-4xl sm:text-5xl">{copy.title}</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">{copy.intro}</p></header>

    <section className="concept-card mt-10 rounded-3xl border bg-card p-6 shadow-[8px_9px_0_rgba(42,16,45,0.08)] sm:p-9">
      <div className="flex items-start gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Mail aria-hidden="true" /></span><div><h2 className="text-3xl">{copy.emailTitle}</h2><p className="mt-3 leading-7 text-muted-foreground">{copy.emailBody}</p><a href={`mailto:${SITE.contactEmail}`} className="mt-5 inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary/90">{SITE.contactEmail}</a></div></div>
    </section>

    <div className="mt-8 grid gap-6 md:grid-cols-2">
      <section className="rounded-2xl border bg-card p-6"><Clock3 className="size-7 text-leaf" aria-hidden="true" /><h2 className="mt-4 text-2xl">{copy.responseTitle}</h2><p className="mt-3 leading-7 text-muted-foreground">{copy.responseBody}</p></section>
      <section className="rounded-2xl border bg-card p-6"><Mail className="size-7 text-leaf" aria-hidden="true" /><h2 className="mt-4 text-2xl">{copy.includeTitle}</h2><p className="mt-3 leading-7 text-muted-foreground">{copy.includeBody}</p></section>
    </div>

    <section className="mt-8 rounded-2xl border border-notice-border bg-notice p-6"><ShieldAlert className="size-7 text-notice-foreground" aria-hidden="true" /><h2 className="mt-4 text-2xl">{copy.privacyTitle}</h2><p className="mt-3 leading-7 text-notice-foreground">{copy.privacyBody}</p></section>
    <section className="mt-8 rounded-2xl border bg-card p-6 sm:p-8"><h2 className="text-2xl">{copy.limitsTitle}</h2><p className="mt-3 leading-7 text-muted-foreground">{copy.limitsBody}</p><h2 className="mt-7 text-2xl">{copy.officialTitle}</h2><p className="mt-3 leading-7 text-muted-foreground">{copy.officialBody}</p></section>
  </article>;
}
