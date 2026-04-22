'use client';

import { useTranslations } from 'next-intl';
import {
  Button,
  CustomBadge,
  Typography,
  Grid,
  Container,
  Stack,
  Center,
} from '@amdlre/design-system';

interface HowItWorksProps {
  onOpenTerms: () => void;
}

const HowItWorks = ({ onOpenTerms }: HowItWorksProps) => {
  const t = useTranslations('landing.howItWorks');

  const steps = [
    { title: t('step1Title'), desc: t('step1Desc'), icon: '1' },
    { title: t('step2Title'), desc: t('step2Desc'), icon: '2' },
    { title: t('step3Title'), desc: t('step3Desc'), icon: '3' },
  ];

  return (
    <div className="relative overflow-hidden bg-card py-32" id="how">
      <Container size={"2xl"} className="relative z-10 px-6">
        <Stack align="center" gap={6} className="reveal mx-auto mb-24 max-w-2xl text-center">
          <CustomBadge>
            {t('badge')}
          </CustomBadge>
          <Typography variant="h2" className="text-4xl font-black md:text-5xl">{t('title')}</Typography>
          <Typography variant="lead" className="leading-relaxed">
            {t('subtitle')}
          </Typography>
        </Stack>

        <div className="relative mx-auto max-w-6xl">
          {/* Connecting Line (Desktop) */}
          <div className="absolute left-10 right-10 top-12 -z-10 hidden h-[2px] border-t-2 border-dashed border-border md:block"></div>

          <Grid cols={1} gap={16} className="md:grid-cols-3">
            {steps.map((s, i) => (
              <Stack
                key={i}
                align="center"
                className="reveal group relative text-center"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <Center
                  className={`relative z-10 mb-10 h-24 w-24 rotate-45 rounded-[2rem] border-[3px] bg-card transition-all duration-500 group-hover:-translate-y-2 ${i === 1 ? 'border-primary shadow-xl shadow-primary/20' : 'border-border group-hover:border-primary/50'
                    }`}
                >
                  <Typography variant="h3" className="-rotate-45 text-2xl font-black transition-colors group-hover:text-primary">
                    {s.icon}
                  </Typography>
                  {i === 1 && (
                    <div className="absolute inset-0 animate-ping rounded-[2rem] border-[3px] border-primary opacity-20"></div>
                  )}
                </Center>

                <Typography variant="h3" className="mb-4 text-2xl font-bold transition-colors group-hover:text-primary">
                  {s.title}
                </Typography>
                <Typography variant="muted" className="text-balance px-2 font-light leading-relaxed">{s.desc}</Typography>
              </Stack>
            ))}
          </Grid>
        </div>

        <Center className="reveal delay-300 mt-20">
          <Button
            variant="default"
            size={"xl"}
            onClick={onOpenTerms}

          >
            {t('readTerms')}
          </Button>
        </Center>
      </Container>
    </div>
  );
};

export default HowItWorks;
