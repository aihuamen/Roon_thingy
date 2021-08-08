import type RoonApiTransport from 'node-roon-api-transport'
import type RoonApiStatus from 'node-roon-api-status'
import type RoonApiSettings from 'node-roon-api-settings'
import type RoonApiBrowse from 'node-roon-api-browse'

declare class RoonApi {
    constructor(o: RoonApiConstructor)

    init_services: (o?: RoonInitServices) => void
    start_discovery: () => void
    save_config: (key: string, value: Record<string,any>) => void
    load_config: <T extends Record<string,any> = {}>(key: string) => T
}

export interface MooMessage {
    moo: any
    msg: any
    body: any

    send_continue(name: string, body?: any, content_type?: any): void
    send_complete(name: string, body?: any, content_type?: any): void
}

export interface RoonApiConstructor {
    extension_id: string
    display_name: string
    display_version: string
    publisher: string
    email: string
    website: string
    core_paired?: (core: Core) => void
    core_found?: (core: Core) => void
    core_unpaired?: (core: Core) => void
    core_lost?: (core: Core) => void
}
 
export interface RoonInitServices {
    required_services?: RoonRequiredServices[]
    optional_services?: any[]
    provided_services?: RoonProvidedServices[]
}

export interface RoonService {
    RoonApiTransport?: RoonApiTransport
    RoonApiBrowse?: RoonApiBrowse
}

export interface Core {
    moo: any
    core_id: string
    display_name: string
    display_version: string
    services: RoonService
}

export type RoonRequiredServices = ThisType<RoonApiTransport | RoonApiBrowse>
export type RoonProvidedServices = RoonApiStatus | RoonApiSettings

export default RoonApi