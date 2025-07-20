import proj4 from 'proj4';

// Initialize proj4 with UTM zone 59S (for New Zealand)
proj4.defs('EPSG:2193', '+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');

export const utmToLatLng = (easting, northing) => {
  return proj4('EPSG:2193', 'EPSG:4326', [easting, northing]);
};
