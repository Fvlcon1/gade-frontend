import { FeatureCollection, Geometry } from 'geojson';
import { featureCollection, distance, centroid } from '@turf/turf';

/**
 * Filters features in collectionB that are within a given distance (in meters)
 * from any feature in collectionA
 */
export function filterByDistance(
  collectionA: FeatureCollection<Geometry>,
  collectionB: FeatureCollection<Geometry>,
  maxDistanceMeters: number
): FeatureCollection<Geometry> {
  const results = [];

  const maxDistanceKm = maxDistanceMeters / 1000;

  collectionB.features.forEach((featureB) => {
    const centroidB = centroid(featureB);

    const isClose = collectionA.features.some((featureA) => {
      const centroidA = centroid(featureA);
      const dist = distance(centroidA, centroidB, { units: 'kilometers' });
      return dist <= maxDistanceKm;
    });

    if (isClose) {
      results.push(featureB);
    }
  });

  return featureCollection(results);
}
