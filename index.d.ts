interface AxiosLocalStorageAdapterOptions {
    /** set cache name as localstorage's key's prefix, default to 'axios_cache' */
    name?: string,
    /** set max age for cache, default to 1 hour */
    maxAge?: number,
    /** set exclude condition, default to [] */
    exclude?: string| RegExp | Function | (string|RegExp|Function)[],
    /** set if clear on localstorage's error, detault to true */
    clearOnError?: boolean,
    /** set default adapter, default to axios.defaults.adapter */
    adapter?: axios.defaults.adapter
}

export declare function AxiosLocalStorageAdapter(opts: AxiosLocalStorageAdapterOptions): AxiosAdapter