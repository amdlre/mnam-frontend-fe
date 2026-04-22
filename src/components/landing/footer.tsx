'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Button,
  Input,
  Typography,
  Separator,
  Flex,
  Grid,
  Container,
  Stack,
} from '@amdlre/design-system';

interface FooterProps {
  onOpenLegal: (type: 'terms' | 'privacy') => void;
}

const Footer = ({ onOpenLegal }: FooterProps) => {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const t = useTranslations('landing.footer');

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const socialLinks = [
    {
      name: 'X',
      url: 'https://x.com/usemnam_sa',
      path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
      color: 'hover:bg-slate-800',
      hoverColor: '#1DA1F2',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/usemnam_sa/',
      path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
      color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400',
      hoverColor: '#E4405F',
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@usemnam_sa',
      path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z',
      color: 'hover:bg-slate-900',
      hoverColor: '#00f2ea',
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/mnam-sa/',
      path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
      color: 'hover:bg-[#0077B5]',
      hoverColor: '#0077B5',
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/966538721499',
      path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
      color: 'hover:bg-[#25D366]',
      hoverColor: '#25D366',
    },
  ];

  const quickLinks = [
    { label: t('linkAbout'), id: 'why' },
    { label: t('linkHow'), id: 'how' },
    { label: t('linkOwners'), id: 'owners' },
    { label: t('linkGuests'), id: 'guests' },
    { label: t('linkFaq'), id: 'faq' },
  ];

  return (
    <footer id="footer" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-foreground via-foreground to-black"></div>

      {/* Animated Background Blobs */}
      <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/4 animate-pulse rounded-full bg-primary/20 blur-[150px]"></div>
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/2 animate-pulse rounded-full bg-indigo-600/15 blur-[120px]"></div>
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[100px]"></div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className="relative z-10">
        {/* CTA Section */}
        <div className="border-b border-white/5">
          <Container size={"2xl"} className="py-10 md:py-16">
            <div className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-primary/20 via-violet-600/10 to-indigo-600/20 p-6 backdrop-blur-xl transition-all duration-500 hover:border-white/20 md:rounded-[2.5rem] md:p-12">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>

              <Flex direction="col" align="center" justify="between" gap={6} className="relative z-10 md:gap-8 lg:flex-row">
                <div className="text-center lg:text-right">
                  <Typography variant="h2" className="mb-3 text-2xl font-black text-white md:mb-4 md:text-3xl lg:text-4xl">
                    {t('ctaTitle')}{' '}
                    <span className="bg-gradient-to-r from-primary via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                      {t('ctaHighlight')}
                    </span>
                    {t('ctaQuestion')}
                  </Typography>
                  <Typography variant="lead" className="max-w-xl text-sm text-slate-300 md:text-lg">
                    {t('ctaSubtitle')}
                  </Typography>
                </div>

                <Flex direction="col" gap={3} className="w-full sm:w-auto sm:flex-row md:gap-4">
                  <Button
                    size="lg"
                    onClick={() => scrollToSection('owners')}
                    className="group/btn relative overflow-hidden rounded-xl bg-white px-6 py-3.5 text-base font-bold text-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-foreground hover:shadow-2xl hover:shadow-white/20 active:scale-95 md:rounded-2xl md:px-8 md:py-4 md:text-lg"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <span>{t('ctaRegister')}</span>
                      <svg
                        className="h-5 w-5 transition-transform group-hover/btn:-translate-x-1 rtl:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="rounded-2xl border-white/20 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/20 hover:text-white"
                  >
                    <a
                      href="https://wa.me/966538721499"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/wa"
                    >
                      <svg className="h-5 w-5 transition-transform group-hover/wa:scale-110" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>{t('ctaContact')}</span>
                    </a>
                  </Button>
                </Flex>
              </Flex>
            </div>
          </Container>
        </div>

        {/* Main Content */}
        <Container size={"2xl"} className="pb-8 pt-12 md:pb-12 md:pt-20">
          <Grid cols={1} className="mb-12 gap-8 md:mb-16 md:grid-cols-2 md:gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Logo & Description */}
            <div className="lg:col-span-4">
              <div className="mb-8 inline-block cursor-pointer" onClick={handleLogoClick}>
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-transparent transition-all duration-500 hover:scale-110 hover:rotate-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/mnam-logo.png" alt="Mnam Logo" className="h-full w-full object-contain drop-shadow-2xl" />
                </div>
              </div>

              <Typography className="mb-8 max-w-sm text-lg leading-relaxed text-slate-400">
                {t('description')}
              </Typography>

              {/* Social Links */}
              <Flex wrap="wrap" gap={3}>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:text-white hover:shadow-lg ${social.color}`}
                    onMouseEnter={() => setHoveredSocial(social.name)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    aria-label={social.name}
                    style={{
                      boxShadow: hoveredSocial === social.name ? `0 10px 40px ${social.hoverColor}40` : 'none',
                    }}
                  >
                    <svg className="h-5 w-5 fill-current transition-transform duration-300 hover:scale-110" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </Flex>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3">
              <Typography variant="large" className="mb-6 flex items-center gap-2 text-white md:mb-8">
                <span className="h-[2px] w-6 rounded-full bg-gradient-to-r from-primary to-violet-500 md:w-8"></span>
                {t('quickLinks')}
              </Typography>
              <Stack gap={3} className="md:gap-4">
                {quickLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="link"
                    onClick={() => scrollToSection(link.id)}
                    className="group h-auto justify-start p-0 text-slate-400 no-underline transition-all duration-300 hover:text-white hover:no-underline"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Button>
                ))}
              </Stack>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <Typography variant="large" className="mb-6 flex items-center gap-2 text-white md:mb-8">
                <span className="h-[2px] w-6 rounded-full bg-gradient-to-r from-primary to-violet-500 md:w-8"></span>
                {t('contactTitle')}
              </Typography>
              <Stack gap={4} className="md:gap-5">
                <Flex align="start" gap={3} className="group cursor-pointer">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 text-primary transition-colors group-hover:bg-primary/20">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <Typography variant="small" className="leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
                    {t('addressLine1')}
                    <br />
                    {t('addressLine2')}
                  </Typography>
                </Flex>
                <Flex align="center" gap={3} className="group cursor-pointer">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 text-primary transition-colors group-hover:bg-primary/20">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <a href="mailto:info@usemanam.com" className="text-sm text-slate-400 transition-colors group-hover:text-primary">
                    info@usemanam.com
                  </a>
                </Flex>
                <Flex align="center" gap={3} className="group cursor-pointer">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 text-primary transition-colors group-hover:bg-primary/20">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <a href="tel:+966538721499" className="text-sm text-slate-400 transition-colors group-hover:text-primary" dir="ltr">
                    +966 53 872 1499
                  </a>
                </Flex>
              </Stack>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-3">
              <Typography variant="large" className="mb-8 flex items-center gap-2 text-white">
                <span className="h-[2px] w-8 rounded-full bg-gradient-to-r from-primary to-violet-500"></span>
                {t('newsletter')}
              </Typography>
              <Typography variant="small" className="mb-6 leading-relaxed text-slate-400">{t('newsletterDesc')}</Typography>

              <form onSubmit={handleSubscribe} className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className="w-full rounded-xl border-white/10 bg-white/5 px-4 py-4 pl-14 pr-4 text-sm text-white transition-all placeholder:text-slate-500 focus:border-primary/50 focus:bg-white/10"
                  required
                />
                <Button
                  type="submit"
                  size="icon"
                  className="group/sub absolute left-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-lg bg-primary text-white hover:bg-primary/80"
                >
                  {isSubscribed ? (
                    <svg className="h-5 w-5 animate-bounce text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 transition-transform group-hover/sub:-translate-x-0.5 rtl:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </Button>
              </form>

              {isSubscribed && <Typography variant="small" className="mt-3 animate-pulse text-xs text-green-400">✓ {t('subscribed')}</Typography>}
            </div>
          </Grid>

          {/* Separator */}
          <Separator className="mb-8 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Copyright & Legal Links */}
          <Flex direction="col" align="center" justify="between" gap={6} className="text-sm text-slate-500 md:flex-row">
            <Flex align="center" gap={2}>
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
              <Typography variant="small" className="text-slate-500">&copy; {new Date().getFullYear()} {t('copyright')}</Typography>
            </Flex>

            <Flex align="center" gap={6}>
              <Button variant="link" onClick={() => onOpenLegal('privacy')} className="group relative h-auto p-0 text-sm text-slate-500 no-underline hover:text-white hover:no-underline">
                {t('privacy')}
                <span className="absolute bottom-0 left-0 h-px w-0 bg-primary/50 transition-all duration-300 group-hover:w-full"></span>
              </Button>
              <span className="text-white/20">|</span>
              <Button variant="link" onClick={() => onOpenLegal('terms')} className="group relative h-auto p-0 text-sm text-slate-500 no-underline hover:text-white hover:no-underline">
                {t('terms')}
                <span className="absolute bottom-0 left-0 h-px w-0 bg-primary/50 transition-all duration-300 group-hover:w-full"></span>
              </Button>
            </Flex>
          </Flex>
        </Container>

        {/* Scroll to Top Button */}
        <Button
          variant="default"
          size="icon"
          onClick={handleLogoClick}
          className="group fixed bottom-24 left-6 z-50 h-12 w-12"
          aria-label="Scroll to top"
        >
          <svg className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
