export function isValidPaginationRequest(
  page: number,
  elements: number,
): boolean {
  return page >= 1 && elements >= 0;
}
