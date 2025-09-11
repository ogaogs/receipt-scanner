export const PYTHON_API_ERROR_CODES = {
  SIZE_ERROR: "SIZE_ERROR",
  INVALID_TYPE: "INVALID_TYPE",
  CLIENT_ERROR: "CLIENT_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
} as const;

export type PythonAPIErrorCode =
  (typeof PYTHON_API_ERROR_CODES)[keyof typeof PYTHON_API_ERROR_CODES];

export class ReceiptAnalysisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReceiptAnalysisError";
  }
}
