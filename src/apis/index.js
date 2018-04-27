
import qs from 'qs';
import { $ } from '../utils/index';
import apiUrl from './congfig.js';

const Api = {}
Api.getTestList = postData => $.post(apiUrl.getTestList, qs.stringify(postData));

export default Api;