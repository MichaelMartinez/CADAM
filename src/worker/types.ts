import { Parameter } from '@shared/types';
import WorkspaceFile from '../lib/WorkspaceFile.ts';

// Credit
// https://github.com/seasick/openscad-web-gui/blob/main/src/worker/types.ts

export enum CompilationEventType {
  STARTED = 'compilation.started',
  PARSING = 'compilation.parsing',
  LIBRARY_LOADING = 'compilation.library_loading',
  LIBRARY_LOADED = 'compilation.library_loaded',
  STDOUT = 'compilation.stdout',
  STDERR = 'compilation.stderr',
  RENDERING = 'compilation.rendering',
  EXPORTING = 'compilation.exporting',
  COMPLETED = 'compilation.completed',
  ERROR = 'compilation.error',
}

export type CompilationEvent = {
  type: CompilationEventType;
  timestamp: number;
  data?: {
    message?: string;
    library?: string;
    progress?: number;
    line?: string;
    isError?: boolean;
  };
};

export const enum WorkerMessageType {
  PREVIEW = 'preview',
  EXPORT = 'export',
  FS_READ = 'fs.read',
  FS_WRITE = 'fs.write',
  FS_UNLINK = 'fs.unlink',
}

type WorkerMessageDataMap = {
  [WorkerMessageType.PREVIEW]: OpenSCADWorkerMessageData;
  [WorkerMessageType.EXPORT]: OpenSCADWorkerMessageData;
  [WorkerMessageType.FS_READ]: FileSystemWorkerMessageData;
  [WorkerMessageType.FS_WRITE]: FileSystemWorkerMessageData;
  [WorkerMessageType.FS_UNLINK]: FileSystemWorkerMessageData;
};

export type WorkerMessage = {
  id?: string | number;
  type: WorkerMessageType;
  data: WorkerMessageDataMap[WorkerMessage['type']];
};

export type WorkerResponseMessage = {
  id: string | number;
  type: WorkerMessageType | 'compilation.event';
  data:
    | OpenSCADWorkerResponseData
    | FileSystemWorkerMessageData
    | boolean
    | null;
  event?: CompilationEvent;
  err?: Error;
};

export type OpenSCADWorkerMessageData = {
  code: string;
  fileType: string;
  params: Parameter[];
};

export type OpenSCADWorkerResponseData = {
  log: {
    stdErr: string[];
    stdOut: string[];
  };
  fileType: string;
  output: Uint8Array;
  exitCode: number;
  duration: number;
};

export type FileSystemWorkerMessageData = {
  path: string;
  content?: WorkspaceFile | ArrayBuffer; // Content is only necessary when writing
  type?: string; // MIME type, needed if content is ArrayBuffer
};
