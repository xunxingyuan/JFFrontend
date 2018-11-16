<template>
  <div class="editContainTest" v-if="state.test">
    <div class="choseRobot flexCenter" v-if="choseRobot">
      <i @click="closeTest()" aria-hidden="true" class="iconfont icon-guanbi"></i>
      <p>选择机器人:</p>
      <el-select v-model="robotId" placeholder="请选择机器人">
        <el-option
          v-for="item in robotList"
          :key="item.robotId"
          :label="item.robotName"
          :value="item.robotId">
        </el-option>
      </el-select>
      <el-button class="comfirm" type="primary" @click = "showTest()">确认</el-button>
    </div>
    <div class="test flex animated fadeInRight" v-if="!choseRobot">
      <div class="title flex">
        <div class="left">
          <p>正常回答 <span class="change" @click="choseRobot = true">切换机器人</span></p>
          <!--<span>当前位置：<span v-for="(item,index) in menuData">{{item.name}}<span v-if="index!==(menuData.length-1)">/</span></span><span><span v-if="selectScenes!==''">/{{selectScenes.scenesName}}</span></span></span>-->
        </div>
        <i @click="closeTest()" aria-hidden="true" class="iconfont icon-guanbi"></i>
      </div>
      <div class="content">
        <div class="inner scrollbar" id="testReplyBox">
          <div class="talk animated fadeInUp robot">
            <span class="icon"><i class="fa icons_robot_pic"></i><i class="fa icons_user_pic"></i></span>
            <div class="textBox">
              <p class="time"></p>
              <p class="text">{{settingData[0].data}}</p>
            </div>
          </div>
          <div class="talk" v-for="(item,index) in talkReplyList" :key="index+1" :class="item.type" v-if="item.text!==''">
            <span class="icon"><i class="fa icons_robot_pic"></i><i class="fa icons_user_pic"></i></span>
            <div class="textBox">
              <p class="time"></p>
              <div class="text">
                <p v-html="item.text"></p>
                <p class="innerItem" v-for="(data,index) in item.conditions" @click.once="setValue(data)" v-if="data!==''">{{index+1}}. <span v-html="data"></span></p>
                <span class="practice" @click="practice(item.text)"><i class="fa icons_practice"></i></span>
                <span class="search" @click="search(item)"><i class="fa fa-search"></i></span>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="input flex">
        <div class="timeSelect" v-if="showOption.type===5">
          <el-date-picker
            v-model="selectTime"
            type="datetime"
            placeholder="选择日期时间"
            @change="selectTimeItem">
          </el-date-picker>
        </div>
        <div class="timeSelect" v-if="showOption.type===6">
          <el-cascader
            :options="areaData"
            v-model="areaSelect"
            change-on-select
            @change="selectAreaData"
            :props="props"
          ></el-cascader>
        </div>
        <!--<p class="change" @click="changeNormal()">切换到自动随机模拟</p>-->
        <div class="inputBox">
          <el-input
            type="textarea"
            @focus="ctrlSubmit"
            @blur="ctrlSubmit"
            :autosize="{ minRows: 2, maxRows: 3}"
            placeholder="请输入测试的内容"
            v-model="inputText"
            :disabled="showOption.type===5||showOption.type===6"
            @keyup.enter.native="sendTalk()">
          </el-input>
        </div>
        <div class="submit" :class="{'active': inputFocus}">
          <span @click="sendTalk()">提交</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

  import { mapGetters, mapActions } from 'vuex'
  import Qs from 'qs'
  import bus from '../../../tools/bus'
  import area from '../../common/api/area.json'

  export default {
    components: {},
    name: 'testPart',
    data(){
      return {
        textarea2: '',
        auto: true,
        autoState: true,
        talkList: [],
        talkAutoList: [],
        talkAuto: false,
        talkCtrl: '',
        inputText: '',
        timeNow: '',
        talkReplyList: [],
        menuData: [],
        selfCheck: true,
        selfResult: [],
        inputFocus: false,
        showOption:{
          show: false,
          type: 1
        },
        selectTime: '',
        areaData: [],
        selectArea: [],
        areaSelect:[],
        props: {
          value: 'id',
          children: 'cities'
        },
        choseRobot: true,
        options: [],
        robotId: '',
        robotObject: ''
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
        selectScenes: 'getSelectScenes',
        robotList: 'getRobotList'
      })
    },
    methods:{
      showTest: function () {
        if(this.robotId!== ''){
          this.choseRobot = false
        }else{
          this.$message({
            message: '输入不能为空',
            type: 'info',
            duration: 1000
          });
        }
      },
      closeTest: function () {
        this.$store.dispatch('closeQuestionEdit',{
          type: 'test'
        })
        this.timeNow = ''
        this.talkReplyList = []
        clearInterval(this.talkCtrl)
      },

      //自动对话
      changeNormal: function () {
        this.closeTest()
        this.$store.dispatch('setQuestionEdit',{
          type: 'auto',
        })
      },
      sendTalk: function () {
        this.inputText = this.inputText.replace('\n','')
        this.talkReplyList.push({
          text: this.inputText,
          type: 'user'
        })
        if(this.timeNow===''){
          this.timeNow = Date.parse( new Date())
        }
        this.sendTalkNew()
      },
      sendTalkCtrl: function () {
        let data = {
          "id": "1522228894804",
          "clientId": "web",
          "messageType": "1",
          "signature": "",
          "sessionId": this.timeNow,
          "content": this.inputText,
          "source": "gbotLaw",
          "test": false,
          "expection": "",
          "attributes": {}
        }
        this.inputText = ''
        this.selectArea = []
        this.selectTime= ''
        this.areaSelect= []
        this.$api.sendTalk(data).then((res)=>{
          if(res.status === 200&&res.content){
            if(res.attributes.hasOwnProperty('optionType')){
              let type = res.attributes.optionType
              if(type === 3||type === '3'){
                this.showOption.type = 3
              }else if(type === 5||type === '5'){
                this.showOption.type = 5
              }else if(type === '6'||type === 6){
                this.showOption.type = 6
              }else{
                this.showOption.type = 1
                this.showOption.show = false
              }
            }
            let data = res
            let dataDetail = []
            data.content.split('@#@').forEach((e)=>{
              e.split('@@@').forEach((ele)=>{
                dataDetail.push(ele)
              })
            })
            let len = dataDetail.length
            let react =  data.attributes

            for(let i=0;i< len;i++){
              setTimeout(()=>{
                if(i===(len-1)){
                  let content = dataDetail[i].replace(/\#\$\#/g,"<br\>")
                  let conditions=[]
                  data.recommendDataSet.forEach((e)=>{
                    conditions.push(e.question)
                  })
                  this.talkReplyList.push({
                    text: content,
                    conditions: conditions,
                    type: 'robot',
                    data: react
                  })
                  //法律意见书
                  if(res.attributes.hasOwnProperty('ruleMsg')){
                    this.talkReplyList.push({
                      text: res.attributes.ruleMsg,
                      conditions: [],
                      type: 'robot',
                      data: react
                    })
                  }
                  this.scrollToBottom('testReplyBox')
                }else{
                  let content = dataDetail[i].replace(/\#\$\#/g,"<br\>")
                  this.talkReplyList.push({
                    text: content,
                    conditions: [],
                    type: 'robot',
                    data: react
                  })
                }
              },i*100)
            }
          }else{
            //法律意见书
            if(res.attributes.hasOwnProperty('ruleMsg')){
              this.talkReplyList.push({
                text: res.attributes.ruleMsg,
                conditions: [],
                type: 'robot',
                data: res.attributes
              })
            }
            this.showOption.type = 1
          }
        })
      },
      sendTalkNew: function () {
        let data = {
          robotId: this.robotId,
          source: 'web',
          content: this.inputText,
          attributes: JSON.stringify({}),
          messageType: 1,
        }
        if(this.inputText.trim()!==''){
          this.$api.gkiApi.robot.robotReply(data).then((res)=>{
            console.log(res)
            if(res.msg === 'ok'){
              this.inputText = ''
              this.talkReplyList.push({
                text: res.data.content,
                conditions: [],
                type: 'robot',
                data: res.data.attributes
              })
            }else{
              this.$message({
                message: res.msg,
                type: 'error',
                duration: 1000
              });
            }
          })
        }else{
          this.$message({
            message: '输入不能为空',
            type: 'info',
            duration: 1000
          });
        }
      },
      //平滑滚动
      scrollToBottom: function (id) {
        setTimeout(()=>{
          let objDiv  = document.getElementById(id)
          let scrollHeight = objDiv.scrollHeight - objDiv.clientHeight
          objDiv.scrollTop = scrollHeight
        },200)
      },
      //选项点击
      setValue: function (data) {
        if(this.showOption.type === 3){

          if(this.inputText === ''){
            this.inputText = data
          }else{
            this.inputText += '##' + data
          }
        }else{
          this.inputText = data
          this.sendTalk()
        }
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
      //当前目录匹配查找
      getSameScenes: function (val) {
        let _self = this
        _self.selfResult = []
        this.checkMenu(val).then((res)=>{
          if(res.length === 0){
            _self.sendTalkCtrl()
          }else{
            _self.$api.scene.getCategoryById({
              id: res.id
            }).then((response)=>{
              if(response.status === 200){
                if(response.data.result.length ===0){
                  _self.sendTalkCtrl()
                }else{
                  _self.talkReplyList.push({
                    text: '你可能想问的是？',
                    conditions:[]
                  })
                  _self.inputText = ''
//                  _self.selfCheck = false
                  _self.scrollToBottom('testReplyBox')

                  let len = _self.talkReplyList.length
                  response.data.result.forEach((e)=>{
                    _self.$api.scene.editor.getScenesById({
                      id: e.scenesId
                    }).then((resp)=>{
                      if(resp.data.result!==null&&resp.data.result.userQuestion!==null){
                        _self.talkReplyList[len-1].conditions.push(resp.data.result.question)
                      }
                    })
                  })
                }
              }
            })
          }
        })
      },
      //检查是否包含在目录
      checkMenu: function (val) {
        return new Promise((resolve,reject)=>{
          let data = []
          this.categoryTreeArr.forEach((e)=>{
            let name = encodeURI(e.name)
            let selectVal =  encodeURI(val).replace('%0A','')
            if(name === selectVal) {
              resolve(e)
            }
          })
          resolve(data)
        })
      },
      practice: function (val) {
        this.$store.dispatch('setQuestionEdit',{
          type: 'practiceQuestion'
        })
        this.$store.dispatch('setPracticeQuestion',val)
      },
      ctrlSubmit: function () {
        this.inputFocus = !this.inputFocus
      },
      search: function (node) {
        console.log(node)
        let data
        if(node.data.hasOwnProperty('reactId')){
          data ={
            reactId: node.data.reactId
          }
        }else if(node.data.hasOwnProperty('answerId')){
          data ={
            answerId: node.data.answerId
          }
        }

        if(node.data.hasOwnProperty('reactId')||node.data.hasOwnProperty('answerId')){
          this.$api.scene.editor.getNodePath(data).then((res)=>{
            console.log(res)
            if(res.code === 'ok'){
              this.$store.dispatch('setSearchNodeData',{
                scenes: res.scenes,
                categories: res.categories
              })
            }else{
              this.$store.dispatch('setSearchNodeData','')
            }
          })
        }else if(node.data.hasOwnProperty('QAID')){
          this.$api.getSoloCatalog({
            qaId: node.data.QAID
          }).then((res)=>{
            if(res.result === -1001){
              this.$store.dispatch('loginCtrl').then(()=>{
                this.$api.getSoloCatalog({
                  qaId: node.data.QAID
                }).then((response)=>{
                  this.$store.dispatch('setSearchNodeData',{
                    scenes: response.data.data.question,
                    categories: response.data.data.category,
                    type: 'solo'
                  })
                })
              })
            }else{
              this.$store.dispatch('setSearchNodeData',{
                scenes: res.data.question,
                categories: res.data.category,
                type: 'solo'
              })
            }
          })
        }
        this.$store.dispatch('setQuestionEdit',{
          type: 'searchQuestion'
        })
        this.$store.dispatch('setSearchQuestionNode',node)
      },
      selectTimeItem: function (val) {
        this.inputText =  Date.parse(val).toString()
      },
      selectAreaData: function (val) {
        let len = val.length
        let id = val[len-1]
        this.coverTree(this.areaData,id)
      },

      //遍历节点树
      coverTree: function (tree,id) {
        tree.forEach((e)=>{
          if(e.id === id){
            this.selectArea.push(e.label)
            e.cities = []
            this.getArea(id,e.cities,area)
          }else {
            this.coverTree(e.cities,id)
          }
        })
      },
      getArea: function (id,item,arr) {
        for(let data in arr[id]){
          item.push({
            label: arr[id][data],
            id: data,
            cities: []
          })
        }
      }
    },
    mounted(){
//      this.getPath()
      this.areaData = []
      this.getArea('86',this.areaData,area)
      this.choseRobot = true
      this.robotId = ''
    },
    watch: {
      state: function () {
        this.timeNow = Date.parse( new Date())
        this.talkReplyList = []
        this.selectArea = []
        this.showOption.type = 1
        this.choseRobot = true
        this.robotId = ''
        this.robotObject = ''
      },
      activeCategory: function () {
        this.getPath()
        this.$store.dispatch('setScenesId',{
          id: '',
          data: ''
        })
      },
      selectArea: function () {
        this.inputText = ''
        this.selectArea.forEach((e,index)=>{
          if(index === 0){
            this.inputText = e
          }else{
            this.inputText +=  '##' + e
          }
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
      .title {
        background: #2B86F6;
        border-radius: 2px 2px 0 0;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 1rem;
        height: 3rem;
        min-height: 3rem;
        .left{
          text-align: left;
          flex: 1;
          margin-right: 1rem;
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          p {
            /*height: 2.5rem;*/
            /*line-height: 2.5rem;*/
            font-size: 0.9rem;
            color: #fff;
            width: 100%;
            text-align: left;
          }
          span{
            font-size: 12px;
            color: #D1E6FF;
            text-align: left;
          }
        }
        i{
          color: #fff;
          min-width: 18px;
        }
      }

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
          .talk {
            margin-bottom: 10px;
            /*min-height: 3rem;*/
            height: auto;
            display: flex;
            align-items: center;
            .icon {
              width: 2.7rem;
              min-width: 2.7rem;
              height: 2.7rem;
              margin-top: 1.2rem;
              border-radius: 1.3rem;
              /*border: solid 1px #999;*/
              align-self: flex-start;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #999;
            }
            .textBox{
              width: 100%;
              display: flex;
              flex-flow: column;
              .text {
                flex: 1;
                width: auto;
                max-width: 80%;
                word-break: break-all;
                padding: 0.5rem;
                color: #000;
                border-radius: 6px;
                min-height: 2.7rem;
                font-size: 0.7rem;
                text-align: left;
                line-height: 1.5;
                display: inline-block;
                height: auto;
                position: relative;
                .innerItem{
                  /*height: 1.5rem;*/
                  width: 100%;
                  background: #F4F4F4;
                  color: #2B86F6;
                  line-height: 1.5rem;
                  margin-bottom: 5px;
                  margin-top: 5px;
                  padding-left: 0.5rem;
                  padding-right: 0.5rem;
                  cursor: pointer;
                  display: flex;
                }
                .practice{
                  position: absolute;
                  width: 30px;
                  height: 24px;
                  left: -30px;
                  bottom: 2px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 10px;
                  color: #2B86F6;
                  cursor: pointer;
                  i{
                    margin-right: 2px;
                  }
                }
                .search{
                  position: absolute;
                  width: 30px;
                  height: 24px;
                  right: -30px;
                  bottom: 2px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 10px;
                  color: #2B86F6;
                  cursor: pointer;
                  i{
                    margin-right: 2px;
                  }
                }

                /*margin-top: 1rem;*/
              }
              .time{
                height: 1.2rem;
                line-height: 1.2rem;
                font-size: 12px;
                color: #999;
              }
            }
          }
          .robot{
            justify-content: flex-start;
            .icon {
              margin-right: 0.8rem;
              /*background: #fff;*/
              /*border: solid 1px #ddd;*/
              .icons_user_pic{
                display: none;
              }
            }
            .textBox{
              align-items: flex-start;
              .text{
                background: #fff;
                border: solid 1px #ddd;
                .practice{
                  display: none;
                }
                .search{
                  display: flex;
                }
              }
              .time{
                text-align: left;
              }
              .text:before{
                content: '';
                z-index: 1;
                width: 6px;
                height: 6px;
                transform: rotate(-45deg);
                border-top: solid 1px #ddd;
                border-left: solid 1px #ddd;
                border-right: none;
                border-bottom: none;
                background: #fff;
                position: absolute;
                top: 18px;
                left: -5px;
                /*box-shadow: 0 0 5px #999;*/
              }
            }

          }
          .user {
            display: flex;
            justify-content: flex-start;
            flex-direction: row-reverse;
            .icon {
              margin-left: 0.8rem;
              /*background: #E4EFFB;*/
              /*border: solid 1px #ACCBEE;*/
              .icons_robot_pic{
                display: none;
              }
            }
            .textBox{
              align-items: flex-end;

              .text{
                background: #E4EFFB;
                border: solid 1px #ACCBEE;
                .practice{
                  display: flex;
                }
                .search{
                  display: none;
                }
              }
              .time{
                text-align: right;
              }
              .text:before{
                content: '';
                z-index: 1;
                width: 6px;
                height: 6px;
                background: #E4EFFB;
                transform: rotate(-45deg);
                border-top: none;
                border-left: none;
                border-right: solid 1px #ACCBEE;
                border-bottom: solid 1px #ACCBEE;
                position: absolute;
                top: 18px;
                right: -5px;
                /*box-shadow: 0 0 5px #999;*/
              }
            }
          }
        }
      }
      .input {
        height: 8rem;
        width: 100%;
        position: relative;
        flex-flow: column;
        .timeSelect{
          position: absolute;
          top: 2rem;
          left: 0.5rem;
        }
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
        .submit {
          height: 36px;
          min-height: 36px;
          display: flex;
          margin-bottom: 10px;
          align-items: center;
          justify-content: flex-end;
          span{
            width: 84px;
            height: 28px;
            line-height: 28px;
            background: #F9F9F9;
            border: solid 1px #eee;
            margin-right: 1rem;
            font-size: 14px;
            color: #ccc;
            cursor: pointer;
            border-radius: 2px;
          }
          span:hover{
            color: #2B86F6;
            border: solid 1px #2B86F6;
          }
        }
        .active{
          span{
            color: #2B86F6;
            border: solid 1px #2B86F6;
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
    .choseRobot{
      width: 50%;
      height: 10rem;
      background: #fff;
      position: relative;
      p{
        margin-right: 1rem;
      }
      .icons_close{
        position: absolute;
        right: 1rem;
        top: 1rem;
      }
      .comfirm{
        margin-left: 1rem;
      }
    }
  }
</style>
