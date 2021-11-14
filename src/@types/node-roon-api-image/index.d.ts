/// <reference types="node"/>

declare module 'node-roon-api-image' {
  import { Core } from "node-roon-api";

  /**
   * Roon API Image Service
   * @class RoonApiImage
   * @param {Core} core - The Core providing the service
   */
  export default class RoonApiImage {
    constructor(core: Core)

    get_image(image_key: string, cb: ImageResultCallback): void
    get_image(image_key: string, options: ImageOption, cb: ImageResultCallback): void
  }

  export type ImageResultCallback = (error: string | false, content_type: string, image: Buffer) => void

  export interface ImageOption {
    scale?: 'fit' | 'fill' | 'stretch'
    width?: number
    height?: number
    format?: 'image/jpeg' | 'image/png'
  }
}