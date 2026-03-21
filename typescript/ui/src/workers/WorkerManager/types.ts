export type MessageWithType = { type: string };
export type MessageType<M extends MessageWithType> = M["type"];

type MessageByType<M extends MessageWithType> = {
  [K in M["type"]]: Extract<M, { type: K }>;
};

export type EventListenerMap<M extends MessageWithType> = {
  [K in keyof MessageByType<M>]?: EventCallback<M, K>[];
};

export type MessageOfType<
  M extends MessageWithType,
  T extends MessageType<M>,
> = MessageByType<M>[T];

export type EventCallback<
  M extends MessageWithType,
  T extends MessageType<M>,
> = (msg: MessageOfType<M, T>) => void;
