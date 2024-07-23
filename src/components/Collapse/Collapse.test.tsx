import { describe, test, expect, vi, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import Collapse from "./Collapse.vue";
import CollapseItem from "./CollapseItem.vue";

describe("Collapse.vue", () => {
  test("basic collapse", async () => {
    const wrapper = mount(
      () => (
        <Collapse modelValue={["a"]}>
          <CollapseItem name="a" title="title a">
            content a
          </CollapseItem>
          <CollapseItem name="b" title="title b">
            content b
          </CollapseItem>
          <CollapseItem name="c" title="title c" disabled>
            content c
          </CollapseItem>
        </Collapse>
      ),
      {
        global: {
          stubs: ["Icon"],
        },
        attachTo: document.body,
      }
    );
    const headers = wrapper.findAll(".wr-collapse-item__header");
    const contents = wrapper.findAll(".wr-collapse-item__content");

    // 长度
    expect(headers.length).toBe(3);
    expect(contents.length).toBe(3);

    // 文本
    const firstHeader = headers[0];
    expect(firstHeader.text()).toBe("title a");

    // 内容
    const firstContent = contents[0];
    const secondContent = contents[1];
    const disabledContent = contents[2];
    expect(firstContent.isVisible()).toBeTruthy();
    expect(secondContent.isVisible()).toBeFalsy();
    expect(firstContent.text()).toBe("content a");

    // 行为
    await firstHeader.trigger("click");
    console.log(firstContent.html());

    expect(firstContent.isVisible()).toBeFalsy();
  });
});
