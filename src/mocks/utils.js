const POWER_BASE = 10;

const getPowered = (val, precision) => val * (POWER_BASE ** precision);

export const getRandomInt = (a = 1, b) => b === undefined ? Math.floor(Math.random() * (a + 1)) : Math.floor(Math.random() * (b - a + 1)) + a;
export const getRandomBool = () => Boolean(getRandomInt());
export const getRandomFloat = (a = 1, b, precision = 1) =>
  getRandomInt(getPowered(a, precision), b ? b * getPowered(b, precision) : undefined) / getPowered(1, precision);
export const getRandomElement = (arr) => arr[getRandomInt(arr.length - 1)];
export const getRandomElements = (arr, min = 1) => {
  const oldArray = [...arr];
  const newArray = [];
  const max = getRandomInt(arr.length - 1) || min;

  for (let i = 0; i < max; i++) {
    const randomIndex = getRandomInt(oldArray.length - 1);
    newArray.push(oldArray[randomIndex]);
    oldArray.splice(randomIndex, 1);
  }

  return newArray;
};
export const getRandomDate = (start, end) => {
  const startDate = start ? new Date(start) : new Date();
  const endDate = end ? new Date(end) : new Date();
  const randomTimestamp = getRandomInt(startDate.getTime(), endDate.getTime());

  return new Date(randomTimestamp);
};
