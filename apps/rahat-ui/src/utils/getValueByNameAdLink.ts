export const getDataByName = (data: any, name: string) => {
  return data?.find((item: any) => item.name === name)?.data?.count || '0';
};
