import { WorkerManager } from "@welliver-me/ui/workers/WorkerManager";
import { useMagnetDataStore as MagnetDataStore } from "@welliver-me/ui/stores/magnetDataStore";
import { useMagnetPositionStore as MagnetPositionStore } from "@welliver-me/ui/stores/magnetPositionStore";
import { GRID_COLS, GRID_ROWS } from "@welliver-me/ui/config/grid";
import type { WorkerRequest, WorkerResponse } from "./messages";
import type { MessageOfType } from "../WorkerManager/types";
import { createDeferrable } from "@welliver-me/ui/utils/deferrable";
import workerUrl from "./worker.ts?worker&url";

export const CLIENT_ID = `magnet-${Math.random().toString(16).slice(2)}`;

const TAIL_BROKER_URL = "wss://reid-desk.tail96ee50.ts.net";
const BROKER_URL =
  window.location.hostname === "localhost"
    ? "ws://localhost:9001/mqtt"
    : TAIL_BROKER_URL;

// vite returns a URL but it's typed as a string
const WORKER_URL = workerUrl as unknown as URL;

export class MagnetManager {
  private worker: WorkerManager<WorkerRequest, WorkerResponse>;
  public readonly ready = createDeferrable<boolean>();
  private initSent = false;
  private ownedTileUUIDs: Set<string> = new Set();

  constructor() {
    this.worker = new WorkerManager(WORKER_URL);
    this.subscribe();
  }

  public init() {
    if (this.initSent) {
      console.warn("Magnet Worker Init sent multiple times, ignoring");
      return;
    }

    this.initSent = true;
    const magnets = MagnetDataStore.getState().magnets;

    const initMsg: WorkerRequest = {
      type: "init",
      magnetsJson: JSON.stringify(magnets),
      brokerUrl: BROKER_URL,
      gridCols: GRID_COLS,
      gridRows: GRID_ROWS,
      clientId: CLIENT_ID,
    };

    this.worker.sendRequest(initMsg);
  }

  private subscribe() {
    this.worker.subscribe("position", (msg) => this.handlePositionUpdate(msg));
    this.worker.subscribe("owner", (msg) => this.handleOwnerUpdate(msg));
    this.worker.subscribe("ready", (msg) => this.handleReady(msg));
    this.worker.subscribe("dragResult", (msg) => this.handleDragResult(msg));
  }

  public sendDragStart(uuid: string) {
    this.ownedTileUUIDs.add(uuid);
    const msg: WorkerRequest = { type: "dragStart", uuid };
    this.worker.sendRequest(msg);
  }

  public sendPositionUpdate(
    uuid: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    const msg: WorkerRequest = {
      type: "positionUpdate",
      uuid,
      x,
      y,
      width,
      height,
    };
    this.worker.sendRequest(msg);
  }

  public sendDragEnd(
    uuid: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    MagnetPositionStore.getState().setPosition(uuid, {
      x,
      y,
    });
    this.ownedTileUUIDs.delete(uuid);

    const msg: WorkerRequest = {
      type: "dragEnd",
      uuid,
      x,
      y,
      width,
      height,
    };
    this.worker.sendRequest(msg);
  }

  private handlePositionUpdate(msg: MessageOfType<WorkerResponse, "position">) {
    if (this.ownedTileUUIDs.has(msg.uuid)) {
      return;
    }

    MagnetPositionStore.getState().setPosition(msg.uuid, {
      x: msg.x,
      y: msg.y,
    });
  }

  private handleOwnerUpdate(msg: MessageOfType<WorkerResponse, "owner">) {
    MagnetPositionStore.getState().setOwner(msg.uuid, msg.owner);
  }

  private handleReady(msg: MessageOfType<WorkerResponse, "ready">) {
    this.ready.resolve(msg.ready);
  }

  private handleDragResult(msg: MessageOfType<WorkerResponse, "dragResult">) {
    if (this.ownedTileUUIDs.has(msg.uuid)) {
      return;
    }

    MagnetPositionStore.getState().setPosition(msg.uuid, {
      x: msg.x,
      y: msg.y,
    });
  }
}
