<template>
  <div class="questionEdit questionEditBox" v-if="state.changeDuo">
    <div class="box animated fadeInRight">
      <span class="close" @click="close()">
        <i class="iconfont icon-guanbi"></i>
      </span>
      <div class="title">
        多选选项 <span title="用户问题条件选项" class="icons_question fa"></span>
      </div>

      <div class="inputBox scrollbar">
        <div class="inputBoxItem">
          <div class="inputItem">
            <!--<span class="inputMsg">*选项内容</span>-->
            <span class="btn_normal" style="width: 100px;height: 30px" @click="addArr()">添加多选</span>
          </div>
          <div class="del">

          </div>
        </div>

        <div class="inputBoxItem" v-for="(item,index) in inputArr">
          <div class="inputItem">
            <span class="inputMsg">*选项内容{{index+1}}</span>
            <el-input type="textarea" autosize v-model="item.value"></el-input>
          </div>
          <div class="del">
            <i class="fa icons_del_small" @click="removeArr(index)"></i>
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
    components: {

    },
    name: 'questionEditDuo',
    data(){
      return {
        inputText: '',
        jumpText: '',
        searchQuestion: '',
        conditionArr:[{
          inputText: ''
        }],
        inputArr:[]
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
        let contentNew = ''
        let len = this.inputArr.length
        this.inputArr.forEach((e,index)=>{
          if(e.value!==''&&index!==(len-1)){
            contentNew = contentNew + e.value + '||'
          }else{
            contentNew = contentNew + e.value
          }
        })
        if(this.question.nodeType === 0||this.question.nodeType === '0'){
          //增加下级
          let reqData = {
            sceneId: this.question.sceneId,
            nodePid: this.question.nodeId,
            content: contentNew,
            jumpTo: -1,
            nodeType: 3
          }
          let nodes = this.question.nodes

          this.$api.scene.editor.addDuoNode(reqData).then((res)=>{
//            if(nodes!==null&&nodes.length!==0){
//              nodes.forEach((e)=>{
//                this.changeFatherNode(e,res.result.reactId)
//              })
//            }

            _self.$message({
              message: '新增成功',
              type: 'success',
              duration: 1000
            });
            _self.close()
            _self.$store.dispatch('updateQuestionTree')
          })
        }else{
          let reqData = {
            nodeId: this.question.nodeId,
            sceneId: this.question.sceneId,
            nodePid: this.question.nodeId,
            content: contentNew,
            jumpTo: -1,
            nodeType: 3
          }
          this.$api.scene.editor.updateDuoNode(reqData).then((res) => {
            _self.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            _self.close()
            _self.$store.dispatch('updateQuestionTree')
          })
        }
      },
      //增加节点
      addNode: function () {
        let _self = this

        let data = {
          scenesId: this.question.scenesId,
          reactPid: this.question.reactPid,
          content: this.inputText,
          jumpTo: -1,
          reactType: 1
        }
        this.$api.scene.editor.addQuestionNode(data).then((res)=>{

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
              if(res.result.userQuestion!==null){
                this.searchQuestion = res.result.content
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
        if(this.question&&this.question.nodeType === 0){
          this.inputArr = []
        }else if(this.question){
          this.inputArr = []
          if(this.question.hasOwnProperty('content')){
            this.inputText = this.question.content
            this.inputText.split("||").forEach((e)=>{
              this.inputArr.push({
                value: e
              })
            })
          }
        }
      },
      //增加选项
      addArr: function () {
        this.inputArr.push({
          value: ''
        })
      },
      //移除选项
      removeArr: function (index) {
        this.inputArr.splice(index,1)
      }
    },
    mounted(){
      this._initData()
    },
    watch: {
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
