import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { distributionChannels } from '../config/distributionChannels';

export default function DistributionChannels({ selectedChannels, onChannelChange }) {
  const [expandedChannel, setExpandedChannel] = useState(null);
  const [selectedAdTypes, setSelectedAdTypes] = useState({});

  const toggleChannel = (channelName) => {
    const isSelected = selectedChannels.includes(channelName);
    
    if (isSelected) {
      // Remove channel
      onChannelChange(selectedChannels.filter(c => c !== channelName));
      // Clear ad types for this channel
      const newAdTypes = { ...selectedAdTypes };
      delete newAdTypes[channelName];
      setSelectedAdTypes(newAdTypes);
    } else {
      // Add channel
      onChannelChange([...selectedChannels, channelName]);
    }
  };

  const toggleAdType = (channelName, adTypeId) => {
    const channelAdTypes = selectedAdTypes[channelName] || [];
    const isSelected = channelAdTypes.includes(adTypeId);

    setSelectedAdTypes({
      ...selectedAdTypes,
      [channelName]: isSelected
        ? channelAdTypes.filter(id => id !== adTypeId)
        : [...channelAdTypes, adTypeId]
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-white font-semibold mb-2">Distribution Channels *</h3>
        <p className="text-sm text-gray-400 mb-4">
          Select platforms and ad types for your campaign
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {distributionChannels.map((channel) => {
          const isSelected = selectedChannels.includes(channel.name);
          const isExpanded = expandedChannel === channel.name;
          const hasAdTypes = channel.adTypes && channel.adTypes.length > 0;

          return (
            <div
              key={channel.name}
              className={`border-2 rounded-lg transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 bg-gray-800'
              }`}
            >
              {/* Channel Header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleChannel(channel.name)}
              >
                <div className="flex items-center gap-3">
                  {/* Logo or Icon */}
                  {channel.logo ? (
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <span
                    className="text-2xl"
                    style={{ display: channel.logo ? 'none' : 'block' }}
                  >
                    {channel.fallbackIcon}
                  </span>

                  <div>
                    <div className="text-white font-medium">{channel.name}</div>
                    <div className="text-xs text-gray-400">{channel.type}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isSelected && selectedAdTypes[channel.name]?.length > 0 && (
                    <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                      {selectedAdTypes[channel.name].length} ad type
                      {selectedAdTypes[channel.name].length > 1 ? 's' : ''}
                    </span>
                  )}
                  
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>

                  {hasAdTypes && isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedChannel(isExpanded ? null : channel.name);
                      }}
                      className="p-1 hover:bg-gray-700 rounded"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Ad Types Dropdown */}
              {hasAdTypes && isSelected && isExpanded && (
                <div className="border-t border-gray-700 p-4 bg-gray-900/50">
                  <div className="text-sm text-gray-300 mb-3 font-medium">
                    Select Ad Types:
                  </div>
                  <div className="space-y-2">
                    {channel.adTypes.map((adType) => {
                      const isAdTypeSelected = selectedAdTypes[channel.name]?.includes(adType.id);

                      return (
                        <button
                          key={adType.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAdType(channel.name, adType.id);
                          }}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            isAdTypeSelected
                              ? 'border-purple-600 bg-purple-600/20'
                              : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="text-white text-sm font-medium mb-1">
                                {adType.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {adType.description}
                              </div>
                            </div>
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ml-2 ${
                                isAdTypeSelected
                                  ? 'border-purple-500 bg-purple-500'
                                  : 'border-gray-600'
                              }`}
                            >
                              {isAdTypeSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {selectedChannels.length > 0 && (
        <div className="mt-4 p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
          <div className="text-sm text-purple-200">
            <span className="font-semibold">{selectedChannels.length}</span> channel
            {selectedChannels.length > 1 ? 's' : ''} selected
            {Object.values(selectedAdTypes).flat().length > 0 && (
              <span>
                {' '}• {Object.values(selectedAdTypes).flat().length} ad type
                {Object.values(selectedAdTypes).flat().length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
