<template>
  <div class="questionBox">
    <div class="lineBox">
      <div class="line"></div>
      <div class="coverLine" :class="[itemIndex===0?'first': 'mid']"></div>
      <div class="arrow"></div>
    </div>
    <div class="firstBlock" :class="{'resultBlock': questionData.hasOwnProperty('answer')}">
      <div class="blockContent" @click.stop="changeQuestion()" :ref="questionData.reactId" :class="{'noHover': jumpCover,'choseBox': checkSelectOther(questionData)}" draggable="true">
        <p class="blockTop" v-if="questionData.leaf !== null">追问+条件</p>
        <p class="blockTop" v-else-if="questionData.hasOwnProperty('answer')">结果回答</p>
        <p class="blockTop" v-else-if="questionData.hasOwnProperty('scenesName')">场景：{{questionData.scenesName}}</p>

        <span class="blockMid" v-if="questionData.leaf !== null">{{questionData.content}}</span>
        <span class="blockMid" v-else-if="questionData.hasOwnProperty('answer')" v-html="questionData.answer"></span>
        <span class="blockMid" v-else-if="questionData.hasOwnProperty('scenesName')">{{questionData.question}}</span>

        <div class="blockBot">
          <i v-if="(questionData.leaf === null||questionData.leaf === 'null')&&!questionData.hasOwnProperty('question')"  @click.stop="testQuestion(questionData)" class="fa fa-play-circle" aria-hidden="true"></i>
          <i @click.stop="delFilter(questionData)" class="fa fa-trash-o" aria-hidden="true"></i>
        </div>
        <div class="selectOption" v-if="questionData.select||questionData.answerCover||questionData.moveSelect === 'cover'" @click.stop="">

        </div>
        <div class="selectOption jumpChoseBox" v-if="questionData.selectState" @click.stop="choseItemRelation(questionData)" >
          <span v-if="questionData.reactId === jumpData.to" class="icons_chose_circle fa"></span>
          <span class="icons_chose_not_circle fa" v-else></span>
        </div>
      </div>
    </div>
    <div class="lineBox" v-if="questionData.leaf !== null&&questionData.nodes!==null">
      <div class="line"></div>
      <div class="coverLine2"></div>
      <div class="iconsResize">
        <i v-if="secondCover" class="fa fa-plus-square-o" @click="hideQuestion()"></i>
        <i  class="fa fa-minus-square-o" @click="hideQuestion()" v-else></i>
      </div>
    </div>
    <div class="secondBox" v-if="!questionData.hasOwnProperty('scenesName')&&!questionData.hasOwnProperty('answer')&&!secondCover" >
      <div class="secondItem" :class="{'lastBlockFilter': index === (questionData.nodes.length-1)}"  v-for="(item,index) in questionData.nodes">
        <div class="lineBox">
          <div class="line"></div>
          <div class="arrow"></div>
          <div class="right"></div>
        </div>
        <div class="lastCover"></div>
        <div class="blockContent filters" @click="changeFilter(item)" :ref="item.reactId" :class="{'noHover': jumpCover,'choseBox': checkSelect(item)&&selectQuestion.hasOwnProperty('select')}">
          <p class="blockTop">{{item.content}}</p>
          <span class="blockMid">用户选了该项</span>
          <div class="blockBot">
            <i @click.stop="testQuestion(item)" class="fa fa-play-circle" aria-hidden="true"></i>
            <i @click.stop="delFilter(item)" class="fa fa-trash-o" aria-hidden="true"></i>
          </div>

          <div class="selectOption" v-if="item.selectState&&!questionData.moveSelect" @click.stop="">

          </div>
          <div class="selectOption" v-if="item.moveSelect === 'cover'" @click.stop="">

          </div>
          <div class="selectOption jumpChoseBox" v-if="item.select" @click.stop="selectConditionData(item)">
            <span v-if="checkCondition(item.reactId)" class="icons_chose fa"></span>
            <span class="icons_not_chose fa" v-else></span>
          </div>
          <div class="selectOption jumpChoseBox" v-if="item.moveSelect === 'show'" @click.stop="choseMove(item)">
            <span v-if="moveResult.hasOwnProperty('reactId')&&(moveResult.reactId === item.reactId)" class="icons_chose fa"></span>
            <span class="icons_not_chose fa" v-else></span>
          </div>

        </div>
        <div class="lineBox" v-if="item.jumpTo!== '-1'||item.nodes !== null">
          <div class="line" v-if="item.nodes !== null||item.jumpTo!== -1||item.jumpTo!== null||item.jumpTo!== '-1'"></div>
          <div class="coverLine4"></div>
          <div class="iconsResize" v-if="item.nodes !== null">
            <i v-if="filterCover" class="fa fa-plus-square-o" @click="hideCondition(item)"></i>
            <i  class="fa fa-minus-square-o" @click="hideCondition(item)" v-else></i>
          </div>
        </div>
        <div class="blockChildren" v-if="hideFilter.indexOf(item.reactId)===-1">
          <question-box :class="{'lastBlock': index===(item.nodes.length-1)}" v-if="item.nodes!==null&&item.nodes.length!==0" v-for="(data,index) in item.nodes" :itemIndex="index" :questionData="data" v-bind:key="data.nodeId"></question-box>
          <!--<div class="questionBox questionBoxAdd" v-if="item.jumpTo=== -1||item.jumpTo === '-1'||item.jumpTo === null||item.jumpTo == 'null'">-->
            <!--<div class="lineBox">-->
              <!--<div class="line"></div>-->
              <!--<div class="coverLine1"></div>-->
            <!--</div>-->
            <!--<question-add  :showFlag="'answer'" :sendData="item"></question-add>-->
          <!--</div>-->
        </div>
      </div>
      <!--<div class="secondItem secondAdd">-->
        <!--<div class="lineBox">-->
          <!--<div class="line"></div>-->
          <!--<div class="coverLine1"></div>-->
        <!--</div>-->
        <!--<question-add :showFlag="'condition'" :sendData="questionData"></question-add>-->
      <!--</div>-->
    </div>
  </div>

