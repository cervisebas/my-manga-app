import axios from 'axios';
import { UserAgents } from '../shared/constants/UserAgents';

axios.interceptors.request.use(function (config) {
  config.headers['User-Agent'] = UserAgents.DEFAULT;

  return config;
});
