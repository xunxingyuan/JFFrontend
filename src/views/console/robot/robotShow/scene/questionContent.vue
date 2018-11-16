<template>
  <div class="questionContent questionEditBox" v-if="state.content">
    <div class="editBox" v-if="editShow">
      <editor :content="editContent" @changed="contentChange"></editor>
    </div>
    <div class="box animated fadeInRight" v-if="!edit" @click.stop="">
      <span class="close" @click="close()">
        <i class="iconfont icon-guanbi"></i>
      </span>
      <div class="title">
        添加结果回答 <span title="用户问题场景" class="icons_question fa"></span>

      </div>
      <div class="inputBox scrollbar">
        <!--<p class="inputTitle">当前关联的条件</p>-->
        <!--<div class="inputBoxItem contentItem">-->
          <!--<div class="flex" v-for="(item,index) in conditionList">-->
            <!--<p>{{item.content}}</p><span v-if="item.reactId !== question.reactId" @click="delCondition(index)">删除</span>-->
          <!--</div>-->
          <!--<div class="addRelation" @click="choseFilter()">+增加关联条件<span>(若下面的回答需要匹配多个条件，请再次添加)</span></div>-->
        <!--</div>-->
        <div class="inputTitle answerTitle">
          <p>简单回答</p>
          <p><span class="active" @click="showVariable=true">管理变量</span> <span @click="editData('result')" class="active">编辑</span></p>
        </div>
        <div class="inputBoxItem">
          <div v-html="resultShow" class="resultContent"></div>
        </div>
        <!--<div class="inputTitle answerTitle">-->
          <!--<p>详细回答</p>-->
          <!--<p><span class="active" @click="showVariable=true">管理变量</span> <span @click="editData('other')" class="active">编辑</span></p>-->
        <!--</div>-->
        <!--<div class="inputBoxItem">-->
          <!--<div v-html="otherShow" class="resultContent"></div>-->
        <!--</div>-->
      </div>
      <div class="btnBox">
        <span class="testBtn" @click="test()">测试一下</span>
        <div class="btnGroup">
          <span class="submit" @click="submit()">提交</span>
          <span class="cancel" @click="close()">取消</span>
        </div>
      </div>
    </div>
    <div class="box animated fadeInRight" v-else>
      <span class="close" @click="close()">
        <i class="iconfont icon-guanbi"></i>
      </span>
      <div class="title">
        修改结果回答 <span title="用户问题场景" class="icons_question fa"></span>

      </div>
      <div class="inputBox scrollbar">
        <!--<p class="inputTitle">当前关联的条件</p>-->

        <!--<div class="inputBoxItem contentItem">-->
          <!--<div class="flex" v-for="(item,index) in conditionList">-->
            <!--<p>{{item.content}}</p><span v-if="item.reactId !== question.reactId" @click="delCondition(index)">删除</span>-->
          <!--</div>-->
          <!--<div class="addRelation" @click="choseFilter()">+增加关联条件<span>(若下面的回答需要匹配多个条件，请再次添加)</span></div>-->
        <!--</div>-->
        <div class="inputTitle answerTitle">
          <p>简单回答</p>
          <p><span class="active" @click="showVariable=true">管理变量</span> <span @click="editData('result')" class="active">编辑</span></p>
        </div>
        <div class="inputBoxItem contentItem">
          <div v-html="resultShow" class="resultContent"></div>
        </div>
        <!--<div class="inputTitle answerTitle">-->
          <!--<p>详细回答</p>-->
          <!--<p><span class="active" @click="showVariable=true">管理变量</span> <span @click="editData('other')" class="active">编辑</span></p>-->
        <!--</div>-->
        <!--<div class="inputBoxItem contentItem">-->
          <!--<div v-html="otherShow" class="resultContent"></div>-->
        <!--</div>-->
      </div>
      <div class="btnBox">
        <div class="btnGroup">
          <span class="submit" @click="save()">提交</span>
          <span class="cancel" @click="close()">取消</span>
        </div>
      </div>
    </div>
    <variable @changed="varChanged" @close="showVariable = false" @varListChange="changeVarList" v-if="showVariable"></variable>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import QuillEditor from "vue-quill-editor/src/editor.vue";
  import Clipboard from 'clipboard';
  import Editor from "@/components/common/editor.vue";
  import Variable from "./variable/variable.vue";

  export default {
    components: {
      Variable,
      Editor,
      QuillEditor
    },
    name: 'questionContent',
    computed:{
      ...mapGetters({
        state: 'getQuestionEditState',
        question: 'getSelectQuestion',
        conditions: 'getSelectConditions',
        addLevel: 'getQuestionAddLevel',
        selectScenes: 'getScenesId',
        rulerList: 'getRulersProperty',
        methodsList: 'getRulersMethods'
      })
    },
    data(){
      return {
        result: '',
        other: '',
        resultShow: '',
        otherShow: '',
        parentRelation: '',
        relationList:[],
        edit: false,
        conditionList:[],
        variableList:[],
        editContent: '',
        editType: '',
        editShow: false,
        showVariable: false,
      }
    },
    methods:{
      close: function () {
        this.$store.dispatch('closeQuestionEdit')
        this.editShow = false
      },
      //提交新增结果回答
      submit: function () {
        let _self = this
        let nodeId = ''
        let relationArr = []
        this.conditionList.forEach((e)=>{
          relationArr.push(e.reactId)
        })
        nodeId = this.question.nodeId
        let data = {
          nodeId: nodeId,
          content: this.result,
          conditions: JSON.stringify(relationArr),
          opinion: this.other
        }
        let questionData
        //先更新当前节点leaf为1
        if(this.question.nodeType === 1){
          questionData = {
            sceneId: this.question.sceneId,
            nodePid: this.question.nodePid,
            nodeId: this.question.nodeId,
            content: this.question.content,
            jumpTo: this.question.jumpTo,
            nodeType: this.question.nodeType,
            similarQuestionList: JSON.stringify(this.question.similarQuestionList),
            slotList: JSON.stringify(this.question.slotList),
            showFlag: this.question.showFlag,
            leaf: 1
          }
          this.$api.scene.editor.updateSoloNode(questionData).then((res)=>{
            if(res.code === 'ok'){
              this.addAnswerData(data)
            }
          })
        }else{
          questionData = {
            nodeId: this.question.nodeId,
            sceneId: this.question.sceneId,
            nodePid: this.question.nodeId,
            content: this.question.content,
            jumpTo: this.question.jumpTo,
            nodeType: this.question.nodeType,
            leaf: 1
          }
          this.$api.scene.editor.updateDuoNode(questionData).then((res)=>{
            if(res.code === 'ok'){
              this.addAnswerData(data)
            }
          })
        }
      },
      //新增回答
      addAnswerData: function (data) {
        let _self = this
        this.$api.scene.editor.addQuestionNodeAnswer(data).then((res)=>{
          _self.$store.dispatch('updateQuestionTree')
          _self.$message({
            message: '新增成功',
            type: 'success',
            duration: 1000
          });
          _self.close()
        })
      },
      //保存结果回答
      save: function () {
        let _self = this
        let relationArr = []
        this.conditionList.forEach((e)=>{
          relationArr.push(e.reactId)
        })
        let data = {
          answerId: this.question.answerId,
          conditions: JSON.stringify(relationArr),
          nodeId: this.question.nodeId,
          content: this.result,
          opinion: this.other
        }
        this.$api.scene.editor.updateQuestionNodeAnswer(data).then((res)=>{
          _self.$store.dispatch('updateQuestionTree')
          _self.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
          _self.close()
        })
      },
      //变量更改替换
      varChanged: function (val) {
        console.log(val)
        let replaceData
        let search = '\\$\\{'+ val.old+ '\\}'
        replaceData = new RegExp(search,"g")
        if(this.result){
          this.result = this.result.replace(replaceData,'${'+val.new+'}')
        }
        if(this.other){
          this.other = this.other.replace(replaceData,'${'+val.new+'}')
        }
        if(this.editType === 'result'){
          this.editContent = this.result
        }else if(this.editType === 'other'){
          this.editContent = this.other
        }
        this.editShow = false
        this.replaceResult()
      },
      //选择关联条件
      choseFilter: function () {
        this.close()
        this.$store.dispatch('choseRelationFilter')
        this.$store.dispatch('setConditionFlag',{
          flag: 'question',
        })
        this.$store.dispatch('setJumpCover',{
          cover: true
        })
      },
      //替换结果变量
      replaceResult: function () {
        let replaceData
        this.resultShow = this.result
        this.otherShow = this.other
        this.variableList.forEach((e)=>{
          let search = '\\$\\{'+ e.variableName+ '\\}'
          replaceData = new RegExp(search,"g")
          if(this.resultShow){
            this.resultShow = this.resultShow.replace(replaceData,"<span title=" + '"'+ this.convertHtmlToText(e.note)+'"' +" class='var'>"+'${'+e.variableName+'}' +"</span>")
          }
          if(this.otherShow){
            this.otherShow = this.otherShow.replace(replaceData,"<span title=" + '"'+ this.convertHtmlToText(e.note)+'"' +" class='var'>"+'${'+e.variableName+'}' +"</span>")
          }
        })
      },
      //替换富文本
      convertHtmlToText: function(inputText) {
        var returnText = "" + inputText;
        returnText = returnText.replace(/<\/div>/ig, '\r\n');
        returnText = returnText.replace(/<\/li>/ig, '\r\n');
        returnText = returnText.replace(/<li>/ig, '  *  ');
        returnText = returnText.replace(/<\/ul>/ig, '\r\n');
        //-- remove BR tags and replace them with line break
        returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

        //-- remove P and A tags but preserve what's inside of them
        returnText=returnText.replace(/<p.*?>/gi, "\r\n");
        returnText=returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

        //-- remove all inside SCRIPT and STYLE tags
        returnText=returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
        returnText=returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
        //-- remove all else
        returnText=returnText.replace(/<(?:.|\s)*?>/g, "");

        //-- get rid of more than 2 multiple line breaks:
        returnText=returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

        //-- get rid of more than 2 spaces:
        returnText = returnText.replace(/ +(?= )/g,'');

        //-- get rid of html-encoded characters:
        returnText=returnText.replace(/ /gi," ");
        returnText=returnText.replace(/&/gi,"&");
        returnText=returnText.replace(/"/gi,'"');
        returnText=returnText.replace(/</gi,'<');
        returnText=returnText.replace(/>/gi,'>');

        return returnText;
      },
      //删除关联条件
      delCondition: function (index) {
        this.conditionList.splice(index,1)
      },
      //获取关联条件
      getRelationData: function () {
        this.conditionList = []
        if(this.conditions!==null&&this.conditions!==undefined){
          this.conditions.forEach((e)=>{
            if(e!==undefined){
              this.$api.scene.editor.getSoloQuestionById({
                reactId: e
              }).then((res)=>{
                if(res.hasOwnProperty('result')&&res.result!==null){
                  this.conditionList.push({
                    content: res.result.content,
                    reactId: res.result.reactId
                  })
                }
              })
            }
          })
        }
      },
      _initData: function () {
        this.relationList = []
        if(this.addLevel === 'same'){
          this.edit = false
          this.result = ''
          this.other = ''
          this.relationList.push(this.question.nodeId)
          this.$store.dispatch('setSelectConditions',this.relationList)
        }else if(this.addLevel === 'next'){
          this.edit = false
          this.result = ''
          this.other = ''
          this.relationList.push(this.question.reactId)
          this.$store.dispatch('setSelectConditions',this.relationList)
        }
//        this.initVarList()
//        this.replaceInit()
      },
      setVariable: function () {
        let clipboard = new Clipboard('.variable')
        clipboard.on('success', e => {
          clipboard.destroy()
        })
//        if(type==='normal'){
//          this.result += '@@' + name+ '@@'
//        }else if(type === 'methods'){
//          this.result += '!!' + name+ '!!'
//        }
      },
      //修改内容
      contentChange: function (val) {
        if(this.editType === 'result'){
          this.result = val
        }else{
          this.other = val
        }
      },
      editData: function (val) {
        if(val === 'result'){
          this.editContent = this.result
        }else if(val === 'other'){
          this.editContent = this.other
        }
        this.editType = val
        this.editShow = !this.editShow
      },
      changeVarList: function (val) {
        this.variableList = val
        this.replaceResult()
      },
      //初始化本场景变量说明
      initVarList: function () {
        //初始化使用到的变量进行替换
        this.getVarListData(1).then((res)=>{
          if(res.code === 'ok'){
            if(res.variables){
              this.variableList = res.variables
              this.replaceResult()
            }else{
              this.variableList = []
            }
          }else{
            this.variableList = []
          }

        })
      },
      getVarListData: function (type) {
        return this.$api.scene.variable.getVariable({
          scenesId: this.selectScenes,
          source: type
        })
      },
    },
    watch: {
      question: function () {
        //判断是否编辑状态
        this.relationList = []
        if(this.question&&!this.question.hasOwnProperty('answerId')&&this.question.nodeType&&(this.question.nodeType===1||this.question.nodeType===2||this.question.nodeType===3||this.question.nodeType===4||this.question.nodeType===5||this.question.nodeType===6)){
          this.edit = false
          this.result = ''
          this.other = ''
          this.relationList.push(this.question.reactId)
          this.$store.dispatch('setSelectConditions',this.relationList)
        }else if(this.question.hasOwnProperty('answerId')){
          this.$api.scene.editor.getQuestionNodeAnswer({
            answerId: this.question.answerId
          })
          this.edit = true
          this.relationList = this.question.conditions
          this.result = this.question.content
          this.other = this.question.opinion
          this.$store.dispatch('setSelectConditions',this.relationList)
          this.initVarList()
        }
//        if(this.question){
//          this.$api.getVariable({
//            scenesId: this.selectScenes.scenesId
//          }).then((res)=>{
//            if(res.code === 'ok'){
//              this.variableList = res.variables
//            }
//          })
//        }
      },
      conditions: function () {
        this.getRelationData()
      },
      addLevel: function () {
        this.relationList = []
        if(this.addLevel === 'same'&&this.question.hasOwnProperty('answer')){
          this.edit = false
          this.result = ''
          this.other = ''
          this.relationList.push(this.question.reactId)
          this.$store.dispatch('setSelectConditions',this.relationList)
        }
      },
      result: function () {
        this.replaceResult()
      },
      other: function () {
        this.replaceResult()
      }
    },
    mounted(){
      this._initData()
    }
  }
</script>

<style lang="less">
  .questionEditBox{
    justify-content: flex-end;
    align-items: center;
    .editBox{
      margin-right: 1.5rem;
      margin-left: 1rem;
      /*flex: 1;*/
      width: 55%;
      height: 100%;
    }
    .box{
      .inputBox{
        display: block;
        .answerTitle{
          justify-content: space-between;
        }
        .contentItem{
          height: auto;
          flex-flow: column;
          font-size: 0.9rem;
          overflow: auto;
          .flex{
            justify-content: space-between;
            width: 60%;
            span{
              color: #2B86F6;
              cursor: pointer;
            }
            span:hover{
              color: #FF0000;
            }
            /*min-width: 50%;*/
          }
          .addRelation{
            color: #2B86F6;
            margin-top: 10px;
            cursor: pointer;
            span{
              color: #999;
              margin-left: 5px;
            }
          }
        }
        .inputBoxItem{
          .resultContent{
            min-height: 7rem;
            min-width: 100%;
            border: solid 1px #ddd;
            padding: 10px;
            user-select: none;
            .var{
              color: green;
              cursor: pointer;
            }
            .var:hover{
              color: red;
            }
          }
          table{
            border-collapse: collapse;
          }
          td,th{
            padding:5px 10px;
            border: solid 1px #ddd;
          }
          .quill-editor{
            /*height: 16rem;*/
            flex: 1;
            width: 100%;
            .ql-container{
              height: 10rem;
            }
          }
        }
      }
    }
  }
</style>
