declare module 'vfile-reporter' {
  import { VFile } from 'vfile';

  // type VFileReporter<T = vfile.Settings> = (files: VFile[], options: T) => string
  const vFileReporter: (
    file: VFile | Error,
    options?: { [key: string]: string }
  ) => string;

  export default vFileReporter;
}
