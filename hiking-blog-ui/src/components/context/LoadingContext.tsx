import React, { useState, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { Set } from 'immutable';
import { v4 as uuidv4 } from 'uuid';

import { useAppBarHeight } from '../uiUtils/uiUtils';

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

  const appBarHeight = useAppBarHeight();

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
            height: `calc(100% - ${appBarHeight}px)`,
            position: 'absolute',
            top: appBarHeight,
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
