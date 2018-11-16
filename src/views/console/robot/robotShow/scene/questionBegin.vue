<template>
  <div class="questionBegin questionEditBox" v-if="state.begin">
    <same v-if="sameOpen" :same="same" @deleteSame="deleteSame" @editSameItem="editSameItem" @saveSameItem="saveSameItem" @cancelSaveItem="cancelSaveItem" @close="sameOpen=false"></same>
    <question-slot v-if="slotShow" :slotData="slot" @editSlotItem="editSlotItem" @close="slotShow= false" @deleteSlot="deleteSlot" @saveSlotItem="saveSlotItem" @cancelSave="cancelSave"></question-slot>
    <div class="box animated fadeInRight">
      <span class="close" @click="close()">
        <i class="iconfont icon-guanbi"></i>
      </span>
      <div class="title">
        进入场景 <span title="用户问题场景" class="icons_question fa"></span>

      </div>
      <div class="inputBox">
        <p class="inputTitle">用户问题</p>
        <div class="inputBoxItem">
          <div class="inputItem">
            <span class="inputMsg">*用户提问</span>
            <el-input v-model="userQuestion"></el-input>
          </div>
          <div class="del">
            <span>—</span>
          </div>
        </div>
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
        <!--<div class="inputBoxItem" v-for="(item,index) in same">-->
          <!--<div class="inputItem">-->
            <!--<span class="inputMsg">*相似问法</span>-->
            <!--<el-input v-model="item.value"></el-input>-->
          <!--</div>-->
          <!--<div class="del" @click="deleteSame(index)">-->
            <!--<span>-->
              <!--<i class="fa fa-plus"></i>-->
            <!--</span>-->
          <!--</div>-->
        <!--</div>-->
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
        <p class="inputTitle" v-if="giantan">槽点</p>
        <div class="inputBoxItem" v-if="giantan">
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
        <div class="inputBoxItem" v-if="giantan">
          <div class="inputItem">
            <span class="inputMsg"></span>
            <div class="flex sameCtrl">
              <p>槽点<span>{{slot.length}}</span>个  <span @click="slotShow= !slotShow">管理</span></p>
              <!--<div class="loadBox flex">-->
                <!--<span>导入相似问</span>-->
                <!--<span style="margin: 0 10px">|</span>-->
                <!--<section class="moreBox">-->
                  <!--<span>更多</span>-->
                  <!--<div class="more">-->
                    <!--<p>导出相似问</p>-->
                    <!--<p>下载Excel模板</p>-->
                  <!--</div>-->
                <!--</section>-->
              <!--</div>-->
            </div>
          </div>
          <div class="del">
          </div>
        </div>
      </div>
      <div class="btnBox">
        <!--<span class="testBtn">测试一下</span>-->
        <div class="btnGroup">
          <span class="submit" @click="submit()">提交</span>
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
      Same},
    name: 'questionBegin',
    computed:{
      ...mapGetters({
        state: 'getQuestionEditState',
        question: 'getSelectQuestion',
        scenesId: 'getScenesId'
      })
    },
    methods:{
      close: function () {
        this.$store.dispatch('closeQuestionEdit')
      },
      submit: function () {
        let _self = this
        let data
        let arr= []
        this.same.forEach((e)=>{
          arr.push(e.value)
        })
        let slotArr = []
        this.slot.forEach((e)=>{
          slotArr.push(e.value)
        })

        if(this.question.parent!== null){
          data = {
            entranceId: this.question.parent.entranceId,
            question: this.userQuestion,
            similarQuestionList: JSON.stringify(arr),
            sceneId: this.scenesId,
            slotList: JSON.stringify(slotArr)
          }

          this.$api.scene.editor.editScenesRoot(data).then((res)=>{

            if(res.code === 'ok'){
              _self.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
              });
              _self.close()
              _self.$store.dispatch('updateQuestionTree')
            }else{
              _self.$message({
                message: res.msg,
                type: 'error',
                duration: 1000
              });
            }
          })
        }else {
          data = {
            question: this.userQuestion,
            similarQuestionList: JSON.stringify(arr),
            sceneId: this.scenesId,
            slotList: JSON.stringify(slotArr)
          }
          this.$api.scene.editor.addScenesRoot(data).then((res)=>{
            if(res.code === 'ok'){
              _self.$message({
                message: '新增成功',
                type: 'success',
                duration: 1000
              });
              _self.close()
              _self.$store.dispatch('updateQuestionTree')
            }else{
              _self.$message({
                message: res.msg,
                type: 'error',
                duration: 1000
              });
            }
          })
        }
      },
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
      }
    },
    data(){
      return {
        userQuestion: '',
        same: [],
        addSameData: '',
        sameOpen: false,
        changeSameItem: '',
        slot:[],
        slotShow: false,
        addSlotData: '',
        changeSlotItem: '',
        giantan: false
      }
    },
    watch:{
      'question': function () {
        this.userQuestion= ''
        this.same = []
        this.slot = []
        if(this.question&&this.question.hasOwnProperty('parent')&&this.question.parent.question&&this.question.parent.hasOwnProperty('similarQuestionList')){
          this.userQuestion = this.question.parent.question
          if(this.question.parent.similarQuestionList){
            this.question.parent.similarQuestionList.forEach((e)=>{
              this.same.push({
                value: e,
                edit: false
              })
            })
          }
        }
        if(this.question&&this.question.hasOwnProperty('parent')&&this.question.parent.question&&this.question.parent.hasOwnProperty('slotList')){
          if(this.question.parent.slotList){
            this.question.parent.slotList.forEach((e)=>{
              this.slot.push({
                value: e,
                edit: false
              })
            })
          }
        }
        this.sameOpen = false
      }
    },
    mounted(){
      this.giantan = true
//      if(window.sessionStorage.getItem('user')==='giantan'){
//        this.giantan = true
//      }
    }
  }
</script>

<style lang="less">
  .questionBegin{
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
          padding: 0.1rem 1rem;
          margin-top: 1rem;
        }
        .inputBoxItem{
          overflow: initial;
        }
      }
    }
    .inputTitle{
      margin: 1rem 0;
      color: #333;
      font-weight: 600;
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
