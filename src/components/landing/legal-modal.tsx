'use client';

import { useTranslations } from 'next-intl';
import {
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  ScrollArea,
  Stack,
} from '@amdlre/design-system';

interface LegalModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

const LegalModal = ({ isOpen, type, onClose }: LegalModalProps) => {
  const t = useTranslations('landing.legal');

  const content = {
    terms: {
      title: t('termsTitle'),
      body: (
        <Stack gap={6} className="text-sm leading-relaxed text-muted-foreground md:text-base">
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <Typography variant="large" className="mb-2 text-amber-800">{t('importantNote')}</Typography>
            <Typography variant="small" className="text-amber-700">
              {t('importantNoteDesc')}
            </Typography>
          </div>

          <div>
            <Typography variant="large" className="mb-2">{t('terms1Title')}</Typography>
            <ul className="mr-2 list-inside list-disc space-y-1">
              <li>{t('terms1Item1')}</li>
              <li>{t('terms1Item2')}</li>
              <li>{t('terms1Item3')}</li>
            </ul>
          </div>

          <div>
            <Typography variant="large" className="mb-2">{t('terms2Title')}</Typography>
            <ul className="mr-2 list-inside list-disc space-y-1">
              <li>{t('terms2Item1')}</li>
              <li>{t('terms2Item2')}</li>
              <li>{t('terms2Item3')}</li>
            </ul>
          </div>

          <div>
            <Typography variant="large" className="mb-2">{t('terms3Title')}</Typography>
            <Typography className="mb-2">
              {t('terms3Intro')}
            </Typography>
            <ul className="mr-2 list-inside list-disc space-y-1">
              <li>{t('terms3Item1')}</li>
              <li>{t('terms3Item2')}</li>
              <li>{t('terms3Item3')}</li>
            </ul>
            <Typography variant="muted" className="mt-2 text-xs">{t('terms3Note')}</Typography>
          </div>

          <div>
            <Typography variant="large" className="mb-2">{t('terms4Title')}</Typography>
            <ul className="mr-2 list-inside list-disc space-y-1">
              <li>{t('terms4Item1')}</li>
              <li>{t('terms4Item2')}</li>
              <li>{t('terms4Item3')}</li>
            </ul>
          </div>
        </Stack>
      ),
    },
    privacy: {
      title: t('privacyTitle'),
      body: (
        <Stack gap={6} className="text-sm leading-relaxed text-muted-foreground md:text-base">
          <Typography>
            {t('privacyIntro')}
          </Typography>

          <div>
            <Typography variant="large" className="mb-2">{t('privacyCollectTitle')}</Typography>
            <Typography>
              {t('privacyCollectDesc')}
            </Typography>
          </div>

          <div>
            <Typography variant="large" className="mb-2">{t('privacyUseTitle')}</Typography>
            <Typography>
              {t('privacyUseDesc')}
            </Typography>
          </div>

          <div>
            <Typography variant="large" className="mb-2">{t('privacyShareTitle')}</Typography>
            <Typography>
              {t('privacyShareDesc')}
            </Typography>
          </div>
        </Stack>
      ),
    },
  };

  const selectedContent = type ? content[type] : { title: '', body: null };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-hidden rounded-3xl p-0">
        <DialogHeader className="border-b border-border p-6 md:p-8">
          <DialogTitle className="text-xl font-black md:text-2xl">{selectedContent.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh]">
          <div className="p-6 md:p-8">{selectedContent.body}</div>
        </ScrollArea>

        <DialogFooter className="gap-3 border-t border-border bg-muted p-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl px-6 font-bold"
          >
            {t('close')}
          </Button>
          {type === 'terms' && (
            <Button
              onClick={() => {
                onClose();
                document.getElementById('owners')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-xl bg-foreground px-6 font-bold text-white shadow-lg shadow-foreground/10 hover:bg-primary"
            >
              {t('agreeStart')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LegalModal;
