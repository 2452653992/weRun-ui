<template>
  <form class="wr-form">
    <slot />
  </form>
</template>
<script lang="ts" setup>
import type {
  FormContext,
  FormItemContext,
  FormProps,
  FormValidateFailure,
  FormInstance,
} from "./types";
import { formContextKey } from "./types";
import { provide } from "vue";
import type { ValidateFieldsError } from "async-validator";
defineOptions({
  name: "WrForm",
});
const props = withDefaults(defineProps<FormProps>(), {});
const fields: FormItemContext[] = [];
const addField: FormContext["addField"] = (field) => {
  fields.push(field);
};
const removeField: FormContext["removeField"] = (field) => {
  if (field.prop) {
    fields.splice(fields.indexOf(field), 1);
  }
};
const resetFields = (keys: string[] = []) => {
  const filterArr =
    keys.length > 0
      ? fields.filter((field) => keys.includes(field.prop))
      : fields;
  filterArr.forEach((field) => field.resetField());
};
const clearValidate = (keys: string[] = []) => {
  const filterArr =
    keys.length > 0
      ? fields.filter((field) => keys.includes(field.prop))
      : fields;
  filterArr.forEach((field) => field.clearValidate());
};
const validate = async () => {
  let validationErrors: ValidateFieldsError = {};
  for (const field of fields) {
    try {
      await field.validate("");
    } catch (e) {
      const error = e as FormValidateFailure;
      validationErrors = {
        ...validationErrors,
        ...error.fields,
      };
    }
  }
  if (Object.keys(validationErrors).length === 0) return true;
  return Promise.reject(validationErrors);
};

provide(formContextKey, {
  ...props,
  addField,
  removeField,
});
defineExpose<FormInstance>({
  validate,
  resetFields,
  clearValidate,
});
</script>

<style lang="scss">
.wr-form {
  --wr-form-label-font-size: var(--wr-font-size-base);
  --wr-form-content-font-size: var(--wr-font-size-base);
}
.wr-form-item {
  display: flex;
  margin-bottom: 18px;
  .wr-form-item__label {
    width: 150px;
    height: 32px;
    line-height: 32px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
    display: inline-flex;
    justify-content: flex-end;
    font-size: var(--wr-form-label-font-size);
    color: var(--wr-text-color-regular);
  }
  .wr-form-item__content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    flex: 1;
    line-height: 32px;
    font-size: var(--wr-form-content-font-size);
    min-width: 0;
    position: relative;
  }
  .wr-form-item__error-msg {
    position: absolute;
    top: 100%;
    left: 0;
    padding-top: 2px;
    color: var(--wr-color-danger);
    font-size: 12px;
    line-height: 1;
  }
}

.wr-form-item.is-error .wr-input__wrapper {
  box-shadow: 0 0 0 1px var(--wr-color-danger) inset;
}
.wr-form-item.is-success .wr-input__wrapper {
  box-shadow: 0 0 0 1px var(--wr-color-success) inset;
}
.wr-form-item.is-required > .wr-form-item__label::before {
  content: "*";
  color: var(--wr-color-danger);
  margin-right: 4px;
}
</style>
