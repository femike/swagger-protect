import type { App } from 'vue'
import type { Composer, VueMessageType } from 'vue-i18n'
import type { DeepFlatten } from '../types/helper'
import { Quasar } from 'quasar'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/vite-plugin-vue-i18n/messages'
import * as enUS from '../i18n/en-US.json'

export type Messages = DeepFlatten<typeof enUS>
export type MessageSchema = typeof enUS
export type NumberSchema = {
  currency: {
    style: 'currency'
    currencyDisplay: 'symbol'
    currency: string
  }
}

export function createI18N(app: App) {
  // @todo want work
  // const i18n = createI18n<{ messages: MessageSchema }, 'en-US'>({
  const i18n = createI18n({
    locale: Quasar.lang.getLocale(),
    fallbackLocale: 'en-US',
    availableLocales: [...Object.keys(messages)],
    messages,
  })
  app.use(i18n)
  return { app, i18n }
}

export const i18t =
  (t: Composer<unknown, unknown, unknown, VueMessageType>['t']) =>
  (message: Messages, ...args: any[]) =>
    t(message, [...args])
