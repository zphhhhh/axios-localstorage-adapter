# axios-localstorage-adapter
🚀Caching adapter for axios. Store request results in localStorage to prevent unneeded network requests. Just 1 KB.

### Install

``` shell
npm i -D axios-localstorage-adapter
```

### Use

``` javascript
import axios from 'axios';
import axiosLocalStorageAdapter from 'axios-localstorage-adapter';

const instance = axios.create({
    adapter: axiosLocalStorageAdapter({
        maxAge: 1000 * 60 * 3
    })
});
```

### What it does?

This adapter cache your HTTP request if possible, depending on:

1. The `window.localStorage` could be used, or it would fallback to axios default adapter.
2. It's a `GET` request, and:
    - response status is 200 OK
    - response body is not empty, further if json, `data.status` or `data.code` should be `0`

and it will store like:

|  key   | value |
|  ----  | ----  |
| axios_cache_config_last_modified      | 1575957622186 |
| axios_cache_url_/api/getUserInfo      | {"lastModified": 1575957622186, "data": {"status": 0, "msg": "", "data": {"name": "zphhhhh"} }} |
| axios_cache_url_/api/getBook?id=1107  | {"lastModified": 1575957622136, "data": {"status": 0, "msg": "", "data": {"title": "deep in es6"} }} |
| axios_cache_url_/xxx                  | {"lastModified": 1575957622116, "data": {"status": 0, "msg": "", "data": {}} |
| ...                                   | ... |

it will clear all the cache until expired time or localstorage error by default.

### Options

``` typescript
interface axiosLocalStorageAdapterOptions {
    /** set cache name as localstorage's key's prefix, default to 'axios_cache' */
    name?: string,
    /** set max age for cache, default to 1 hour */
    maxAge?: number,
    /** set exclude condition, default to [] */
    exclude?: string| RegExp | Function | (string|RegExp|Function)[],
    /** set if clear on localstorage's error, detault to true */
    clearOnError?: boolean,
    /** set default adapter, default to axios.defaults.adapter */
    adapter?: AxiosAdapter
}
```