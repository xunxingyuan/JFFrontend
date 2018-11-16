<template>
  <div class="scenesBoxNew fullScreen" v-loading="loading">
    <div class="topTools flexCenter">
      <div class="backIcon">
        <p class="backCtrl" @click="backScenes()" :title="showId" >
          <i class=" fa fa-chevron-left" aria-hidden="true"></i><span style="margin-right:10px;height:2rem;line-height:2rem;display:block;font-weight: 600;font-size: 18px;max-width: 150px;overflow: hidden">{{localScenes.sceneName}} </span> 对应的场景
        </p>
      </div>
      <!--右上角按钮-->
      <div class="refreshIcon">
          <span class="flex" :class="{'active': questionTree&&(questionTree.rollback!== 0)}" @click="rollbackNodeChange()">
            <i class="fa icons_redo_edit" aria-hidden="true"></i><p>撤销</p>
          </span>
        <span class="flex add" :class="{'active': true}">
              <i class="fa icons_add_edit" aria-hidden="true"></i>
              <p>添加</p>
              <div class="addFirst">
                <div class="addItem active">
                  <p>上级插入</p>
                  <div class="addSecond">
                    <div class="addItem" @click="addBeforeNode('before')" :class="{'active': nodeCtrl.add.beforeQuestion}">
                      <p>追问</p>
                    </div>
                  </div>
                </div>
                <div class="addItem active">
                  <p>下级插入</p>
                  <div class="addSecond">
                    <div class="addItem" @click="addQuestionNode('next')" :class="{'active': nodeCtrl.add.question}">
                      <p>追问</p>
                    </div>
                    <div class="addItem" :class="{'active': nodeCtrl.add.conditionSecond}">
                      <p>条件</p>
                      <div class="addThird">
                        <div class="addItem" @click="addConditionNode('next')" :class="{'active': nodeCtrl.add.condition}">
                          <p>单选选项</p>
                        </div>
                        <div class="addItem" @click="addConditionNodeDuo('next')" :class="{'active': nodeCtrl.add.conditionDuo}">
                          <p>多选选项</p>
                        </div>
                        <div class="addItem" @click="addConditionInput()" :class="{'active': nodeCtrl.add.conditionInput}">
                          <p>输入数据</p>
                        </div>
                      </div>
                    </div>
                    <div class="addItem" @click="addQuestionAnswer('next')" :class="{'active': nodeCtrl.add.result}">
                      <p>结果</p>
                    </div>
                  </div>
                </div>
                <div class="addItem active">
                  <p>同级增加</p>
                  <div class="addSecond">
                    <div v-if="checkSameLevel('question')" class="addItem active" @click="addNodeSame()">
                      <p>追问</p>
                    </div>
                    <div v-if="checkSameLevel('condition')" class="addItem active">
                      <p>条件</p>
                      <div class="addThird">
                        <div class="addItem" @click="addNodeSame()" :class="{'active': nodeCtrl.add.condition}">
                          <p>单选选项</p>
                        </div>
                        <div class="addItem" @click="addNodeSame()" :class="{'active': nodeCtrl.add.conditionDuo}">
                          <p>多选选项</p>
                        </div>
                        <div class="addItem" @click="addConditionInput()" :class="{'active': nodeCtrl.add.conditionInput}">
                          <p>输入数据</p>
                        </div>
                      </div>
                    </div>
                    <div v-if="checkSameLevel('result')" class="addItem active" @click="addNodeSame()">
                      <p>结果</p>
                    </div>
                  </div>
                </div>
              </div>
            </span>
        <span class="flex add" style="margin-right: 1rem" :class="{'active': nodeCtrl.jump}">
              <i class="fa icons_jump_edit" aria-hidden="true"></i><p>跳转</p>
              <div class="addFirst">
                <div class="addItem" :class="{'active': nodeCtrl.add.jumpNode}" @click="jumpQuestionNode()">
                  <p>其他追问</p>
                </div>
                <div class="addItem" :class="{'active': nodeCtrl.add.jumpScenes}" @click="jumpOtherScenes()">
                  <p>其他场景</p>
                </div>
              </div>
            </span>
        <span class="flex" @click="viewNode()" :class="{'active': nodeCtrl.edit}">
              <i class="fa icons_edit_edit" aria-hidden="true"></i><p>编辑</p>
            </span>
        <span class="flex" :class="{'active': nodeCtrl.copy}" @click="copyNode()">
              <i class="fa icons_copy_edit" aria-hidden="true"></i><p>复制</p>
            </span>
        <span class="flex" :class="{'active': nodeCtrl.paste}" @click="parseNode()">
              <i class="fa icons_paste_edit" aria-hidden="true"></i><p>粘贴</p>
            </span>
        <span class="flex" :class="{'active': nodeCtrl.moveUp}" @click="nodeMove('up')">
              <i class="fa fa-arrow-up" aria-hidden="true"></i><p>上移</p>
            </span>
        <span class="flex" :class="{'active': nodeCtrl.moveDown}" @click="nodeMove('down')">
              <i class="fa fa-arrow-down" aria-hidden="true"></i><p>下移</p>
            </span>
        <span class="flex" :class="{'active': nodeCtrl.move}" @click="moveNode()">
              <i class="fa icons_move_edit" aria-hidden="true"></i><p>移动</p>
            </span>
        <div class="exchange">
          <p v-if="treeUpdateStatus&&exchangePercent===0" class="start" @click="commitScenesData()"><i class="fa icons_tips_edit"></i>未同步数据,开始同步</p>
          <div v-if="treeUpdateStatus&&exchangePercent!==0" class="exchangeStatus" >
            <el-progress :percentage="exchangePercent" color="#8e71c7"></el-progress>
          </div>
          <p v-if="!treeUpdateStatus" class="result"><i class="fa icons_finish_edit"></i>已完成同步</p>
        </div>
      </div>
    </div>
    <!--缩略图控制-->
    <div class="resizeBox block" @click.stop="" @mousedown="picDown" v-if="captureData!==''">
      <img :src="captureData" />
      <span class="picCover" ref="picDrag" :style="picPosition"></span>
    </div>
    <div class="innerBox scrollbar" ref="dragWrapper" id="scenesBox" @mousemove="mouseMove" @mousedown="mouseDown" @mouseup="mouseUp">
      <div class="choseSubmit" v-if="relationFlag">
        <div class="choseBox">
          <p v-if="ifChangeCondition === 'condition'">请选择跳转追问(单选)</p>
          <p v-else-if="ifChangeCondition === 'move'">请选择移动的目标位置(单选)</p>
          <p v-else>请选择关联条件(多选)</p>
          <span class="submit" @click="submitRelation()">确定</span>
          <span class="cancel" @click="cancelRelation()">取消</span>
        </div>
      </div>
      <div class="nodeInner">
        <div class="row" ref="rowLine" :style="{left: rowColumnPosition.left + 'px'}">
          <span v-for="i in 100">R{{i}}</span>
        </div>
        <div class="column" ref="columnLine" :style="{top: rowColumnPosition.top + 'px'}">
          <span v-for="i in 100">C{{i}}</span>
        </div>
        <div class="begin flex">
          <div class="firstBlock">
            <span class="blockTitle">用户咨询</span>
            <div class="blockContent" style="cursor: pointer;justify-content: space-between" @click="beginQuestion()" :class="{'noHover': jumpCover}">
              <p class="blockTop" style="justify-content: flex-start;padding-left: 1rem;">进入场景</p>
              <p class="blockMid" v-if="questionTree!==null" style="font-size: 0.8rem;color: #666;padding-left: 0.5rem">{{questionTree.question}}</p>
              <div class="blockBot">
                <!--<i @click="testQuestion()" class="fa fa-play-circle" aria-hidden="true"></i>-->
                <!--<i class="fa fa-trash-o" aria-hidden="true"></i>-->
              </div>
              <div v-if="jumpCover" class="beginCover" @click.stop=""></div>
              <div class="selectOption jumpChoseBox" v-if="ifChangeCondition === 'move'&&question.nodeType===0" @click.stop="choseMove(questionTree)">
                <span v-if="moveResult.hasOwnProperty('entranceId')&&(moveResult.entranceId === questionTree.entranceId)" class="icons_chose fa"></span>
                <span class="icons_not_chose fa" v-else></span>
              </div>
            </div>
          </div>
          <div v-if="questionTree!==null" class="lineBox">
            <div class="line"></div>
            <div class="coverRight"></div>
          </div>
          <span class="addCtrlIcon icons_add fa" v-if="questionTree!==null&&questionTree.hasOwnProperty('nodes')&&(questionTree.nodes===null||questionTree.nodes.length===0)" @click="showAddBox()"></span>
        </div>
        <div v-if="questionTree!==null&&questionTree.nodes&&questionTree.nodes!==null&&questionTree.nodes.length !== 0" style="padding-right: 1rem">
          <node-box :nodeData="questionTree.nodes"></node-box>
        </div>
      </div>
      <svg class="lineDrawNew" v-for="item in DrawData" :width="item.width" :height="item.height" :style="{top: item.top+'px',left: item.left+'px'}" :class="item.location">
        <defs>
          <marker id="markerArrow" markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto">
            <path d="M2,2 L2,11 L10,6 L2,2" style="fill: #ccc;" />
          </marker>

        </defs>
        <path :d='drawPath(item.width,item.height,item.location)' fill="none" stroke="#ccc" stroke-dasharray="4,4" stroke-width="1" marker-end='url(#markerArrow)' marker-mid="url(#markerArrow)"/>
      </svg>
    </div>
    <!--弹出框内容-->
    <section style="z-index: 10001">
      <question-begin></question-begin>
      <question-edit></question-edit>
      <question-add-box></question-add-box>
      <question-content></question-content>
      <question-inquiry></question-inquiry>
      <!--<question-jump-scenes></question-jump-scenes>-->
      <question-node-show></question-node-show>
      <question-edit-input></question-edit-input>
      <question-edit-duo></question-edit-duo>
    </section>
  </div>
