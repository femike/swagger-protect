<template>
  <q-page
    padding
    class="window-height window-width row justify-center items-center"
    style="background: radial-gradient(#2c5451, #2c5454)"
  >
    <LoginForm :backUrl="backUrl" />
  </q-page>
</template>

<script>
import { defineComponent } from '@vue/runtime-core'
import LoginForm from '../components/LoginForm.vue'
export default defineComponent({
  name: 'LoginPage',
  props: {
    backUrl: {
      type: String,
      required: true,
      default: '/',
    },
  },
  components: {
    LoginForm,
  },
})
</script>

<style></style>
