import React from 'react';

import '@testing-library/jest-dom';
import {render as rtlRender, waitFor, screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import { MemoryRouter, Routes, Route } from 'react-router-dom';

import TripDetails from '../trip/TripDetails';

const server = setupServer(
  rest.get('/api/trip/getTrip', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      data: {
        key: 1,
        name: 'Test trip',
        description: 'Test description',
        tags: [],
        pathCoordinates: [],
        fromDate: new Date(),
        toDate: new Date()
      }
    }));
  }),
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
  render(<TripDetails/>, {route: '/tripDetails/1', routePath: '/tripDetails/:tripId'});
  // await waitFor(() => screen.getByRole('textbox'));
});
