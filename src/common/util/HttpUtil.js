import axios from 'axios';
import ServerResponse from '../model/ServerResponse';
import HttpError from '../model/HttpError';

// 创建axios实例
const http = axios.create({timeout: 1000 * 12});
// 启用cookie
http.defaults.withCredentials = true;

const getUrlParams = (url, params) => {
    if (params) {
        const paramsArray = [];
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&');
        } else {
            url += '&' + paramsArray.join('&');
        }
    }
    return url;
};

/**
 * http请求响应码200，需要处理服务逻辑错误
 */
const handleResponse = (response, resolve, reject) => {
    if (response.success) {
        // 服务端的逻辑正确
        resolve(response);
    } else {
        // 服务端的逻辑错误
        reject(response);
    }
};

/**
 * 此处会把http响应处理成为 ServerResponse对象
 * 也会把http error 处理成为 HttpError对象
 * 这样上层使用统一方便
 * @see ServerResponse
 * @see HttpError
 */
const handlePromise = (promise, resolve, reject) => {
    promise
        .then(response => new ServerResponse(response.data)) // 把http服务端响应数据封装为 @see ServerResponse 对象
        .then(response => handleResponse(response, resolve, reject)) // 需要处理服务逻辑错误

        // 把HttpResponseError处理成为 HttpError对象
        .catch(error => {
            window.console.log('HttpUtil->handlePromise->catch', error);
            const status = error.response ? error.response.status : '500';
            let statusText = error.response ? error.response.statusText : '系统错误，请稍后再试！';
            reject(new HttpError(status, statusText));
        });
};

const doGet = (url, options, resolve, reject) => {
    const promise = http.get(url, options);
    handlePromise(promise, resolve, reject);
};

const doPost = (url, body, options, resolve, reject) => {
    const promise = http.post(url, body, options);
    handlePromise(promise, resolve, reject);
};

export default class HttpUtil {
    static get = (url, params, options) => {
        url = getUrlParams(url, params);
        return new Promise((resolve, reject) => doGet(url, options, resolve, reject));
    };
    static post = (url, body, options) => {
        return new Promise((resolve, reject) => doPost(url, body, options, resolve, reject));
    };
}
