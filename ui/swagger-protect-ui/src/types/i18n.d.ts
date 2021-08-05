import 'vue-i18n'

declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage {
    home: string
    buttons: {
      entry: string
      accept: string
    }
    inputs: {
      login: string
      password: string
    }
    notifications: {
      allow_cookie: string
    }
    errors: {
      must_be_not_empty: string
    }
  }
  // define the datetime format schema
  export interface DefineDateTimeFormat {
    short: {
      hour: 'numeric'
      minute: 'numeric'
      second: 'numeric'
      timeZoneName: 'short'
      timezone: string
    }
  }

  // define the number format schema
  export interface DefineNumberFormat {
    currency: {
      style: 'currency'
      currencyDisplay: 'symbol'
      currency: string
    }
  }
}
