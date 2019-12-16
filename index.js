import axios from 'axios';

/**
 * @type {AxiosLocalStorageAdapterOptions}
 */
const options = {
    /** @type {string} cache name as localstorage's key's prefix */
    name: 'axios_cache',
    /** @type {number} default to 1 hour */
    maxAge: 60 * 60 * 1000,
    /** @type {string|RegExp|Function|(string|RegExp|Function)[]} exclude some urls */
    exclude: [],
    /** @type {boolean} if clear on localstorage's error */
    clearOnError: true,
    /** @type {AxiosAdapter} default adapter, default to axios.defaults.adapter */
    adapter: axios.defaults.adapter,
    /** @type {boolean} default to true to cache request, generally we may use it in development but not production */
    cache: true
};

/**
 * @type {string} key for last-modified
 */
let K_LAST_MODIFIED = '';

/**
 * @type {string} key for url prefix
 */
let K_URL_PREFIX = '';

/**
 * @type {Object} like AxiosDefaultAdapter
 */
let adapter;

/**
 * if url doesn't need to cache
 * @param {string} url request's url
 * @returns {boolean} return true if url doesn't need to cache
 */
function isExcluded(url) {
    const exclude = options.exclude;
    if (exclude) {
        const excludeList = Array.isArray(exclude) ? exclude : [exclude];
        const isMatched = excludeList.some(
            item =>
                (typeof item === 'string' && url.startsWith(item)) ||
                (typeof item === 'function' && item(url)) ||
                (Object.prototype.toString.call(item) === '[object RegExp]' && item.test(url))
        );
        return isMatched;
    }

    return false;
}

/**
 * clear the localStorage cache which prefix `options.name` to.
 */
function clearStorage() {
    Object.keys(localStorage)
        .filter(key => key.startsWith(options.name))
        .forEach(key => localStorage.removeItem(key));
}

/**
 * axios `get` with cache enhanced
 * @param {AxiosRequestConfig} config axiosConfig
 * @returns {AxiosPromise}
 */
async function requestGet(config) {
    try {
        const res = await options.adapter(config);
        const data = res.data;
        // only cache it when request successful
        if (data) {
            let cachedData;
            try {
                cachedData = JSON.parse(data);
            } catch (e) {
                cachedData = data;
            }

            // only cache it when `typeof data === 'string'` or `data.status === 0` or `data.code === 0`
            if (
                typeof cachedData === 'string' ||
                (typeof cachedData === 'object' && (cachedData.status === 0 || cachedData.code === 0))
            ) {
                try {
                    const lastModified = new Date().getTime();
                    const V_URL_NEW = JSON.stringify({lastModified, data: cachedData});
                    const V_LAST_MODIFIED_NEW = lastModified;
                    localStorage.setItem(config.K_URL, V_URL_NEW);
                    localStorage.setItem(K_LAST_MODIFIED, V_LAST_MODIFIED_NEW);
                } catch (e) {
                    if (options.clearOnError) {
                        clearStorage();
                    }
                }
            }
        }
        return res;
    } catch (rej) {
        return rej;
    }
}

/**
 * axios adapter, ref: https://github.com/axios/axios/tree/master/lib/adapters
 * @param {AxiosRequestConfig} config
 * @returns {AxiosPromise}
 */
async function cacheAdapter(config) {
    const {url, params = {}, method} = config;
    // only cache GET request, or return default adapter
    if (method.toLowerCase() !== 'get') {
        return options.adapter(config);
    }

    // if excluded, return default adapter
    if (isExcluded(url)) {
        return options.adapter(config);
    }

    // the key will be like `default_cache_url_/api/getUserInfo?name=zphhhhh&id=137181`
    const K_URL = `${K_URL_PREFIX + url}?${Object.entries(params)
        .map(([k, v]) => `${k}=${v}`)
        .join('&')}`;
    const V_URL = localStorage.getItem(K_URL);

    config.K_URL = K_URL;

    // if cache none, just request continue
    if (!V_URL) {
        return requestGet(config);
    }

    // if there is a cache, determine whether cache could be used
    const lastRequst = JSON.parse(V_URL);
    if (lastRequst.lastModified + options.maxAge > new Date().getTime()) {
        // if cache not expired
        const response = {
            data: lastRequst.data,
            status: 200,
            statusText: 'OK',
            _from_localstorage: true,
            config
        };
        return response;
    }
    // if cache expired
    localStorage.removeItem(K_URL);
    return requestGet(config);
}

/**
 * do something with localstorage on init
 */
function initAdapter() {
    if (!options.cache) {
        adapter = options.adapter;
        return;
    }

    try {
        localStorage.setItem('test', 't');
        localStorage.removeItem('test');
    } catch (e) {
        adapter = options.adapter;
        return;
    }

    adapter = cacheAdapter;

    K_LAST_MODIFIED = `${options.name}_config_last_modified`;
    K_URL_PREFIX = `${options.name}_url_`;

    const V_LAST_MODIFIED = localStorage.getItem(K_LAST_MODIFIED);
    const expiredTime = parseInt(V_LAST_MODIFIED, 10) + options.maxAge;

    // clear all data if expired
    if (expiredTime < new Date().getTime()) {
        clearStorage();
    }
}

/**
 * init AxiosLocalStorageAdapter and return the adapter
 * @param {AxiosLocalStorageAdapterOptions} opts custom options
 * @return {Object} axios adapter
 */
export default function AxiosLocalStorageAdapter(opts) {
    Object.assign(options, opts);
    
    initAdapter();

    return adapter;
}
