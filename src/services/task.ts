import request from '@/utils/request';
import { EarnTaskModelItem } from '@/models/earn/task';

export async function runCrawlTask({ id }: EarnTaskModelItem) {
  return request(`/earn/run-crawl-task?id=${id}`);
}
