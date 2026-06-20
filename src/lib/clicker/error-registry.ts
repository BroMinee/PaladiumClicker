const _errors: string[] = [];

export const errorRegistry = {
  push(message: string): void {
    _errors.push(message);
  },
  flush(): string[] {
    return _errors.splice(0);
  },
};
