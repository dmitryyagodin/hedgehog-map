import { useEffect, useRef } from "react";
import { Map as OlMap, MapBrowserEvent, Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import Point from 'ol/geom/Point';
import { Vector as VectorSource } from 'ol/source';
import { Circle, Fill, Stroke, Style } from "ol/style";
import { Position } from 'geojson';

interface AddFeatureOnClickProps {
  olMap: OlMap;
  setCoordinates: (coordinates: Position | null) => void;
}

const createNewVectorLayer = ({ fillColor, strokeColor }: { fillColor: string, strokeColor: string }) => {
  return new VectorLayer({
    source: new VectorSource(),
    style: new Style({
      image: new Circle({
        radius: 7,
        fill: new Fill({ color: fillColor }),
        stroke: new Stroke({ color: strokeColor, width: 3 }),
      }),
    }),
  });
};

const useAddFeatureOnClick = ({ olMap, setCoordinates }: AddFeatureOnClickProps) => {
  const singleClickFlagRef = useRef(false);
  const previousFeatureRef = useRef<Feature | null>(null);

  useEffect(() => {
    const handleSingleClick = (event: MapBrowserEvent<UIEvent>) => {
      setCoordinates(event.coordinate);

      const newVectorLayer = createNewVectorLayer({ fillColor: "lime", strokeColor: "#000" });
      olMap.addLayer(newVectorLayer);

      const newFeature = new Feature({
        geometry: new Point(event.coordinate),
      });

      if (previousFeatureRef.current) {
        const previousVectorLayer = olMap.getLayers().getArray().find(layer => {
          return layer instanceof VectorLayer && layer.getSource().getFeatures().includes(previousFeatureRef.current);
        }) as VectorLayer<VectorSource> | undefined;

        if (previousVectorLayer) {
          previousVectorLayer.getSource()?.removeFeature(previousFeatureRef.current);
        }
      }

      newVectorLayer.getSource()?.addFeature(newFeature);

      previousFeatureRef.current = newFeature;
      singleClickFlagRef.current = true;
      olMap.un('pointermove', handlePointerMove);
    };

    const handlePointerMove = (event: MapBrowserEvent<UIEvent>) => {
      if (!singleClickFlagRef.current) {
        setCoordinates(event.coordinate);
      }
    };

    olMap.on("singleclick", handleSingleClick);
    olMap.on('pointermove', handlePointerMove);

    return () => {
      olMap.un("singleclick", handleSingleClick);
      olMap.un('pointermove', handlePointerMove);
    };
  }, [olMap, setCoordinates]);
};

export default useAddFeatureOnClick;
