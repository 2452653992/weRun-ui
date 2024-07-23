// import { expect, test } from "vitest";
// // 普通测试
// test("test common matcher", () => {
//   const name = "viking";
//   expect(name).toBe("viking");
//   expect(2 + 2).toBe(4);
//   expect(2 + 2).not.toBe(5);
// });
// // boolean测试
// test("test to be true or false", () => {
//   expect(1).toBeTruthy();
//   expect(0).toBeFalsy();
// });
// // 数字测试
// test("test number", () => {
//   expect(4).toBeGreaterThan(3);
//   expect(2).toBeLessThan(3);
// });
// test("test object", () => {
//   expect({ name: "vki" }).toEqual({ name: "vki" });
// });
import { test, describe, vi, expect, Mocked } from "vitest";
import { testFn, request } from "./utils";
import axios from "axios";
vi.mock("axios");
const mockAxios = axios as Mocked<typeof axios>;
describe("functions", () => {
  test("create a mock function", () => {
    const callback = vi.fn();
    testFn(12, callback);
    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(12);
  });
  test("spy on method", () => {
    const obj = {
      getName: () => 1,
    };
    const spy = vi.spyOn(obj, "getName");
    obj.getName();
    expect(spy).toHaveBeenCalled();
    obj.getName();
    expect(spy).toHaveBeenCalledTimes(2);
  });
  test("mock third party module", async () => {
    // mockAxios.get.mockImplementation(() => Promise.resolve({ data: 123 })); // 等于下面的
    mockAxios.get.mockResolvedValue({ data: 123 });
    const result = await request();
    expect(result).toBe(123);
  });
});
