import React from 'react';
import { render, screen } from '@testing-library/react';
import { PhaseBadge } from './phase-badge';
import { getPhaseColor } from '../utils/getPhaseColor';

describe('phase badges', () => {
  it.each([
    ['PREPAREDNESS', 'bg-green-100 text-green-700'],
    ['ACTIVATION', 'bg-red-100 text-red-700'],
    ['READINESS', 'bg-yellow-100 text-yellow-800'],
  ])('uses the established color for %s', (phase, color) => {
    expect(getPhaseColor(phase)).toBe(color);
    expect(getPhaseColor(` ${phase.toLowerCase()} `)).toBe(color);
  });

  it('assigns custom names a stable color regardless of case or spacing', () => {
    const color = getPhaseColor('Flood response');
    expect(color).toMatch(/^bg-\S+ text-\S+$/);
    expect(getPhaseColor(' flood response ')).toBe(color);
    expect(getPhaseColor('FLOOD RESPONSE')).toBe(color);
  });

  it('uses a neutral style for missing names', () => {
    expect(getPhaseColor(undefined)).toBe('bg-gray-100 text-gray-700');
    expect(getPhaseColor('   ')).toBe('bg-gray-100 text-gray-700');
  });

  it('renders the same phase styling with different labels and preserves layout classes', () => {
    render(
      <>
        <PhaseBadge phase="Flood response">Flood response</PhaseBadge>
        <PhaseBadge phase="FLOOD RESPONSE" className="max-w-full">
          Translated label
        </PhaseBadge>
      </>,
    );
    const color = getPhaseColor('Flood response').split(' ');
    for (const label of ['Flood response', 'Translated label']) {
      const badge = screen.getByText(label);
      color.forEach((name) =>
        expect(badge.className.split(' ')).toContain(name),
      );
    }
    expect(screen.getByText('Translated label').className).toContain(
      'max-w-full',
    );
  });
});
