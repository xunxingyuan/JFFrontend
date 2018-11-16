import http from './methods'

let base = '/api/robots'


function addRobotId(data) {
  if(data){
    data['botId'] =  window.sessionStorage.getItem('robotId')
  }else{
    data = {
      botId: window.sessionStorage.getItem('robotId')
    }
  }
  return data
}


export default {
  word: {
    sensitive: {
      getType:  (data) => {
        let url = base + '/config/sensitive/type'
        return http.get(url,data)
      },
      getWords: (data)=>{
        let url = base + '/config/sensitive'
        return http.get(url,data)
      },
      addWord: (data)=>{
        let url = base + '/config/sensitive'
        return http.postForm(url,data)
      },
      updateWord: (data)=>{
        let url = base + '/config/sensitive'
        return http.putMethod(url,data)
      },
      deleteWord: (data)=>{
        let url = base + '/config/sensitive'
        return http.deleteMethod(url,data)
      },
    },
    near:{
      getWords: (data)=>{
        let url = base + '/config/synonym'
        return http.get(url,data)
      },
      createWord: (data)=>{
        let url = base + '/config/synonym'
        return http.postForm(url,data)
      },
      deleteWord: (data)=>{
        let url = base + '/config/synonym'
        return http.deleteMethod(url,data)
      },
      updateWord: (data)=>{
        let url = base + '/config/synonym'
        return http.putMethod(url,data)
      },
      getWordDetail: (data)=>{
        let url = base + '/config/synonym' + '/' + data.wordId
        return http.get(url,data)
      }
    }
  },
  qa: {
    //获取目录节点子目录
    getCategory: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/qa'
      data = addRobotId(data)
      let url = qaBase + '/getCategory'
      return http.postForm(url,data)
    },
    //新建目录
    createCategory: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/qa'
      data = addRobotId(data)
      let url = qaBase + '/saveCategory'
      return http.postNew(url,data)
    },
    //删除目录
    deleteCategory: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/qa'
      data = addRobotId(data)
      let url = qaBase + '/deleteCategory'
      return http.postForm(url,data)
    },
    //获取目录的qa
    getCategoryQa: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/qa'
      data = addRobotId(data)
      let url = qaBase + '/listQuestionByCategory'
      return http.postForm(url,data)
    },
    //未分类QA
    getUnCategoryQa: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/qa'
      data = addRobotId(data)
      let url = qaBase + '/listQuestionByUnCategory'
      return http.postForm(url,data)
    },
    //搜索QA
    searchQa: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/qa'
      data = addRobotId(data)
      let url = qaBase + '/qaSearch'
      return http.postForm(url,data)
    },
    //新建QA与更新QA
    createQa: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/qa'
      data = addRobotId(data)
      let url = qaBase + '/saveQuestion'
      return http.postNew(url,data)
    },
    //删除QA
    deleteQa:(data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/qa'
      data = addRobotId(data)
      let url = qaBase + '/deleteQuestion'
      return http.postForm(url,data)
    },
    //QA生成AIML
    makeAIML:(data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/qa'
      data = addRobotId(data)
      let url = qaBase + '/saveAiml'
      return http.postForm(url,data)
    },
    //获取QA AIML
    getQaAiml:(data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/qa'
      data = addRobotId(data)
      let url = qaBase + '/listAiml'
      return http.postForm(url,data)
    },
    //删除AIML
    deleteAiml:(data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/qa'
      data = addRobotId(data)
      let url = qaBase + '/deleteAiml'
      return http.postForm(url,data)
    },
    //获取QA内容
    getQaDetail: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/qa'
      data = addRobotId(data)
      let url = qaBase + '/getQuestion'
      return http.postForm(url,data)
    },
  }
}