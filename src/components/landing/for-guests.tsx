'use client';

import { useTranslations } from 'next-intl';
import {
  Button,
  Badge,
  Typography,
  Flex,
  Container,
  Stack,
} from '@amdlre/design-system';

const ForGuests = () => {
  const t = useTranslations('landing.forGuests');

  const features = [
    { title: t('feature1Title'), desc: t('feature1Desc') },
    { title: t('feature2Title'), desc: t('feature2Desc') },
    { title: t('feature3Title'), desc: t('feature3Desc') },
  ];

  const unitImages = [
    {
      url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600',
      alt: t('imgAlt1'),
      span: 'row-span-2',
    },
    {
      url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=600',
      alt: t('imgAlt2'),
      span: 'row-span-1',
    },
    {
      url: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=80&w=600',
      alt: t('imgAlt3'),
      span: 'row-span-1',
    },
  ];

  const handleBrowseUnits = () => {
    window.open('https://booking.usemnam.com', '_blank');
  };

  return (
    <div className="bg-card py-16 md:py-24" id="guests">
      <Container className="px-6">
        <Flex direction="col" align="center" gap={12} className="lg:flex-row lg:gap-16">
          {/* Text Content */}
          <div className="w-full lg:w-5/12">
            <Badge variant="secondary" className="mb-4 rounded-none border-0 bg-transparent px-0 text-xs font-bold uppercase tracking-widest text-primary">
              {t('badge')}
            </Badge>
            <Typography variant="h2" className="mb-6 text-3xl font-black leading-tight md:text-4xl lg:text-5xl">
              {t('titleLine1')} <br />
              <span className="text-primary">{t('titleLine2')}</span>
            </Typography>
            <Typography variant="lead" className="mb-10 text-base leading-relaxed text-muted-foreground md:text-lg">
              {t('description')}
            </Typography>

            <Stack gap={6} className="mb-10">
              {features.map((f, i) => (
                <Flex key={i} align="start" gap={4}>
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary/20">
                    <svg className="h-3.5 w-3.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <Typography variant="large" className="text-lg">{f.title}</Typography>
                    <Typography variant="muted" className="mt-1">{f.desc}</Typography>
                  </div>
                </Flex>
              ))}
            </Stack>

            <Button
              size="lg"
              onClick={handleBrowseUnits}
              className="group w-full rounded-xl bg-foreground px-8 py-4 font-bold text-white shadow-xl shadow-border transition-all hover:bg-foreground/90 sm:w-auto"
            >
              <span>{t('browseUnits')}</span>
              <svg
                className="h-5 w-5 transition-transform group-hover:-translate-x-1 rtl:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
          </div>

          {/* Grid Layout Images */}
          <div className="h-[400px] w-full lg:h-[500px] lg:w-7/12">
            <div className="grid h-full grid-cols-2 grid-rows-2 gap-3 md:gap-4">
              {unitImages.map((img, idx) => (
                <div key={idx} className={`group relative overflow-hidden rounded-2xl md:rounded-3xl ${img.span}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/40"></div>
                  <div className="absolute bottom-4 right-4 hidden translate-y-2 text-white opacity-0 transition-opacity duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
                    <Typography variant="large" className="text-white">{img.alt}</Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Flex>
      </Container>
    </div>
  );
};

export default ForGuests;