</template>

<script>
  import questionBegin from './questionBegin.vue'
  import questionContent from './questionContent.vue'
  import questionEdit from './questionEdit.vue'
  import questionAddBox from './questionAddBox.vue'
  import questionInquiry from './questionInquiry.vue'
  import questionSetting from './questionSetting.vue'
//  import questionJumpScenes from './questionJumpScenes.vue'
  import QuestionNodeShow from "./questionNodeShow.vue";
  import QuestionEditInput from "./questionEditInput.vue";
  import QuestionEditDuo from "./questionEditDuo.vue";
  import nodeBox from "./nodeBox.vue"


  import { Loading, Message } from 'element-ui'
  import { mapGetters, mapActions } from 'vuex'
  import html2canvas from "html2canvas"


  export default {
    name: 'scenesBox',
    props:['scenes'],
    data(){
      return {
        selectedScenes: '',
        //拖动数据
        dragData:{
          mouseNow: '',
          mouseDown: '',
          drag: false,
          begin: {
            moveX: '',
            moveY: ''
          }
        },
        //线条数据
        DrawData: [],
        //场景全屏和缩放
        fullScenes: true,
        //场景缩放比例
        resizeCtrl: 50,
        //选择节点
        selectedNode: '',
        //节点操作控制
        nodeCtrl: {
          add: {
            question: true,
            conditionSecond: false,
            condition: false,
            conditionDuo: false,
            conditionInput: false,
            result: false,
            jumpNode: false,
            jumpScenes: false,
            beforeQuestion: false
          },
          jump: false,
          edit: false,
          copy: false,
          paste: false,
          move: false,
          del: false,
          moveUp: false,
          moveDown: false
        },
        //屏幕截图数据
        captureData: '',
        //同步百分比
        exchangePercent: 0,
        //缩略图遮罩尺寸
        picPositionData:{
          width: 0,
          height: 0,
          left: 0,
          top: 0
        },
        //缩略图遮罩尺寸位置
        picPosition:{
          width: 0,
          height: 0,
          left: 0,
          top: 0
        },
        //跳转的场景数据
        jumpScenesData: '',
        //跳转场景展示
        jumpScenesShow: false,
        //场景记录
        record:[],
        //场景数据
        scenesData: '',
        //当前场景id
        showId: '',
        //加载
        loading: true,
        //横纵轴位置
        rowColumnPosition:{
          left: 5,
          top: 56
        }
      }
    },
    components:{
      QuestionEditDuo,
      QuestionEditInput,
      QuestionNodeShow,
      questionBegin,
      questionContent,
      questionEdit,
      questionAddBox,
      questionInquiry,
//      questionJumpScenes,
      nodeBox
    },
    computed:{
      ...mapGetters({
        questionTree: 'getQuestionTree',
        relationFlag: 'getShowQuestionRelation',
        jumpData: 'getJumpData',
        categoryTree: 'getCategoryTree',
        jumpList: 'getJumpList',
        locationList: 'getLocationList',
        question: 'getSelectQuestion',
        questionGroup: 'getSelectQuestionGroup',
        selectCondition: 'getSelectConditions',
        ifChangeCondition: 'getConditionFlag',
        jumpCover: 'getJumpCover',
        categoryTreeRoot: 'getCategoryTreeRoot',
        categoryTreeArr: 'getCategoryTreeArr',
        localScenes: 'getSelectScenes',
        copyNodeData: 'getCopyNode',
        moveResult: 'getMoveResultNode',
        jumpLineShow: 'getJumpLine',
        treeUpdateStatus: 'getTreeUpdateStatus',
        jumpScenes: 'getJumpScenes',
        scenesHistory: 'getScenesHistory'
      }),
    },
    methods:{
      //查看场景
      viewScenesData: function (data) {
        let dragDom = this.$refs.dragWrapper
        dragDom.scrollLeft = 0
        dragDom.scrollTop = 0
        let _self = this
        _self.loading = true
        this.selectedScenes = data
        this.$store.dispatch('setSelectQuestion','')
        _self.DrawData = []
        this.$store.dispatch('refreshJumpData')
        this.$store.dispatch('getQuestionTree',{
          id: data.sceneId,
          data: data
        }).then(()=>{
          let picDom = document.getElementById('scenesBox')
          picDom.style.overflow = 'visible';
          picDom.addEventListener('scroll',()=>{
            _self.listenScreen()
          },false)
          let width = picDom.scrollWidth;
          let height = picDom.scrollHeight;
          let scaleBy = 0.4; //缩放比例
          let opts = {
//            canvas:canvas,
            logging: false, //日志开关
            width: width,
            height: height,
            scale: scaleBy
          };
          _self.picPosition.width = (picDom.clientWidth/picDom.scrollWidth)*120 + 'px'
          _self.picPosition.height = (picDom.clientHeight/picDom.scrollHeight)*120 + 'px'
          _self.picPositionData.width = (picDom.clientWidth/picDom.scrollWidth)*120
          _self.picPositionData.height = (picDom.clientHeight/picDom.scrollHeight)*120
          _self.picPosition.left = 0 + 'px'
          _self.picPosition.top = 0 + 'px'
          _self.picPositionData.left = 0
          _self.picPositionData.top = 0
          html2canvas(picDom, opts).then(canvas => {
            _self.captureData = canvas.toDataURL();
            picDom.style.overflow = 'auto'
            _self.loading = false
          });
        })
        this.domPosition = {
          x: 0,
          y: 0
        }
        this.showScenesBox = true
        this.$store.dispatch('setRulersProperty',[])
        this.$store.dispatch('setRulersMethods',[])
      },
      //查看场景节点
      viewNode: function () {
        this.$store.dispatch('setAddQuestionLevel','')
        if(this.question.hasOwnProperty('answerId')){
          this.$store.dispatch('setQuestionEdit',{
            type: 'content'
          })
        }else if(this.question.nodeType===1||this.question.nodeType===2){
          this.$store.dispatch('setQuestionEdit',{
            type: 'change'
          })
        }else if(this.question.nodeType=== 0 ){
          this.$store.dispatch('setQuestionEdit',{
            type: 'inquiry'
          })
        }else if(this.question.nodeType===3){
          this.$store.dispatch('setQuestionEdit',{
            type: 'changeDuo'
          })
        }else if(this.question.nodeType===4||this.question.nodeType===5||this.question.nodeType===6){
          this.$store.dispatch('setQuestionEdit',{
            type: 'changeInput'
          })
        }
      },
      //新增同级节点
      addNodeSame: function () {
        this.$store.dispatch('setAddQuestionLevel','same')
        if(this.question.answer!==null){
          this.$store.dispatch('setQuestionEdit',{
            type: 'content'
          })
        }else if(this.question.nodeType===0){
          this.$store.dispatch('setQuestionEdit',{
            type: 'add'
          })
        }else if(this.question.nodeType===1||this.question.nodeType===2){
          if(this.nodeCtrl.add.condition){
            this.$store.dispatch('setQuestionEdit',{
              type: 'change'
            })
          }
        }else if(this.question.nodeType===3){
          if(this.nodeCtrl.add.conditionDuo){
            this.$store.dispatch('setQuestionEdit',{
              type: 'changeDuo'
            })
          }
        }
      },
      //新增追问
      addQuestionNode: function (val) {
        this.$store.dispatch('setAddQuestionLevel',val)
        if(this.nodeCtrl.add.question){
          this.$store.dispatch('setQuestionEdit',{
            type: 'add'
          })
        }
      },
      //新增条件
      addConditionNode: function (val) {
        this.$store.dispatch('setAddQuestionLevel',val)

        if(this.nodeCtrl.add.condition){
          this.$store.dispatch('setQuestionEdit',{
            type: 'change'
          })
        }
      },
      addConditionNodeDuo: function (val) {
        this.$store.dispatch('setAddQuestionLevel',val)
        if(this.nodeCtrl.add.conditionDuo){
          this.$store.dispatch('setQuestionEdit',{
            type: 'changeDuo'
          })
        }
      },
      //新增回答
      addQuestionAnswer: function (val) {
        this.$store.dispatch('setAddQuestionLevel',val)

        if(this.nodeCtrl.add.result){
          this.$store.dispatch('setQuestionEdit',{
            type: 'content'
          })
        }
      },
      //插入节点
      addBeforeNode: function (val) {
        this.$store.dispatch('setAddQuestionLevel',val)
        if(this.nodeCtrl.add.beforeQuestion){
          this.$store.dispatch('setQuestionEdit',{
            type: 'add'
          })
        }
      },
      //复制节点
      copyNode: function () {
        //判断复制节点类型
        let type
        if(this.question.hasOwnProperty('answer')){
          type = 'answer'
        }else if(this.question.nodeType === 0){
          type = 'question'
        }else if(this.question.nodeType === 1){
          type = 'condition'
        }else{
          type = 'none'
        }
        this.$store.dispatch('setCopyNode',{
          type: type,
          data: this.question
        })
        this.$message({
          type: 'success',
          message: '复制成功!',
          duration: 1000
        });
      },
      //粘贴节点数据
      parseNode: function () {
        if(this.nodeCtrl.paste){
          if(this.copyNodeData.type === 'answer'){
            let arr = []
            if(this.question.hasOwnProperty('answer')){
              arr.push(this.question.reactPid)
            }else{
              arr.push(this.question.reactId)
            }
            let data = {
              reactId: this.question.reactId,
              answer: this.copyNodeData.data.answer,
              conditions: JSON.stringify(arr),
              opinion: this.copyNodeData.data.opinion
            }
            this.$api.scene.editor.addQuestionNodeAnswer(data).then((res)=>{
              this.$store.dispatch('updateQuestionTree')
              this.$message({
                message: '新增成功',
                type: 'success',
                duration: 1000
              });
            })
          }else{
            let data={
              copyReactId: this.copyNodeData.data.reactId,
              toReactId: this.question.reactId,
              toScenesId: this.localScenes.scenesId
            }
            this.$api.scene.editor.parseNode(data).then((res)=>{
              if(res.code === 'ok'){
                this.$message({
                  message: '新增成功',
                  type: 'success',
                  duration: 1000
                });
                this.$store.dispatch('updateQuestionTree')
              }
            })
          }
        }
      },
      //移动节点
      moveNode: function () {
        if(this.nodeCtrl.move){
          if(this.question.nodeType === 0){
            this.$store.dispatch('choseMoveSelect')
            this.$store.dispatch('setConditionFlag',{
              flag: 'move',
            })
          }else if(this.question.nodeType === 1){
            this.$store.dispatch('choseMoveConditionSelect')
            this.$store.dispatch('setConditionFlag',{
              flag: 'move',
            })
            this.$store.dispatch('setJumpCover',{
              cover: true
            })
          }
          this.$store.dispatch('setMoveResultNode','')
        }
      },
      //节点上下移动
      nodeMove: function (type) {
        let arr = this.questionGroup.concat()
        let idList = []
        if((this.nodeCtrl.moveUp&&type === 'up')||(this.nodeCtrl.moveDown&&type === 'down')){
          let choseIndex=0
          arr.forEach((e,index)=>{
            if(this.question.hasOwnProperty('answer')&&(this.question.answerId === e.answerId)){
              choseIndex = index
            }else if(!this.question.hasOwnProperty('answer')&&(this.question.reactId === e.reactId)){
              choseIndex = index
            }
          })
          if(this.question.hasOwnProperty('answer')){
            if(type === 'up'){
              this.swapItems(arr,choseIndex,choseIndex-1)
              if(choseIndex===1){
                this.nodeCtrl.moveUp = false
                this.nodeCtrl.moveDown = true
              }
            }else if(type === 'down'){
              this.swapItems(arr,choseIndex,choseIndex+1)
              if((choseIndex+1)===(arr.length-1)){
                this.nodeCtrl.moveDown = false
                this.nodeCtrl.moveUp = true
              }
            }
            arr.forEach((e)=>{
              idList.push(e.answerId)
            })
            this.$api.scene.editor.sortAnswerNode({
              answerIdListJson: JSON.stringify(idList)
            }).then((res)=>{
              if(res.code === 'ok'){
                this.$store.dispatch('updateQuestionTree')
                this.$store.dispatch('updateQuestionNode',{
                  type: 'update',
                  data: {
                    data: arr,
                    pId: this.question.reactId
                  }
                })
              }
            })
          }else{
            if(type === 'up'){
              this.swapItems(arr,choseIndex,choseIndex-1)
              if(choseIndex===1){
                this.nodeCtrl.moveUp = false
                this.nodeCtrl.moveDown = true
              }
            }else if(type === 'down'){
              this.swapItems(arr,choseIndex,choseIndex+1)
              if((choseIndex+1)===(arr.length-1)){
                this.nodeCtrl.moveDown = false
                this.nodeCtrl.moveUp = true
              }
            }
            arr.forEach((e)=>{
              idList.push(e.reactId)
            })
            this.$api.scene.editor.sortQuestionNode({
              reactIdListJson: JSON.stringify(idList)
            }).then((res)=>{
              if(res.code === 'ok'){
                this.$store.dispatch('updateQuestionTree')
                this.$store.dispatch('updateQuestionNode',{
                  type: 'update',
                  data: {
                    data: arr,
                    pId: this.question.reactPid
                  }
                })
              }
            })
          }
        }
      },
      //交换位置
      swapItems: function(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
      },
      //撤销节点更改
      rollbackNodeChange: function () {
        if(this.questionTree&&this.questionTree.rollback!==0){
          this.$api.scene.editor.rollbackNode().then((res)=>{
            this.$store.dispatch('updateQuestionTree')
            this.$message({
              message: '撤销成功',
              type: 'success',
              duration: 1000
            });
          })
        }
      },
      //检查当前节点
      checkSameLevel: function (type) {
        if(this.question){
          if(this.question.answer!==null){
            return type === 'result'
          }else if(this.question.nodeType === 1||this.question.nodeType === 2||this.question.nodeType === 3||this.question.nodeType === 4||this.question.nodeType === 5||this.question.nodeType === 6){
            return type === 'condition'
          }else{
            return type === 'question'
          }
        }
      },
      //跳转其他节点
      jumpQuestionNode: function () {
        if(this.nodeCtrl.add.jumpNode){
          this.$store.dispatch('setConditionFlag',{
            flag: 'condition',
          })
          this.$store.dispatch('choseRelationQuestion',{
            edit: false
          })
          this.$store.dispatch('setJumpData',{
            type: 'from',
            value: this.question.nodeId
          })
          this.$store.dispatch('setJumpData',{
            type: 'to',
            value: ''
          })
          this.$store.dispatch('setJumpCover',{
            cover: true
          })
        }
      },
      //跳转其他场景
      jumpOtherScenes: function () {
        if(this.nodeCtrl.add.jumpScenes){
          this.$store.dispatch('setQuestionEdit',{
            type: 'choseScene'
          })
        }
      },
      //处理线条
      createLine: function () {
        let _self = this
        _self.DrawData = []
        _self.jumpList.forEach((e)=>{
          let fromLocation = ''
          let toLocation = ''
          let location = ''
          _self.locationList.forEach((ele)=>{
            if(ele.id === e.from){
              fromLocation = ele
            }
            if(ele.id === e.to){
              toLocation = ele
            }
          })
          if(fromLocation.left&&toLocation.left&&fromLocation.top&&toLocation.top){
            if(fromLocation.left - toLocation.left<0&&fromLocation.top - toLocation.top<0){
              location = 'topLeft'
            }else if(fromLocation.left - toLocation.left<0&&fromLocation.top - toLocation.top>0){
              location = 'bottomLeft'
            }else if(fromLocation.left - toLocation.left>0&&fromLocation.top - toLocation.top<0){
              location = 'topRight'
            }else if(fromLocation.left - toLocation.left>0&&fromLocation.top - toLocation.top>0){
              location = 'bottomRight'
            }else{
              location = 'no'
            }
            let result = {
              width: Math.abs(fromLocation.left - toLocation.left),
              height: Math.abs(fromLocation.top - toLocation.top),
              left: (fromLocation.left<toLocation.left)?fromLocation.left:toLocation.left,
              top: (fromLocation.top<toLocation.top)?fromLocation.top:toLocation.top,
              location: location
            }
            _self.DrawData.push(result)
          }
        })
      },
      //开始创建场景根问题
      beginQuestion: function () {
        let data ={
          parent: this.questionTree,
          select: {
            condition: ''
          }
        }
        this.$store.dispatch('setSelectQuestion',data)
        this.$store.dispatch('setQuestionEdit',{
          type: 'begin'
        })
      },
      //提交场景数据测试
      commitScenesData: function () {
        let data = {
          scenesId: this.selectedScenes.scenesId
        }
        for(let i=0;i<100;i++){
          setTimeout(()=>{
            if(this.exchangePercent< 95){
              this.exchangePercent +=1
            }else if(i === 99){
              this.$api.scene.testScenesCommit(data).then((res)=>{
                if(res.code === 'ok'){
                  this.$message({
                    type: 'success',
                    message: '同步成功',
                    duration: 1000
                  });
                  this.$store.dispatch('setQuestionTreeState',false)
                }
                this.exchangePercent = 0
              })
            }
          },i*10)

        }
      },
      //移动
      mouseMove: function (e) {
        this.dragData.mouseNow = e
        if(this.dragData.drag){
          let dragDom = this.$refs.dragWrapper
          dragDom.scrollLeft  = this.dragData.begin.beginX + (this.dragData.mouseDown.clientX-e.clientX)
          dragDom.scrollTop  = this.dragData.begin.beginY + (this.dragData.mouseDown.clientY-e.clientY)
//          console.log(dragDom.scrollLeft,dragDom.scrollTop)
          this.rowColumnPosition.left =  5 - dragDom.scrollLeft
          this.rowColumnPosition.top = 56- dragDom.scrollTop
          this.picPosition.left = (dragDom.scrollLeft/dragDom.scrollWidth)*120 + 'px'
          this.picPosition.top = (dragDom.scrollTop/dragDom.scrollHeight)*120 + 'px'
          this.picPositionData.left = (dragDom.scrollLeft/dragDom.scrollWidth)*120
          this.picPositionData.top = (dragDom.scrollTop/dragDom.scrollHeight)*120
        }
      },
      mouseDown: function (e) {
        this.dragData.mouseDown = e
        let dragDom = this.$refs.dragWrapper
        this.dragData.begin.beginX = dragDom.scrollLeft
        this.dragData.begin.beginY = dragDom.scrollTop
        this.dragData.drag = true
      },
      mouseUp: function () {
        this.dragData.drag = false
      },
      //提交选择(场景跳转，条件选择，移动选择)
      submitRelation: function () {
        let _self = this
        if(this.ifChangeCondition === 'question'){
          this.$store.dispatch('updateQuestionTree')
          this.$store.dispatch('setQuestionEdit',{
            type: 'content'
          })
        }else if(this.ifChangeCondition === 'move'){
          let data
          let Pid
          if(this.question.nodeType === 1||this.question.nodeType === '1'){
            Pid = this.moveResult.reactId
            console.log(Pid)
            data = {
              reactPid: Pid,
              scenesId: this.question.scenesId,
              reactId: this.question.reactId,
              content: this.question.content,
              jumpTo: this.question.jumpTo
            }
          }else{
            if(this.moveResult.hasOwnProperty('entranceId')){
              Pid = 0
            }else{
              Pid = this.moveResult.reactId
            }
            data = {
              reactPid: Pid,
              scenesId: this.question.scenesId,
              reactId: this.question.reactId,
              content: this.question.content,
              jumpTo: this.question.jumpTo
            }
          }
          this.$api.scene.editor.updateQuestionNode(data).then((res)=>{
            if(res.code === 'ok'){
              this.$store.dispatch('updateQuestionTree')
              _self.$message({
                message: '移动成功',
                type: 'success',
                duration: 1000
              });
            }
          })
        }else{
          let submitData
          if(this.jumpData.answer){
            this.$api.scene.editor.nodeJumpAnswer(this.jumpData).then((res)=>{
              if(res.code === 'ok'){
                this.$store.dispatch('updateQuestionTree')
                this.$message({
                  message: '保存跳转成功',
                  type: 'success',
                  duration: 1000
                });
              }else{
                this.$message({
                  message: res.msg,
                  type: 'error',
                  duration: 1000
                });
              }
            })
          }else{
            this.$api.scene.editor.nodeJump(this.jumpData).then((res)=>{
              if(res.code === 'ok'){
                this.$store.dispatch('updateQuestionTree')
                this.$message({
                  message: '保存跳转成功',
                  type: 'success',
                  duration: 1000
                });
              }else{
                this.$message({
                  message: res.msg,
                  type: 'error',
                  duration: 1000
                });
              }
          })
        }
        this.$store.dispatch('changeShowRelation')
        this.$store.dispatch('setConditionFlag',{
          flag: false
        })
        this.$store.dispatch('setJumpCover',{
          cover: false
        })
        }
      },
      //取消问题跳转
      cancelRelation: function () {
        this.$store.dispatch('updateQuestionTree')
        this.$store.dispatch('changeShowRelation')
        this.$store.dispatch('setJumpCover',{
          cover: false
        })
        this.$store.dispatch('setConditionFlag',{
          flag: false
        })
      },
      //曲线划线
      drawPath: function (width,height, location) {
        let steps =  []
        if(location=== 'topLeft'){
          steps.push('M' + 0 + ',' + 0)
          // 两个控制点坐标
          let ctrl1 = {
            x: width*0.1,
            y: height
          }
          let ctrl2 = {
            x: width,
            y: height*0.1
          }
          steps.push('C' + ctrl1.x + ',' + ctrl1.y)
          steps.push(ctrl2.x + ',' + ctrl2.y)
          steps.push((width-6) + ',' + (height-10))
          return steps.join(' ')
        }else if(location === 'bottomLeft'){
          steps.push('M' + 0 + ',' + height)
          // 两个控制点坐标
          let ctrl1 = {
            x: width,
            y: height*0.8
          }
          let ctrl2 = {
            x: 0,
            y: height*0.1
          }
          steps.push('C' + ctrl1.x + ',' + ctrl1.y)
          steps.push(ctrl2.x + ',' + ctrl2.y)
          steps.push((width-5) + ',' + 4)
          return steps.join(' ')
        }else if(location === 'topRight'){
          steps.push('M' + width + ',' + 0)
          // 两个控制点坐标
          let ctrl1 = {
            x: width,
            y: height*0.8
          }
          let ctrl2 = {
            x: 0,
            y: height*0.1
          }
          steps.push('C' + ctrl1.x + ',' + ctrl1.y)
          steps.push(ctrl2.x + ',' + ctrl2.y)
          steps.push(4 + ',' + (height-6))
          return steps.join(' ')
        }else if(location === 'bottomRight'){
          steps.push('M' + width + ',' + height)
          // 两个控制点坐标
          let ctrl1 = {
            x: width,
            y: height*0.1
          }
          let ctrl2 = {
            x: width*0.1,
            y: height
          }
          steps.push('C' + ctrl1.x + ',' + ctrl1.y)
          steps.push(ctrl2.x + ',' + ctrl2.y)
          steps.push(4 + ',' + 10)
          return steps.join(' ')
        }else{

        }

      },

      //返回上一步
      backScenes: function () {
//        this.commitScenesData()
        this.$store.dispatch('setScenesHistory',{
          type: 'pop'
        })
        this.showScenesBox = false
        this.captureData = ''
        if(this.scenesHistory.length===0){
          this.$emit('close')
          this.scenesData = ''
          this.$store.dispatch('getQuestionTree')
        }else{
          this.viewScenesData(this.scenesHistory[this.scenesHistory.length-1])
        }
      },
      //选择根场景
      choseMove: function (item) {
        this.$store.dispatch('setMoveResultNode',item)
      },
      //初始添加
      showAddBox: function () {
        this.$store.dispatch('setQuestionEdit',{
          type: 'add'
        })
      },
      //屏幕监听事件
      listenScreen: function () {
        let dragDom = this.$refs.dragWrapper
        this.picPosition.left = (dragDom.scrollLeft/dragDom.scrollWidth)*120 + 'px'
        this.picPosition.top = (dragDom.scrollTop/dragDom.scrollHeight)*120 + 'px'
        this.picPositionData.left = (dragDom.scrollLeft/dragDom.scrollWidth)*120
        this.picPositionData.top = (dragDom.scrollTop/dragDom.scrollHeight)*120
        this.rowColumnPosition.left =  5 - dragDom.scrollLeft
        this.rowColumnPosition.top = 56- dragDom.scrollTop
      },
      //点击缩略图
      picDown: function (e) {
        let left = e.offsetX
        let top =  e.offsetY
        if(left< this.picPositionData.width/2){
          left = 0
        }else if(left>(120-this.picPositionData.width/2)){
          left = 120-this.picPositionData.width
        }else{
          left = left - this.picPositionData.width/2
        }
        if(top< this.picPositionData.height/2){
          top = 0
        }else if(top>(120-this.picPositionData.height/2)){
          top = 120-this.picPositionData.height
        }else{
          top = top - this.picPositionData.height/2
        }
        this.picPosition.left = left + 'px'
        this.picPosition.top = top + 'px'
        this.picPositionData.left = left
        this.picPositionData.top = top
        let dragDom = this.$refs.dragWrapper
        dragDom.scrollLeft = dragDom.scrollWidth*(left/120)
        dragDom.scrollTop = dragDom.scrollHeight*(top/120)
        this.rowColumnPosition.left =  5 - dragDom.scrollLeft
        this.rowColumnPosition.top = 56- dragDom.scrollTop
      },
      //遍历标记选定节点
      setSelectedNode: function(item,id) {
        if(item.hasOwnProperty('reactId')&&(item.reactId === id)){
          item.selectState = 'jumpNode'
        }else{
          item.selectState = 'jumpNodeCover'
        }
        if(item.nodes!==null&&item.nodes.length!==0){
          item.nodes.forEach((e)=>{
            this.setSelectedNode(e)
          })
        }
      },
      //新增输入框选项
      addConditionInput: function () {
        if(this.nodeCtrl.add.conditionInput){
          this.$store.dispatch('setQuestionEdit',{
            type: 'changeInput'
          })
        }
      }
    },
    mounted(){
      this.viewScenesData(this.scenes)
      this.record.push(this.scenes)
    },
    watch: {
      jumpList: function () {
        this.createLine()
      },
      question: function () {
        this.nodeCtrl = {
          add: {
            question: false,
            conditionSecond: false,
            condition: false,
            conditionDuo: false,
            conditionInput: false,
            result: false,
            jumpNode: false,
            jumpScenes: false,
            beforeQuestion: false
          },
          jump: false,
          edit: false,
          copy: false,
          paste: false,
          move: false,
          del: false,
          moveUp: false,
          moveDown: false
        }

        if(this.question.hasOwnProperty('answerId')){
          //回答
          this.nodeCtrl.edit = true
        }else if(this.question.nodeType === 1||this.question.nodeType === 2||this.question.nodeType === 3||this.question.nodeType === 4||this.question.nodeType === 5||this.question.nodeType === 6){
          //条件
          this.nodeCtrl.move = true
          if(this.question.nodes!==null&&this.question.nodes!=='null'&&this.question.nodes!==undefined&&this.question.nodes.length!==0){
            this.nodeCtrl.add.conditionSecond = false
            if(this.question.nodes[0].hasOwnProperty('answer')){
              this.nodeCtrl.add.result = true
            }else if(this.question.nodes[0].type=== 0){
              this.nodeCtrl.add.question = true
            }
          }else if(this.question.jumpTo === -1||this.question.jumpTo === '-1'){
            this.nodeCtrl.add.conditionSecond = true
            this.nodeCtrl.jump = true
            this.nodeCtrl.add.jumpNode = true
            this.nodeCtrl.add.jumpScenes = true
            this.nodeCtrl.add.result = true
            this.nodeCtrl.add.question = true
          }
          if(this.question.nodeType!== 0){
            this.nodeCtrl.add.conditionSecond = false
          }else{
            this.nodeCtrl.add.conditionSecond = true
          }
          if(this.copyNodeData.type === 'answer'){
            if((this.question.nodes===undefined||this.question.nodes===null)&&this.question.jumpTo === '-1'){
              this.nodeCtrl.paste = true
            }else if(this.question.nodes[0].hasOwnProperty('answer')){
              this.nodeCtrl.paste = true
            }
          }else if(this.copyNodeData.type === 'question'){
            if(this.question.jumpTo === -1||this.question.jumpTo === '-1'){
              this.nodeCtrl.paste = true
            }
          }
          if(this.question.nodeType === 2||this.question.nodeType === 1){
            this.nodeCtrl.add.condition = true
          }else if(this.question.nodeType === 3){
            this.nodeCtrl.add.conditionDuo = false
          }else if(this.question.nodeType === 4||this.question.nodeType === 5||this.question.nodeType === 6){
            this.nodeCtrl.add.conditionInput = false
          }else{
            this.nodeCtrl.add.condition = false
            this.nodeCtrl.add.conditionDuo = false
            this.nodeCtrl.add.conditionInput = false
          }
          this.nodeCtrl.edit = true
        }else if(this.question.nodeType === 0){
          this.nodeCtrl.add.conditionSecond = true

          if(this.question.nodes=== null ||this.question.nodes === undefined|| this.question.nodes.length === 0){
            this.nodeCtrl.add.question = true
            this.nodeCtrl.add.condition = true
            this.nodeCtrl.add.conditionDuo = true
            this.nodeCtrl.add.conditionInput = true
            this.nodeCtrl.paste = true
          }else if(this.question.nodes[0].nodeType === 0){
            this.nodeCtrl.add.question = true
            this.nodeCtrl.add.condition = true
            this.nodeCtrl.add.conditionDuo = true
            this.nodeCtrl.add.conditionInput = true

            if(this.copyNodeData.type === 'question'){
              this.nodeCtrl.paste = true
            }
          }else if(this.question.nodes[0].nodeType === 1){
//            this.nodeCtrl.add.condition = true
            if(this.copyNodeData.type === 'condition'){
              this.nodeCtrl.paste = true
            }
          }
          this.nodeCtrl.add.beforeQuestion = true
          this.nodeCtrl.move = true
        }
        if(this.questionGroup){
          this.questionGroup.forEach((e,index)=>{
            if(this.question.hasOwnProperty('answer')&&this.question.answer!==null){
              if(e.answerId === this.question.answerId){
                if(index === 0){

                  this.nodeCtrl.moveUp = false
                  if(this.questionGroup.length!==1){
                    this.nodeCtrl.moveDown = true
                  }
                }else if(index === (this.questionGroup.length-1)){
                  this.nodeCtrl.moveDown = false
                  if(this.questionGroup.length!==1){
                    this.nodeCtrl.moveUp = true
                  }
                }else{
                  this.nodeCtrl.moveUp = true
                  this.nodeCtrl.moveDown = true
                }
              }
            }else{
              if(e.reactId === this.question.reactId){
                if(index === 0){
                  this.nodeCtrl.moveUp = false
                  if(this.questionGroup.length!==1){
                    this.nodeCtrl.moveDown = true
                  }
                }else if(index === (this.questionGroup.length-1)){
                  this.nodeCtrl.moveDown = false
                  if(this.questionGroup.length!==1){
                    this.nodeCtrl.moveUp = true
                  }
                }else{
                  this.nodeCtrl.moveUp = true
                  this.nodeCtrl.moveDown = true
                }
              }
            }
          })
        }
        if(this.question){
          this.nodeCtrl.copy = true
          this.nodeCtrl.edit = true
        }else{
          this.nodeCtrl.copy = false
          this.nodeCtrl.edit = false
        }
      },
      jumpScenes: function () {
        if(this.jumpScenes){
          this.viewScenesData(this.jumpScenes)
          this.record.push(this.jumpScenes)
        }
      }
    }
  }
