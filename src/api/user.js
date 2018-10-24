import http from './methods'

let url = '/api/user'

export default {
  getUser: (data)=>{
    return http.get(url,data)
  }
}