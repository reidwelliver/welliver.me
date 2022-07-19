import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import getBaseUrl from "@welliver.me/frontend/api/getBaseURL";
import { FrontendTile, TileDataGridProps } from "@welliver.me/tile";
import useWebsocketConnection from "./useWebsocketConnection";

interface TileProviderData {
  fetchingTiles: boolean;
  tiles: FrontendTile[];
  updateTile: (tile: TileDataGridProps) => void;
}

const defaultState = {
  fetchingTiles: false,
  tiles: [],
  updateTile: () => {},
} as TileProviderData;

const TileContext = createContext<TileProviderData>(defaultState);

export default function useTiles() {
  return useContext(TileContext);
}

type TileProviderProps = PropsWithChildren<{}>;

export function TileProvider(props: TileProviderProps) {
  const { children } = props;

  const connection = useWebsocketConnection();

  const [fetchingTiles, setFetchingTiles] = useState(false);
  const [tiles, setTiles] = useState<FrontendTile[]>([]);

  const updateTile = useCallback((tile: TileDataGridProps) => {
    fetch(`${getBaseUrl()}/update`, {
      method: "POST",
      body: JSON.stringify({
        x: tile.x,
        y: tile.y,
        id: tile.i,
      }),
    });
  }, []);

  const fetchTiles = useCallback(
    async (force = false) => {
      if (force || (!fetchingTiles && !tiles.length)) {
        setFetchingTiles(true);

        const tileResponse = await fetch(`${getBaseUrl()}/fetch`);
        const tiles = await tileResponse.json();

        setTiles(tiles);
        setFetchingTiles(false);
      }
    },
    [tiles, fetchingTiles]
  );

  // fetch tiles on first load
  useEffect(() => {
    fetchTiles();
  }, []);

  // subscribe to tile updates on first load
  useEffect(() => {
    if (connection) {
      connection.handleMessage("tileUpdate", (message) => {
        const newTile = JSON.parse(message);
        setTiles((tiles) =>
          tiles.map((t) =>
            t.id === newTile.id ? { ...t, x: newTile.x, y: newTile.y } : t
          )
        );
      });
    }
  }, [connection]);

  const value = useMemo(
    () => ({
      fetchingTiles,
      tiles,
      updateTile,
    }),
    [fetchingTiles, tiles, updateTile]
  );

  return <TileContext.Provider value={value}>{children}</TileContext.Provider>;
}
