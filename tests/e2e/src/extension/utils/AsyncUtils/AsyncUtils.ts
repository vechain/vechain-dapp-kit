// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const asyncFilter = async (array: any[], predicate: any) => {
    const results = await Promise.all(array.map(predicate));
    return array.filter((_v, index) => results[index]);
};
