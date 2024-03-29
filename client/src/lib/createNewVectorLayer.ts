import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Circle, Fill, Stroke, Style } from 'ol/style';

// Function to create a new VectorLayer
export const createNewVectorLayer = ({ fillColor, strokeColor }: { fillColor: string, strokeColor: string }) => {
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