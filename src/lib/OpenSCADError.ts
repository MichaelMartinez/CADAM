type ParsedError = {
  type: 'error' | 'warning';
  message: string;
  line?: number;
  rawLine: string;
};

class OpenSCADError extends Error {
  code: string;
  stdErr: string[];
  stdOut: string[];
  parsedErrors: ParsedError[];

  constructor(
    message: string,
    code: string,
    stdErr: string[],
    stdOut: string[] = [],
  ) {
    super(message);
    this.name = 'OpenSCADError';
    this.code = code;
    this.stdErr = stdErr;
    this.stdOut = stdOut;
    this.parsedErrors = this.parseErrors();
  }

  private parseErrors(): ParsedError[] {
    // Parse stderr for structured error information
    // Example: "ERROR: Parser error in line 10: syntax error"
    const errors: ParsedError[] = [];

    const errorRegex = /ERROR:\s+(.+?)(?:in line (\d+))?(?:: (.+))?/gi;
    const warningRegex = /WARNING:\s+(.+?)(?:in line (\d+))?(?:: (.+))?/gi;

    this.stdErr.forEach((line) => {
      // Reset regex indices
      errorRegex.lastIndex = 0;
      warningRegex.lastIndex = 0;

      let match;
      if ((match = errorRegex.exec(line))) {
        errors.push({
          type: 'error',
          message: match[3] || match[1],
          line: match[2] ? parseInt(match[2]) : undefined,
          rawLine: line,
        });
      } else if ((match = warningRegex.exec(line))) {
        errors.push({
          type: 'warning',
          message: match[3] || match[1],
          line: match[2] ? parseInt(match[2]) : undefined,
          rawLine: line,
        });
      }
    });

    return errors;
  }

  toFormattedString(): string {
    // Format for easy copy-paste
    return [
      '=== OpenSCAD Compilation Error ===',
      '',
      ...this.parsedErrors.map(
        (err) =>
          `${err.type.toUpperCase()}: ${err.message}${err.line ? ` (line ${err.line})` : ''}`,
      ),
      '',
      '=== Full Output ===',
      ...this.stdErr,
      '',
      '=== Stdout ===',
      ...this.stdOut,
    ].join('\n');
  }
}

export default OpenSCADError;
