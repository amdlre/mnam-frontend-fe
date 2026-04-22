'use client';

import { useTranslations } from 'next-intl';
import {
  CustomBadge,
  Button,
  Typography,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Separator,
  Container,
  Grid,
  Stack,
  Flex,
} from '@amdlre/design-system';

const FAQ = () => {
  const t = useTranslations('landing.faq');

  const guestFaqs = [
    { question: t('guestQ1'), answer: t('guestA1') },
    { question: t('guestQ2'), answer: t('guestA2') },
    { question: t('guestQ3'), answer: t('guestA3') },
    { question: t('guestQ4'), answer: t('guestA4') },
  ];

  const ownerFaqs = [
    { question: t('ownerQ1'), answer: t('ownerA1') },
    { question: t('ownerQ2'), answer: t('ownerA2') },
    { question: t('ownerQ3'), answer: t('ownerA3') },
    { question: t('ownerQ4'), answer: t('ownerA4') },
  ];

  const handleWhatsApp = () => {
    window.open('https://wa.me/966538721499', '_blank');
  };

  return (
    <div className="bg-muted/30 py-16 md:py-24" id="faq">
      <Container size={"2xl"}>
        <Stack align="center" gap={4} className="mb-10 text-center md:mb-16">
          <CustomBadge>
            {t('badge')}
          </CustomBadge>
          <Typography variant="h2" className="text-2xl font-bold md:text-3xl lg:text-4xl">{t('title')}</Typography>
          <Typography variant="muted" className="text-sm md:text-base">{t('subtitle')}</Typography>
        </Stack>

        <Grid cols={1} className="gap-8 md:gap-12 lg:grid-cols-2">
          {/* Guest Section */}
          <div>
            <Flex align="center" gap={3} className="mb-8 border-b border-border pb-4">
              <span className="text-2xl">✨</span>
              <Typography variant="h3" className="text-2xl font-bold">{t('guestTitle')}</Typography>
            </Flex>
            <Accordion type="single" collapsible>
              {guestFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`guest-${index}`} className="rounded-2xl border bg-card px-6 mb-4 transition-all duration-300 data-[state=open]:border-primary data-[state=open]:shadow-lg data-[state=open]:shadow-primary/5">
                  <AccordionTrigger className="py-5 text-base font-bold hover:no-underline ltr:text-left rtl:text-right [&[data-state=open]]:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Owner Section */}
          <div>
            <Flex align="center" gap={3} className="mb-8 border-b border-border pb-4">
              <span className="text-2xl">🏢</span>
              <Typography variant="h3" className="text-2xl font-bold">{t('ownerTitle')}</Typography>
            </Flex>
            <Accordion type="single" collapsible>
              {ownerFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`owner-${index}`} className="rounded-2xl border bg-card px-6 mb-4 transition-all duration-300 data-[state=open]:border-primary data-[state=open]:shadow-lg data-[state=open]:shadow-primary/5">
                  <AccordionTrigger className="py-5 text-base font-bold hover:no-underline ltr:text-left rtl:text-right [&[data-state=open]]:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Grid>

        <Stack align="center" gap={4} className="mt-16">
          <Typography variant="muted">{t('noAnswer')}</Typography>
          <Button
            variant="outline"
            onClick={handleWhatsApp}
            className="group inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-card px-8 py-3 font-bold text-primary transition-all hover:bg-primary hover:text-white"
          >
            <span>{t('whatsappCta')}</span>
            <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </Button>
        </Stack>
      </Container>
    </div>
  );
};

export default FAQ;
