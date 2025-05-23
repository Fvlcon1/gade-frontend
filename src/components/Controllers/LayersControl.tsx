'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import Text from '@styles/components/text';

const initialLayers = [
  { id: 'mining', label: 'Detected mining activity', checked: true },
  { id: 'concessions', label: 'Mining concessions', checked: false },
  { id: 'forest', label: 'Forest reserves', checked: true },
  { id: 'admin', label: 'Admin districts', checked: false },
  { id: 'rivers', label: 'Rivers', checked: true },
];

const LayersControl = ({ isOpen, onClose, sidebarExpanded = false }) => {
  const [layers, setLayers] = useState(initialLayers);
  
  const toggleLayer = (id) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === id ? { ...layer, checked: !layer.checked } : layer
      )
    );
  };
  
  const selectAll = () => {
    setLayers(prev => prev.map(layer => ({ ...layer, checked: true })));
  };
  
  const selectedCount = layers.filter(l => l.checked).length;

  // Calculate left position based on sidebar state
  const leftPosition = sidebarExpanded ? '295px' : '135px';
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute top-[10px] w-[240px] h-auto max-h-[270px] rounded-xl bg-white/65 backdrop-blur-xs shadow-md px-4 py-3 z-[1002] border border-gray-200"
          initial={{ opacity: 0, y: -10, left: leftPosition }}
          animate={{ opacity: 1, y: 0, left: leftPosition }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between text-sm font-bold text-gray-700 mb-2">
            <Text>Layers</Text>
            <div className="flex items-center gap-2 text-xs font-normal text-gray-500">
              {selectedCount} Selected
              <IoClose className="cursor-pointer" onClick={onClose} />
            </div>
          </div>
          
          {/* Layer Items */}
          <div className="flex flex-col gap-1 mb-3 text-sm">
            {layers.map((layer) => (
              <div key={layer.id}>
                <label className="flex items-center gap-3 py-[6px] cursor-pointer">
                  <ToggleSwitch 
                    checked={layer.checked} 
                    onChange={() => toggleLayer(layer.id)} 
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
          
          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={selectAll}
              className="bg-[#4F46E5] text-white text-xs font-semibold px-3 py-[3px] rounded-md shadow"
            >
              Select all
            </button>
            <button className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center text-sm text-gray-600">
              ⟳
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }) => (
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