export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  waitFor: number
): (...args: Args) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}