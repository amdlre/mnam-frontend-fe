'use client';

import { useState } from 'react';
import { useForm } from '@formspree/react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Button,
  Input,
  Label,
  Badge,
  Card,
  CardContent,
  Typography,
  Combobox,
  Flex,
  Grid,
  Stack,
  Container,
  getSaudiCities,
} from '@amdlre/design-system';

const ForOwners = () => {
  const [state, handleFormspreeSubmit] = useForm('xjgjelzp');
  const t = useTranslations('landing.forOwners');
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    unitType: '',
    unitCount: '',
  });

  const cityOptions = getSaudiCities(locale as 'ar' | 'en');

  const unitTypes = [
    { key: 'unitTypeApartments', value: t('unitTypeApartments') },
    { key: 'unitTypeVillas', value: t('unitTypeVillas') },
    { key: 'unitTypeShops', value: t('unitTypeShops') },
    { key: 'unitTypeOffices', value: t('unitTypeOffices') },
    { key: 'unitTypeOther', value: t('unitTypeOther') },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleFormspreeSubmit(e);
  };

  return (
    <div className="relative overflow-hidden bg-foreground py-16 md:py-24 lg:py-32" id="owners">
      {/* Abstract Art Background */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] translate-x-1/3 -translate-y-1/3 animate-float-slow rounded-full bg-primary blur-[100px] md:h-[600px] md:w-[600px] md:blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/3 translate-y-1/3 animate-float-reverse rounded-full bg-blue-500 blur-[100px] md:h-[500px] md:w-[500px] md:blur-[150px]"></div>
        <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500 opacity-50 blur-[80px] md:h-[300px] md:w-[300px] md:blur-[120px]"></div>
      </div>

      <Container className="relative z-10 px-6">
        <Flex direction="col" gap={16} className="items-start lg:flex-row lg:gap-24">
          {/* Content */}
          <div className="reveal order-2 hidden text-white lg:sticky lg:top-24 lg:order-1 lg:block lg:w-5/12">
            <Badge className="mb-6 rounded-full border-white/10 bg-white/10 text-slate-200 shadow-glass backdrop-blur-md md:mb-8">
              {t('badge')} 🏢
            </Badge>
            <Typography as="h2" variant="h1" className="mb-8 text-3xl font-black leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
              {t('titleLine1')} <br />
              <span className="bg-linear-to-r from-primary via-violet-400 to-indigo-400 bg-clip-text text-transparent">{t('titleLine2')}</span>
            </Typography>
            <Typography variant="lead" className="mb-12 max-w-xl font-light leading-relaxed text-slate-300">
              {t('description')}
            </Typography>

            <Grid cols={2} className="gap-x-6 gap-y-10 md:gap-x-10">
              {[
                { title: t('benefit1Title'), desc: t('benefit1Desc'), icon: '🛡️' },
                { title: t('benefit2Title'), desc: t('benefit2Desc'), icon: '📄' },
                { title: t('benefit3Title'), desc: t('benefit3Desc'), icon: '💸' },
                { title: t('benefit4Title'), desc: t('benefit4Desc'), icon: '🔍' },
              ].map((item, idx) => (
                <Flex key={idx} gap={4} className="group">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl shadow-inner transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/20">
                    {item.icon}
                  </div>
                  <div>
                    <Typography variant="large" className="text-white transition-colors group-hover:text-primary">{item.title}</Typography>
                    <Typography variant="small" className="font-light leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
                      {item.desc}
                    </Typography>
                  </div>
                </Flex>
              ))}
            </Grid>
          </div>

          {/* Form Card */}
          <div className="reveal delay-200 order-1 w-full lg:order-2 lg:w-7/12">
            <Card className="overflow-hidden rounded-[2.5rem] border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl">
              <CardContent className="p-6 md:p-10">
                <Stack gap={2} className="mb-8">
                  <Typography variant="h3" className="font-black tracking-tight text-foreground">{t('formTitle')}</Typography>
                  <Typography variant="muted">{t('formSubtitle')}</Typography>
                </Stack>

                {state.succeeded ? (
                  <Card className="min-h-[400px] rounded-3xl border-green-100 bg-green-50">
                    <CardContent className="flex h-full flex-col items-center justify-center p-8 py-24 text-center">
                      <div className="mb-6 flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-green-100 text-3xl">🎉</div>
                      <Typography variant="h3" className="mb-2 font-black text-green-900">{t('successTitle')}</Typography>
                      <Typography className="font-medium text-green-700">{t('successMessage')}</Typography>
                    </CardContent>
                  </Card>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <Stack gap={5} className="md:gap-8">
                      <Grid cols={1} className="gap-4 md:grid-cols-2 md:gap-5">
                        <Stack gap={2} className="group">
                          <Label className="form-label">{t('labelName')}</Label>
                          <Input
                            required
                            type="text"
                            name="name"
                            className="form-input"
                            placeholder={t('placeholderName')}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </Stack>
                        <Stack gap={2} className="group">
                          <Label className="form-label">{t('labelPhone')}</Label>
                          <Input
                            required
                            type="number"
                            name="phone"
                            placeholder={t('placeholderPhone')}
                            className="form-input text-left"
                            dir="ltr"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </Stack>
                      </Grid>

                      <Grid cols={1} className="gap-4 md:grid-cols-2 md:gap-5">
                        <Stack gap={2} className="group">
                          <Label className="form-label">{t('labelCity')}</Label>
                          <Combobox
                            options={cityOptions}
                            value={formData.city}
                            onValueChange={(val) => setFormData({ ...formData, city: val })}
                            placeholder={t('placeholderCity')}
                            searchPlaceholder={t('citySearchPlaceholder')}
                            emptyMessage={t('cityEmptyMessage')}
                            className="form-input h-auto w-full"
                          />
                          <input type="hidden" name="city" required value={formData.city} />
                        </Stack>
                        <Stack gap={2} className="group">
                          <Label className="form-label">{t('labelUnitCount')}</Label>
                          <Input
                            required
                            type="number"
                            name="unitCount"
                            min="1"
                            placeholder={t('placeholderUnitCount')}
                            className="form-input"
                            value={formData.unitCount}
                            onChange={(e) => setFormData({ ...formData, unitCount: e.target.value })}
                          />
                        </Stack>
                      </Grid>

                      {/* Unit Type Selection */}
                      <Stack gap={3}>
                        <Label className="form-label">{t('labelUnitType')}</Label>
                        <Flex wrap="wrap" gap={2}>
                          {unitTypes.map((type) => (
                            <Button
                              key={type.key}
                              type="button"
                              variant={formData.unitType === type.value ? 'default' : 'outline'}
                              onClick={() => setFormData({ ...formData, unitType: type.value })}
                              className={`form-unit-btn ${formData.unitType === type.value ? 'form-unit-btn-active' : 'form-unit-btn-inactive'}`}
                            >
                              {type.value}
                            </Button>
                          ))}
                        </Flex>
                        <input type="hidden" name="unitType" required value={formData.unitType} />
                      </Stack>

                      <Button
                        type="submit"
                        size={"xl"}
                        disabled={state.submitting || !formData.unitType}
                        className='!form-unit-btn'
                      >
                        {state.submitting ? (
                          <Flex align="center" justify="center" gap={2}>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-white delay-100"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-white delay-200"></div>
                          </Flex>
                        ) : (
                          <>
                            <span className="absolute inset-0 h-full w-full -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></span>
                            <span className="relative z-10">{t('submitButton')}</span>
                          </>
                        )}
                      </Button>
                      <Typography variant="muted" className="mt-2 text-center text-[10px]">{t('privacyNote')}</Typography>
                    </Stack>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </Flex>
      </Container>
    </div>
  );
};

export default ForOwners;
