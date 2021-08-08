import RoonApi, { MooMessage } from 'node-roon-api'

declare class RoonApiSettings {
    constructor(roon: RoonApi, opts: SettingOption)

    update_settings(settings: any): void
}

export interface SettingOption {
    get_settings: (cb: Function) => void
    save_settings: (req: MooMessage, isdryrun: boolean, settings: any) => void
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

export default RoonApiSettings