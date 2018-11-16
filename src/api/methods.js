import Qs from 'qs'
import request from '@/utils/request'


export default {
  get: (url,data)=>{
    return request.get(url,{
      params: data
    })
  },
  post: (url,data)=>{
    return request.post(url,data)
  },
  postNew:(url,data)=>{
    let reqData = Qs.stringify(data);
    return request.post(url,data)
  },
  postForm: (url,data)=>{
    let reqData = Qs.stringify(data);
    return request.post(url,reqData,{headers:{'Content-Type':'application/x-www-form-urlencoded'}})
  },
  deleteMethod: (url,data)=>{
    return request.delete(url,{
      params: data
    })
  },
  putMethod: (url,data)=>{
    let reqData = Qs.stringify(data);
    return request.put(url,reqData,{headers:{'Content-Type':'application/x-www-form-urlencoded'}})
  }
}