export const debounce = (fn: any, time: number) => {
  let timeout: any = null;
  return (...args: any) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(...args);
    }, time);
  };
};
