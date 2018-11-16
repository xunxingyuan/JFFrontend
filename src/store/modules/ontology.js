import api from '../../api/index'


const ontology = {
  state:{
    ontologyList: [],
    selectOntology: '',
    ontologyTree:[],
    selectOntologyNode: '',
    ontologyPropertyList: [],
    selectedClassMsg:'',
    selectedClassInstance:[]
  },
  getters:{
    getOntologyList: (state) => state.ontologyList,
    getSelectOntology: (state)=> state.selectOntology,
    getOntologyTree: (state)=> state.ontologyTree,
    getSelectOntologyNode: (state)=> state.selectOntologyNode,
    getPropertyList: (state)=> state.ontologyPropertyList,
    getSelectedClassMsg:(state) => state.selectedClassMsg,
    getSelectedClassInstance: (state)=> state.selectedClassInstance
  },
  actions:{
    setOntologyList: ({commit},data)=>{
      commit('setOntologyList',data)
    },
    updateOntologyList: ({commit})=>{
      api.ontology.setSemanticTree('','get').then((res)=>{
        if(res.code === 'ok'){
          commit('setOntologyList',res.projects)
        }
      })
    },
    setSelectOntology: ({commit},data)=>{
      commit('setSelectOntology',data)
      let reqData = {
        ontologyId: data.projectId
      }
      api.ontology.setSemanticProperty(reqData,'list').then((res)=>{
        if(res.code === 'ok'){
          commit('setPropertyList',res.result)
        }
      })
    },
    setOntologyTree: ({commit},data)=>{
      commit('setOntologyTree',data)
    },
    updateOntologyTree: ({commit},data)=>{
      commit('updateOntologyTree',data)
    },
    setSelectOntologyNode: ({commit},data)=>{
      commit('setSelectOntologyNode',data)
    },
    updateSelectOntologyNode: ({commit,state})=>{
      api.ontology.setSemanticClass({
        ontologyId: state.selectOntology.projectId,
        selection: '('+ state.selectOntologyNode.subject.iri +')'
      },'get').then((res)=>{
        if(res.code==='ok'){
          commit('setSelectOntologyNode',res.frame)
        }
      })
    },
    updatePropertyList: ({commit,state})=>{
      api.ontology.setSemanticProperty({
        ontologyId: state.selectOntology.projectId
      },'list').then((res)=>{
        if(res.code === 'ok'){
          commit('setPropertyList',res.result)
        }
      })
    },
    setSelectedClassMsg: ({commit},data)=>{
      commit('changeSelectedClassMsg',data)
    },
    setSelectedClassInstance: ({commit},data)=>{
      commit('setSelectedClassInstance',data)
    },
  },
  mutations:{
    setOntologyList: (state,data)=>{
      state.ontologyList = data
    },
    setSelectOntology: (state,data)=>{
      state.selectOntology= data
    },
    setOntologyTree: (state,data)=>{
      state.ontologyTree = data
    },
    updateOntologyTree: (state,data)=>{
      state.ontologyTree.forEach((e)=>{
        setTreeChild(e,data.id,data.child)
      })
    },
    setSelectOntologyNode: (state,data)=>{
      state.selectOntologyNode = data
    },
    setPropertyList: (state,data)=>{
      state.ontologyPropertyList = data
    },
    changeSelectedClassMsg:(state,data)=>{
      state.selectedClassMsg = data
    },
    setSelectedClassInstance:(state,data)=>{
      state.selectedClassInstance = data
    }
  }
}

function setTreeChild(item,id,data) {
  if(item.id === id){
    if(item.child&&item.child.length!==0){
      // item.show = !item.show
    }else{
      item.child = data
    }
  }else if(item.child&&item.child.length!==0){
    item.child.forEach((e)=>{
      setTreeChild(e,id,data)
    })
  }
}

export default ontology