'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  Typography,
  Grid,
  Container,
} from '@amdlre/design-system';
import Image from 'next/image';
import Link from 'next/link';

interface AnimatedCounterProps {
  end: string;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter = ({ end, suffix = '', duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 },
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const parseValue = (val: string) =>
      parseFloat(val.replace(/,/g, '').replace(/\+/g, '').replace(/M/g, '').replace(/K/g, ''));
    const target = parseValue(end.toString());

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < duration) {
        const percentage = progress / duration;
        const ease = 1 - Math.pow(1 - percentage, 4);
        setCount(Math.floor(target * ease));
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  return (
    <span ref={countRef}>
      {hasStarted ? (
        <>
          {end.toString().includes('+') ? '+' : ''}
          {count.toLocaleString()}
          {end.toString().includes('M') ? 'M' : end.toString().includes('K') ? 'K' : ''}
          {suffix}
        </>
      ) : (
        '0'
      )}
    </span>
  );
};

const TrustStats = () => {
  const t = useTranslations('landing.trustStats');

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label'), sub: t('stat1Sub') },
    { value: t('stat2Value'), label: t('stat2Label'), sub: t('stat2Sub') },
    { value: t('stat3Value'), label: t('stat3Label'), sub: t('stat3Sub') },
    { value: t('stat4Value'), label: t('stat4Label'), sub: t('stat4Sub') },
  ];

  const partners = [
    { name: 'Ministry of Tourism', logo: '/images/Ministry-of-Tourism.svg', url: 'https://mt.gov.sa' },
    { name: 'Gathern', logo: '/images/Gather-n.svg', url: 'https://gathern.co' },
    { name: 'Booking.com', logo: '/images/Booking-com.svg', url: 'https://booking.com' },
    { name: 'Airbnb', logo: '/images/Airbnb.svg', url: 'https://airbnb.com' },
  ];

  return (
    <div className="overflow-hidden border-t border-border bg-background py-24">
      <Container className="px-6">
        {/* Stats Grid */}
        <Grid cols={2} className="mb-24 divide-x divide-x-reverse divide-border/60 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="reveal delay-100 p-4 text-center">
              <Typography variant="h1" className="mb-2 font-sans text-5xl font-black tracking-tight md:text-6xl">
                <AnimatedCounter end={stat.value} />
              </Typography>
              <Typography variant="large" className="text-lg">{stat.label}</Typography>
              <Typography variant="muted" className="mt-1">{stat.sub}</Typography>
            </div>
          ))}
        </Grid>

        {/* Infinite Marquee Partners */}
        <div className="reveal delay-300 text-center">
          <Typography variant="muted" className="mb-16 text-xs font-bold uppercase tracking-[0.3em]">
            <span className="animate-pulse bg-linear-to-l from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-sm font-black text-transparent">
              {t('partnersTitle')}
            </span>
            <span className="mx-2">&bull;</span>
            {t('partnersSeparator')}
          </Typography>

          <div className="mask-linear-fade relative w-full overflow-hidden">
            <div className="flex w-max animate-marquee items-center gap-24 opacity-60 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0">
              {[...partners, ...partners].map((partner, idx) => {
                return (
                  <Link
                    key={idx}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-[180px] items-center justify-center"
                  >
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={200}
                      height={200}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TrustStats;
