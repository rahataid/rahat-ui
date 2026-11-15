import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';

type Props = {
  successful: unknown;
  total: unknown;
};

export function PayoutProgress({ successful, total }: Props) {
  const tg = useTranslations('GLOBAL');
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const formatNum = useNumberFormat();
  const formatCount = (value: unknown) =>
    typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
      ? formatNum(value)
      : tg('N_A');

  return (
    <p className="text-sm text-muted-foreground" aria-live="polite">
      {tv('SUCCESS')} / {tg('TOTAL_BENEFICIARIES')}:{' '}
      {formatCount(successful)} / {formatCount(total)}
    </p>
  );
}
