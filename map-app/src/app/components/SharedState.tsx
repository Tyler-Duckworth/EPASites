// src/SharedContext.js
import React, { createContext, useState, useContext, Dispatch, SetStateAction } from 'react';
import { AirQualityStation } from './AirQualityStation';
// 1. Define the Context
interface SharedStateContextType {
    sharedState: AirQualityStation | null,
    setSharedState: Dispatch<SetStateAction<AirQualityStation | null>>
}
export const SharedStateContext = createContext<SharedStateContextType | undefined>(undefined);

// 2. Create the Provider component
export const SharedStateProvider = ({ children }: any) => {
  const [sharedState, setSharedState] = useState<AirQualityStation | null>(null);
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