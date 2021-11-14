/// <reference types="node"/>

declare module 'node-roon-api-transport' {
  export default class RoonApiTransport {

    /**
     * Mute/unmute all zones (that are mutable).
     * @param {('mute'|'unmute')} how - The action to take
     * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
     */
    mute_all(how: HowMute, cb?: ResultCallBack): void
  
    /**
     * Pause all zones.
     * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
     */
    pause_all(cb?: ResultCallBack): void
  
    /**
     * Standby an output.
     *
     * @param {Output} output - The output to put into standby
     * @param {object} opts - Options. If none, specify empty object ({}).
     * @param {string} [opts.control_key] - The <tt>control_key</tt> that identifies the <tt>source_control</tt> that is to be put into standby. If omitted, then all source controls on this output that support standby will be put into standby.
     * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
     */
    standby(o: Output, opts: any, cb?: ResultCallBack): void
  
    /**
     * Toggle the standby state of an output.
     *
     * @param {Output} output - The output that should have its standby state toggled.
     * @param {object} opts - Options. If none, specify empty object ({}).
     * @param {string} [opts.control_key] - The <tt>control_key</tt> that identifies the <tt>source_control</tt> that is to have its standby state toggled.
     * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
     */
    toggle_standby(o: Output, opts: any, cb?: ResultCallBack): void
  
    /**
   * Cconvenience switch an output, taking it out of standby if needed.
   *
   * @param {Output} output - The output that should be convenience-switched.
   * @param {object} opts - Options. If none, specify empty object ({}).
   * @param {string} [opts.control_key] - The <tt>control_key</tt> that identifies the <tt>source_control</tt> that is to be switched. If omitted, then all controls on this output will be convenience switched.
   * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
   */
    convenience_switch(o: Output, opts: any, cb?: ResultCallBack): void
    
    /**
   * Mute/unmute an output.
   * @param {Output} output - The output to mute.
   * @param {('mute'|'unmute')} how - The action to take
   * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
   */
    mute(o: Output, how: HowMute, cb?: ResultCallBack): void
  
    /**
   * Change the volume of an output. Grouped zones can have differently behaving
   * volume systems (dB, min/max, steps, etc..), so you have to change the volume
   * different for each of those outputs.
   *
   * @param {Output} output - The output to change the volume on.
   * @param {('absolute'|'relative'|'relative_step')} how - How to interpret the volume
   * @param {number} value - The new volume value, or the increment value or step
   * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
   */
    change_volume(output: Output, how: HowChangeVolume, value: number, cb?: ResultCallBack): void
  
    /**
   * Seek to a time position within the now playing media
   * @param {Zone|Output} zone - The zone or output
   * @param {('relative'|'absolute')} how - How to interpret the target seek position
   * @param {number} seconds - The target seek position
   * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
   */
    seek(z: Zone | Output, how: HowSeek, seconds: number, cb?: ResultCallBack): void
  
    /**
   * Execute a transport control on a zone.
   *
   * <p>Be sure that `is_<control>_allowed` is true on your {Zone} before allowing the user to operate controls</p>
   *
   * @param {Zone|Output} zone - The zone or output
   * @param {('play'|'pause'|'playpause'|'stop'|'previous'|'next')} control - The control desired
   * <pre>
   * "play" - If paused or stopped, start playback
   * "pause" - If playing or loading, pause playback
   * "playpause" - If paused or stopped, start playback. If playing or loading, pause playback.
   * "stop" - Stop playback and release the audio device immediately
   * "previous" - Go to the start of the current track, or to the previous track
   * "next" - Advance to the next track
   * </pre>
   *
   * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
   */
    control(z: Zone | Output, control: ControlType, cb?: ResultCallBack): void
  
    /**
   * Transfer the current queue from one zone to another
   *
   * @param {Zone|Output} fromzone - The source zone or output
   * @param {Zone|Output} tozone - The destination zone or output
   * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
   */
    transfer_zone(fromz: Zone | Output, toz: Zone | Output, cb?: ResultCallBack): void
  
    /**
   * Create a group of synchronized audio outputs
   *
   * @param {Output[]} outputs - The outputs to group. The first output's zone's queue is preserved.
   * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
   */
    group_outputs(outputs: Output[], cb?: ResultCallBack): void
  
    /**
   * Ungroup outputs previous grouped
   *
   * @param {Output[]} outputs - The outputs to ungroup.
   * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
   */
    ungroup_outputs(outputs: Output[], cb?: ResultCallBack): void
  
    /**
   * Change zone settings
   *
   * @param {Zone|Output} zone - The zone or output
   * @param {object} settings - The settings to change
   * @param {boolean} [settings.shuffle] - If present, sets shuffle mode to the specified value
   * @param {boolean} [settings.auto_radio] - If present, sets auto_radio mode to the specified value
   * @param {('loop'|'loop_one'|'disabled'|'next')} [settings.loop] - If present, sets loop mode to the specified value. 'next' will cycle between the settings.
   * @param {RoonApiTransport~resultcallback} [cb] - Called on success or error
   */
    change_settings(z: Zone | Output, settings: ChangeSettingOption, cb?: ResultCallBack): void
  
    subscribe_zones(cb: (cmd: string, data: RoonData) => void): void
  }
  
  export type HowMute = 'mute' | 'unmute'
  export type HowChangeVolume = 'absolute' | 'relative' | 'relative_step'
  export type HowSeek = 'relative' | 'absolute'
  
  export type ControlType = 'play' | 'pause' | 'playpause' | 'stop' | 'previous' | 'next'
  export type LoopType = 'loop'| 'loop_one' | 'disabled' | 'next'
  
  export type ResultCallBack = (m: false | string) => void
  
  export interface RoonData {
    zones_seek_changed?: {
      zone_id: string
      queue_time_remaining: number
      seek_position: number
    }[]
    zones_changed?: Zone[]
    zones?: Zone[]
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
  
  export interface ChangeSettingOption {
    shuffle?: boolean
    auto_radio?: boolean
    loop?: LoopType
  }
}

