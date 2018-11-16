<template>
  <div class="questionSetting coverBack" v-if="edit.setting">
    <div class="settingBox">
      <div class="title flex">
        <p>通用设置</p>
        <i @click="close()" aria-hidden="true" class="iconfont icon-guanbi"></i>
      </div>
      <div class="content">
        <div class="contentItem" v-for="item in settingData">
          <div class="itemText">
            <span>{{item.name}}</span>
            <el-switch
              v-model="item.show"
              :rows="2"
              active-color="#2B86F6"
              inactive-color="#D1D1D1">
            </el-switch>
          </div>
          <div class="itemInner" v-if="item.show">
            <el-input type="textarea" v-model="item.data">

            </el-input>
          </div>
        </div>
      </div>
      <div class="btnGroup">
        <el-button type="primary" @click="commitSetting()">确定</el-button>
        <el-button @click="close()">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    components: {},
    name: 'questionSetting',
    data(){
      return {
        welcomeData: '',
        settingList: {
          aimlNoOptionReply: '',
          aimlExitReply: '',
          businessDefaultReply: '',
          welcomeReply: ''
        },
        settingData:[{
          tag: 'welcomeReply',
          name: '欢迎语',
          show: true,
          data: ''
        },{
          tag: 'aimlNoOptionReply',
          name: '当用户回答没有命中[条件]时',
          show: false,
          data: ''
        },{
          tag: 'aimlExitReply',
          name: '结束场景语',
          show: false,
          data: ''
        },{
          tag: 'businessDefaultReply',
          name: '未能识别用户意图(无法帮助)用户',
          show: false,
          data: ''
        }]
      }
    },
    computed:{
      ...mapGetters({
        'edit': 'getQuestionEditState',
//        'settingData': 'getQuestionCommonSetting'
      })
    },
    methods:{
      close: function () {
        this.$store.dispatch('closeQuestionEdit')
      },
      commitSetting: function () {
        this.settingData.forEach((e)=>{
          if(e.tag === 'welcomeReply'){
            this.settingList.welcomeReply = e.data
          }else if(e.tag === 'aimlNoOptionReply'){
            this.settingList.aimlNoOptionReply = e.data
          }else if(e.tag === 'aimlExitReply'){
            this.settingList.aimlExitReply = e.data
          }else if(e.tag === 'businessDefaultReply'){
            this.settingList.businessDefaultReply = e.data
          }
        })
        this.$api.updateDefaultGreeting(this.settingList).then((res)=>{
          if(res.status === 200){
            this.$message({
              type: 'success',
              message: '修改成功!',
              duration: 1000
            });
            this.close()
            this.$store.dispatch('setSettingWelcome',this.settingData)
          }
        })
      },
      getSetting: function () {
        this.$api.getDefaultGreeting().then((res)=>{
          if(res.status === 200){
            this.settingList = res
            this.settingData.forEach((e)=>{
              if(e.tag === 'welcomeReply'){
                e.data = this.settingList.welcomeReply
              }else if(e.tag === 'aimlNoOptionReply'){
                e.data = this.settingList.aimlNoOptionReply
              }else if(e.tag === 'aimlExitReply' ){
                e.data = this.settingList.aimlExitReply
              }else if(e.tag === 'businessDefaultReply'){
                e.data = this.settingList.businessDefaultReply
              }
              if(e.data === ''){
                e.show = false
              }else{
                e.show = true
              }
            })

            this.$store.dispatch('setSettingWelcome',this.settingData)

          }
        })
      }
    },
    mounted(){
//      this.welcomeData = this.settingData[0].data
      this.getSetting()
    }
  }
</script>

<style lang="less">
  .questionSetting{
    .settingBox{
      width: 30rem;
      height: 35rem;
      background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      border-radius: 2px;
      overflow: hidden;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: space-between;
      .title{
        height: 3rem;
        background: #f3f3f3;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
      }
      .content{
        flex: 1;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 1rem 4rem;
        .contentItem{
          width: 100%;
          /*height: 7rem;*/
          min-height: 4rem;
          display: flex;
          flex-flow: column;
          justify-content: center;
          border-bottom: solid 1px #eee;
          .itemText{
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 2.5rem;
            font-size: 0.8rem;
          }
          .itemInner{
            height: 4rem;
            textarea{
              resize: none;
            }
          }
        }
      }
      .btnGroup{
        height: 4rem;
      }
    }
  }
</style>
