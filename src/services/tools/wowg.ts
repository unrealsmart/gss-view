import request from '@/utils/request';

export async function dateList() {
  return request('/tools/wow-gold/dateList');
}
