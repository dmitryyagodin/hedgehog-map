import { useDataContext } from "@client/context/useDataContext";
import { Map as OlMap } from "ol";
import { useCallback } from "react";

export const useResetView = (olMap: OlMap, defaultCoordinates: number[]) => {
  const { setCoordinates, setSelectedHedgehog } = useDataContext();

  const resetView = useCallback(() => {
    setCoordinates(defaultCoordinates);
    setSelectedHedgehog(null);
    olMap.getView().setCenter(defaultCoordinates);
    olMap.getView().setZoom(5);
  }, [olMap, setCoordinates, setSelectedHedgehog, defaultCoordinates]);

  return resetView;
};

export default useResetView;
