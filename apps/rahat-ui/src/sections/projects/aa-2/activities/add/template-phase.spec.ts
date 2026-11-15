import { getContextPhaseId, getTemplatePhaseId } from './template-phase';

const phases = [
  { uuid: 'readiness', name: 'Readiness' },
  { uuid: 'response', name: 'Response' },
];

describe('activity template phase', () => {
  it('does not replace the phase supplied by the navigation context', () => {
    expect(getTemplatePhaseId('readiness', 'Response', phases)).toBeUndefined();
  });

  it('selects a matching template phase when there is no phase context', () => {
    expect(getTemplatePhaseId(null, 'rEsPoNsE', phases)).toBe('response');
  });

  it('does not change phase for missing or unknown template phases', () => {
    expect(getTemplatePhaseId(null, undefined, phases)).toBeUndefined();
    expect(getTemplatePhaseId(null, 'unknown', phases)).toBeUndefined();
  });

  it('retains a valid context when clearing the form', () => {
    expect(getContextPhaseId('readiness', phases)).toBe('readiness');
    expect(getContextPhaseId(null, phases)).toBe('');
    expect(getContextPhaseId('unknown', phases)).toBe('');
  });
});
