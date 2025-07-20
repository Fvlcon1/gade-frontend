import * as L from 'leaflet'

declare module 'leaflet' {
  function heatLayer(
    latlngs: Array<[number, number, number?]>,
    options?: {
      minOpacity?: number
      maxZoom?: number
      radius?: number
      blur?: number
      gradient?: Record<number, string>
      max?: number
    }
  ): L.Layer
}
