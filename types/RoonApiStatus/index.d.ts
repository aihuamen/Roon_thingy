import RoonApi from 'node-roon-api'

declare class RoonApiStatus {
    constructor(roon: RoonApi)

    set_status(message: string, is_error: boolean): void
}

export default RoonApiStatus