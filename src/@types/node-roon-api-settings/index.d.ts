/// <reference types="node"/>

declare module 'node-roon-api-settings' {
  import RoonApi, { MooMessage } from 'node-roon-api'

  export default class RoonApiSettings {
    constructor(roon: RoonApi, opts: SettingOption)

    update_settings(settings: any): void
  }

  export type GetSettingCallback = (s: RoonSetting) => void

  export interface SettingOption {
    get_settings: (cb: GetSettingCallback) => void
    save_settings: (req: MooMessage, isdryrun: boolean, settings: RoonSetting) => void
  }

  export interface RoonSetting {
    values: SettingValues
    layout: SettingLayout[]
    has_error: boolean
  }

  export interface SettingValues {
    [k: string]: any
  }

  export interface SettingLayout {
    type: string
    title: string
    setting?: string  
  }
}

