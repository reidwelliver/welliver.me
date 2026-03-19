// Messages from main thread → worker
export type WorkerRequest =
  | { type: 'init'; magnetsJson: string; brokerUrl: string; gridCols: number; gridRows: number; wasmUrl: string }
  | { type: 'dragStart'; uuid: string }
  | { type: 'positionUpdate'; uuid: string; x: number; y: number; width: number; height: number }
  | { type: 'dragEnd'; uuid: string; x: number; y: number; width: number; height: number };

// Messages from worker → main thread
export type WorkerResponse =
  | { type: 'ready'; ready: boolean; clientId: string }
  | { type: 'position'; uuid: string; x: number; y: number }
  | { type: 'owner'; uuid: string; owner: string | null }
  | { type: 'dragResult'; uuid: string; x: number; y: number };
