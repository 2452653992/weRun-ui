import axios from "axios";

export const testFn = (number: number, callback: Function) => {
  if (number > 10) {
    callback(number);
  }
};

export const request = async () => {
  const { data } = await axios.get("fake.url");
  return data;
};