</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import bus from '../../../tools/bus'

  export default {
    name: 'questionBox',
    props:['questionData','itemIndex'],
    data(){
      return {
        ifChild: false,
        addSame: false,
        addSameT: false,
        addChild: false,
        addNew: false,
        checkJump: '',
        jumpShow: false,
        selectConditionArr:[],
        secondCover: false,
        filterCover: false,
        hideFilter: []
      }
    },
    methods:{
      //判断是否选中(条件)
      checkSelect: function (item) {
        if(this.selectQuestion ===''){
          return false
        }else if(this.selectQuestion.hasOwnProperty('select')){
          return item.reactId === this.selectQuestion.select.reactId
        }else{
          return false
        }
      },
      //判断是否选中（问题，回答，跳转场景）
      checkSelectOther: function (item) {
        if(this.selectQuestion ===''||this.selectQuestion.hasOwnProperty('select')){
          return false
        }else if(item.hasOwnProperty('answer')){
          return item.answerId === this.selectQuestion.parent.answerId
        }else{
          return item.reactId === this.selectQuestion.parent.reactId
        }
      },
      //选中条件
      changeFilter: function (item) {
        this.$store.dispatch('setAddQuestionLevel','')
        let data ={
          parent: this.questionData,
          select: item
        }
        this.$store.dispatch('setSelectQuestion',data)
//        this.$store.dispatch('setQuestionEdit',{
//          type: 'change'
//        })
      },
      //删除节点
      delFilter: function (item) {
        let _self = this
        if(item.hasOwnProperty('answer')){
          this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.$api.scene.editor.deleteQuestionNodeAnswer({
              answerId: item.answerId
            }).then((res)=>{
              _self.$message({
                message: '删除成功',
                type: 'success',
                duration: 1000
              });
              _self.$store.dispatch('updateQuestionTree')
            })
          })
        }else if(item.hasOwnProperty('question')){
          this.$confirm('此操作将永久删除该场景跳转, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.$api.scene.editor.delQuestionJump({
              reactId: item.reactId
            }).then((res)=>{
              _self.$message({
                message: '删除成功',
                type: 'success',
                duration: 1000
              });
              _self.$store.dispatch('updateQuestionTree')
            })
          })
        }else{
          this.$confirm('此操作将永久删除该项及其子项, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.$api.scene.editor.delQuestionById({
              reactId: item.reactId
            }).then((res)=>{
              console.log(res)
              _self.$message({
                message: '删除成功',
                type: 'success',
                duration: 1000
              });
              _self.$store.dispatch('updateQuestionTree')
            })
          })
        }
      },

      //选中追问或者答案
      changeQuestion: function () {
        let data ={
          parent: this.questionData,
        }
        this.$store.dispatch('setSelectQuestion',data)
        if(this.questionData.hasOwnProperty('question')){
          this.$store.dispatch('getQuestionTree',{
            id: this.questionData.scenesId,
            data: this.questionData
          })
          this.$nextTick()
        }
      },
      //隐藏追问节点
      hideCondition: function (item) {
        this.filterCover = !this.filterCover
        if(this.hideFilter.indexOf(item.reactId)===-1){
          this.hideFilter.push(item.reactId)
        }else{
          let index = this.hideFilter.indexOf(item.reactId)
          this.hideFilter.splice(index,1)
        }
        if(!this.filterCover&&!this.secondCover){
          this.$store.dispatch('setJumpCoverLine',true)
        }else{
          this.$store.dispatch('setJumpCoverLine',false)
        }
      },
      //隐藏条件节点
      hideQuestion: function () {
        this.secondCover = !this.secondCover
        if(!this.filterCover&&!this.secondCover){
          this.$store.dispatch('setJumpCoverLine',true)
        }else{
          this.$store.dispatch('setJumpCoverLine',false)
        }
      },

      //模拟对话
      testQuestion: function (data) {
        this.$store.dispatch('setAutoId',data)
        this.$store.dispatch('setQuestionEdit',{
          type: 'auto',
        })
      },
      //关联问题
      choseItemRelation: function (item) {
        this.$store.dispatch('setJumpData',{
          type: 'to',
          value: item.reactId
        })
      },
      //推送块位置信息
      pushLocationAndJump: function () {
        let _self = this
//        console.log(this.$refs[this.questionData.reactId].offsetLeft)
        if(this.questionData!==null&&this.questionData.nodes!==null){
          this.questionData.nodes.forEach((e)=>{
            if(e.jumpTo !== -1&&e.jumpTo!== '-1'&&e.jumpTo!==null&&e.jumpTo!=='null'&&this.$refs[e.reactId]){
//            console.log('跳转：'+ e.nodeId +'到' + e.jumpTo )
              this.$store.dispatch('pushJumpData',{
                from: e.reactId,
                to: e.jumpTo
              })
              this.$store.dispatch('pushLocationData',{
                id: e.reactId,
                left: this.$refs[e.reactId][0].offsetLeft+ this.$refs[e.reactId][0].clientWidth+16,
                top: this.$refs[e.reactId][0].offsetTop+ this.$refs[e.reactId][0].clientHeight/2 +3
              })
            }
          })
        }
        if(this.$refs[this.questionData.reactId]){
          this.$store.dispatch('pushLocationData',{
            id: this.questionData.reactId,
            reactId: this.questionData.reactId,
            left: this.$refs[this.questionData.reactId].offsetLeft -10,
            top: this.$refs[this.questionData.reactId].offsetTop+30
          })
        }
      },
      checkCondition: function (id) {
        return this.selectCondition.indexOf(id)!==-1
      },
      //选择条件
      selectConditionData: function (item) {
        let conditionData = this.selectCondition
        if(this.selectCondition.indexOf(item.reactId) === -1){
          conditionData.push(item.reactId)
        }else{
          conditionData.splice(this.selectCondition.indexOf(item.reactId),1)
        }
        this.$store.dispatch('setSelectConditions',conditionData)
      },
      //选择移动节点
      choseMove: function (item) {
        this.$store.dispatch('setMoveResultNode',item)
      }
    },
    computed:{
      ...mapGetters({
        jumpData: 'getJumpData',
        tree: 'getQuestionTree',
        selectCondition: 'getSelectConditions',
        jumpCover: 'getJumpCover',
        selectQuestion: 'getSelectQuestion',
        moveResult: 'getMoveResultNode'
      })
    },
    mounted(){
      this.$nextTick(()=>{
        this.pushLocationAndJump()
      })
      this.hideFilter = []
    },
    watch: {
      tree: function () {
        this.$nextTick(()=>{
          this.pushLocationAndJump()
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .questionBox{
    border-left: solid 1px #ccc;
    display: flex;
    align-items: flex-start;
    padding-bottom: 5px;
    margin-right: 5rem;

    .blockContent{
      border: solid 1px #2B86F6;
      border-radius: 3px;
      height: 3.6rem;
      width: 9rem;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      position: relative;
      cursor: pointer;
      background-color: #fff;
      .blockBot{
        align-items: center;
        height: 1.2rem;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding-right: 0.5rem;
        /*background: #F5F5F5;*/
        .fa{
          margin-left: 0.5rem;
          display: none;
        }
      }
      .blockMid,.blockTop{
        height: 1.2rem;
        line-height: 1.2rem;
        width: 90%;
        font-size: 0.8rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .blockTop{
        color: #2B86F6;
        font-weight: 600;
        text-align: left;
      }
      .blockMid{
        color: #666;
        text-align: left;
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
    .jumpChose{
      background: #edf5ff;
    }
    .blockContent:hover{
      box-shadow: 0 0 3px #2B86F6;
      .blockBot{
        .fa{
          display: flex;
        }
      }
    }
    .jumpChose:hover{
      box-shadow: none;
    }
    .filters{
      border: solid 1px #FFB129;
      .blockTop{
        color: #F68D04;
      }
      .blockMid{
        color: #666;
      }
    }
    .filters:hover{
      box-shadow: 0 0 3px #FFB129;
    }

    .noHover:hover{
      box-shadow: none;
      .blockBot{
        .fa{
          display: none;
        }
      }
    }
    .lineBox{
      height: 3.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .arrow{
        width: 0;
        height: 0;
        border: solid 0.3rem #fff;
        border-left-color: #ddd;
        position: absolute;
        right: -0.3rem;
        top: 1.5rem;
      }
      .line{
        height: 2px;
        width: 1rem;
        border-bottom: solid 1px #CCCCCC;
      }
      .coverLine{
        width: 2px;
        height: 1.8rem;
        position: absolute;
        left: -2px;
        top: 0;
        background: #fff;
      }
      .coverLine3{
        width: 1rem;
        height: 1.8rem;
        position: absolute;
        left: -1px;
        top: 0;
        background: #fff;
      }

      .mid{
        left: 0;
        width: 2px;
      }
      .coverLine1{
        width: 1px;
        height: 1.8rem;
        position: absolute;
        left: -1px;
        bottom: -1px;
        background: #fff;
      }
      .coverLine2{
        width: 2px;
        height: 1.8rem;
        position: absolute;
        right: -2px;
        top: 0;
        background: #fff;
        z-index: 10;
      }
      .coverLine4{
        width: 2px;
        height: 1.8rem;
        position: absolute;
        right: -2px;
        top: 0;
        background: #fff;
      }
      .iconsResize{
        /*background: #fff;*/
        color: #ccc;
        height: 3.6rem;
        z-index: 10;
        width: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: -0.5rem;
        top: 0;
        margin-top: 1px;
      }
    }
    .firstBlock{
      display: flex;
    }
    .resultBlock{
      .blockContent{
        border: solid 1px #17BAA9;
        p{
          color: #17BAA9;
        }
      }
      .blockContent:hover{
        box-shadow: 0 0 3px #17BAA9;
      }
    }

    .resultBlock{
      .choseBox{
        border: solid 1px #FF0000;
        box-shadow: 0 0 10px #FF0000;
      }
      .choseBox:hover{
        box-shadow: 0 0 10px #FF0000;
      }
    }
    .choseBox{
      border: solid 1px #FF0000;
      box-shadow: 0 0 10px #FF0000;
    }
    .choseBox:hover{
      box-shadow: 0 0 10px #FF0000;
    }


    .jump{
      align-self: center;
      width: auto;
      padding: 0 0.5rem;
      height: 30px;
      color: #FF0000;
      border: solid 2px #2B86F6;
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .secondBox{
      /*display: flex;*/
      border-left: solid 1px #CCC;
      .secondItem{
        display: flex;
        margin-bottom: 5px;
      }
      .secondAdd{
        margin-bottom: 0;
      }
    }
  }
  .questionBoxAdd{
    padding-bottom: 0;
    /*border-color: #fff;*/
    .coverLine4{
      width: 2rem;
      height: 2rem;
      position: absolute;
      left: 0;
      top: 0;
      background: #fff;
    }
  }
  .questionBox{

    .lastBlock{
      border-color: #fff;
      .mid{
        left: -1px;
        width: 1px;
        background: #ccc;
      }
    }
    .secondBox{
      .lastBlockFilter{
        /*position: relative;*/
        margin-bottom: 0;
        border: solid 1px #fff;
        margin-left: -1px;
        .lastCover{
          height: 100%;
          width: 1px;
          background: #FF0000;
          position: absolute;
          left: 0;
          top: 1.8rem;
        }
        .lineBox{
          .right{
            width: 1px;
            position: absolute;
            left: -1px;
            top: -1px;
            height: 1.9rem;
            background: #ccc;
          }
        }
      }
    }
  }

  .lineCommon{
    width: 1rem;
    display: flex;
    justify-content: space-between;
    .top,.mid,.bottom{
      width: 100%;
    }
    .top{
      flex: 1;
      background: #fff;
    }
    .mid{
      height: 1px;
      background: #ccc;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .arrow{
        width: 0;
        height: 0;
        border: solid 0.3rem #fff;
        border-left-color: #ddd;
      }
    }
    .bottom{
      flex: 1;
      background: #fff;
    }
  }
  .lineTop{
    .top{
      margin-left: -1px;
    }
  }
  .lineMid{
    .top,.bottom{
      border-left: solid 1px #ccc;
    }
  }
  .line{
    .bottom{
      margin-left: -1px;
    }
  }



</style>
