<template>
  <div class="editContainTest" v-if="state.testAuto">
    <div class="test flex animated fadeInRight">
      <div class="title flex">
        <div class="left">
          <p>测试对话</p>
          <span>当前位置：<span v-for="(item,index) in menuData">{{item.name}}<span v-if="index!==(menuData.length-1)">/</span></span><span v-if="selectScenes!==''">/{{selectScenes.scenesName}}</span></span>
        </div>
        <i @click="closeTest()" aria-hidden="true" class="iconfont icon-guanbi"></i>
      </div>
      <div class="content">
        <div class="inner scrollbar" id="testAutoBox">
          <div class="talk animated fadeInUp robot">
            <span class="icon"><i class="fa icons_robot_pic"></i><i class="fa icons_user_pic"></i></span>
            <div class="textBox">
              <p class="time"></p>
              <p class="text">{{settingData[0].data}}</p>
            </div>
          </div>
          <div class="talk" v-for="(item,index) in talkAutoList" :class="item.type" v-if="item.text!==''">
            <span class="icon"><i class="fa icons_robot_pic"></i><i class="fa icons_user_pic"></i></span>
            <div class="textBox">
              <p class="time"></p>
              <div class="text">
                <span v-html="item.text"></span>
                <p class="innerItem" v-for="(data,index) in item.conditions" v-if="data!==''">{{index+1}}. {{data}}</p>
                <span class="practice" @click="practice(item.text)"><i class="fa icons_practice"></i></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="input flex">
        <div class="ctrlBox flexCenter">
          <span class="ctrlBtn flexCenter" @click="autoState = false" v-if="autoState"><i class="fa icons_pause" aria-hidden="true"></i>  <p style="margin-left: 10px;">自动模拟回答</p></span>
          <span class="ctrlBtn flexCenter" @click="autoState = true" v-else><i class="fa icons_run" aria-hidden="true"></i> <p style="margin-left: 10px;">自动模拟回答</p></span>
          <span class="ctrlBtn flexCenter" @click="changeToNormal()">切换到正常回答</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Qs from 'qs'
  import bus from '../../../tools/bus'
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button.vue";
  import ElInput from "../../../../node_modules/element-ui/packages/input/src/input.vue";

  export default {
    components: {
      ElInput,
      ElButton},
    name: 'editPart',
    data(){
      return {
        textarea2: '',
        autoState: true,
        talkList: [],
        talkAutoList: [],
        talkAuto: false,
        talkCtrl: '',
        inputText: '',
        timeNow: '',
        talkReplyList: [],
        menuData: []
      }
    },
    computed:{
      ...mapGetters({
        state: 'getQuestionEditState',
        autoId: 'getAutoId',
        scenesId: 'getScenesId',
        scenesList: 'getScenesList',
        settingData: 'getQuestionCommonSetting',
        categoryTreeRoot: 'getCategoryTreeRoot',
        categoryTreeArr: 'getCategoryTreeArr',
        activeCategory: 'getActiveCategory',
        selectScenes: 'getSelectScenes'
      })
    },
    methods:{
      closeTest: function () {
        this.$store.dispatch('closeQuestionEdit')
        clearInterval(this.talkCtrl)
      },
      beginAuto: function () {
        let _self = this
        this.talkCtrl = setInterval(()=>{
          if(_self.autoState&&_self.talkList.length!==0){
            _self.talkAutoList.push(_self.talkList[0])
            _self.talkList.splice(0,1)
            this.scrollToBottom('testAutoBox')
          }
        },5000)
      },
      //普通对话
      changeToNormal: function () {
        console.log('changetoNormal')
        this.closeTest()
        this.$store.dispatch('setQuestionEdit',{
          type: 'test'
        })
      },
      //平滑滚动
      scrollToBottom: function (id) {
        setTimeout(()=>{
          let objDiv  = document.getElementById(id)
          let scrollHeight = objDiv.scrollHeight - objDiv.clientHeight
          objDiv.scrollTop = scrollHeight
        },200)
      },
      //获取路径
      getPath: function () {
        this.menuData = []
        if(this.activeCategory){
          this.activeCategory.path.forEach((e)=>{
            this.categoryTreeArr.forEach((ele)=>{
              if(ele.id === e){
                this.menuData.push({
                  id: ele.id,
                  name: ele.name
                })
              }
            })
          })
        }
      },
      practice: function (val) {
        this.$store.dispatch('setQuestionEdit',{
          type: 'practiceQuestion'
        })
        this.$store.dispatch('setPracticeQuestion',val)
      }
    },
    mounted(){
      this.getPath()
    },
    watch: {
      autoId: function () {
        console.log(this.autoId)
        this.talkAutoList = []
        let reqData
        if(this.autoId.hasOwnProperty('answerId')){
          reqData = {
            scenesId: this.autoId.scenesId,
            reactId: this.autoId.reactId,
            answerId: this.autoId.answerId
          }
        }else{
          reqData = {
            scenesId: this.autoId.scenesId,
            reactId: this.autoId.reactId,
          }
        }
        console.log(reqData)
        this.talkList = []
        this.$api.getAutoQuestion(reqData).then((res)=>{
//          this.talkList = res.result
          res.result.forEach((e,index)=>{
            if(e.type === 1||e.type === '1'){
              this.talkList.push({
                text: e.content,
                conditions: e.options,
                type: 'user'
              })
            }else{
              this.talkList.push({
                text: e.content,
                conditions: e.options,
                type: 'robot'
              })
            }
          })

          this.beginAuto()
        })
      },
      activeCategory: function () {
        this.getPath()
        this.$store.dispatch('setScenesId',{
          id: '',
          data: ''
        })
      }
    }
  }
</script>

<style lang="less">
  .editContainTest {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    z-index: 2001;
    right: 0;
    top: 0;
    .test {
      margin-right: 0.5rem;
      width: 30rem;
      height: 35rem;
      background: #fff;
      border-radius: 2px;
      /*align-self: flex-start;*/
      flex-flow: column;
      .content {
        flex: 1;
        position: relative;
        background: #F4F6F8;
        .inner {
          position: absolute;
          height: 100%;
          width: 100%;
          left: 0;
          right: 0;
          top: 0;
          overflow: auto;
          padding: 1rem;
        }
      }
      .input {
        height: 8rem;
        width: 100%;
        position: relative;
        flex-flow: column;
        .change{
          height: 1.4rem;
          min-height: 1.4rem;
          width: 100%;
          background: #ECF4FE;
          color: #2B86F6;
          font-size: 12px;
          line-height: 1.2rem;
          cursor: pointer;
        }
        .inputBox {
          flex: 1;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: solid 1px #EEEEEE;
          .el-textarea{
            width: 100%;
            textarea{
              border: none;
              font-size: 14px;
              resize: none;
            }
          }
        }
        .ctrlBox{
          flex: 1;
          border-top: solid 1px #EEEEEE;
          span{
            width: 11rem;
            height: 42px;
            line-height: 42px;
            color: #333;
            border: solid 1px #ddd;
            border-radius: 2px;
            font-size: 14px;
            cursor: pointer;
          }
          span:nth-child(1){
            background: #2B86F6;
            color: #fff;
            border: none;
            margin-right: 1rem;
          }
        }
      }
    }
  }
</style>
