/**
 * Custom Logger
 *
 * Provides styled console logging that stands out from noisy third-party logs.
 * Uses console grouping and colored output for better visibility.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  minLevel: LogLevel;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Styles for different log levels and components
const STYLES = {
  // Base styles
  prefix: 'font-weight: bold; padding: 2px 6px; border-radius: 3px;',

  // Level-specific colors
  debug: 'background: #6b7280; color: white;',
  info: 'background: #3b82f6; color: white;',
  warn: 'background: #f59e0b; color: black;',
  error: 'background: #ef4444; color: white;',

  // Component colors (for easy identification)
  workflow: 'background: #8b5cf6; color: white;',
  screenshot: 'background: #10b981; color: white;',
  api: 'background: #ec4899; color: white;',
  auth: 'background: #f97316; color: white;',
  storage: 'background: #06b6d4; color: white;',

  // Content styles
  content: 'color: inherit;',
  muted: 'color: #6b7280;',
};

// Component name to style mapping
const COMPONENT_STYLES: Record<string, string> = {
  Workflow: STYLES.workflow,
  Screenshot: STYLES.screenshot,
  API: STYLES.api,
  Auth: STYLES.auth,
  Storage: STYLES.storage,
};

const config: LoggerConfig = {
  enabled: import.meta.env.DEV,
  minLevel: 'debug',
};

function shouldLog(level: LogLevel): boolean {
  if (!config.enabled) return false;
  return LOG_LEVELS[level] >= LOG_LEVELS[config.minLevel];
}

function getComponentStyle(component: string): string {
  return COMPONENT_STYLES[component] || STYLES.info;
}

function formatMessage(
  level: LogLevel,
  component: string,
  message: string,
  data?: unknown,
): void {
  if (!shouldLog(level)) return;

  const now = new Date();
  const timestamp =
    now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) +
    '.' +
    String(now.getMilliseconds()).padStart(3, '0');

  const levelStyle = `${STYLES.prefix} ${STYLES[level]}`;
  const componentStyle = `${STYLES.prefix} ${getComponentStyle(component)}`;
  const timeStyle = STYLES.muted;

  const logFn =
    level === 'error'
      ? console.error
      : level === 'warn'
        ? console.warn
        : console.log;

  if (data !== undefined) {
    logFn(
      `%c${level.toUpperCase()}%c %c${component}%c %c${timestamp}%c ${message}`,
      levelStyle,
      '',
      componentStyle,
      '',
      timeStyle,
      STYLES.content,
      data,
    );
  } else {
    logFn(
      `%c${level.toUpperCase()}%c %c${component}%c %c${timestamp}%c ${message}`,
      levelStyle,
      '',
      componentStyle,
      '',
      timeStyle,
      STYLES.content,
    );
  }
}

/**
 * Create a logger for a specific component
 */
export function createLogger(component: string) {
  return {
    debug: (message: string, data?: unknown) =>
      formatMessage('debug', component, message, data),
    info: (message: string, data?: unknown) =>
      formatMessage('info', component, message, data),
    warn: (message: string, data?: unknown) =>
      formatMessage('warn', component, message, data),
    error: (message: string, data?: unknown) =>
      formatMessage('error', component, message, data),

    // Group related logs together
    group: (label: string, fn: () => void) => {
      if (!config.enabled) {
        fn();
        return;
      }
      const componentStyle = `${STYLES.prefix} ${getComponentStyle(component)}`;
      console.group(`%c${component}%c ${label}`, componentStyle, '');
      fn();
      console.groupEnd();
    },

    // Collapsed group (less intrusive)
    groupCollapsed: (label: string, fn: () => void) => {
      if (!config.enabled) {
        fn();
        return;
      }
      const componentStyle = `${STYLES.prefix} ${getComponentStyle(component)}`;
      console.groupCollapsed(`%c${component}%c ${label}`, componentStyle, '');
      fn();
      console.groupEnd();
    },

    // Table for structured data
    table: (data: unknown[], columns?: string[]) => {
      if (!config.enabled) return;
      const componentStyle = `${STYLES.prefix} ${getComponentStyle(component)}`;
      console.log(`%c${component}%c Table:`, componentStyle, '');
      if (columns) {
        console.table(data, columns);
      } else {
        console.table(data);
      }
    },
  };
}

// Pre-configured loggers for common components
export const workflowLogger = createLogger('Workflow');
export const screenshotLogger = createLogger('Screenshot');
export const apiLogger = createLogger('API');
export const authLogger = createLogger('Auth');
export const storageLogger = createLogger('Storage');

// Configure logger at runtime
export function configureLogger(options: Partial<LoggerConfig>) {
  Object.assign(config, options);
}

// Export default logger for general use
export const logger = createLogger('App');
