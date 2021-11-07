import { Core } from "node-roon-api";

declare class RoonApiBrowse {
    constructor(core: Core)
    /**
     * Perform a browsing operation.  Use this when the user selects an `Item`
     *
     * @param {object} opts - Options. If none, specify empty object ({}).
     * @param {string} opts.hierarchy         The hierarchy is being browsed. 
     *<pre>
    *            The following values are currently supported:
    *
    *             * "browse" -- If you are exposing a general-purpose browser, this is what you should use
    *             * "playlists" 
    *             * "settings" 
    *             * "internet_radio"
    *             * "albums"
    *             * "artists"
    *             * "genres"
    *             * "composers"
    *             * "search"
    *</pre>
    * @param {string}  [opts.multi_session_key]        If your application browses several instances of the same hierarchy at the same time, you can populate this to distinguish between them. Most applications will omit this field.
    *
    * @param {string}  [opts.item_key]            The key from an `Item` If you omit this, the most recent level will be re-loaded.
    * @param {string}  [opts.input]               Input from the input box
    * @param {string}  [opts.zone_or_output_id]   Zone ID. This is required for any playback-related functionality to work.
    * @param {bool}    [opts.pop_all]             True to pop all levels but the first
    * @param {int}     [opts.pop_levels]          If set, pop n levels
    * @param {bool}    [opts.refresh_list]        If set, refresh the list contents
    *
    * @param {int}     [opts.set_display_offset]  Update the display offset for the current list prior to performing the browse operation
    *<pre>
    *            If true, then the session will be reset so that browsing begins from the root of the hierarchy. 
    *            If this is false or unset, then the core will attempt to resume at the previous browsing position
    *            It is not valid to provide `pop_all` and `item_key` at the same time
    *</pre>
    * @param {RoonApiBrowse~browseresultcallback} [cb] - Called on success or error
    */
    browse(opts: BrowseOption | {}, cb: BrowseResultCallback): void

    /**
     * Retrieve items from a browse level. Item loading is handled separately from browsing. This allows clients to load very large lists in very small increments if needed.
     *
     * @param {object}   opts - Options.
     * @param {int}     [opts.set_display_offset] Update the display offset for the current list
     * @param {int}     [opts.level]              Which level of the browse hierarchy to load from. Defaults to the current (deepest) level.
     * @param {int}     [opts.offset]             Offset into the list where loading should begin. Defaults to 0.
     * @param {int}     [opts.count]              Number of items to load. Defaults to 100.
     * @param {string}   opts.hierarchy           The hierarchy is being browsed. See `browse` for a list of possible values
     * @param {string}  [opts.multi_session_key]  If your application browses several instances of the same hierarchy at the same time, you can populate this to distinguish between them. Most applications will omit this field.
     * @param {RoonApiBrowse~loadresultcallback} [cb] - Called on success or error
     */
    load(opts: LoadOption | {}, cb: LoadResultCallback): void
}

export interface BrowseOption {
    hierarchy: HierarchyType
    multi_session_key?: string
    item_key?: string
    input?: string
    zone_or_output_id?: string
    pop_all?: boolean
    pop_levels?: number
    refresh_list?: boolean
    set_display_offset?: number
}

export interface LoadOption {
    hierarchy: HierarchyType
    set_display_offset?: number
    level?: number
    offset?: number
    count?: number
    multi_session_key?: string
}

export interface BrowseResult {
    action: BrowseAction
    item?: Item
    list?: List
    message?: string
    is_error: boolean
}

export interface LoadResult {
    items: Item[]
    offset: number
    list: List
}

export interface Item {
    title: string
    subtitle?: string
    image_key?: string
    item_key?: string
    hint?: string
    input_prompt?: any
}

export interface List {
    title: string
    count: number
    subtitle?: string
    image_key?: string
    level: number
    display_offset?: number
    hint?: string
}

export type HierarchyType = "browse" | "playlists" | "settings" | "internet_radio" | "albums" |"artists" | "genres" | "composers" | "search"
export type BrowseAction = "message" | "none" | "list" | "replace_item" | "remove_item"
export type BrowseResultCallback = (err: string | false, body: BrowseResult) => void
export type LoadResultCallback = (err: string | false, body: LoadResult) => void

export default RoonApiBrowse