<template>
  <div class="questionEdit questionEditBox" v-if="state.inquiry">
    <div class="box animated fadeInRight">
      <span class="close" @click="close()">
        <i class="iconfont icon-guanbi"></i>
      </span>
      <div class="title">
        追问 <span title="机器人追问" class="icons_question fa"></span>
      </div>
      <div class="inputBox">
        <div class="inputBoxItem">
          <div class="inputItem">
            <span class="inputMsg">*追问问题</span>
            <!--<el-input type="textarea" autosize  v-model="inputText"></el-input>-->

          </div>
          <div class="del">

          </div>
        </div>
        <div class="inputBoxItem">
          <quill-editor :options="editorOption" v-model="inputText">

          </quill-editor>
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
          <div class="del">
            <!--<span @click="delTitle()">—</span>-->
          </div>
        </div>
      </div>
      <div class="btnBox">
        <!--<span class="testBtn">测试一下</span>-->
        <div class="btnGroup">
          <span class="submit" @click="submitAdd()">提交</span>
          <span class="cancel" @click="close()">取消</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import QuillEditor from "vue-quill-editor/src/editor.vue";

  export default {
    components: {
      QuillEditor
    },
    name: 'questionInquiry',
    data(){
      return {
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              [{ 'font': [] }],
              ['clean']                                         // remove formatting button
            ],
          }
        },
        inputText: '',
        jumpText: '',
        searchQuestion: '',
        nameText: '',
        initText: '',
        variableList: [],
        varType: '1',
      }
    },
    computed:{
      ...mapGetters({
        state: 'getQuestionEditState',
        question: 'getSelectQuestion',
        addLevel: 'getQuestionAddLevel',
        rulerList: 'getRulersProperty',
        selectScenes: 'getSelectScenes',
        options: 'getGlobalVarList'
      })
    },
    methods:{
      close: function () {
        this.$store.dispatch('closeQuestionEdit')
      },
      submitAdd: function () {
        let _self = this
        let data = {
          sceneId: this.question.sceneId,
          nodePid: this.question.nodePid,
          nodeId: this.question.nodeId,
          content: this.inputText,
          jumpTo: -1,
          nodeType: this.question.nodeType,
          variableType: this.question.variableType,
          variableName: this.question.variableName,
          variableId: this.question.variableId
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
//                data.variableName = e.variableName
//              }
//            })
          }
        }
        this.commitChange(data)
      },
      commitChange: function (data) {
        this.$api.scene.editor.updateQuestionNode(data).then((res)=>{
          if(res.code === 'ok'){
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            this.close()
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
      question:function () {
        if(this.question&&this.question.hasOwnProperty('content')){
          this.inputText = this.question.content
          if(this.question.variableName){
            this.nameText = this.question.variableName
            this.initText = this.question.variableName
            if(this.question.variableName&&this.question.variableType === 0){
              this.varType = '2'
            }else{
              this.varType = '1'
            }
          }else{
            this.nameText = ''
            this.initText = ''
          }
        }
      }
    },
    mounted(){

    }
  }
</script>

<style lang="less">
  .questionEdit{
    .box{
      .inputBox{
        .inputBoxItem{
          .inputItem{
            .delInner{
              color: #00bfff;
              padding-left: 1rem;
              cursor: pointer;
              min-width: 3rem;
            }
            .delInner:hover{
              color: #FF0000;
            }
          }
        }
      }
    }

  }
</style>
