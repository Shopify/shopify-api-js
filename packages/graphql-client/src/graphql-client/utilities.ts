export function getErrorMessage(error: any) {
  return error instanceof Error ? error.message : JSON.stringify(error);
}
