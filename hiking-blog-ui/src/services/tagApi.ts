import { getApi, postApi } from './api';
import { ApiRes, isSuccessApi } from './apiRes';

import { Tag } from '../data/tag';

const TAG_API_PREFIX = '/api/tag';

export const getTags = async (): Promise<Tag[] | null> => {
  const searchParams = new URLSearchParams();
  try {
    const res = await getApi(`${TAG_API_PREFIX}/getTags`, searchParams);
    const resJson = await res.json() as ApiRes<Tag[]>;
    if (isSuccessApi(resJson)) {
      return resJson.data;
    } else {
      throw new Error(resJson.error);
    }
  } catch (err) {
    console.log('getTag err', err);
    return null;
  }
};

export const getTag = async (tagId: number): Promise<Tag | null> => {
  const searchParams = new URLSearchParams();
  searchParams.append('tagId', tagId.toString());
  try {
    const res = await getApi(`${TAG_API_PREFIX}/getTag`, searchParams);
    const resJson = await res.json() as ApiRes<Tag>;
    if (isSuccessApi(resJson)) {
      return resJson.data;
    } else {
      throw new Error(resJson.error);
    }
  } catch (err) {
    console.log('getTag err', err);
    return null;
  }
};

export const getTagByName = async (name: string): Promise<Tag | null> => {
  const searchParams = new URLSearchParams();
  searchParams.append('tagName', name);
  try {
    const res = await getApi(`${TAG_API_PREFIX}/getTagByName`, searchParams);
    const resJson = await res.json() as ApiRes<Tag>;
    if (isSuccessApi(resJson)) {
      return resJson.data;
    } else {
      throw new Error(resJson.error);
    }
  } catch (err) {
    console.log('getTagByName err', err);
    return null;
  }
};

export const addTag = async (name: string, description: string) => {
  try {
    const data = {
      name: name,
      description: description
    };
    const res = await postApi(`${TAG_API_PREFIX}/addTag`, data);
    const resJson = await res.json() as ApiRes<boolean>;
    if (isSuccessApi(resJson)) {
      return resJson.data;
    } else {
      throw new Error(resJson.error);
    }
  } catch (err) {
    console.log('addTag error', err);
    return false;
  }
};

export const deleteTag = async (tagId: number) => {
  const data = {
    tagId: tagId
  };
  try {
    const res = await postApi(`${TAG_API_PREFIX}/deleteTag`, data);
    const resJson = await res.json() as ApiRes<boolean>;
    if (isSuccessApi(resJson)) {
      return resJson.data;
    } else {
      throw new Error(resJson.error);
    }
  } catch (err) {
    console.log('deleteTag error', err);
    return false;
  }
};
