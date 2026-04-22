'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Badge,
  Typography,
  Separator,
  Grid,
  Container,
  Flex,
} from '@amdlre/design-system';

interface Feature {
  title: string;
  desc: string;
  icon: string;
  color: string;
  bg: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`reveal group relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-2 hover:border-border hover:shadow-2xl hover:shadow-border/50 md:p-10 ${index === 0 || index === 3 || index === 4 ? 'md:col-span-2' : ''
        }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(124, 58, 237, 0.08), transparent 40%)`,
        }}
      />

      <Flex direction="col" align="start" className="relative z-10 h-full">
        <div
          className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.bg} ${feature.color} border border-transparent text-3xl transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110 group-hover:border-black/5`}
        >
          {feature.icon}
        </div>
        <Typography variant="h3" className="mb-4 text-2xl font-black tracking-tight transition-colors group-hover:text-primary md:text-3xl">
          {feature.title}
        </Typography>
        <Typography className="mt-auto text-balance text-base font-normal leading-relaxed text-muted-foreground md:text-lg">
          {feature.desc}
        </Typography>
      </Flex>

      {/* Decorative Blob */}
      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-gradient-to-tr from-slate-50 to-transparent opacity-0 blur-3xl transition-transform duration-700 group-hover:scale-150 group-hover:opacity-100"></div>
    </div>
  );
};

const WhyUs = () => {
  const t = useTranslations('landing.whyUs');

  const features: Feature[] = [
    { title: t('feature1Title'), desc: t('feature1Desc'), icon: '⚡', color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: t('feature2Title'), desc: t('feature2Desc'), icon: '🎯', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: t('feature3Title'), desc: t('feature3Desc'), icon: '📈', color: 'text-green-600', bg: 'bg-green-50' },
    { title: t('feature4Title'), desc: t('feature4Desc'), icon: '📱', color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: t('feature5Title'), desc: t('feature5Desc'), icon: '🇸🇦', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: t('feature6Title'), desc: t('feature6Desc'), icon: '✨', color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <section className="relative bg-background py-32" id="why">
      {/* Separator */}
      <Separator className="absolute left-0 top-0 bg-gradient-to-r from-transparent via-border to-transparent" />

      <Container size={"2xl"} className="px-6">
        <Flex direction="col" justify="between" gap={8} className="mb-20 items-end md:flex-row">
          <div className="reveal max-w-2xl">
            <Badge variant="secondary" className="mb-4 rounded-none border-0 bg-transparent px-0 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {t('badge')}
            </Badge>
            <Typography variant="h1" className="text-4xl font-black leading-[1.1] tracking-tight md:text-6xl">
              {t('titleLine1')} <br />
              <span className="text-muted-foreground">{t('titleLine2')}</span>
            </Typography>
          </div>
          <Typography variant="lead" className="reveal delay-100 max-w-sm font-light leading-relaxed">
            {t('subtitle')}
          </Typography>
        </Flex>

        {/* Bento Grid Layout */}
        <Grid cols={1} gap={6} className="md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </Grid>
      </Container>
    </section>
  );
};

export default WhyUs;
