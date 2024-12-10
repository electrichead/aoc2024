export function trampoline<T>(exec: T | (() => T)): T {
  let res = exec;

  while (res instanceof Function) {
    res = res();
  }

  return res;
}
