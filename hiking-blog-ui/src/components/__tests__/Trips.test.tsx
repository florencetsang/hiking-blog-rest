import React from 'react';

import '@testing-library/jest-dom';
import {render as rtlRender, waitFor, screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import { MemoryRouter, Routes, Route } from 'react-router-dom';

import Trips from '../posts/Trips';

const server = setupServer(
  rest.get('/api/trip/getTrips', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      data: [
        {
          key: 1,
          name: 'Test trip',
          description: 'Test description',
          tags: [],
          pathCoordinates: [],
          fromDate: new Date(),
          toDate: new Date()
        }
      ]
    }));
  }),
  rest.get('/api/tag/getTags', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      data: [
        {
          tagId: 1,
          name: 'Test tag',
          description: 'Test tag description'
        }
      ]
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('../../services/apiUtils', () => {
  const originalModule = jest.requireActual('../../services/apiUtils');
  return {
    __esModule: true,
    ...originalModule,
    getAuthToken: () => 'test-auth-token'
  };
});

jest.mock('notistack', () => {
  const originalModule = jest.requireActual('notistack');
  return {
    __esModule: true,
    ...originalModule,
    useSnackbar: () => ({
      enqueueSnackbar: () => {}
    })
  };
});

jest.mock('firebase/analytics', () => {
  const originalModule = jest.requireActual('firebase/analytics');
  return {
    __esModule: true,
    ...originalModule,
    logEvent: (analytics: any, page: any, options: any) => {}
  };
});

jest.mock('reactfire', () => {
  const originalModule = jest.requireActual('reactfire');
  return {
    __esModule: true,
    ...originalModule,
    useAnalytics: () => ({})
  };
});

const render = (ui: React.ReactElement, {route = '/', routePath = '/'} = {}) => {
  return rtlRender(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={routePath} element={ui}/>
      </Routes>
    </MemoryRouter>
  );
};

test('Load trip', async () => {
  render(<Trips/>, {route: '/trips', routePath: '/trips'});
  // await waitFor(() => screen.getByRole('textbox'));
});
