/// <reference types="node"/>

declare module 'node-roon-api-status' {
  import RoonApi from 'node-roon-api'

  export default class RoonApiStatus {
    constructor(roon: RoonApi)

    set_status(message: string, is_error: boolean): void
  }
}


