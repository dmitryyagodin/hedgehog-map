import { useState, useEffect } from "react";
import { Feature } from "ol";
import { Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Circle, Stroke, Fill, Style} from "ol/style";
import { Map as OlMap } from "ol";
import { Hedgehog } from '@ubigu/shared/src/hedgehog';

export const useSetFeatures = (olMap: OlMap, hedgehogs: Hedgehog[] | null) => {
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    if (hedgehogs && hedgehogs.length > 0) {
      const newFeatures = hedgehogs.map((hedgehog) => {
        // Create an OpenLayers Point geometry
        const geometry = new Point(hedgehog.coordinates);

        // Create properties object for the feature
        const properties = {
          name: hedgehog.name,
          age: hedgehog.age,
          gender: hedgehog.gender,
        };

        // Create an OpenLayers Feature with the geometry and properties
        return new Feature({
          geometry,
          properties,
        });
      });
      setFeatures(newFeatures);
    }
  }, [hedgehogs]);

  useEffect(() => {
    // Add features to the VectorLayer
    const vectorSource = new VectorSource({ features });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: "#00B2A0" }),
          stroke: new Stroke({ color: "darkblue", width: 3 }),
        }),
      }),
    });

    // Add the VectorLayer to the map
    olMap.addLayer(vectorLayer);

    // Cleanup function
    return () => {
      olMap.removeLayer(vectorLayer);
    };
  }, [features, olMap]);

  return olMap;
};
