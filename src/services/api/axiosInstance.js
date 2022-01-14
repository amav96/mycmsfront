import axios from "axios";
import router from "../../router";
import {baseUrl} from '@/services/api/BaseUrl'

const axiosInstance = axios.create({
     baseURL : baseUrl().apicms
});

axiosInstance.interceptors.request.use(
  
    function (config) {
      // Do something before request is sent
      // config.headers.common['interceptorheader'] = 'Interceptor Header';
      return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
  
  axiosInstance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
  
      if(error.response.status === 401){
                const getToken = localStorage.getItem('auth')
                if(getToken !== null){ localStorage.removeItem('auth') }
                router.push('/login')
      }
    
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

export default axiosInstance;