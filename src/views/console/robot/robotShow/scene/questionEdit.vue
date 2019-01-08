<template>
  <div class="questionEdit questionEditBox" v-if="state.change">
    <same v-if="sameOpen" :same="same" @deleteSame="deleteSame" @editSameItem="editSameItem" @saveSameItem="saveSameItem" @cancelSaveItem="cancelSaveItem" @close="sameOpen=false"></same>
    <question-slot v-if="slotShow" :slotData="slot" @editSlotItem="editSlotItem" @close="slotShow= false" @deleteSlot="deleteSlot" @saveSlotItem="saveSlotItem" @cancelSave="cancelSave"></question-slot>
    <div class="box animated fadeInRight">
      <span class="close" @click="close()">
        <i class="fa icons_close"></i>
      </span>
      <div class="title">
        单选选项 <span title="用户问题条件选项" class="icons_question fa"></span>
        <span style="color: #999;font-size: 0.8rem;margin-left: 2rem">  显示选项内容  </span><el-switch
              v-model="ifShow"
              :active-value='1'
              :inactive-value='0'
              active-color="#2B86F6"
              inactive-color="#d6d6d6">
      </el-switch>
      </div>

      <div class="inputBox scrollbar">
        <div class="bg">
          <div class="inputBoxItem">
            <div class="inputItem">
              <span class="inputMsg">*选项内容</span>
              <el-input type="textarea" autosize v-model="inputText"></el-input>
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
            <i class="fa icons_jump_relation"></i>
          </div>
          <div class="inputBoxItem" v-for="item in questionGroup" v-if="item.reactId!==question.reactId||addLevel==='same'">
            <div class="inputItem">
              <span class="inputMsg">*选项内容</span>
              <el-input type="textarea" autosize v-model="item.content" disabled></el-input>
            </div>
            <div class="del">

            </div>
          </div>


          <!--<div class="inputBoxItem" v-if="(questionGroup.length===0||questionGroup.length===1)&&addLevel!=='same'&&question.type!==0">-->
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

        <div class="bg">
          <p class="inputTitle">训练机器人</p>
          <div class="inputBoxItem">
            <div class="inputItem">
              <span class="inputMsg">*相似问题</span>
              <el-input v-model="addSameData" placeholder="输入需要添加的相似问题"></el-input>
            </div>
            <div class="del" @click="addSame()">
            <span>
              <i class="fa fa-plus"></i>
            </span>
            </div>
          </div>
          <div class="inputBoxItem">
            <div class="inputItem">
              <span class="inputMsg"></span>
              <div class="flex sameCtrl">
                <p>相似问<span>{{same.length}}</span>个  <span @click="sameOpen= !sameOpen">管理</span></p>
                <div class="loadBox flex">
                  <span>导入相似问</span>
                  <span style="margin: 0 10px">|</span>
                  <section class="moreBox">
                    <span>更多</span>
                    <div class="more">
                      <p>导出相似问</p>
                      <p>下载Excel模板</p>
                    </div>
                  </section>

                </div>
              </div>
            </div>
            <div class="del">
            </div>
          </div>
        </div>
        <div class="bg">
          <p class="inputTitle">槽点</p>
          <div class="inputBoxItem">
            <div class="inputItem">
              <span class="inputMsg">*槽点内容</span>
              <el-input v-model="addSlotData" placeholder="输入需要添加的槽点内容"></el-input>
            </div>
            <div class="del" @click="addSlot()">
            <span>
              <i class="fa fa-plus"></i>
            </span>
            </div>
          </div>
          <div class="inputBoxItem">
            <div class="inputItem">
              <span class="inputMsg"></span>
              <div class="flex sameCtrl">
                <p>槽点<span>{{slot.length}}</span>个  <span @click="slotShow= !slotShow">管理</span></p>
              </div>
            </div>
            <div class="del">
            </div>
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
  import Same from "./tools/same.vue";
  import QuestionSlot from "./tools/questionSlot.vue";

  export default {
    components: {
      QuestionSlot,
      Same
    },
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
        inputType: 1,
        giantan: false,
        same: [],
        slot: [],
        addSameData: '',
        addSlotData: '',
        slotShow: false,
        sameOpen: false,
        ifShow: 1
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
        let arr= []
        this.same.forEach((e)=>{
          if(e.value.trim()){
            arr.push(e.value)
          }
        })
        let slotArr = []
        this.slot.forEach((e)=>{
          if(e.value.trim()){
            slotArr.push(e.value)
          }
        })
        if(this.question.nodeType === 0){
          let data = {
            sceneId: this.question.sceneId,
            nodePid: this.question.nodeId,
            content: this.inputText,
            showFlag: this.ifShow,
            jumpTo: -1,
            nodeType: 1,
            similarQuestionList: JSON.stringify(arr),
            slotList: JSON.stringify(slotArr)
          }
          this.addNode(data)
        }else{
          if(this.addLevel === 'same'){
            let data = {
              sceneId: this.question.sceneId,
              nodePid: this.question.nodePid,
              content: this.inputText,
              showFlag: this.ifShow,
              jumpTo: -1,
              nodeType: 1,
              similarQuestionList: JSON.stringify(arr),
              slotList: JSON.stringify(slotArr)
            }
            this.addNode(data)
          }else{
            //更新
            let reqData = {
              sceneId: this.question.sceneId,
              nodePid: this.question.nodePid,
              nodeId: this.question.nodeId,
              content: this.inputText,
              jumpTo: -1,
              nodeType: 1,
              similarQuestionList: JSON.stringify(arr),
              slotList: JSON.stringify(slotArr),
              showFlag: this.ifShow
            }
            this.$api.scene.editor.updateSoloNode(reqData).then((res)=>{
              if(res.code === 'ok'){
                _self.$message({
                  showClose: true,
                  message: '更新成功',
                  type: 'success',
                  duration: 1000
                });
                _self.$store.dispatch('updateQuestionTree')
                _self.close()
              }else{
                _self.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'error',
                  duration: 1000
                });
              }
            })
          }
        }
      },
      //增加节点
      addNode: function (data) {
        let _self = this
        this.$api.scene.editor.addSoloNode(data).then((res)=>{
          if(res.code === 'ok'){
            _self.$message({
              showClose: true,
              message: '新增成功',
              type: 'success',
              duration: 1000
            });
            _self.close()
            _self.$store.dispatch('updateQuestionTree')
          }
        })
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
        if(this.question&&this.question.nodeType === 0){
          this.inputText = ''
          this.same = []
          this.slot = []
          this.ifShow = true
        }else{
          if (this.addLevel === 'same'){
            this.inputText = ''
            this.same = []
            this.slot = []
            this.ifShow = true
          }else{
            this.inputText = this.question.content
            this.ifShow = this.question.showFlag
            this._initSameSlot()
            if(this.question.nodeType!== 0&&this.question.hasOwnProperty('jumpTo')&&this.question.jumpTo!==null&&this.question.jumpTo!==-1&&this.question.jumpTo!=='-1'){
              this.checkByID(this.question.jumpTo)
            }
          }
        }
      },
      _initSameSlot: function () {
        this.same = []
        this.slot = []
        if(this.question.hasOwnProperty('similarQuestionList')){
          this.question.similarQuestionList.forEach((e)=>{
            this.same.push({
              value: e,
              edit: false
            })
          })
        }
        if(this.question.hasOwnProperty('slotList')){
          this.question.slotList.forEach((e)=>{
            this.slot.push({
              value: e,
              edit: false
            })
          })
        }
      },
      //添加相似问
      addSame: function () {
        if(this.addSameData!==''){
          this.same.push({
            value: this.addSameData,
            edit: false
          })
          this.addSameData = ''
        }
      },
      deleteSame: function (index) {
        this.same.splice(index,1)
      },
      //编辑相似问题
      editSameItem: function (val) {
        this.same.forEach((e,index)=>{
          if(index === val){
            e.edit = true
          }else{
            e.edit = false
          }
        })
      },
      //保存编辑
      saveSameItem: function (val) {
        this.same.forEach((e,index)=>{
          if(index=== val.index){
            e.value = val.value
            e.edit = false
          }
        })
      },
      //取消保存
      cancelSaveItem: function (val) {
        this.same.forEach((e,index)=>{
          if(index=== val){
            e.edit = false
          }
        })
      },

      //添加槽点
      addSlot: function () {
        if(this.addSlotData!==''){
          this.slot.push({
            value: this.addSlotData,
            edit: false
          })
          this.addSlotData = ''
        }
      },
      deleteSlot: function (index){
        this.slot.splice(index,1)
      },
      editSlotItem: function (val){
        this.slot.forEach((e,index)=>{
          if(index === val){
            e.edit = true
          }else{
            e.edit = false
          }
        })
      },
      saveSlotItem: function (val){
        this.slot.forEach((e,index)=>{
          if(index === val.index){
            e.value =  val.value
            e.edit = false
          }
        })
      },
      cancelSave: function (val) {
        this.slot.forEach((e,index)=>{
          if(index === val){
            e.edit = false
          }
        })
      },
    },
    mounted(){
//      this._initData()
//      if(window.sessionStorage.getItem('user')==='giantan'){
//        this.giantan = true
//      }
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
    .addSlot{
      position: absolute;
      background: #fff;
      top: 4rem;
      right: 2rem;
    }
    .box{
      .inputBox{
        .bg{
          background: #F6F6F6;
          padding: 0.5rem 1rem;
          margin-top: 1rem;
        }
        .inputBoxItem{
          position: relative;
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
          .icons_jump_relation{
            position: absolute;
            right: 0;
            top: -35px;
          }
        }
      }
    }
    .sameCtrl{
      width: 100%;
      justify-content: space-between;
      span{
        cursor: pointer;
        color: #2B86F6;
      }
      .loadBox{
        .moreBox{
          position: relative;
          height: 2rem;
          .more{
            z-index: 1000;
            background: #fff;
            position: absolute;
            display: none;
            right: 0;
            top: 2rem;
            width: 8rem;
            height: 4.5rem;
            padding: 0.25rem 0;
            border: solid 1px #D6D6D6;
            box-shadow: 0 0 5px #D6D6D6;
            p{
              height: 2rem;
              line-height: 2rem;
              padding: 0 1rem;
              font-size: 0.8rem;
              cursor: pointer;
            }
            p:hover{
              color: #2B86F6;
            }
          }
        }
        .moreBox:hover{
          .more{
            display: block;
          }
        }
      }
    }

  }
</style>
