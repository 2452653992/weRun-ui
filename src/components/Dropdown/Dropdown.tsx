import { computed, defineComponent, Fragment, ref } from "vue";
import type { PropType } from "vue";
import type { Placement } from "@floating-ui/vue";
import type { MenuOption } from "./types";
import Tooltip from "../Tooltip/Tooltip.vue";
import type { TooltipInstance } from "../Tooltip/types";
export default defineComponent({
  name: "WrDropdown",
  props: {
    placement: {
      type: String as PropType<Placement>, // 类型收缩
      default: "bottom",
    },
    trigger: {
      type: String as PropType<"hover" | "click">,
      default: "hover",
    },
    transition: {
      type: String,
      default: "fade",
    },
    openDelay: {
      type: Number,
      default: 0,
    },
    closeDelay: {
      type: Number,
      default: 0,
    },
    menuOptions: {
      type: Array as PropType<MenuOption[]>,
      required: true,
    },
    hideAfterClick: {
      type: Boolean,
      default: true,
    },
    manual: {
      type: Boolean,
    },
  },
  emits: ["visible-change", "select"],
  setup(props, { slots, emit, expose }) {
    const tooltipRef = ref<TooltipInstance | null>(null);
    const itemClick = (e: MenuOption) => {
      if (e.disabled) {
        return;
      }
      emit("select", e);
      if (props.hideAfterClick) {
        tooltipRef.value?.hide();
      }
    };
    const visiableChange = (e: boolean) => {
      emit("visible-change", e);
    };
    const options = computed(() => {
      return props.menuOptions.map((item) => {
        return (
          <Fragment key={item.key}>
            {item.divided ? (
              <li role="separator" class="divided-placeholder" />
            ) : (
              ""
            )}
            <li
              class={{
                "wr-dropdown__item": true,
                "is-disabled": item.disabled,
                "is-divided": item.divided,
              }}
              id={`dropdown-item-${item.key}`}
              onClick={() => itemClick(item)}
            >
              {item.label}
            </li>
          </Fragment>
        );
      });
    });
    expose({
      show: () => tooltipRef.value?.show(),
      hide: () => tooltipRef.value?.hide(),
    });
    return () => (
      <div className="wr-dropdown">
        <Tooltip
          trigger={props.trigger}
          placement={props.placement}
          open-delay={props.openDelay}
          close-delay={props.closeDelay}
          manual={props.manual}
          ref={tooltipRef}
          onVisibleChange={visiableChange}
        >
          {{
            default: () => slots.default && slots.default(),
            content: () => <ul class="wr-dropdown__menu">{options.value}</ul>,
          }}
        </Tooltip>
      </div>
    );
  },
});
