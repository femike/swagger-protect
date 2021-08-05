<template>
  <div class="column q-pa-lg">
    <div class="row">
      <q-card class="shadow-24" style="width: 300px; height: 485px">
        <q-card-section class="bg-red-8 q-pa-sm">
          <div class="row">
            <div class="col-10"></div>
            <div class="col">
              <q-btn
                round
                flat
                :title="t('home')"
                color="white"
                @click="home"
                :icon="matHome"
              ></q-btn>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row items-center">
            <q-img
              alt="swagger protect"
              fit="contain"
              :src="imgLogo"
              style="max-width: 268px; height: 119px"
              class="q-mb-sm"
            />
          </div>

          <q-separator />

          <br />

          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="login"
              autofocus
              filled
              type="text"
              :label="t('inputs.login') + '*'"
              no-error-icon
              lazy-rules
              :rules="[empty]"
              autocomplete="login"
            >
              <template v-slot:prepend>
                <q-icon :name="matAccountCircle" />
              </template>
            </q-input>

            <q-input
              filled
              :type="!visiblePwd ? 'password' : 'text'"
              v-model="password"
              :label="t('inputs.password') + '*'"
              no-error-icon
              lazy-rules
              autocomplete="current-password"
              :rules="[empty]"
            >
              <template v-slot:prepend>
                <q-icon :name="matLock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="!visiblePwd ? matVisibilityOff : matVisibility"
                  class="cursor-pointer"
                  @click="visiblePwd = !visiblePwd"
                />
              </template>
            </q-input>

            <q-separator />

            <div>
              <q-btn
                :label="t('buttons.entry')"
                class="full-width"
                type="submit"
                color="green"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { imgLogo } from '../assets'
import {
  matAccountCircle,
  matHome,
  matLock,
  matVisibility,
  matVisibilityOff,
  matWarning,
} from '@quasar/extras/material-icons'
import { useQuasar } from 'quasar'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { i18t } from '../plugins/i18n'

export default defineComponent({
  name: 'LoginForm',
  props: {
    backUrl: {
      type: String,
      required: true,
    },
  },
  setup: props => {
    const $q = useQuasar()
    const { t } = useI18n()
    const _t = i18t(t)

    if (!$q.cookies.has('allow_cookie')) {
      const dismiss = $q.notify({
        message: _t('notifications.allow_cookie'),
        color: 'green',
        multiLine: true,
        timeout: 0,
        position: 'bottom',
        avatar: imgLogo,
        actions: [
          {
            label: _t('buttons.accept'),
            color: 'yellow',
            handler: () => {
              $q.cookies.set('allow_cookie', '1')
              dismiss()
            },
          },
        ],
      })
    }

    const login = ref(null)
    const password = ref(null)
    const visiblePwd = ref(false)
    const headersList = {
      Accept: '*/*',
      'User-Agent': 'Swagger Protect Client',
      'Content-Type': 'application/json',
    }
    return {
      t: _t,
      imgLogo,
      matHome,
      matWarning,
      matAccountCircle,
      matLock,
      matVisibility,
      matVisibilityOff,
      login,
      password,
      visiblePwd,
      productName: 'Swagger Protect',
      onSubmit() {
        fetch('/login-api', {
          method: 'POST',
          body: `{"login": "${login.value}", "password": "${password.value}"}`,
          headers: headersList,
        })
          .then(response => {
            const { ok } = response
            if (ok) {
              response
                .json()
                .then(({ token }: { token: string }) => {
                  if (token) {
                    $q.cookies.set('swagger_token', token)
                    setTimeout(() => location.replace(props.backUrl))
                  } else {
                    $q.notify({
                      type: 'negative',
                      icon: matWarning,
                      message: _t('errors.server_return_empty_result'),
                    })
                  }
                })
                .catch(err => {
                  $q.notify({
                    type: 'negative',
                    icon: matWarning,
                    message: err,
                  })
                })
            } else {
              console.error(response)
              $q.notify({
                type: 'negative',
                icon: matWarning,
                message: `${response.status}: ${response.statusText}`,
              })
            }
          })
          .catch(err => {
            console.error(err)
            $q.notify({
              type: 'negative',
              icon: matWarning,
              message: `${err.status}: ${err.statusText}`,
            })
          })
      },
      empty: (val: string) =>
        (val && val.length > 0) || _t('errors.must_be_not_empty'),
      home: () => location.replace('/'),
    }
  },
})
</script>
