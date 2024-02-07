import { render } from '@testing-library/react';

import Shadecn from './shadecn';

describe('Shadecn', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Shadecn />);
    expect(baseElement).toBeTruthy();
  });
});
