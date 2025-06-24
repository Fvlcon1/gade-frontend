import { featureCollection, distance, centroid } from '@turf/turf';
/**
 * Filters features in collectionB that are within a given distance (in meters)
 * from any feature in collectionA
 */
export function filterByDistance(collectionA, collectionB, maxDistanceMeters, minDistanceMeters) {
    const results = [];
    const maxDistanceKm = maxDistanceMeters / 1000;
    const minDistanceKm = minDistanceMeters ? minDistanceMeters / 1000 : 0;
    collectionB.features.forEach((featureB) => {
        const centroidB = centroid(featureB);
        const isClose = collectionA.features.some((featureA) => {
            const centroidA = centroid(featureA);
            const dist = distance(centroidA, centroidB, { units: 'kilometers' });
            return dist <= maxDistanceKm && dist >= minDistanceKm;
        });
        if (isClose) {
            results.push(featureB);
        }
    });
    return featureCollection(results);
}
