export interface Error {
  code: string;
  expected: string;
  message: string;
  path: [string];
  recevied: string;
}