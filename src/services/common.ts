import request from '@/utils/request';
import { stringify } from 'qs';

interface SearchParams {
  content?: string;
  expiry_time?: number | string;
}

interface RequestParams {
  id?: number | string | 0;
  [key: string]: any;
}

export async function search(url: string, params: SearchParams) {
  const str = stringify(params);
  const part = !str ? str : `?${str}`;
  return request(`${url}${part}`);
}

export async function create(url: string, params: RequestParams) {
  return request(url, {
    method: 'POST',
    data: params,
  });
}

export async function detail(url: string, { id = 0 }: RequestParams) {
  return request(`${url}/${id}`);
}

export async function update(url: string, { id = 0, ...params }: RequestParams) {
  return request(`${url}/${id}`, {
    method: 'PUT',
    data: params,
  });
}
