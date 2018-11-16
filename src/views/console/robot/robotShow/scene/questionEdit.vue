<template>
  <div class="questionEdit questionEditBox" v-if="state.change">
    <div class="box animated fadeInRight">
      <span class="close" @click="close()">
        <i class="iconfont icon-guanbi"></i>
      </span>
      <div class="title">
        单选选项 <span title="用户问题条件选项" class="icons_question fa"></span>
      </div>

      <div class="inputBox">
        <div class="inputBoxItem">
          <div class="inputItem">
            <span class="inputMsg">*选项内容</span>
            <el-input type="textarea" autosize v-model="inputText"></el-input>
          </div>
          <div class="del">

          </div>
        </div>
        <div class="inputBoxItem" v-for="item in questionGroup" v-if="item.reactId!==question.reactId||addLevel==='same'">
          <div class="inputItem">
            <span class="inputMsg">*选项内容</span>
            <el-input type="textarea" autosize v-model="item.content" disabled></el-input>
          </div>
          <div class="del">

          </div>
        </div>

        <div class="inputBoxItem" v-if="question.nodeType!== 0&&question.jumpTo!=='-1'&&question.jumpTo!==-1&&question.jumpTo!==null&&question.jumpTo!=='null'">
          <div class="inputItem">
            <span class="inputMsg">*问题跳转</span>
            <p v-html="searchQuestion"></p>
            <p class="delInner" @click="delJump()">删除</p>

          </div>
          <div class="del">
          </div>
        </div>
        <!--<div class="inputBoxItem" v-if="(questionGroup.length===0||questionGroup.length===1)&&addLevel!=='same'&&question.nodeType!==0">-->
          <!--<div class="inputItem">-->
            <!--<span class="inputMsg">类型转换</span>-->
            <!--<el-select v-model="inputType" placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in options"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</div>-->
          <!--<div class="del">-->

          <!--</div>-->
        <!--</div>-->

      </div>
      <div class="btnBox">
        <!--<span class="testBtn">测试一下</span>-->
        <div class="btnGroup">
          <span class="submit" @click="saveChange()">提交</span>
          <span class="cancel" @click="close()">取消</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    components: {},
    name: 'questionEdit',
    data(){
      return {
        inputText: '',
        jumpText: '',
        searchQuestion: '',
        conditionArr:[{
          inputText: ''
        }],
        radio: '',
        options: [{
          value: 1,
          label: '单选'
        },{
          value: 3,
          label: '多选'
        },{
          value: 4,
          label: '文本框'
        },{
          value: 5,
          label: '时间'
        },{
          value: 6,
          label: '地址录入'
        }],
        inputType: 1
      }
    },
    computed:{
      ...mapGetters({
        state: 'getQuestionEditState',
        question: 'getSelectQuestion',
        questionTree: 'getQuestionTree',
        addLevel: 'getQuestionAddLevel',
        questionGroup: 'getSelectQuestionGroup'
      })
    },
    methods:{
      close: function () {
        this.$store.dispatch('closeQuestionEdit')
      },
      //编辑条件
      saveChange: function () {
        let _self = this
        console.log(this.inputType)
        if (this.addLevel === 'same') {
          this.addNode()
        } else {
          if (this.question.nodeType === 1||this.question.nodeType === 2) {
            let reqData = {
              sceneId: this.question.sceneId,
              nodePid: this.question.nodePid,
              nodeId: this.question.nodeId,
              content: this.inputText,
              jumpTo: this.question.jumpTo,
              nodeType: this.inputType,
              similarQuestionList: JSON.stringify(this.question.similarQuestionList),
              slotList: JSON.stringify(this.question.slotList),
              showFlag: this.question.showFlag
            }
            console.log(this.inputType)
            if(this.inputType!==1&&this.inputType!== 2&&this.inputType!== 3){
              reqData.content = ''
            }
            this.$api.scene.editor.updateSoloNode(reqData).then((res) => {
              _self.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
              });
              _self.close()
              _self.$store.dispatch('updateQuestionTree')
            })
          } else {
            //增加下级
            let reqData = {
              sceneId: this.question.sceneId,
              nodePid: this.question.nodeId,
              content: this.inputText,
              jumpTo: this.question.jumpTo,
              nodeType: this.inputType,
              similarQuestionList: '[]',
              slotList: '[]',
              showFlag: 0
            }
            let nodes = this.question.nodes

            this.$api.scene.editor.addSoloNode(reqData).then((res)=>{
              if(nodes!==null&&nodes.length!==0){
                nodes.forEach((e)=>{
                  this.changeFatherNode(e,res.result.reactId)
                })
              }

              _self.$message({
                message: '新增成功',
                type: 'success',
                duration: 1000
              });
              _self.close()
              _self.$store.dispatch('updateQuestionTree')
            })
          }
        }
      },
      //增加节点
      addNode: function () {
        let _self = this

        let data = {
          sceneId: this.question.sceneId,
          nodePid: this.question.nodePid,
          content: this.inputText,
          jumpTo: this.question.jumpTo,
          nodeType: this.inputType,
          similarQuestionList: '[]',
          slotList: '[]',
          showFlag: 0
        }
        this.$api.scene.editor.addSoloNode(data).then((res)=>{

          if(res.code === 'ok'){
            _self.$message({
              message: '新增成功',
              type: 'success',
              duration: 1000
            });
            _self.close()
            _self.$store.dispatch('updateQuestionTree')
          }
        })
      },
      //修改子元素父节点
      changeFatherNode: function (item,pid) {
        let data = {
          reactId: item.reactId,
          scenesId: item.scenesId,
          reactPid: pid,
          content: item.content,
          jumpTo: item.jumpTo,
          reactType: 0
        }
        this.$api.scene.editor.updateQuestionNode(data)
      },

      //查找问题
      checkByID: function (id) {

        if(id){
          this.searchQuestion = ''
          this.$api.scene.editor.getSoloQuestionById({
            nodeId: id
          }).then((res)=>{
            if(res.code === 'ok'){
              if(res.node.content!==null){
                this.searchQuestion = res.node.content
              }
            }
          })
        }
      },
      //删除跳转
      delJump: function () {
        this.$confirm('此操作将永久删除该问题跳转, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.question.jumpTo = -1
        })
      },
      //初始化
      _initData: function () {
        this.inputText = ''
        this.jumpText = ''
        this.searchQuestion = ''
        if(this.question&&this.question.nodeType!== 0){
//          this.inputType = this.question.nodeType

          if (this.addLevel === 'same') {
            this.inputText = ''
          }else{
            if(this.question.hasOwnProperty('content')){
              this.inputText = this.question.content
            }
          }
        }
        if(this.question.nodeType!== 0&&this.question.hasOwnProperty('jumpTo')&&this.question.jumpTo!==null&&this.question.jumpTo!==-1&&this.question.jumpTo!=='-1'){
          this.checkByID(this.question.jumpTo)
        }
        if(this.question&&this.addLevel === 'same') {
          this.inputText = ''
          this.searchQuestion = ''
          this.jumpText = ''
          this.question.jumpTo = -1
        }else{
          if(this.question&&this.question.hasOwnProperty('content')&&this.question.nodeType!==0){
            this.inputText = this.question.content
          }
        }
      }
    },
    mounted(){
//      this._initData()
    },
    watch: {
      addLevel: function () {
        this._initData()
      },
      question: function(){
        this._initData()
      }
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
