import api from '../../api/index'

//state
const state = {
  //场景问题编辑状态
  questionEditState:{
    //入口问题
    begin: false,
    //结果回答（新增/修改）
    content: false,
    //新增追问+条件
    add: false,
    //查看+新增条件
    change: false,
    //查看追问
    inquiry: false,
    //测试对话
    test: false,
    //自动对话
    testAuto: false,
    //对话配置
    setting: false,
    //场景选择
    choseScene: false,
    //训练对话
    practiceQuestion: false,
    //选中问题
    searchQuestion: false,
    //选中显示
    nodeShow: false,
    //输入框条件
    changeInput: false,
    //多选输入
    changeDuo: false
  },
  //问题树
  questionTree: [],
  //场景ID
  scenesId: '',
  selectScenes: '',
  //选中的场景节点
  selectQuestion: '',
  //选中的场景节点组
  selectQuestionGroup: [],
  //问题跳转
  showQuestionRelation: false,
  //问题跳转数据
  jumpData: {
    from: '',
    to: ''
  },
  //跳转列表
  jumpList:[],
  //场景问题条件块位置
  locationList:[],
  //跳转和条件选择遮罩
  jumpCover: false,
  //问题模拟数据ID
  autoId: '',
  //结果条件选择数据
  selectConditions:[],
  //条件选择标志
  selectConditionFlag: false,
  //条件选择父类型
  selectConditionCall: false,
  //通用设置
  settingData:[{
    id: 1,
    name: '欢迎语',
    show: true,
    data: '你好，有问题都可以问我！'
  },{
    id: 2,
    name: '当用户回答没有命中[条件]时',
    show: false,
    data: ''
  },{
    id: 3,
    name: '结束场景语',
    show: false,
    data: ''
  },{
    id: 4,
    name: '未能识别用户意图(无法帮助)用户',
    show: false,
    data: ''
  }],
  //添加节点级别
  addLevel:'',
  //复制节点数据
  copyNodeData: '',
  //跳转线显示隐藏
  jumpLineShow: true,
  //移动的目标节点
  moveResultNode: '',
  //节点更新状态
  treeUpdateStatus: false,
  //训练问题
  practiceQuestion: '',
  //跳转场景ID
  jumpScenes: '',
  //查询选中
  searchQuestionNode: '',
  //搜索节点数据
  searchNodeData: '',
  //规则变量
  rulersProperty: [],
  //规则计算变量
  rulersMethods: [],
  //场景历史
  scenesHistory: [],
  //当前场景全局变量
  globalVarList: []
}

//getters
const getters = {
  getQuestionEditState: (state) => state.questionEditState,
  getQuestionTree: (state) => state.questionTree,
  getSelectQuestion: (state) => state.selectQuestion,
  getSelectQuestionGroup: (state) => state.selectQuestionGroup,
  getScenesId: (state) => state.scenesId,
  getShowQuestionRelation: (state) => state.showQuestionRelation,
  getJumpData: (state) => state.jumpData,
  getJumpList: (state) => state.jumpList,
  getJumpCover: (state) => state.jumpCover,
  getLocationList: (state) => state.locationList,
  getAutoId: (state) => state.autoId,
  getSelectConditions: (state) => state.selectConditions,
  getConditionFlag: (state) => state.selectConditionFlag,
  getQuestionCommonSetting: (state) => state.settingData,
  getSelectScenes: (state) => state.selectScenes,
  getQuestionAddLevel: (state) => state.addLevel,
  getCopyNode: (state) => state.copyNodeData,
  getJumpLine: (state) => state.jumpLineShow,
  getMoveResultNode: (state) => state.moveResultNode,
  getTreeUpdateStatus: (state) => state.treeUpdateStatus,
  getPracticeQuestion: (state) => state.practiceQuestion,
  getJumpScenes: (state) => state.jumpScenes,
  getSearchQuestionNode: (state) => state.searchQuestionNode,
  getSearchNodeData: (state)=> state.searchNodeData,
  getRulersProperty: (state)=> state.rulersProperty,
  getRulersMethods: (state)=> state.rulersMethods,
  getScenesHistory: state => state.scenesHistory,
  getGlobalVarList: state => state.globalVarList
}

