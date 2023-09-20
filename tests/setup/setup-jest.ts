import fetchMock from 'jest-fetch-mock';

// Globally disable fetch requests so we don't risk making real ones
fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.mockReset();
});
