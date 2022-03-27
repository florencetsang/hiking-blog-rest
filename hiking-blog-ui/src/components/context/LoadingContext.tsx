import React, { useState, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { Set } from 'immutable';
import { v4 as uuidv4 } from 'uuid';

interface AppLoading {
  isLoading: boolean;
  load: () => string;
  unLoad: (id: string) => void;
}

export const LoadingContext = React.createContext<AppLoading>({
  isLoading: false,
  load: () => 'loadingId',
  unLoad: () => {}
});

const emptyLoadingIds: Set<string> = Set();

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider = (props: LoadingProviderProps) => {
  const [loadingIds, setLoadingIds] = useState(emptyLoadingIds);

  const isLoading = useMemo(() => loadingIds.size > 0, [loadingIds]);

  const load = useCallback(() => {
    const id = uuidv4();
    setLoadingIds(loadingIds => loadingIds.add(id));
    return id;
  }, []);

  const unLoad = useCallback((id: string) => {
    setLoadingIds(loadingIds => loadingIds.delete(id));
  }, []);

  const appLoading: AppLoading = useMemo(() => ({
    isLoading: isLoading,
    load: load,
    unLoad: unLoad
  }), [isLoading, load, unLoad]);

  return (
    <LoadingContext.Provider value={appLoading}>
      {props.children}

      {
        isLoading
        && (
          <Box sx={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            zIndex: 10000
          }}>
            <CircularProgress/>
          </Box>
        )
      }
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
