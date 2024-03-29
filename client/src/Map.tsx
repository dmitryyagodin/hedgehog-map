import { useState, useEffect, useRef, useContext } from "react";
import { Map as OlMap, MapBrowserEvent, Feature } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM.js";
import { DataContext } from "./context/dataContext";
import { GlobalStyles } from "@mui/material";
import { ReactNode } from "react";
import { useSetCenter } from './hooks/useSetCenter';
import { useSetFeatures } from './hooks/useSetFeatures';
import ZoomControls from './ZoomControls';
import useResetView from './hooks/useResetView';
import Point from 'ol/geom/Point';
import { createNewVectorLayer } from './lib/createNewVectorLayer';
import { Geometry } from 'geojson';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

interface Props {
  children?: ReactNode;
}

const defaultCoordinates = [2659167.020281517, 9632038.56757201];

export function Map({ children }: Props) {
  const { setCoordinates, selectedHedgehog, hedgehogs } = useContext(DataContext);
  const mapRef = useRef<HTMLDivElement>(null);
  const currentHedgehog = hedgehogs?.find(h => h.id === selectedHedgehog) || null;

  const setCenter = useSetCenter(currentHedgehog, defaultCoordinates);

  const [olMap] = useState(() => {
    return new OlMap({
      target: "",
      controls: [],
      view: setCenter,
      keyboardEventTarget: document,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        createNewVectorLayer({ fillColor: "#00B2A0", strokeColor: "darkblue" }),
      ],
    });
  });

  useSetFeatures(olMap, hedgehogs);
  const resetView = useResetView(olMap, defaultCoordinates);

  useEffect(() => {
    olMap.setTarget(mapRef.current as HTMLElement);

    let singleClickFlag = false;

    // Create a new VectorLayer
    let newVectorLayer: VectorLayer<VectorSource>;

    const handleSingleClick = (event: MapBrowserEvent<UIEvent>) => {
      setCoordinates(event.coordinate);

      if (newVectorLayer) {
        olMap.removeLayer(newVectorLayer)
      }

      newVectorLayer = createNewVectorLayer({ fillColor: "lime", strokeColor: "red" })


      // Add the newVectorLayer to the map
      olMap.addLayer(newVectorLayer);


      // Create a new feature
      const newFeature = new Feature({
        geometry: new Point(event.coordinate),
      });

      // Add the newFeature to the newVectorLayer's source
      newVectorLayer.getSource()?.addFeature(newFeature);

      singleClickFlag = true;
      // Remove pointermove listener when double click occurs
      olMap.un('pointermove', handlePointerMove);
    };

    const handlePointerMove = (event: MapBrowserEvent<UIEvent>) => {
      // Only update coordinates if not triggered by double click
      if (!singleClickFlag) {
        setCoordinates(event.coordinate);
      }
    };

    olMap.on("singleclick", handleSingleClick);
    olMap.on('pointermove', handlePointerMove);

    // Cleanup function to remove event listeners
    return () => {
      olMap.un("singleclick", handleSingleClick);
      olMap.un('pointermove', handlePointerMove);
    };
  }, [olMap]);



  return (
    <div style={{ width: "100%", height: "100%" }}>
      <GlobalStyles styles={{ ".ol-viewport": { cursor: "pointer" } }} />
      <div style={{ width: "100%", height: "100%", position: "relative" }} ref={mapRef}>
        <ZoomControls
          onZoomIn={() => olMap?.getView().setZoom((olMap?.getView().getZoom() ?? 0) + 1)}
          onZoomOut={() => olMap?.getView().setZoom((olMap?.getView().getZoom() ?? 0) - 1)}
          onResetView={() => resetView()}
        />
        {children}
      </div>
    </div>
  );
}
