import axios from 'axios';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

/**
 * @type {AxiosLocalStorageAdapterOptions}
 */

var options = {
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

var K_LAST_MODIFIED = '';
/**
 * @type {string} key for url prefix
 */

var K_URL_PREFIX = '';
/**
 * @type {Object} like AxiosDefaultAdapter
 */

var adapter;
/**
 * if url doesn't need to cache
 * @param {string} url request's url
 * @returns {boolean} return true if url doesn't need to cache
 */

function isExcluded(url) {
  var exclude = options.exclude;

  if (exclude) {
    var excludeList = Array.isArray(exclude) ? exclude : [exclude];
    var isMatched = excludeList.some(function (item) {
      return typeof item === 'string' && url.startsWith(item) || typeof item === 'function' && item(url) || Object.prototype.toString.call(item) === '[object RegExp]' && item.test(url);
    });
    return isMatched;
  }

  return false;
}
/**
 * clear the localStorage cache which prefix `options.name` to.
 */


function clearStorage() {
  Object.keys(localStorage).filter(function (key) {
    return key.startsWith(options.name);
  }).forEach(function (key) {
    return localStorage.removeItem(key);
  });
}
/**
 * axios `get` with cache enhanced
 * @param {AxiosRequestConfig} config axiosConfig
 * @returns {AxiosPromise}
 */


function requestGet(_x) {
  return _requestGet.apply(this, arguments);
}
/**
 * axios adapter, ref: https://github.com/axios/axios/tree/master/lib/adapters
 * @param {AxiosRequestConfig} config
 * @returns {AxiosPromise}
 */


function _requestGet() {
  _requestGet = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(config) {
    var res, data, cachedData, lastModified, V_URL_NEW, V_LAST_MODIFIED_NEW;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return options.adapter(config);

          case 3:
            res = _context.sent;
            data = res.data; // only cache it when request successful

            if (data) {
              try {
                cachedData = JSON.parse(data);
              } catch (e) {
                cachedData = data;
              } // only cache it when `typeof data === 'string'` or `data.status === 0` or `data.code === 0`


              if (typeof cachedData === 'string' || _typeof(cachedData) === 'object' && (cachedData.status === 0 || cachedData.code === 0)) {
                try {
                  lastModified = new Date().getTime();
                  V_URL_NEW = JSON.stringify({
                    lastModified: lastModified,
                    data: cachedData
                  });
                  V_LAST_MODIFIED_NEW = lastModified;
                  localStorage.setItem(config.K_URL, V_URL_NEW);
                  localStorage.setItem(K_LAST_MODIFIED, V_LAST_MODIFIED_NEW);
                } catch (e) {
                  if (options.clearOnError) {
                    clearStorage();
                  }
                }
              }
            }

            return _context.abrupt("return", res);

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", _context.t0);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 9]]);
  }));
  return _requestGet.apply(this, arguments);
}

function cacheAdapter(_x2) {
  return _cacheAdapter.apply(this, arguments);
}
/**
 * do something with localstorage on init
 */


function _cacheAdapter() {
  _cacheAdapter = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(config) {
    var url, _config$params, params, method, K_URL, V_URL, lastRequst, response;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            url = config.url, _config$params = config.params, params = _config$params === void 0 ? {} : _config$params, method = config.method; // only cache GET request, or return default adapter

            if (!(method.toLowerCase() !== 'get')) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return", options.adapter(config));

          case 3:
            if (!isExcluded(url)) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", options.adapter(config));

          case 5:
            // the key will be like `default_cache_url_/api/getUserInfo?name=zphhhhh&id=137181`
            K_URL = "".concat(K_URL_PREFIX + url, "?").concat(Object.entries(params).map(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  k = _ref2[0],
                  v = _ref2[1];

              return "".concat(k, "=").concat(v);
            }).join('&'));
            V_URL = localStorage.getItem(K_URL);
            config.K_URL = K_URL; // if cache none, just request continue

            if (V_URL) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", requestGet(config));

          case 10:
            // if there is a cache, determine whether cache could be used
            lastRequst = JSON.parse(V_URL);

            if (!(lastRequst.lastModified + options.maxAge > new Date().getTime())) {
              _context2.next = 14;
              break;
            }

            // if cache not expired
            response = {
              data: lastRequst.data,
              status: 200,
              statusText: 'OK',
              _from_localstorage: true,
              config: config
            };
            return _context2.abrupt("return", response);

          case 14:
            // if cache expired
            localStorage.removeItem(K_URL);
            return _context2.abrupt("return", requestGet(config));

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _cacheAdapter.apply(this, arguments);
}

function initAdapter() {
  if (!options.cache) {
    adapter = options.adapter;
    return;
  }

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('test', 't');
      localStorage.removeItem('test');
    }
  } catch (e) {
    adapter = options.adapter;
    return;
  }

  adapter = cacheAdapter;
  K_LAST_MODIFIED = "".concat(options.name, "_config_last_modified");
  K_URL_PREFIX = "".concat(options.name, "_url_");
  var V_LAST_MODIFIED = localStorage.getItem(K_LAST_MODIFIED);
  var expiredTime = parseInt(V_LAST_MODIFIED, 10) + options.maxAge; // clear all data if expired

  if (expiredTime < new Date().getTime()) {
    clearStorage();
  }
}
/**
 * init AxiosLocalStorageAdapter and return the adapter
 * @param {AxiosLocalStorageAdapterOptions} opts custom options
 * @return {Object} axios adapter
 */


function AxiosLocalStorageAdapter(opts) {
  Object.assign(options, opts);
  initAdapter();
  return adapter;
}

export default AxiosLocalStorageAdapter;
