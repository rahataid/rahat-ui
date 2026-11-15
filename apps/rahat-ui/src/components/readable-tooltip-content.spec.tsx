import React from 'react';
import { render, screen } from '@testing-library/react';
import TooltipWrapper from './tooltip.wrapper';
import { TruncatedCell } from '../sections/projects/aa-2/stakeholders/component/TruncatedCell';

jest.mock('@rahat-ui/shadcn/src', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('@rahat-ui/shadcn/components/tooltip', () => {
  return {
    TooltipProvider: ({ children }: { children: React.ReactNode }) => children,
    Tooltip: ({ children }: { children: React.ReactNode }) => children,
    TooltipTrigger: ({ children }: { children: React.ReactNode }) => children,
    TooltipContent: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className: string;
    }) => (
      <div data-testid="tooltip" className={className}>
        {children}
      </div>
    ),
  };
});

describe('long text tooltips', () => {
  const longText = 'unbroken'.repeat(100);

  it('keeps the complete activity or communication tooltip in a bounded wrapping container', () => {
    render(
      <TooltipWrapper tip={longText}>
        <span>Activity</span>
      </TooltipWrapper>,
    );
    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip.textContent).toBe(longText);
    expect(tooltip.className).toContain('[overflow-wrap:anywhere]');
    expect(tooltip.className).toContain('overflow-y-auto');
    expect(tooltip.className).toContain('calc(100vw-2rem)');
  });

  it.each([false, true])(
    'keeps the complete cell tooltip (truncateByWidth=%s)',
    (truncateByWidth) => {
      render(
        <TruncatedCell text={longText} truncateByWidth={truncateByWidth} />,
      );
      expect(screen.getByTestId('tooltip').textContent).toBe(longText);
      expect(screen.getByTestId('tooltip').className).toContain(
        '[overflow-wrap:anywhere]',
      );
      expect(
        screen
          .getByText(
            truncateByWidth ? longText : `${longText.slice(0, 20)}...`,
            { selector: 'span' },
          )
          .getAttribute('tabindex'),
      ).toBe('0');
    },
  );

  it('does not add a tooltip to a short character-truncated cell', () => {
    render(<TruncatedCell text="Short title" />);
    expect(screen.queryByTestId('tooltip')).toBeNull();
    expect(screen.getByText('Short title')).toBeTruthy();
  });
});
