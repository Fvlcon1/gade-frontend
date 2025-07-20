'use client';
import React, { useState, useCallback, Fragment, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoLayersOutline, IoMapOutline } from 'react-icons/io5';
import Text from '@styles/components/text';
import ClickableTab from '@components/ui/clickable/clickabletab';
import BlurContainer from '@components/ui/blur-container';
import OutlineButton from '@components/ui/button/outlineButton';
import Button from '@components/ui/button/button';
import { useTheme } from '@/app/styles/theme-context';

// Feature layer definitions with colors matching LAYER_STYLES
export const initialLayers = [
  { id: 'admin', label: 'Admin districts', checked: true, color: '#D2B48C' },
  { id: 'reports', label: 'Reports', checked: true, color: '#8F3C19' },
  { id: 'rivers', label: 'Rivers', checked: true, color: '#03A9F4' },
  { id: 'forest', label: 'Forest reserves', checked: true, color: '#4CAF50' },
  { id: 'concessions', label: 'Mining concessions', checked: true, color: '#d3b036' },
  { id: 'mining_sites', label: 'Detected mining activity', checked: true, color: '#FF4B4B' },
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
  const {theme, themeColor, systemTheme} = useTheme()
  // Basemap definitions
  const basemaps = useMemo(() => [
    { id: 'cartocdnLight', label: 'Light Basemap', checked: themeColor === 'light' || systemTheme === 'light' },
    { id: 'osm', label: 'Open Street Map', checked: false },
    { id: 'cartocdnDark', label: 'Dark Basemap', checked: themeColor === 'dark' || systemTheme === 'dark' },
    { id: 'satellite', label: 'Google Satellite', checked: false },
    { id: 'planet', label: 'Planet', checked: false },
  ], [themeColor]);
  const [basemapLayers, setBasemapLayers] = useState(basemaps);
  const [featureLayers, setFeatureLayers] = useState(initialLayers);

  useEffect(() => {
    onBasemapChange(basemaps.find(layer => layer.checked)?.id || '');
    setBasemapLayers(basemaps);
  }, [basemaps]);

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
  const leftPosition = sidebarExpanded ? '332px' : '135px';

  const Divider = ({ className }: { className?: string }) => {
    return (
      <div className={`w-full pl-8 ${className}`}>
        <div className="w-full h-0.25 bg-border-primary" />
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
          <div className="w-full h-[33px] bg-bg-primary/80 dark:border-[1px] dark:border-border-primary dark:shadow-bg-primary/50 backdrop-blur-sm shadow-xl px-3 pr-1 flex items-center justify-between rounded-[10px]">
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
            <BlurContainer className='border-[1px] border-border-primary'>
              <div className="py-3 gap-2 flex flex-col">
                <Text
                  bold={theme.text.bold.md}
                  className="pl-4"
                >
                  Basemaps
                </Text>
                <div className="flex flex-col gap-2">
                  {basemapLayers.map((layer, index) => (
                    <Fragment key={layer.id}>
                      <label className="flex items-center gap-2 px-4 py-1 cursor-pointer">
                        <input
                          type="radio"
                          name="basemap"
                          checked={layer.checked}
                          onChange={() => toggleBasemap(layer.id)}
                          className="w-3 h-3 accent-main-primary"
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
            <BlurContainer className='border-[1px] border-border-primary'>
              <div className="py-3 gap-2 flex flex-col">
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
                    className="flex-1 !h-[32px]"
                    onClick={selectAllFeatures}
                  />
                  <OutlineButton
                    text="Deselect All"
                    className="flex-1 !h-[32px]"
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