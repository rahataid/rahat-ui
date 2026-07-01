// utils/logger.ts
const DEBUG = process.env.NODE_ENV === 'development';

export const logger = {
  debug: (...args: any[]) => {
    if (DEBUG) {
      console.log('[AbilityContext]', ...args);
    }
  },
  info: (...args: any[]) => {
    console.info('[AbilityContext]', ...args);
  },
  warn: (...args: any[]) => {
    console.warn('[AbilityContext]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[AbilityContext]', ...args);
  },
};
