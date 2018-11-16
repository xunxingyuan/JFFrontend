import http from './methods'

let url = '/api/service/robot'

export default {
  //新增服务
  createService: (data)=>{
    return http.postForm('/api/service/robot/register',data)
  },
  //更新服务
  updateService: (data)=>{
    return  http.putMethod('/api/service/robot',data)
  },
  //删除服务
  deleteService: (data)=>{
    return  http.deleteMethod('/api/service/robot',data)
  },
  //获取服务配置
  getServiceConfig: (data)=>{
    return  http.get('/api/service/robot/configuration',data)
  },
  //更新服务配置
  updateServiceConfig: (data)=>{
    return  http.postForm('/api/service/robot/configuration',data)
  },
  //获取机器人可订阅服务
  getRobotOrderList: (data)=>{
    return  http.get('/api/service/robot/page/opened',data)
  },
  //获取用户所有服务
  getUserService: (data)=>{
    return  http.get('/api/service/robot/page/visible',data)
  },
  //获取机器人服务
  getService: (data)=>{
    return  http.get('/api/service/robot/page',data)
  },
  //机器人订阅服务
  robotSub: (data)=>{
    return  http.postForm('/api/service/robot/subscription',data)
  },
  //机器人取消订阅服务
  robotSubCancel: (data)=>{
    return  http.deleteMethod('/api/service/robot/subscription',data)
  },
  //机器人启动服务
  robotServiceStart: (data)=>{
    return  http.putMethod('/api/service/robot/subscription/enable',data)
  },
  //发布服务
  releaseService: (data)=>{
    return  http.get('/api/service/robot/release',data)
  },
  //取消发布
  cancelReleaseService : (data)=>{
    return  http.deleteMethod('/api/service/robot/release',data)
  },
}