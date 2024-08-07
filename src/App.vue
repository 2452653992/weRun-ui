<script setup>
import Form from "./components/Form/Form.vue";
import FormItem from "./components/Form/FormItem.vue";
import Input from "./components/Input/Input.vue";
import Button from "./components/Button/Button.vue";

import { reactive, ref } from "vue";
const model = reactive({
  email: "",
  password: "",
  confirmPwd: "",
});
const rules = {
  email: [{ type: "email", required: true, trigger: "blur" }],
  password: [
    { type: "string", required: true, trigger: "blur", min: 3, max: 5 },
  ],
  confirmPwd: [
    { type: "string", required: true, trigger: "blur" },
    {
      validator: (rule, value) => value === model.password,
      trigger: "blur",
      message: "两个密码必须相同",
    },
  ],
};
const FormRef = ref();
const submit = async () => {
  try {
    await FormRef.value.validate();
    console.log("passed");
  } catch (error) {
    console.log(error);
  }
};
const reset = () => {
  FormRef.value.resetFields();
};
</script>

<template>
  <div>
    <Form :model="model" :rules="rules" ref="formRef">
      <FormItem label="the email" prop="email">
        <Input v-model="model.email" />
      </FormItem>
      <FormItem label="the password" prop="password">
        <Input type="password" v-model="model.password" />
      </FormItem>
      <FormItem prop="confirmPwd" label="confirm password">
        <Input v-model="model.confirmPwd" type="password" />
      </FormItem>
      <div :style="{ textAlign: 'center' }">
        <Button type="primary" @click.prevent="submit">Submit</Button>
        <Button @click.prevent="reset">Reset</Button>
      </div>
    </Form>
  </div>
</template>

<style></style>
