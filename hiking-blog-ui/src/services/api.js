import { getAuth } from "firebase/auth";

const getApiPath = (apiPath) => {
    return `${apiPath}`;
  };

const getAuthToken = async () => {
    try {
        const auth = getAuth();
        return await auth.currentUser?.getIdToken(true);
    } catch (e) {
        console.log(e);
        return null;
    }
}

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
  
const postApi = async (apiPath, data, options={}) => {
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
        // 'Content-Type': 'multipart/form-data; boundary=something'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: data
    });
};
  
export {getApi, postApi};