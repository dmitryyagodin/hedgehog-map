import { Position } from 'geojson';
import proj4 from 'proj4';

// Define the source and target projection systems
const sourceProjection = 'EPSG:3857'; // Assuming the given coordinates are in EPSG:3857
const targetProjection = 'EPSG:4326'; // Target projection for human-readable coordinates (WGS 84)

export function transformCoordinates(coordinates: Position) {
    // Transform the coordinates
    const transformedCoordinates = proj4(
        sourceProjection,
        targetProjection,
        [coordinates[0], coordinates[1]]
    );

    // Extract latitude and longitude from the transformed coordinates
    const [longitude, latitude] = transformedCoordinates;

    // Format longitude and latitude into degrees, minutes, seconds
    const formattedLongitude = formatCoordinate(longitude, 'longitude');
    const formattedLatitude = formatCoordinate(latitude, 'latitude');

    // Return the transformed coordinates with formatted values
    return { latitude: formattedLatitude, longitude: formattedLongitude };
}

// Helper function to format coordinate into degrees, minutes, seconds
function formatCoordinate(coordinate: number, type: 'latitude' | 'longitude') {
    const direction = coordinate >= 0 ? (type === 'latitude' ? 'N' : 'E') : (type === 'latitude' ? 'S' : 'W');
    coordinate = Math.abs(coordinate);

    const degrees = Math.floor(coordinate);
    const remainder = coordinate - degrees;
    const minutes = Math.floor(remainder * 60);
    const seconds = Math.round((remainder * 3600) % 60);

    return `${degrees}°${minutes}'${seconds}"${direction}`;
}
