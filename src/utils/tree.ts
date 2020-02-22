import { TreeNode } from 'antd/lib/tree-select';

function initialize(data: any[] = [], keyFor: string = 'id') {
  return data.map((item: object) => {
    let newItem: object = item;
    if (item && item[keyFor]) {
      newItem = {
        ...item,
        key: item[keyFor].toString(),
      };
    }
    return newItem;
  });
}

function simple(data: any[] = [], keyFor: string = 'id'): TreeNode[] {
  const newData: TreeNode[] = [];
  data.forEach((item?: { title?: string; name?: string }) => {
    if (item && item[keyFor]) {
      newData.push({
        key: item.name || item[keyFor],
        value: item[keyFor],
        title: item.title || item.name || item[keyFor].toString(),
      });
    }
  });
  return newData;
}

function parent(data: any[] = [], keyFor: string = 'id'): TreeNode[] {
  const newData = simple(data, keyFor);
  newData.unshift({
    key: 0,
    value: 0,
    title: '最上级',
  });
  return newData;
}

function fetch(data: any[] = [], value: number | string, key: string = 'id'): any {
  let objective = {};
  data.forEach((item: object) => {
    if (String(item[key]) === String(value)) {
      objective = item;
    }
  });
  return objective;
}

function insert(data: any[] = [], value: any, modeOrFunc: string | Function) {
  const newData: any[] = data;
  // Tree
  // data.map((item: object) => {
  //   console.log(item);
  //   return item;
  // });

  if (typeof modeOrFunc === 'string') {
    if (modeOrFunc === 'unshift') newData.unshift(value);
    if (modeOrFunc === 'push') newData.push(value);
  } else {
    // modeOrFunc();
  }

  // TODO 还需要避免重复问题

  return newData;
}

function update(data: any[] = [], value: any, key = 'id') {
  const newData = data.map((item: object) => {
    if (String(item[key]) === String(value[key])) {
      return {
        ...item,
        ...value,
      };
    }
    return item;
  });

  return newData;
}

function remove(data: any[] = [], value: any, key = 'id') {
  const newData: any[] = [];
  data.forEach((item: object) => {
    if (String(item[key]) !== String(value[key])) {
      newData.push(item);
    }
  });
  return newData;
}

/**
 * 从数据结构中提取 tabList 列表
 *
 * @param data
 * @param array
 */
function fetchTabList(data = [], array: string[] = ['name', 'title']): any {
  const [key, tab] = array;
  return data.map((item: object) => ({
    key: item[key],
    tab: item[tab],
  }));
}

export default {
  // 初始化（添加键 & 标记叶子节点）
  initialize,
  // 提取简化版的标记（只包含 Key，Value，Title）
  simple,
  // 包含最上级的标记
  parent,

  // 获取
  fetch,
  // 添加
  insert,
  // 更新
  update,
  // 移除
  remove,

  // 特殊方法
  fetchTabList,
};
