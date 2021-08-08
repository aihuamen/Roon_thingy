declare class RoonApiTransport {

  /**
   * Mute/unmute all zones (that are mutable).
   * @param {('mute'|'unmute')} how - The action to take
   * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
   */
  mute_all(how: HowMute, cb: ResultCallBack): void

  /**
   * Pause all zones.
   * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
   */
  pause_all(cb: ResultCallBack): void

  /**
   * Standby an output.
   *
   * @param {Output} output - The output to put into standby
   * @param {object} opts - Options. If none, specify empty object ({}).
   * @param {string} [opts.control_key] - The <tt>control_key</tt> that identifies the <tt>source_control</tt> that is to be put into standby. If omitted, then all source controls on this output that support standby will be put into standby.
   * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
   */
  standby(o: Output, opts: any, cb: ResultCallBack): void

  /**
   * Toggle the standby state of an output.
   *
   * @param {Output} output - The output that should have its standby state toggled.
   * @param {object} opts - Options. If none, specify empty object ({}).
   * @param {string} [opts.control_key] - The <tt>control_key</tt> that identifies the <tt>source_control</tt> that is to have its standby state toggled.
   * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
   */
  toggle_standby(o: Output, opts: any, cb: ResultCallBack): void

  convenience_switch(o: Output, opts: any, cb: ResultCallBack): void

  mute(o: Output, how: HowMute, cb: ResultCallBack): void

  change_volume(output: Output, how: HowChangeVolume, value: number, cb: ResultCallBack): void

  subscribe_zones(cb: (cmd: string, data: RoonData) => void): void
}

export type HowMute = 'mute' | 'unmute'
export type HowChangeVolume = 'absolute' | 'relative' | 'relative_step'

export type ResultCallBack = (m: false | string) => void

export interface RoonData {
  zones_seek_changed?: {
    zone_id: string
    queue_time_remaining: number
    seek_position: number
  }[]
  zones_changed?: Zone[]
}
  
export interface Zone {
  zone_id: string
  display_name: string
  outputs: Output[]
  state: 'playing' | 'paused' | 'loading' | 'stopped'
  is_next_allowed: boolean
  is_previous_allowed: boolean
  is_pause_allowed: boolean
  is_seek_allowed: boolean
  queue_items_remaining: number
  queue_times_remaining: number
  settings: {
    loop: 'loop' | 'loop_one' | 'disabled'
    shuffle: boolean
    auto_radio: boolean
  }
  now_playing: MusicStatus
}
  
export interface Output {
  output_id: string
  zone_id: string
  can_group_with_output_ids: string[]
  display_name: string
  volume: {
    type: 'number' | 'db' | 'incremental'
    min: number
    max: number
    value: number
    step: number
    is_muted: boolean
    hard_limit_min: number
    hard_limit_max: number
    soft_limit: number
  }
  source_controls: {
    control_key: string
    display_name: string
    supports_standby: boolean
    status: string
  }[]
}
  
export interface MusicStatus {
  seek_position: number
  length: number
  one_line: {
    line1: string
  }
  two_line: {
    line1: string
    line2: string
  }
  three_line: {
    line1: string
    line2: string
    line3: string
  }
  image_key: string
}

export default RoonApiTransport