// actions
const actions = {
  setQuestionEdit: ({commit},data)=>{
    commit('setQuestionEdit',data)
  },
  closeQuestionEdit: ({commit},data)=>{
    commit('closeQuestionEdit',data)
  },
  getQuestionTree: ({commit},data) => {
    if(data){
      commit('setScenesId',{
        id: data.id,
        data: data.data
      })
      //初始化当前场景全局变量
      if(data.id){
        api.scene.variable.getVariable({
          scenesId: data.id,
          source: 0
        }).then((res)=>{
          let options = []
          if(res.code === 'ok'){
            if(res.variables){
              options = res.variables
            }
          }
          commit('setGlobalVarList',options)
        })
      }
      commit('refreshJumpData')
      return new Promise((resolve,reject)=>{
        api.scene.editor.getScenesById({
          id: data.id
        }).then((res)=>{
          if(res.code === 'ok'){
            let data = res.root
            if(data!==null&&data.nodes!==null&&data.nodes.length!==0){
              data.nodes.forEach((e)=>{
                setSelectedState(e)
              })
              data.rollback = res.actions
            }
            commit('getQuestionTreeData',data)
            commit('questionTreeUpdate',false)
            resolve()
          }else{
            commit('getQuestionTreeData',null)
            commit('questionTreeUpdate',false)
            resolve()
          }

        })
      })
    }else{
      commit('getQuestionTreeData',null)
    }
  },
  setScenesId: ({commit},data)=>{
    commit('setScenesId',{
      id: data.id,
      data: data.data
    })
  },
  updateQuestionTree: ({commit,state}) =>{
    commit('refreshJumpData')
    api.scene.editor.getScenesById({
      id: state.scenesId
    }).then((res)=>{
      let data = res.root
      if(data!==null&&data.nodes!==null){
        data.nodes.forEach((e)=>{
          setSelectedState(e)
        })
        data.rollback = res.actions
      }
      commit('getQuestionTreeData',data)
      commit('questionTreeUpdate',true)
    })
  },
  setSelectQuestion: ({commit},data)=>{
    commit('setSelectQuestion',data)
  },
  setSelectConditions: ({commit},data)=>{
    commit('setSelectConditions',data)
  },
  choseRelationQuestion: ({commit,state}) =>{
    let data = state.questionTree
    if(data!==null&&data.nodes!==null){
      data.nodes.forEach((e)=>{
        setSelectedStateQuestion(e)
      })
    }
    commit('changeShowRelation')
  },
  choseRelationFilter: ({commit,state}) =>{
    let data = state.questionTree
    if(data!==null&&data.nodes!==null){
      data.nodes.forEach((e)=>{
        setSelectedStateFilter(e)
      })
    }
    commit('changeShowRelation')
  },
  choseMoveSelect: ({commit,state})=>{
    let data = state.questionTree
    if(data!==null&&data.nodes!==null){
      data.nodes.forEach((e)=>{
        setMoveSelectState(e,state.selectQuestion.reactId,'other')
      })
    }
    commit('changeShowRelation')
  },
  choseMoveConditionSelect: ({commit,state})=>{
    let data = state.questionTree
    if(data!==null&&data.nodes!==null){
      data.nodes.forEach((e)=>{
        setMoveConditionSelectState(e,state.selectQuestion.reactId,'other')
      })
    }
    commit('changeShowRelation')
  },

  changeShowRelation: ({commit}) =>{
    commit('changeShowRelation')
  },
  //设置当前跳转
  setJumpData: ({commit},data) =>{
    commit('setJumpData',data)
  },
  //推送跳转数据
  pushJumpData: ({commit},data) =>{
    commit('pushJumpData',data)
  },
  //重置跳转数据
  refreshJumpData: ({commit}) =>{
    commit('refreshJumpData')
  },
  //跳转遮罩
  setJumpCover: ({commit},data) =>{
    commit('setJumpCover',data)
  },
  //推送块位置信息
  pushLocationData: ({commit},data)=>{
    commit('pushLocationData',data)
  },
  //设置自动问答
  setAutoId: ({commit},data) =>{
    commit('setAutoId',data)
  },
  //修改条件
  setConditionFlag: ({commit},data)=>{
    commit('setConditionFlag',data)
  },
  //设置欢迎语
  setSettingWelcome: ({commit},data)=>{
    commit('setSettingWelcome',data)
  },
  //设置添加级别
  setAddQuestionLevel: ({commit},data)=>{
    commit('setAddQuestionLevel',data)
  },
  setCopyNode: ({commit},data)=>{
    commit('setCopyNode',data)
  },
  //设置移动目标节点
  setMoveResultNode: ({commit},data)=>{
    commit('setMoveResultNode',data)
  },
  //设置是否显示跳转线
  setJumpCoverLine: ({commit},data)=>{
    commit('setJumpCoverLine',data)
  },
  //设置更新状态
  setQuestionTreeState: ({commit},data)=>{
    commit('questionTreeUpdate',data)
  },
  //设置训练问题
  setPracticeQuestion: ({commit},data)=>{
    commit('setPracticeQuestion',data)
  },
  //设置跳转场景ID
  setJumpScenes: ({commit},data) => {
    commit('setJumpScenes',data)
  },
  //更新树节点数据
  updateQuestionNode: ({commit},data)=>{
    commit('updateQuestionNode',data)
  },
  //设置搜索节点
  setSearchQuestionNode: ({commit},data)=>{
    commit('setSearchQuestionNode',data)
  },
  //搜索目录
  setSearchNodeData: ({commit},data)=>{
    commit('setSearchNodeData',data)
  },
  //场景变量列表
  setRulersProperty: ({commit},data)=>{
    commit('setRulersProperty',data)
  },
  //场景计算变量
  setRulersMethods: ({commit},data)=>{
    commit('setRulersMethods',data)
  },
  //操作场景历史
  setScenesHistory: ({commit},data)=>{
    commit('setScenesHistory',data)
  },
  //获取当前场景全局变量
  getGlobalVarList: ({commit,state})=>{
    if(state.scenesId){
      api.scene.variable.getVariable({
        scenesId: state.scenesId,
        source: 0
      }).then((res)=>{
        let options = []
        if(res.data.code === 'ok'){
          if(res.data.variableList){
            options = res.data.variableList
          }else{
            options = []
          }
        }else{
          options = []
        }
        commit('setGlobalVarList',options)
      })
    }
  }
}


