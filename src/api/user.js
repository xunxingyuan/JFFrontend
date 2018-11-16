import http from './methods'


export default {
  login:(data)=>{
    return http.postForm('/api/authentication/login',data)
  },
  logout: ()=>{
    return http.get('/api/authentication/logout')
  },
  register: (data)=>{
    return http.postForm('/api/authentication/register',data)
  },
}