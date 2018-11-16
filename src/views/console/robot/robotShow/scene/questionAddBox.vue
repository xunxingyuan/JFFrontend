<template>
  <div class="questionAddBox questionEditBox" v-if="state.add">
    <div class="searchPart animated fadeInRight" v-if="relationShow">
      <p class="title">关联知识</p>
      <el-input
        placeholder="请输入搜索关键字"
        v-model="searchInput"
        @keyup.enter.native="search()">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="search()"></i>
      </el-input>
      <div class="searchContent scrollbar">
        <div class="searchItem" v-for="item in searchData" v-if="searchData.length!==0">
          <p v-html="item.content"></p>
        </div>
        <div class="tips flexCenter" v-if="searchData.length===0">
          <span>暂无搜索结果</span>
        </div>
      </div>
    </div>
    <div class="box animated fadeInRight">
      <span class="close" @click="close()" v-if="!relationShow">
        <i class="iconfont icon-guanbi"></i>
      </span>
      <div class="title">
        添加追问 <span title="用户问题场景" class="icons_question fa"></span>

      </div>
      <div class="inputBox">
        <div class="inputBoxItem">
          <div class="inputItem">
            <span class="inputMsg">*追问问题</span>
          </div>
          <div class="del"></div>
        </div>
        <div class="inputBoxItem">
          <quill-editor :options="editorOption" v-model="addQuestion"></quill-editor>
        </div>
        <div class="inputBoxItem">
          <div class="inputItem">
            <span class="inputMsg"> 变量类型：</span>
            <div>
              <el-radio v-model="varType" label='1'>本场景变量</el-radio>
              <el-radio v-model="varType" label='2'>全局变量</el-radio>
            </div>
          </div>
          <div class="del">
            <!--<span @click="delTitle()">—</span>-->
          </div>
        </div>
        <div class="inputBoxItem">
          <div class="inputItem">
            <span class="inputMsg"> 变量名称：</span>
            <el-input v-model="nameText" v-if="varType === '1'" placeholder="无变量配置即为空"></el-input>
            <el-select v-model="nameText" placeholder="请选择" v-if="varType === '2'">
              <el-option
                v-for="item in options"
                :key="item.variableId"
                :label="item.variableName"
                :value="item.variableName">
              </el-option>
            </el-select>
          </div>
          <div class="del"></div>
        </div>
        <div class="inputBoxItem" v-if="checkRuler()">
          <div class="inputItem">
            <span class="inputMsg"> 规则变量：</span>
            <el-select v-model="nameText" placeholder="请选择(可为空)">
              <el-option
                v-for="item in rulerList"
                :key="item.paramName"
                :label="item.paramName"
                :value="item.paramName">
              </el-option>
            </el-select>
          </div>
          <div class="del"></div>
        </div>
      </div>
      <div class="btnBox">
        <div class="btnGroup">
          <span class="submit" @click="submit()">提交</span>
          <span class="cancel" @click="close()">取消</span>
        </div>
      </div>

      <span class="relationIcon" @click="[relationShow?relationShow=false:relationShow=true]">
        <i class="fa icons_showInner" aria-hidden="true" v-if="relationShow"></i>
        <i class="fa icons_showOut" aria-hidden="true" v-else></i>
      </span>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import QuillEditor from "vue-quill-editor/src/editor.vue";
  export default {
    components: {QuillEditor},
    name: 'questionAddBox',
    data(){
      return {
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
//              ['blockquote', 'code-block'],

//              [{ 'header': 1 }, { 'header': 2 }],               // custom button values
//              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//              [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
//              [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
//              [{ 'direction': 'rtl' }],                         // text direction

//              [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
//              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

              [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              [{ 'font': [] }],
//              [{ 'align': [] }],

              ['clean']                                         // remove formatting button
            ],
          }
        },
        added: [],
        addQuestion: '',
        relationShow: false,
        searchInput: '',
        searchData: [],
        focusData: '',
        nameText: '',
        variableList: [],
        varType: '1',
      }
    },
    computed:{
      ...mapGetters({
        state: 'getQuestionEditState',
        question: 'getSelectQuestion',
        scenesId: 'getScenesId',
        addLevel: 'getQuestionAddLevel',
        selectScenes: 'getSelectScenes',
        rulerList: 'getRulersProperty',
        options: 'getGlobalVarList'
      })
    },
    methods:{
      close: function () {
        this.$store.dispatch('closeQuestionEdit')
      },
      addItem: function () {
        this.added.push({
          value: ''
        })
      },
      removeItem: function (index) {
        this.added.splice(index,1)
      },
      delTitle: function () {
        this.addQuestion = ''
      },
      submit: function () {
        this.submitData()
      },
      submitData: function () {
        let _self = this
        let arr = []

        this.added.forEach((e)=>{
          arr.push(e.value)
        })
        let reactPid = ''
        if(this.question.hasOwnProperty('entranceId')||this.question === ''||this.question.hasOwnProperty('parent')){
          reactPid = 0
        }else{
          if(this.addLevel === 'same'){
            reactPid = this.question.nodeId
          }else if(this.addLevel === 'before'){
            reactPid = this.question.nodePid
          }else {
            reactPid = this.question.nodeId
          }
        }
        let data = {
          sceneId: this.scenesId,
          nodePid: reactPid,
          content: this.addQuestion,
          jumpTo: -1,
          nodeType: 0,
          variableType: 0,
          variableName: '',
          variableId: ''
        }
        console.log(this.rulerList)
        if(this.nameText.trim()!==''){
          data.variableName = this.nameText.trim()
          if(this.varType === '1'){
            data.variableType = 2
          }else{
            data.variableType = 0
//            this.options.forEach((e)=>{
//              if(e.variableName === this.nameText){
//                data.variableName = e.variableId
//              }
//            })
          }
        }
        this.$api.scene.editor.addQuestionNode(data).then((res)=>{
          if(res.code === 'ok'){
            this.$message({
              message: '新增成功',
              type: 'success',
              duration: 1000
            });
//            let reactIdData = res.result.reactId
//            if(this.addLevel === 'before'){
//              _self.changePid(res.result.reactId)
//            }else if(this.addLevel === 'next'){
//              if(this.question.nodes&&this.question.nodes!==null&&this.question.nodes.length!==0){
//                this.question.nodes.forEach((e)=>{
//                  this.changePidNext(e,reactIdData)
//                })
//              }
//            }
            this.close()
//            this.$message({
//              message: '新增成功',
//              type: 'success',
//              duration: 1000
//            });
            this.$store.dispatch('updateQuestionTree')
          }else{
            this.$message({
              message: res.msg,
              type: 'info',
              duration: 1000
            });
          }
        })
      },

      //上级转接节点
      changePid: function (id) {
        let data = {
          nodeId: this.question.nodeId,
          sceneId: this.question.sceneId,
          nodePid: id,
          content: this.question.content,
          jumpTo: this.question.jumpTo,
          variableType: this.question.variableType
        }
        this.$api.scene.editor.updateQuestionNode(data).then((res)=>{
          this.$store.dispatch('updateQuestionTree')
        })
      },
      //下级转接
      changePidNext: function (item,pid) {
        let data = {
          nodeId: item.nodeId,
          sceneId: item.sceneId,
          nodePid: pid,
          content: item.content,
          jumpTo: item.jumpTo,
          variableType: item.variableType
        }
        this.$api.scene.editor.updateQuestionNode(data).then((res)=>{
          this.$store.dispatch('updateQuestionTree')
        })
      },

      search: function () {
        this.searchResult(this.searchInput)
      },
      searchResult:function (data) {
        this.searchData = []
        if(data!==''){
          this.$api.getLawPiecesByKeyword({
            keyword: data
          }).then((res)=>{
            this.searchData = res.result
            this.searchData.forEach((e)=>{
              e.content = e.content.replace(/\n/g,"<br/>")
            })
          })
        }
      },
      //input聚焦
      getInputSearch: function (data) {
        this.searchResult(data)
      },
      checkRuler: function () {
        let arr = []
        this.rulerList.forEach((e)=>{
          arr.push(e.paramName)
        })
        if(this.selectScenes.ruleName === null||this.selectScenes.ruleName === ''){
          return false
        }else{
          if(this.rulerList.length===0){
            return false
          }else if(arr.indexOf(this.nameText)=== -1&&this.nameText!==''){
            return false
          }else{
            return true
          }
        }
      }
    },
    watch: {
      state:function () {
        this.nameText =  ''
        this.addQuestion = ''
        this.added = []
        this.varType = '1'
      }
    },
    mounted(){
      this.varType = '1'
      this.addQuestion = ''
      this.added = []
      this.nameText = ''
    }
  }
</script>

<style lang="less">

  .questionAddBox{
    .addCtrl{
      color: #2B86F6;
      cursor: pointer;
    }
    .searchPart{
      width: 30rem;
      height: 100%;
      /*margin-right: 1.5rem;*/
      display: flex;
      flex-flow: column;
      padding: 1rem;
      background: #F8F8F8;
      border-right: solid 1px #eee;
      .title{
        width: 100%;
        text-align: left;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #333;
      }
      .searchContent{
        flex: 1;
        margin-top: 1rem;
        background: #fff;
        overflow: auto;
        overflow-x: hidden;
        padding: 1rem;
        .searchItem{
          font-size: 0.8rem;
          margin-bottom: 10px;
          p{
            text-align: left;
            line-height: 1.6;
            span{
              color: #2B86F6;
            }
          }
        }
        .tips{
          height: 100%;
          width: 100%;
          background: #fff;
          span{
            font-size: 1rem;
            color: #999;
          }
        }
      }
    }
    .box{
      .relationIcon{
        position: absolute;
        left: 0;
        top: 45%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1rem;
        height: 3rem;
        /*border: solid 1px #ddd;*/
      }
    }
  }
</style>