// mutations
const mutations = {
  setQuestionEdit: (state,data)=>{
    switch (data.type){
      case 'begin':
        state.questionEditState.begin = true;
        break;
      case 'add':
        state.questionEditState.add = true;
        break;
      case 'content':
        state.questionEditState.content = true;
        break;
      case 'change':
        state.questionEditState.change = true;
        break;
      case 'test':
        state.questionEditState.test = true;
        break;
      case 'auto':
        state.questionEditState.testAuto = true;
        break;
      case 'setting':
        state.questionEditState.setting = true;
        break;
      case 'inquiry':
        state.questionEditState.inquiry = true;
        break;
      case 'choseScene':
        state.questionEditState.choseScene = true;
        break;
      case 'practiceQuestion':
        state.questionEditState.practiceQuestion = true;
        break;
      case 'searchQuestion':
        state.questionEditState.searchQuestion = true;
        break;
      case 'nodeShow':
        state.questionEditState.nodeShow = true;
        break;
      case 'changeInput':
        state.questionEditState.changeInput = true;
        break;
      case 'changeDuo':
        state.questionEditState.changeDuo = true;
        break;
      default:
        break
    }
  },
  closeQuestionEdit: (state,data) =>{
    if(data){
      switch (data.type){
        case 'begin':
          state.questionEditState.begin = false;
          break;
        case 'add':
          state.questionEditState.add = false;
          break;
        case 'content':
          state.questionEditState.content = false;
          break;
        case 'change':
          state.questionEditState.change = false;
          break;
        case 'test':
          state.questionEditState.test = false;
          break;
        case 'auto':
          state.questionEditState.testAuto = false;
          break;
        case 'setting':
          state.questionEditState.setting = false;
          break;
        case 'inquiry':
          state.questionEditState.inquiry = false;
          break;
        case 'choseScene':
          state.questionEditState.choseScene = false;
          break;
        case 'practiceQuestion':
          state.questionEditState.practiceQuestion = false;
          break;
        case 'searchQuestion':
          state.questionEditState.searchQuestion = false;
          break;
        case 'nodeShow':
          state.questionEditState.nodeShow = false;
          break;
        case 'changeInput':
          state.questionEditState.changeInput = false;
          break;
        case 'changeDuo':
          state.questionEditState.changeDuo = true;
          break;
        default:
          break
      }
    }else{
      state.questionEditState = {
        begin: false,
        content: false,
        add: false,
        change: false,
        test: false,
        testAuto: false,
        setting: false,
        inquiry: false,
        choseScene: false,
        practiceQuestion: false,
        searchQuestion: false,
        nodeShow: false,
        changeInput: false,
        changeDuo: false
      }
    }
  },
  setScenesId: (state,data) =>{
    state.scenesId = data.id
    state.selectScenes = data.data
  },
  getQuestionTreeData: (state,data)=>{
    state.locationList = []
    state.jumpList = []
    state.questionTree = data
  },
  setSelectQuestion: (state,data)=>{
    if(data.hasOwnProperty('select')&&data.hasOwnProperty('group')){
      state.selectQuestion = data.select
      state.selectQuestionGroup = data.group
    }else{
      state.selectQuestion = data
      state.selectQuestionGroup = []
    }
  },
  changeShowRelation: (state) =>{
    if(state.showQuestionRelation){
      state.showQuestionRelation = false
    }else{
      state.showQuestionRelation = true
    }
  },
  setJumpData: (state,data)=>{
    if(data.type=== 'from'){
      state.jumpData.from = data.value
    }else{
      if(data.answer){
        state.jumpData.answer = true
      }
      state.jumpData.to = data.value
    }
  },
  pushJumpData: (state,data)=>{
    state.jumpList.push({
      from: data.from,
      to: data.to
    })
  },
  refreshJumpData: (state)=>{
    state.jumpList = []
    state.locationList = []
  },
  pushLocationData: (state,data) =>{
    if(data.hasOwnProperty('nodeId')){
      state.locationList.push({
        id: data.id,
        left: data.left,
        top: data.top,
        nodeId: data.nodeId
      })
    }else {
      state.locationList.push({
        id: data.id,
        left: data.left,
        top: data.top,
      })
    }
  },
  setAutoId: (state,data)=>{
    state.autoId = data
  },
  setSelectConditions: (state,data)=>{
    state.selectConditions = data
  },
  setConditionFlag: (state,data)=>{
    state.selectConditionFlag = data.flag
  },
  setSettingWelcome: (state,data)=>{
    state.settingData = data
  },
  setJumpCover: (state,data) => {
    state.jumpCover = data.cover
  },
  setAddQuestionLevel: (state,data)=>{
    state.addLevel = data
  },
  setCopyNode: (state,data)=>{
    state.copyNodeData = data
  },
  setMoveResultNode: (state,data)=>{
    state.moveResultNode = data
  },
  setJumpCoverLine: (state,data)=>{
    state.jumpLineShow = data
  },
  questionTreeUpdate: (state,data)=>{
    state.treeUpdateStatus = data
  },
  setPracticeQuestion: (state,data)=>{
    state.practiceQuestion = data
  },
  setJumpScenes: (state,data)=>{
    state.jumpScenes = data
  },
  updateQuestionNode: (state,data) =>{
    if(data.type === 'update'){
      state.selectQuestionGroup = data.data.data
      state.questionTree.nodes.forEach((e)=>{
        changeNode(e,data.data)
      })
    }
  },
  setSearchQuestionNode: (state,data) =>{
    state.searchQuestionNode = data
  },
  setSearchNodeData: (state,data)=>{
    state.searchNodeData = data
  },
  setRulersProperty: (state,data)=>{
    state.rulersProperty = data
  },
  setRulersMethods: (state,data)=>{
    state.rulersMethods = data
  },
  setScenesHistory: (state,data)=>{
    if(data.type === 'init'){
      state.scenesHistory = []
      state.scenesHistory.push(data.data)
    }else if(data.type === 'add'){
      state.scenesHistory.push(data.data)
    }else if(data.type === 'pop'){
      state.scenesHistory.pop()
    }
  },
  setGlobalVarList: (state,data)=>{
    state.globalVarList = data
  }
}

