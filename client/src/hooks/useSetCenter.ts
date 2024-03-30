import { Hedgehog } from "@ubigu/shared/src/hedgehog";
import { View } from "ol";
import { useEffect, useState } from "react";

export const useSetCenter = (
  selectedHedgehog: Hedgehog | null,
  coordinates: number[]
): View => {
  const [olView] = useState(() => {
    const initialCenter = selectedHedgehog
      ? selectedHedgehog.coordinates
      : coordinates;
    const initialZoom = selectedHedgehog ? 10 : 5;
    return new View({
      center: initialCenter,
      zoom: initialZoom,
      multiWorld: false,
      enableRotation: false,
    });
  });

  useEffect(() => {
    if (selectedHedgehog) {
      olView.animate({
        center: selectedHedgehog.coordinates,
        zoom: 12,
        duration: 2000,
      });
    } else {
      olView.animate({ center: coordinates, zoom: 5, duration: 2000 });
    }
  }, [selectedHedgehog, coordinates, olView]);

  return olView;
};
