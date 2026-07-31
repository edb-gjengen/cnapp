/**
 * A non-ok API response, carrying the DRF error body for FormErrors to render.
 * Network/timeout failures stay raw Errors and render as a generic message.
 */
export class ApiError extends Error {
  fields: Record<string, unknown>;
  status: number;

  constructor(fields: Record<string, unknown>, status: number) {
    super(`API request failed with status ${status}`);
    this.name = 'ApiError';
    this.fields = fields;
    this.status = status;
  }
}
