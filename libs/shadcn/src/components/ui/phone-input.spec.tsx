/** @jest-environment jsdom */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { PhoneInput } from './phone-input';

jest.mock('react-phone-number-input', () => ({
  __esModule: true,
  default: ({ onChange }: { onChange: (value?: string) => void }) => (
    <button onClick={() => onChange()}>Clear phone</button>
  ),
}));
jest.mock('react-phone-number-input/flags', () => ({}));
jest.mock('./command', () => ({}));
jest.mock('./popover', () => ({}));
jest.mock('./input', () => ({ Input: () => null }));
jest.mock('./button', () => ({ Button: () => null }));

it('propagates a cleared phone value as an empty string', () => {
  const onChange = jest.fn();
  render(<PhoneInput value="+9779841234567" onChange={onChange} />);
  fireEvent.click(screen.getByRole('button', { name: 'Clear phone' }));
  expect(onChange).toHaveBeenCalledWith('');
});
