const createStore = () => {
  let data: string | null = null;

  const setData = (next: string) => {
    data = next;
  };

  const getData = () => {
    return data;
  };

  return { setData, getData };
};

export const store = createStore();