//初始化
function setSelectedState(item) {
  item.selectState = false
  item.select = false
  item.moveSelect = false
  item.cover = false
  if(item.nodes!==null&&item.nodes!==undefined&&item.nodes.length!==0){
    item.nodes.forEach((e)=>{
      setSelectedState(e)
    })
  }
  if(item.answer!==null){
    item.answer.selectState = false
  }
}
//选择关联问题
function setSelectedStateQuestion(item) {
  if(item.leaf === null||item.leaf === 'null'){
    item.selectState = 'jump'
  }else if(item.nodeType === 0){
    item.selectState = 'jumpChose'
  }else{
    item.selectState = 'jump'
  }

  if(item.nodes!==null&&item.nodes!==undefined&&item.nodes.length!==0){
    item.nodes.forEach((e)=>{
      setSelectedStateQuestion(e)
    })
  }
  if(item.answer!==null){
    item.answer.selectState = 'jumpChose'
  }
}
//选择关联条件
function setSelectedStateFilter(item) {
  if(item.leaf === null||item.leaf === 'null'){
    item.selectState = false
  }else if(item.nodeType === 1){
    item.selectState = 'conditionChose'
  }else{
    item.selectState = 'condition'
  }
  if(item.nodes!==null&&item.nodes!==undefined&&item.nodes.length!==0){
    item.nodes.forEach((e)=>{
      setSelectedStateFilter(e)
    })
  }
}
//选择移动父节点
function setMoveSelectState(item,id,flag) {

  if(flag=== 'other'){
    if(item.nodeId === id){
      item.moveSelect = 'cover'
      if(item.nodes!==null&&item.nodes!==undefined&&item.nodes.length!==0){
        item.nodes.forEach((e)=>{
          setMoveSelectState(e,id,'child')
        })
      }
    }else{
      if(item.jumpTo=== '-1'||item.jumpTo=== -1){
        if(item.nodes===null||item.nodes===undefined){
          item.moveSelect = 'show'
        }else if(item.nodes[0]&&!item.nodes[0].answer!==null&&!item.nodes[0].hasOwnProperty('question')&&item.nodes[0].nodeType ===0){
          item.moveSelect = 'show'
        }else{
          item.moveSelect = 'cover'
        }
      }else {
        item.moveSelect = 'cover'
      }
      if(item.nodes!==null&&item.nodes!==undefined&&item.nodes.length!==0){
        item.nodes.forEach((e)=>{
          setMoveSelectState(e,id,'other')
        })
      }
    }
  }else{
    item.moveSelect = 'cover'
    if(item.nodes!==null&&item.nodes.length!==0){
      item.nodes.forEach((e)=>{
        setMoveSelectState(e,id,'child')
      })
    }
  }
}
//移动条件
function setMoveConditionSelectState(item,id,flag){
  if(flag=== 'other'){
    if(item.nodeId === id){
      item.moveSelect = 'cover'
      if(item.nodes!==null&&item.nodes!==undefined&&item.nodes.length!==0){
        item.nodes.forEach((e)=>{
          setMoveConditionSelectState(e,id,'child')
        })
      }
    }else{
      if(item.type === 0){
        if(item.nodes===null||item.nodes.length===0||item.nodes===undefined){
          item.moveSelect = 'show'
        }else if(item.nodes[0]&&!item.nodes[0].answer!==null&&!item.nodes[0].hasOwnProperty('question')&&item.nodes[0].nodeType === 1){
          item.moveSelect = 'show'
        }else{
          item.moveSelect = 'cover'
        }
      }else{
        item.moveSelect = 'cover'
      }
      if(item.nodes!==null&&item.nodes!==undefined&&item.nodes.length!==0){
        item.nodes.forEach((e)=>{
          setMoveConditionSelectState(e,id,'other')
        })
      }
    }
  }else{
    item.moveSelect = 'cover'
    if(item.nodes!==null&&item.nodes!==undefined&&item.nodes.length!==0){
      item.nodes.forEach((e)=>{
        setMoveConditionSelectState(e,id,'child')
      })
    }
  }
}
function changeNode(item,check) {
  if((item.reactId === check.pId)&&!item.answer!==null&&!item.hasOwnProperty('question')){
    item.nodes = check.data
  }else if(item.nodes!==null&&item.nodes!==undefined&&item.nodes.length!==0){
    item.nodes.forEach((e)=>{
      changeNode(e,check)
    })
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}
