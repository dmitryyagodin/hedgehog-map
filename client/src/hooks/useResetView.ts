import { useCallback, useContext } from "react";
import { DataContext } from '@client/context/dataContext';
import { Map as OlMap } from "ol";

export const useResetView = (olMap: OlMap, defaultCoordinates: number[]) => {
  const { setCoordinates, setSelectedHedgehog } = useContext(DataContext);

  const resetView = useCallback(() => {
    setCoordinates(defaultCoordinates);
    setSelectedHedgehog(null);
    olMap.getView().setCenter(defaultCoordinates);
    olMap.getView().setZoom(5)
  }, [olMap, setCoordinates, setSelectedHedgehog, defaultCoordinates]);

  return resetView;
};

export default useResetView;
