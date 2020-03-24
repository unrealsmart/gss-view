export default (component: any, columns: any, props: any) => {
  //
  const { defaultProps }: any = component;
  const current = { ...defaultProps, ...columns };

  // default props and props difference
  const difference: string[] = [];
  Object.keys({ ...defaultProps, ...props }).forEach(item => {
    if (item !== 'change' && props[item] !== defaultProps[item]) {
      difference.push(item);
    }
  });

  // current and props difference
  const objects = {};
  const all = difference.length ? { ...current, ...props } : current;
  Object.keys(all).forEach(item => {
    if (item !== 'change' && props[item] !== current[item]) {
      objects[item] = all[item];
    }
  });

  return objects;
};
