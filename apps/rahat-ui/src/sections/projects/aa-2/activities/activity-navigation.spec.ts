import {
  findActivityPhase,
  getActivitiesListPath,
} from './activity-navigation';

describe('activity phase navigation', () => {
  const phases = [
    { uuid: 'phase-1', name: 'Early Warning & Response' },
    { uuid: 'phase-2', name: 'Readiness' },
  ];

  it('resolves phase names without depending on their capitalization', () => {
    expect(findActivityPhase(phases, 'early warning & response')).toEqual(
      phases[0],
    );
    expect(findActivityPhase(phases, 'READINESS')).toEqual(phases[1]);
  });

  it('does not resolve a missing or still-loading phase', () => {
    expect(findActivityPhase([], 'readiness')).toBeUndefined();
    expect(findActivityPhase(phases, 'undefined')).toBeUndefined();
  });

  it('preserves and encodes the originating phase in the return path', () => {
    expect(getActivitiesListPath('project-1', phases[0].name)).toBe(
      '/projects/aa/project-1/activities/list/early%20warning%20%26%20response',
    );
  });

  it('returns to the overview when no phase is available', () => {
    expect(getActivitiesListPath('project-1')).toBe(
      '/projects/aa/project-1/activities',
    );
  });
});
