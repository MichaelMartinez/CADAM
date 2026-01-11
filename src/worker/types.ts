import { CompilationEvent, Parameter } from '@shared/types';
import WorkspaceFile from '../lib/WorkspaceFile.ts';

// Credit
// https://github.com/seasick/openscad-web-gui/blob/main/src/worker/types.ts

export const enum WorkerMessageType {
  PREVIEW = 'preview',
  EXPORT = 'export',
  FS_READ = 'fs.read',
  FS_WRITE = 'fs.write',
  FS_UNLINK = 'fs.unlink',
  COMPILATION_EVENT = 'compilation.event',
}

export type WorkerCompilationEventMessage = {
  type: WorkerMessageType.COMPILATION_EVENT;
  event: CompilationEvent;
};

// Request message types (main thread -> worker)
type WorkerRequestMessageType = Exclude<
  WorkerMessageType,
  WorkerMessageType.COMPILATION_EVENT
>;

type WorkerMessageDataMap = {
  [WorkerMessageType.PREVIEW]: OpenSCADWorkerMessageData;
  [WorkerMessageType.EXPORT]: OpenSCADWorkerMessageData;
  [WorkerMessageType.FS_READ]: FileSystemWorkerMessageData;
  [WorkerMessageType.FS_WRITE]: FileSystemWorkerMessageData;
  [WorkerMessageType.FS_UNLINK]: FileSystemWorkerMessageData;
};

export type WorkerMessage = {
  id?: string | number;
  type: WorkerRequestMessageType;
  data: WorkerMessageDataMap[WorkerRequestMessageType];
};

export type WorkerResponseMessage = {
  id: string | number;
  type: WorkerMessageType;
  data:
    | OpenSCADWorkerResponseData
    | FileSystemWorkerMessageData
    | boolean
    | null;
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
