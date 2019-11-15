import request from '@/utils/request';
import { stringify } from 'qs';

interface SearchParams {
  content?: string;
}

interface RequestParams {
  id?: number | string;
  [key: string]: any;
}

export async function search(url: string, params: SearchParams) {
  return request(`${url}?${stringify(params)}`);
}

export async function create(url: string, params: RequestParams) {
  return request(url, {
    method: 'POST',
    data: params,
  });
}

export async function detail(url: string, { id }: RequestParams) {
  return request(`${url}/${id}`);
}

export async function update(url: string, { id, ...params }: RequestParams) {
  return request(`${url}/${id}`, {
    method: 'PUT',
    data: params,
  });
}
