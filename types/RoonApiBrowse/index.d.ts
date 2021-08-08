import { Core } from "node-roon-api";

declare class RoonApiBrowse {
    constructor(core: Core)

    browse(opts: BrowseOption | {}, cb: BrowseResultCallback): void
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