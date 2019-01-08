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
      //同步数据
      syncData:(data)=>{
        let url = base + '/config/sensitive/sync'
        return http.postForm(url,data)
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
      },
      //同步数据
      syncData:(data)=>{
        let url = base + '/config/synonym/sync'
        return http.postForm(url,data)
      },
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
    //搜索QA
    searchQaNew: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/qa'
      data = addRobotId(data)
      let url = qaBase + '/listConditionalQuestion'
      return http.post(url,data)
    },
    //新建QA与更新QA
    createQa: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/qa'
      data = addRobotId(data)
      let url = qaBase + '/saveQuestion'
      return http.postNew(url,data)
    },
    //新建QA并生成AIML
    createQaAiml:(data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/qa'
      data = addRobotId(data)
      let url = qaBase + '/saveQuestionAndUpdateStatus'
      return http.postNew(url,data)
    },

    //全局AIML
    updateQaAiml:(data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/qa'
      data = addRobotId(data)
      let url = qaBase + '/updateQuestionStatus'
      return http.post(url,data)
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
  },
  //寒暄
  greeting: {
    //获取目录节点子目录
    getCategory: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/greeting'
      data = addRobotId(data)
      let url = qaBase + '/getCategory'
      return http.postForm(url,data)
    },
    //新建目录
    createCategory: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/greeting'
      data = addRobotId(data)
      let url = qaBase + '/saveCategory'
      return http.postNew(url,data)
    },
    //删除目录
    deleteCategory: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/greeting'
      data = addRobotId(data)
      let url = qaBase + '/deleteCategory'
      return http.postForm(url,data)
    },
    //获取目录的greeting
    getCategoryQa: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/greeting'
      data = addRobotId(data)
      let url = qaBase + '/listQuestionByCategory'
      return http.postForm(url,data)
    },
    //未分类greeting
    getUnCategoryQa: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/greeting'
      data = addRobotId(data)
      let url = qaBase + '/listQuestionByUnCategory'
      return http.postForm(url,data)
    },
    //搜索greeting
    searchQa: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/greeting'
      data = addRobotId(data)
      let url = qaBase + '/qaSearch'
      return http.postForm(url,data)
    },
    //搜索greeting
    searchQaNew: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/greeting'
      data = addRobotId(data)
      let url = qaBase + '/listConditionalQuestion'
      return http.post(url,data)
    },
    //新建greeting与更新greeting
    createQa: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/greeting'
      data = addRobotId(data)
      let url = qaBase + '/saveQuestion'
      return http.postNew(url,data)
    },
    //新建QA并生成AIML
    createQaAiml:(data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/greeting'
      data = addRobotId(data)
      let url = qaBase + '/saveQuestionAndUpdateStatus'
      return http.postNew(url,data)
    },

    //全局AIML
    updateQaAiml:(data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/greeting'
      data = addRobotId(data)
      let url = qaBase + '/updateQuestionStatus'
      return http.post(url,data)
    },
    //删除QA
    deleteQa:(data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/greeting'
      data = addRobotId(data)
      let url = qaBase + '/deleteQuestion'
      return http.postForm(url,data)
    },
    //QA生成AIML
    makeAIML:(data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/greeting'
      data = addRobotId(data)
      let url = qaBase + '/saveAiml'
      return http.postForm(url,data)
    },
    //获取QA AIML
    getQaAiml:(data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/greeting'
      data = addRobotId(data)
      let url = qaBase + '/listAiml'
      return http.postForm(url,data)
    },
    //删除AIML
    deleteAiml:(data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/greeting'
      data = addRobotId(data)
      let url = qaBase + '/deleteAiml'
      return http.postForm(url,data)
    },
    //获取QA内容
    getQaDetail: (data)=>{
      let qaBase = '/api/'+ window.sessionStorage.getItem('robotId') + '/greeting'
      data = addRobotId(data)
      let url = qaBase + '/getQuestion'
      return http.postForm(url,data)
    },
  },
  validation:{
    //获取验证集
    getList: (data)=>{
      let url = '/api/validation/page'
      return http.get(url,data)
    },
    //添加验证集
    addValidation:(data)=>{
      let url = '/api/validation'
      return http.postForm(url,data)
    },
    //获取知识库
    getLibrary:  (data)=>{
      let url = '/api/validation/library'
      return http.get(url,data)
    },
    //删除验证集
    deleteValidation:(data)=>{
      let url = '/api/validation'
      return http.deleteMethod(url,data)
    },
    //获取验证集详情列表
    getValidationDetailList:(data)=>{
      let url = '/api/validation/data/page'
      return http.get(url,data)
    },
    //搜索知识列表
    getKnowledgeList:(data)=>{
      let url = '/api/validation/knowledge'
      return http.get(url,data)
    },
    //新增问题
    addValidationQestion: (data)=>{
      let url = '/api/validation/data'
      return http.postForm(url,data)
    },
    //更新问题
    updateValidationData:(data)=>{
      let url = '/api/validation/data'
      return http.putMethod(url,data)
    },
    //删除问题
    deleteValidationData:(data)=>{
      let url = '/api/validation/data'
      return http.deleteMethod(url,data)
    },
    //验证
    authValidation: (data)=>{
      let url = '/api/validation/' + data.setId
      return http.postForm(url,data)
    },



    //获取所有报告
    getAllReport:(data)=>{
      let url = '/api/validation/getAllReport'
      return http.get(url,data)
    },
    //获取验证集报告
    getValidationReport: (data)=>{
      let url = '/api/validation/getReport'
      return http.get(url,data)
    },
  },
  statistics:{
    //答案命中查询
    getAnswerList: (data)=>{
      let url = '/api/statistics/queryEngAnswerList'
      return http.get(url,data)
    },
    //设置问题解决
    setQuestionHelpful: (data)=>{
      let url = '/api/statistics/isHelpful'
      return http.get(url,data)
    },
    //会话时长和次数
    getSession:(data)=>{
      let url = '/api/statistics/querySession'
      return http.get(url,data)
    },
    //会话总数
    getSessionSummary:(data)=>{
      let url = '/api/statistics/querySessionSummary'
      return http.get(url,data)
    },
    //查看会话记录
    viewHistory:(data)=>{
      let url = '/api/statistics/listEngSessionLog'
      return http.get(url,data)
    },
    //未命中概况
    getAnswerListDetail:(data)=>{
      let url = '/api/statistics/queryEngAnswerLogOverview'
      return http.get(url,data)
    },
    //更新答案是否已处理
    setAnswerSolveInfo:(data)=>{
      let url = '/api/statistics/updateSolveInfo'
      return http.postForm(url,data)
    },
    //获取热点问题
    getHotQuestion: (data)=>{
      let url = '/api/statistics/listHotQuestion'
      return http.get(url,data)
    },
    //获取热词详情
    getHotQuestionDetail: (data)=>{
      let url = '/api/statistics/listHotQuestionDetail'
      return http.get(url,data)
    },
  }
}