</script>

<style lang="less">
  .scenesBoxNew:active{
    cursor: grabbing;
  }
  .scenesBoxNew{
    width: 100%;
    height: 100%;
    position: absolute;
    background: #EFF3F6;
    left: 0;
    top: 0;
    z-index: 500;
    display: flex;
    cursor: grab;
    .topTools{
      position: fixed;
      height: 3rem;
      width: 100%;
      background: #fff;
      top: 0;
      left: 0;
      z-index: 10000;
      cursor: default;
    }
    .backIcon{
      position: absolute;
      left: 1rem;
      top: 0;
      height: 3rem;
      line-height: 3rem;
      background: #fff;
      padding: 0 0.5rem;
      z-index: 100;
      font-size: 14px;
      display: flex;
      align-items: center;
      color: #333;
      overflow: hidden;
      .backCtrl{
        cursor: pointer;
        display: flex;
        align-items: center;
        i{
          margin-right: 0.5rem;
        }
      }
      .backCtrl:hover{
        color: #2B86F6;
      }
    }
    .refreshIcon{
      /*position: absolute;*/
      /*right: 10rem;*/
      /*top: 0.5rem;*/
      height: 3rem;
      line-height: 2rem;
      background: #fff;
      z-index: 100;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      /*span{*/
      /*margin-left: 1rem;*/
      /*}*/
      span{
        border: solid 1px #ddd;
        border-radius: 2px;
        align-items: center;
        padding: 0 0.8rem;
        margin-right: -1px;
        color: #999;
        p{
          margin-left: 5px;
        }
      }
      .active{
        border: solid 1px #ddd;
        color: #333;
        cursor: pointer;
        p{
          color: #333;
        }
      }
      .active:hover{
        border: solid 1px #DDDDDD;
        /*color: #2B86F6;*/
        /*p{*/
        /*color: #2B86F6;*/
        /*}*/
        background: #F1F1F1;
      }
      .add{
        position: relative;
        .addFirst{
          display: none;
          position: absolute;
          top: 2rem;
          left: 0;
          padding: 0.5rem 0;
          background: #fff;
          border: none;
          box-shadow: 0 0 4px 1px #BFBFBF;
          .addItem{
            width: 140px;
            height: 2.2rem;
            font-size: 0.8rem;
            padding: 0 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: none;
            background: #fff;
            margin-top: -1px;
            position: relative;
            p{
              color: #333;
            }
            .addSecond{
              display: none;
              color: #999;
              position: absolute;
              padding: 0.5rem 0;
              background: #fff;
              border: none;
              box-shadow: 0 0 4px 1px #BFBFBF;
              left: 138px;
              top: 0;
              z-index: 10;
              p{
                color: #999;
              }
              .addThird{
                display: none;
                color: #999;
                position: absolute;
                padding: 0.5rem 0;
                background: #fff;
                border: none;
                box-shadow: 0 0 4px 1px #BFBFBF;
                left: 138px;
                top: 0;
                z-index: 10;
                p{
                  color: #999;
                }
              }
              /*.addItem:hover{*/
              /*background: #f7f7f7;*/
              /*p{*/
              /*color: #333;*/
              /*}*/
              /*}*/
            }
          }
        }
        .active:hover{
          background: #f7f7f7;
          p{
            color: #333;
          }
          .addSecond{
            display: block;
            p{
              color: #999;
            }
            .active{
              p{
                color: #333;
              }
            }
            .active:hover{
              .addThird{
                display: block;
                p{
                  color: #999;
                }
                .active{
                  p{
                    color: #333;
                  }
                }
              }
            }
          }
        }
        .active{
          p{
            color: #333;
          }
        }
      }
      .active:hover{
        .addFirst{
          display: block;
        }
      }
      .exchange{
        width: 200px;
        margin-left: 2rem;
        p{
          font-size: 0.8rem;
          text-align: left;
          padding-left: 1rem;
        }
        .start{
          color: #3692FA;
          cursor: pointer;
        }
        .result{
          color: #333;
        }
      }
    }
    .resizeBox{
      position: absolute;
      left: 2rem;
      bottom: 1rem;
      height: 120px;
      width: 120px;
      background: #F4F7F9;
      display: flex;
      align-items: center;
      justify-content: center;
      border: solid 1px #BFBFBF;
      box-shadow: 0 0 4px 1px #BFBFBF;
      z-index: 1000;
      img{
        width: 120px;
        height: 120px;
        cursor: crosshair;
      }
      .picCover{
        position: absolute;
        display: block;
        background: rgba(0,0,0,0.2);
        cursor: crosshair;
      }

    }
    .innerBox{
      display: flex;
      overflow: auto;
      margin-top: 3.5rem;
      margin-left: 0.5%;
      /*width: 100%;*/
      /*height: 100%;*/
      min-width: 99.5%;
      position: relative;
      background: #fff;
      .nodeInner{
        background: #fff;
        width: 100%;
        height: 100%;
        padding: 2.5rem 2rem;
        flex: 1;
        display: flex;
        align-items: flex-start;
        .row,.column{
          position: fixed;
          background: #fff;
          z-index: 1001;
          span{
            font-size: 0.8rem;
          }
        }
        .column{
          left: 5px;
          width: 1.5rem;
          height: auto;
          top: 3.5rem;
          padding-top: 2.1rem;
          border: solid 1px #ddd;
          span{
            height: 4.2rem;
            line-height: 4.2rem;
            border-top: solid 1px #ddd;
            display: block;
          }
        }
        .row{
          top: 3.5rem;
          left: 5px;
          height: 1.5rem;
          line-height: 1.5rem;
          width: auto;
          border: solid 1px #ddd;
          padding-left: 14rem;
          display: flex;
          span{
            display: inline-block;
            width: 11.07rem;
            border-left: solid 1px #ddd;
          }
        }
      }


      .begin{
        z-index: 11;
        .blockContent{
          border: solid 1px #2B86F6;
          height: 3.6rem;
          width: 10rem;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          position: relative;
          .selectOption{
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.5);
            z-index: 1000;
          }
          .blockTop,.blockBot{
            height: 1.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
          }
          .blockBot{
            display: flex;
            justify-content: flex-end;
            padding-right: 1rem;
            /*background: #F5F5F5;*/
            .fa{
              margin-left: 0.5rem;
              display: none;
            }

          }
          .blockTop{
            text-align: left;
          }
          .blockMid{
            text-align: left;
            height: 1.2rem;
            line-height: 1.2rem;
            width: 90%;
            font-size: 0.8rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .selectOption{
            width: 100%;
            height: 100%;
            position: absolute;
            background: rgba(255,255,255,0.7);
            z-index: 1000;
            .fa{
              position: absolute;
              right: -5px;
              top: -5px;
            }
          }
        }
        .lineBox{
          height: 3.6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          .line{
            height: 1px;
            width: 2rem;
            /*margin-top: 1px;*/
            border-bottom: solid 1px #CCCCCC;
          }
          .coverRight{
            position: absolute;
            right: -1px;
            width: 1px;
            height: 1.8rem;
            top: -1px;
            background: #ffffff;
          }
          .coverLine{
            width: 2rem;
            height: 2rem;
            position: absolute;
            left: -1px;
            top: 0;
            background: #fff;
          }
          .coverLine3{
            width: 2rem;
            height: 2rem;
            position: absolute;
            left: -1px;
            top: 0;
            background: #fff;
          }
          .mid{
            left: 0;
            width: 1.9rem;
          }
          .coverLine1{
            width: 2rem;
            height: 2rem;
            position: absolute;
            left: -1px;
            bottom: -1px;
            background: #fff;
          }
          .coverLine2{
            width: 2rem;
            height: 2rem;
            position: absolute;
            right: -1px;
            top: 0;
            background: #fff;
          }
          .coverLine4{
            width: 2rem;
            height: 2rem;
            position: absolute;
            right: -1px;
            top: 0;
            background: #fff;
          }
        }
        .blockContent:hover{
          justify-content: space-between;
          box-shadow: 0 0 3px #2B86F6;

          .blockBot{
            .fa{
              display: flex;
            }
          }
        }
        .noHover:hover{
          box-shadow: none;
        }
        .firstAddIcon{
          align-self: flex-start;
          margin-top: 1.3rem;
        }
        .firstBlock{
          position: relative;
          .blockTitle{
            position: absolute;
            top: -18px;
            font-size: 10px;
            left: 0;
            height: 16px;
            padding: 0 5px;
            line-height: 16px;
            background: #6d6d6d;
            color: #fff;
          }
          .beginCover{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(255,255,255,0.8);
          }
          .selectOption{
            width: 100%;
            height: 100%;
            position: absolute;
            background: rgba(255,255,255,0.5);
            z-index: 1000;
            .fa{
              position: absolute;
              right: -5px;
              top: -5px;
            }
          }
          .jumpChoseBox{
            background: transparent;
          }
        }
        .addCtrlIcon{
          align-self: flex-start;
          margin-top: 1.2rem;
          z-index: 10;
        }
      }
      .addFilter{
        z-index: 11;
        height: 4rem;
        .lineBox{
          width: 2rem;
          height: 4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          .line{
            height: 2rem;
            width: 2rem;
            border-bottom: solid 1px #CCCCCC;
            border-left: solid 1px #ccc;
            align-self: flex-start;
          }
          .coverLine{
            width: 2rem;
            height: 2rem;
            position: absolute;
            left: -1px;
            top: 0;
            background: #fff;
          }
          .coverLine3{
            width: 2rem;
            height: 2rem;
            position: absolute;
            left: -1px;
            top: 0;
            background: #fff;
          }

          .mid{
            left: 0;
            width: 1.9rem;
          }
          .coverLine1{
            width: 2rem;
            height: 2rem;
            position: absolute;
            left: -1px;
            bottom: -1px;
            background: #fff;
          }
          .coverLine2{
            width: 2rem;
            height: 2rem;
            position: absolute;
            right: -1px;
            top: 0;
            background: #fff;
          }
          .coverLine4{
            width: 2rem;
            height: 2rem;
            position: absolute;
            right: -1px;
            top: 0;
            background: #fff;
          }
        }
      }
      .lineDraw{
        position: absolute;
        border: dashed 1px #2B86F6;
        pointer-events: none;
        /*border-bottom: none;*/
        /*border-left: none;*/
        z-index: 1;
        /*border-bottom-left-radius: 100px;*/
        .coin{
          position: absolute;
          width: 10px;
          height: 10px;
          display: none;
          align-items: center;
          justify-content: center;
          .fa{
            font-size: 10px;
            color: #FF0000;
          }
        }
      }
      .lineDrawNew{
        position: absolute;
        pointer-events: none;
        z-index: 1000;
      }
      .choseSubmit{
        position: fixed;
        /*bottom: 0.7rem;*/
        top: 0;
        left: 0;
        height: 3rem;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        z-index: 10001;
        padding-left: 180px;
        .choseBox{
          height: 100%;
          flex: 1;
          background: #2B86F6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          color: #fff;
          span{
            width: 96px;
            height: 2rem;
            border-radius: 2px;
            line-height: 2rem;
            cursor: pointer;
          }
          p{
            margin-right: 1rem;
          }
          .submit{
            background: #2FD8D6;
            color: #fff;
          }
          .cancel{
            background: transparent;
            color: #fff;
            margin-left: 1rem;
          }
        }
      }
      .lastBlock{
        border-color: #fff;
        .mid{
          left: -1px;
          width: 1px;
          background: #ccc;
        }
      }
    }
  }
  .fullScreen{
    position: fixed;
    .innerBox{
      .choseSubmit{
        top: 0;
        /*bottom: 0;*/
        left: 0;
        padding-left: 0;
      }
    }
  }
</style>
