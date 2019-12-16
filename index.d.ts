interface AxiosLocalStorageAdapterOptions {
    /** set cache name as localstorage's key's prefix, default to 'axios_cache' */
    name?: string,
    /** set max age for cache, default to 1 hour */
    maxAge?: number,
    /** set exclude condition, default to [] */
    exclude?: string| RegExp | Function | (string|RegExp|Function)[],
    /** set if clear on localstorage's error, default to true */
    clearOnError?: boolean,
    /** set default adapter, default to axios.defaults.adapter */
    adapter?: AxiosAdapter,
    /** set false to cache no request in development, default to true */
    cache?: boolean
}

export declare function AxiosLocalStorageAdapter(opts: AxiosLocalStorageAdapterOptions): AxiosAdapter