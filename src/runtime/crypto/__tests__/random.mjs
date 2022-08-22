export function random({min = 0, max = 1, floor = true} = {}) {
  let value = Math.random() * (max - min) + min;
  if (floor) {
    value = Math.floor(value);
  }
  return value;
}
