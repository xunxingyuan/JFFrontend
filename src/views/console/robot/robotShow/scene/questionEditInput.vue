<template>
  <div class="questionEdit questionEditBox" v-if="state.changeInput">
    <div class="box animated fadeInRight">
      <span class="close" @click="close()">
        <i class="iconfont icon-guanbi"></i>
      </span>
      <div class="title">
        输入数据 <span title="用户输入数据" class="icons_question fa"></span>
      </div>

      <div class="inputBox">
        <div class="inputBoxItem">
          <div class="inputItem">
            <span class="inputMsg">*输入类型</span>
            <el-select v-model="inputType" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="del"></div>
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
    name: 'questionEditInput',
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
          value: 4,
          label: '文本框'
        },{
          value: 5,
          label: '时间'
        },{
          value: 6,
          label: '地址录入'
        }],
        inputType: 4
      }
    },
    computed:{
      ...mapGetters({
        state: 'getQuestionEditState',
        question: 'getSelectQuestion',
        questionTree: 'getQuestionTree',
        addLevel: 'getQuestionAddLevel'
      })
    },
    methods:{
      close: function () {
        this.$store.dispatch('closeQuestionEdit')
      },
      //编辑条件
      saveChange: function () {
        let _self = this
        if (this.question.nodeType === 4||this.question.nodeType === 5||this.question.nodeType === 6) {
          let reqData = {
            nodeId: this.question.nodeId,
            sceneId: this.question.sceneId,
            nodePid: this.question.nodePid,
            content: this.inputText,
            jumpTo: -1,
            nodeType:this.inputType
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
        } else {
          //增加下级
          let reqData = {
            sceneId: this.question.sceneId,
            nodePid: this.question.nodeId,
            content: this.inputText,
            jumpTo: -1,
            nodeType:this.inputType
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
        }
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
          this.inputType = 4
        }else if(this.question.nodeType){
          this.inputType = this.question.nodeType
        }

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
