import { fightersDetails, fighters } from './mockData';

const API_URL = 'https://api.github.com/repos/binary-studio-academy/stage-2-es6-for-everyone/contents/resources/api/';
const useMockAPI = true;

async function callApi<T>(endpoint : string, method : string) {
  const url = API_URL + endpoint;
  const options = {
    method,
  };

  return useMockAPI
    ? fakeCallApi(endpoint) as Promise<T>
    : fetch(url, options)
      .then((response) => (response.ok ? response.json() : Promise.reject(Error('Failed to load'))))
      .then((result) => JSON.parse(atob(result.content)))
      .catch((error) => { throw error; }) as Promise<T>;
}

async function fakeCallApi(endpoint : string) {
  const response = endpoint === 'fighters.json' ? fighters : getFighterById(endpoint);

  return new Promise((resolve, reject) => {
    setTimeout(() => (response ? resolve(response) : reject(Error('Failed to load'))), 500);
  });
}

function getFighterById(endpoint : string) {
  const start = endpoint.lastIndexOf('/');
  const end = endpoint.lastIndexOf('.json');
  const id = endpoint.substring(start + 1, end);

  return fightersDetails.find((it) => it._id === id);
}

export { callApi };
