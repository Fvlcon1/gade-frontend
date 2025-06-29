'use client';
import React, { useState, useCallback, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoLayersOutline, IoMapOutline } from 'react-icons/io5';
import Text from '@styles/components/text';
import theme from '@styles/theme';
import ClickableTab from '@components/ui/clickable/clickabletab';
import BlurContainer from '@components/ui/blur-container';
import OutlineButton from '@components/ui/button/outlineButton';
import Button from '@components/ui/button/button';

// Basemap definitions
const basemaps = [
  { id: 'cartocdnLight', label: 'Light Basemap', checked: true },
  { id: 'osm', label: 'Open Street Map', checked: false },
  { id: 'cartocdnDark', label: 'Dark Basemap', checked: false },
  { id: 'satellite', label: 'Google Satellite', checked: false },
  { id: 'planet', label: 'Planet', checked: false },
];

// Feature layer definitions with colors matching LAYER_STYLES
export const initialLayers = [
  // { id: 'mining', label: 'Mining concessions', checked: true }, // Commented out concessions
  { id: 'reports', label: 'Reports', checked: true, color: '#8F3C19' },
  { id: 'rivers', label: 'Rivers', checked: true, color: '#03A9F4' },
  { id: 'mining_sites', label: 'Detected mining activity', checked: true, color: '#FF4B4B' }, // Matches mining_sites color
  { id: 'forest', label: 'Forest reserves', checked: true, color: '#4CAF50' }, // Matches forest color
  { id: 'admin', label: 'Admin districts', checked: true, color: '#D2B48C' }, // Matches admin color
];

interface Layer {
  id: string;
  label: string;
  checked: boolean;
  color: string;
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
  onBasemapChange = () => { },
  onLayerChange = () => { }
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

  const deselectAllFeatures = useCallback(() => {
    setFeatureLayers(prev => {
      const newLayers = prev.map(layer => ({ ...layer, checked: false }));
      // Call onLayerChange after state update
      setTimeout(() => onLayerChange(newLayers), 0);
      return newLayers;
    });
  }, [onLayerChange]);

  const selectedFeatureCount = featureLayers.filter(l => l.checked).length;
  const leftPosition = sidebarExpanded ? '295px' : '135px';

  const Divider = ({ className }: { className?: string }) => {
    return (
      <div className={`w-full pl-8 ${className}`}>
        <div className="w-full h-0.25 bg-border-primary/80" />
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ left: leftPosition }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute top-[10px] z-[1001] w-[240px] gap-2 flex flex-col"
        >
          {/* Header */}
          <div className="w-full h-[33px] bg-white/80 backdrop-blur-sm shadow-xl px-3 pr-1 flex items-center justify-between rounded-[10px]">
            <Text bold={theme.text.bold.md}>
              Map Layers
            </Text>
            <ClickableTab onClick={onClose}>
              <IoClose
                size={17}
                color={theme.colors.text.secondary}
              />
            </ClickableTab>
          </div>

          {/* Content Container */}
          <div className="space-y-2">
            {/* Basemaps Section */}
            <BlurContainer>
              <div className="py-3 gap-1 flex flex-col">
                <Text
                  bold={theme.text.bold.md}
                  className="pl-4"
                >
                  Basemaps
                </Text>
                <div className="flex flex-col gap-1">
                  {basemapLayers.map((layer, index) => (
                    <Fragment key={layer.id}>
                      <label className="flex items-center gap-2 px-4 py-1 cursor-pointer">
                        <input
                          type="radio"
                          name="basemap"
                          checked={layer.checked}
                          onChange={() => toggleBasemap(layer.id)}
                          className="w-3 h-3 accent-[#4F46E5]"
                        />
                        <Text
                          textColor={layer.checked ? theme.colors.main.primary : theme.colors.text.secondary}
                          bold={layer.checked ? theme.text.bold.md : theme.text.bold.sm2}
                        >
                          {layer.label}
                        </Text>
                      </label>

                      {index < basemapLayers.length - 1 && <Divider />}
                    </Fragment>
                  ))}
                </div>
              </div>
            </BlurContainer>

            {/* Feature Layers Section */}
            <BlurContainer>
              <div className="py-3 gap-1 flex flex-col">
                <Text
                  bold={theme.text.bold.md}
                  className="pl-4"
                >
                  Layers
                </Text>
                <div className="flex flex-col gap-1">
                  {featureLayers.map((layer, index) => (
                    <Fragment key={layer.id}>
                      <div className="flex items-center gap-2 px-4 py-1 cursor-pointer" onClick={() => toggleFeatureLayer(layer.id)}>
                        <ToggleSwitch
                          checked={layer.checked}
                          onChange={() => { }}
                          color={layer.color}
                        />
                        <Text
                          bold={layer.checked ? theme.text.bold.md : theme.text.bold.sm2}
                          textColor={layer.checked ? theme.colors.main.primary : theme.colors.text.secondary}
                        >
                          {layer.label}
                        </Text>
                      </div>
                      {index < featureLayers.length - 1 && <Divider className="pl-12" />}
                    </Fragment>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full px-3 mt-2">
                  <Button
                    text="Select All"
                    className="flex-1"
                    onClick={selectAllFeatures}
                  />
                  <OutlineButton
                    text="Deselect All"
                    className="flex-1"
                    onClick={deselectAllFeatures}
                  />
                </div>
              </div>
            </BlurContainer>
          </div>
        </motion.div>
      )
      }
    </AnimatePresence >
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, color }: { checked: boolean; onChange: () => void; color: string }) => (
  <div
    style={{
      width: '28px',
      height: '16px',
      display: 'flex',
      alignItems: 'center',
      borderRadius: '9999px',
      padding: '2px',
      transition: 'duration-300',
      backgroundColor: checked ? color : '#D1D5DB'
    }}
    onClick={onChange}
  >
    <div
      style={{
        backgroundColor: 'white',
        width: '12px',
        height: '12px',
        borderRadius: '9999px',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        transform: checked ? 'translateX(12px)' : 'translateX(0)',
        transition: 'transform 300ms'
      }}
    />
  </div>
);

export default LayersControl;