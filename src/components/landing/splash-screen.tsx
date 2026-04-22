'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Typography,
  Center,
  Stack,
  Flex,
} from '@amdlre/design-system';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, duration = 3000 }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('landing.splash');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  return (
    <Center
      className={`fixed inset-0 z-[999] flex-col transition-all duration-500 ${fadeOut ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
        }`}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      </div>

      {/* Animated Glow Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] animate-pulse rounded-full bg-violet-500/30 blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] animate-pulse rounded-full bg-purple-600/20 blur-[120px] [animation-delay:0.5s]"></div>
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-indigo-500/15 blur-[150px] [animation-delay:1s]"></div>
      </div>

      {/* Floating Particles */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 animate-float rounded-full bg-white/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <Stack align="center" className="relative z-10">

        {/* Logo with glow effect */}
        <div className="relative mb-8 animate-in zoom-in duration-700">
          <div className="absolute inset-0 h-40 w-40 animate-pulse rounded-full bg-white/20 blur-3xl"></div>

          <Center className="relative h-32 w-32 md:h-40 md:w-40">
            <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-white/20"></div>
            <div className="absolute inset-2 animate-spin-reverse rounded-full border-2 border-white/10"></div>
            <div className="absolute inset-4 animate-pulse rounded-full border border-white/5"></div>

            <div className="relative h-20 w-20 animate-float-slow md:h-24 md:w-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mnam-logo.png"
                alt="Mnam"
                className="h-full w-full object-contain drop-shadow-2xl"
              />
            </div>
          </Center>
        </div>

        {/* Company Name */}
        <Typography as="h1" variant="h1" className="mb-3 text-4xl font-black tracking-tight text-white animate-in slide-in-from-bottom duration-700 delay-200 md:text-6xl">

        </Typography>

        {/* Tagline */}
        <Typography variant="lead" className="mb-12 font-light text-white/70 animate-in slide-in-from-bottom duration-700 delay-300">
          {t('tagline')}
        </Typography>

        {/* Progress Bar */}
        <div className="w-48 animate-in fade-in duration-700 delay-500 md:w-64">
          <div className="h-1 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
            <div
              className="relative h-full rounded-full bg-gradient-to-r from-white via-violet-200 to-white transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            </div>
          </div>

          <Flex justify="between" className="mt-3">
            <Typography variant="small" className="text-xs text-white/50">{t('loading')}</Typography>
            <Typography variant="small" className="text-xs text-white/50">{progress}%</Typography>
          </Flex>
        </div>

        {/* Bouncing Dots */}
        <Flex gap={2} className="mt-8 animate-in fade-in duration-700 delay-700">
          <div className="h-2 w-2 animate-bounce rounded-full bg-white/50"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-white/50 [animation-delay:0.1s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-white/50 [animation-delay:0.2s]"></div>
        </Flex>
      </Stack>

      {/* Copyright */}
      <Typography variant="small" className="absolute bottom-8 text-xs text-white/30 animate-in fade-in duration-700 delay-1000">
        &copy; {new Date().getFullYear()} {t('copyright')}
      </Typography>
    </Center>
  );
};

export default SplashScreen;
