'use client';
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoLayersOutline, IoMapOutline } from 'react-icons/io5';
import Text from '@styles/components/text';

// Basemap definitions
const basemaps = [
  { id: 'osm', label: 'OpenStreetMap', checked: true },
  { id: 'satellite', label: 'Google Satellite', checked: false },
  { id: 'planet', label: 'Planet', checked: false },
];

// Feature layer definitions
export const initialLayers = [
  // { id: 'mining', label: 'Mining concessions', checked: true }, // Commented out concessions
  { id: 'mining_sites', label: 'Detected mining activity', checked: true },
  { id: 'forest', label: 'Forest reserves', checked: true },
  { id: 'admin', label: 'Admin districts', checked: true },
  { id: 'rivers', label: 'Rivers', checked: true },
  { id: 'reports', label: 'Reports', checked: true },
];

interface Layer {
  id: string;
  label: string;
  checked: boolean;
}

interface LayersControlProps {
  isOpen: boolean;
  onClose: () => void;
  sidebarExpanded?: boolean;
  onBasemapChange?: (id: string) => void;
  onLayerChange?: (layers: Layer[]) => void;
}

const LayersControl: React.FC<LayersControlProps> = ({ 
  isOpen, 
  onClose, 
  sidebarExpanded = false, 
  onBasemapChange = () => {}, 
  onLayerChange = () => {} 
}) => {
  const [basemapLayers, setBasemapLayers] = useState(basemaps);
  const [featureLayers, setFeatureLayers] = useState(initialLayers);
  
  const toggleBasemap = useCallback((id: string) => {
    setBasemapLayers(prev => {
      const newLayers = prev.map(layer => ({
        ...layer,
        checked: layer.id === id
      }));
      // Call onBasemapChange after state update
      setTimeout(() => onBasemapChange(id), 0);
      return newLayers;
    });
  }, [onBasemapChange]);
  
  const toggleFeatureLayer = useCallback((id: string) => {
    setFeatureLayers(prev => {
      const newLayers = prev.map(layer =>
        layer.id === id ? { ...layer, checked: !layer.checked } : layer
      );
      // Call onLayerChange after state update
      setTimeout(() => onLayerChange(newLayers), 0);
      return newLayers;
    });
  }, [onLayerChange]);
  
  const selectAllFeatures = useCallback(() => {
    setFeatureLayers(prev => {
      const newLayers = prev.map(layer => ({ ...layer, checked: true }));
      // Call onLayerChange after state update
      setTimeout(() => onLayerChange(newLayers), 0);
      return newLayers;
    });
  }, [onLayerChange]);
  
  const selectedFeatureCount = featureLayers.filter(l => l.checked).length;
  const leftPosition = sidebarExpanded ? '295px' : '135px';
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute top-[10px] w-[240px] rounded-xl bg-white/90 backdrop-blur-xs shadow-md px-4 py-3 z-[1002] border border-gray-200"
          initial={{ opacity: 0, y: -10, left: leftPosition }}
          animate={{ opacity: 1, y: 0, left: leftPosition }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between text-sm font-bold text-gray-700 mb-2">
            <Text>Map Layers</Text>
            <div className="flex items-center gap-2 text-xs font-normal text-gray-500">
              {selectedFeatureCount} Selected
              <IoClose className="cursor-pointer hover:text-gray-700" onClick={onClose} />
            </div>
          </div>

          {/* Content Container */}
          <div className="space-y-4">
            {/* Basemaps Section */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-2">
                <IoMapOutline size={14} />
                <span>Basemaps</span>
              </div>
              <div className="flex flex-col gap-1">
                {basemapLayers.map((layer) => (
                  <div key={layer.id}>
                    <label className="flex items-center gap-3 py-[6px] cursor-pointer">
                      <input
                        type="radio"
                        name="basemap"
                        checked={layer.checked}
                        onChange={() => toggleBasemap(layer.id)}
                        className="w-4 h-4 accent-[#4F46E5]"
                      />
                      <span
                        className={`text-left text-sm font-medium ${
                          layer.checked ? 'text-[#4F46E5]' : 'text-gray-500'
                        }`}
                      >
                        {layer.label}
                      </span>
                    </label>
                    <div className="h-px bg-gray-200 w-[calc(100%+1rem)] -mr-4" />
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Layers Section */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-2">
                <IoLayersOutline size={14} />
                <span>Layers</span>
              </div>
              <div className="flex flex-col gap-1">
                {featureLayers.map((layer) => (
                  <div key={layer.id}>
                    <div className="flex items-center gap-3 py-[6px] cursor-pointer" onClick={() => toggleFeatureLayer(layer.id)}>
                      <ToggleSwitch 
                        checked={layer.checked} 
                        onChange={() => {}}
                      />
                      <span
                        className={`text-left text-sm font-medium ${
                          layer.checked ? 'text-[#4F46E5]' : 'text-gray-500'
                        }`}
                      >
                        {layer.label}
                      </span>
                    </div>
                    <div className="h-px bg-gray-200 w-[calc(100%+1rem)] -mr-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
            <button
              onClick={selectAllFeatures}
              className="bg-[#4F46E5] text-white text-xs font-semibold px-3 py-[3px] rounded-md shadow hover:bg-[#4338CA] cursor-pointer"
            >
              Select all layers
            </button>
            <button className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center text-sm text-gray-600 hover:bg-gray-100 cursor-pointer">
              ⟳
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <div
    className={`w-[28px] h-[16px] flex items-center rounded-full p-[2px] transition duration-300 ${
      checked ? 'bg-[#4F46E5]' : 'bg-gray-300'
    }`}
    onClick={onChange}
  >
    <div
      className={`bg-white w-[12px] h-[12px] rounded-full shadow-md transform transition duration-300 ${
        checked ? 'translate-x-[12px]' : ''
      }`}
    />
  </div>
);

export default LayersControl;