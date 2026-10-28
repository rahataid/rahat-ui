'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ConnectKitButton } from 'connectkit';

function ConnectWallet() {
  const t = useTranslations('GLOBAL');
  return (
    <ConnectKitButton
      showAvatar={true}
      showBalance={false}
      label={t('CONNECT_WALLET')}
    />
  );
}

export default ConnectWallet;
