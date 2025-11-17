// src/SharedContext.js
import React, { createContext, useState, useContext, Dispatch, SetStateAction } from 'react';
import { AirQualityStation } from '../types/AirQualityStation';
import { DockviewApi } from 'dockview-core';
import RAW_SITES from '../../../data/near_road_sides.json';
import { SiteMetaData } from '../types/SiteMetaData';


export const SITES: AirQualityStation[] = RAW_SITES as AirQualityStation[];



// 1. Define the Context
export interface SharedStateType {
  currentStation?: AirQualityStation | null,
  stations?: SiteMetaData[] | null,
  api?: DockviewApi
}
interface SharedStateContextType {
    sharedState: SharedStateType | null
    setSharedState: Dispatch<SetStateAction<SharedStateType | null>>
}
export const SharedStateContext = createContext<SharedStateContextType | undefined>(undefined);

// 2. Create the Provider component
export const SharedStateProvider = ({ children }: any) => {
  const [sharedState, setSharedState] = useState<SharedStateType | null>(null);
    const contextValue: SharedStateContextType = {
        sharedState,
        setSharedState,
    };
  return (
    <SharedStateContext.Provider value={contextValue}>
      {children}
    </SharedStateContext.Provider>
  );
};

// Custom hook for convenience
export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (context === undefined) {
    throw new Error('useSharedState must be used within a SharedStateProvider');
  }
  return context;
};