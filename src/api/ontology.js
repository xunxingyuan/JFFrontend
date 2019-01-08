import http from './methods'


export default {
  //语义网树
  setSemanticTree: (data,type)=>{
    let url = '/api/ontology'
    if(type==='get'){
      return http.get(url,data)
    }else if(type=== 'delete'){
      url += '/'+ data.ontologyId
      return http.deleteMethod(url,data)
    }else if(type==='update'){
      url += '/'+ data.ontologyId
      return http.putMethod(url,data)
    }else if(type === 'create'){
      return http.postForm(url,data)
    }else if(type === 'release'){
      url += '/'+ data.ontologyId + '/release'
      return http.postForm(url,data)
    }else if(type === 'detail'){
      url += '/getOntology'
      return http.get(url,data)
    }else if(type === 'version'){
      url += '/' + data.ontologyId + '/version'
      return http.get(url,data)
    }else if(type === 'rollback'){
      url += '/' + data.ontologyId + '/version/rollback'
      return http.postForm(url,data)
    }
  },
  //语义网类信息控制
  setSemanticClass: (data,type)=>{
    let url = '/api/'+ data.ontologyId+ '/classes'
    // let url= '/backServer/editor/classes'
    if(type === 'get'){
      return http.get(url,data)
    }else if(type === 'update'){
      return http.putMethod(url,data)
    }
  },
  //语义网类树
  setSemanticClassTree: (data,type)=>{
    let url = '/api/'+ data.ontologyId+ '/classes/tree'
    // let url = '/backServer/editor/classes/tree'
    if(type === 'delete'){
      return http.deleteMethod(url,data)
    }else if(type === 'get'){
      return http.get(url,data)
    }else if(type === 'create'){
      return http.postForm(url,data)
    }else if(type === 'update'){
      return http.putMethod(url,data)
    }else if(type === 'search'){
      return http.get('/api/'+data.ontologyId+'/classes/tree/search',data)
    }else if(type === 'getNode'){
      url += '/parentList'
      return http.get(url,data)
    }
  },
  //语义网树属性
  setSemanticProperty: (data,type)=> {
    let url = '/api/' + data.ontologyId + '/property'
    if (type === 'get') {
      return http.get(url, data)
    } else if (type === 'delete') {
      return http.deleteMethod(url, data)
    } else if (type === 'create') {
      return http.postForm(url, data)
    } else if (type === 'update') {
      return http.putMethod(url, data)
    } else if (type === 'list') {
      url = '/api/' + data.ontologyId + '/properties'
      return http.get(url, data)
    }
  },
  //语义网实例
  setSemanticInstance: (data,type)=>{
    let url = '/api/'+ data.ontologyId + '/classes/instance'
    if (type === 'get'){
      url += '/all'
      return http.get(url,data)
    }else if(type === 'getDetail'){
      return http.get(url,data)
    }else if(type === 'delete'){
      return http.deleteMethod(url,data)
    }else if(type === 'create'){
      return http.postForm(url,data)
    }else if(type === 'update'){
      return http.putMethod(url,data)
    }
  }
}