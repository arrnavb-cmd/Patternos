import React, { createContext, useContext, useState } from 'react';

const BrandContext = createContext();

export const BrandProvider = ({ children }) => {
  const [currentBrand] = useState('Himalaya');
  
  return (
    <BrandContext.Provider value={{ currentBrand }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => useContext(BrandContext);
