import { getAuthToken } from './apiUtils';

const getApiPath = (apiPath) => {
    return `${apiPath}`;
  };

const getApi = async (apiPath, urlParams=new URLSearchParams(), options={}) => {
    const authToken = await getAuthToken();
    if (!authToken) {
      throw new Error('Unauthrorized');
    }
    console.log(`${getApiPath(apiPath)}?${urlParams.toString()}`);
    return fetch(`${getApiPath(apiPath)}?${urlParams.toString()}`, {
      ...options,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
};

const getApiHeaders = (contentType) => {
  const headers = {};
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  return headers;
};

const _postApi = async (apiPath, data, options, contentType) => {
    const authToken = await getAuthToken();
    if (!authToken) {
      throw new Error('Unauthrorized');
    }

    return fetch(getApiPath(apiPath), {
      ...options,
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...getApiHeaders(contentType)
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: data
    });
};

const postApi = async (apiPath, data, options={}) => {
  return _postApi(apiPath, JSON.stringify(data), options, 'application/json');
};

const postFormData = async (apiPath, data, options={}) => {
  return _postApi(apiPath, data, options, null);
};

const dataToBlob = (data) => {
  return new Blob([JSON.stringify(data)], {type: 'application/json'});
};

export {getApi, postApi, postFormData, dataToBlob};