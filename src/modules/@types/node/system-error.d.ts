interface SystemError extends Error {
  address: string;
  code: string;
  dest: string;
  errno: number;
  info: Obj;
  message: string;
  path: string;
  port: number;
  syscall: string;
}
