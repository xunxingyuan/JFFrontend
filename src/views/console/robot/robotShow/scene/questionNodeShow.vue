<template>
  <div class="questionNodeShow coverBack" v-if="state.nodeShow" @click="close()">
    <div class="centerBox" @click.stop="">
      <div class="title flex">
        <p>查看</p>
        <i aria-hidden="true" @click="close()" class="iconfont icon-guanbi"></i>
      </div>
      <div class="content scrollbar">
        <div v-html="showContent">

        </div>
        <div v-if="showOthers!==''" v-html="showOthers" style="margin-top: 1rem;padding-top: 1rem;border-top: solid 1px #ddd"></div>
      </div>
      <!--<div class="btnGroup">-->
        <!--&lt;!&ndash;<el-button @click="textAna = false">取消</el-button>&ndash;&gt;-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'questionNodeShow',
    computed:{
      ...mapGetters({
        state: 'getQuestionEditState',
        question: 'getSelectQuestion',
        selectScenes: 'getSelectScenes',

      })
    },
    methods:{
      close: function () {
        this.$store.dispatch('closeQuestionEdit')
      },
      _initData: function () {
        if(this.question.hasOwnProperty('answer')){
          this.showContent = this.question.answer
          this.showOthers = this.question.opinion
        }else {
          this.showContent = this.question.content
          this.showOthers = ''
        }
//        let replaceData
//        replaceData =  new RegExp(this.selectScenes.scenesId,"g")
//        if(this.showContent){
//          this.showContent = this.showContent.replace(/\%\$\%/g,'')
//          this.showContent = this.showContent.replace(replaceData,'')
//        }
//        if(this.showOthers){
//          this.showOthers = this.showOthers.replace(/\%\$\%/g,'')
//          this.showOthers = this.showOthers.replace(replaceData,'')
//        }

      }
    },
    data(){
      return {
        showContent: '',
        showOthers: ''
      }
    },
    mounted(){
      this._initData()
    },
    watch:{
      question: function () {
        this._initData()
      }
    }
  }
</script>

<style lang="less">
  .questionNodeShow{
    .centerBox{
      height: 25rem;
      .content{
        font-size: 0.9rem;
        overflow: auto;
        display: block;
        div{
          width: 100%;
          /*height: 100%;*/
          p{
            word-break: break-all;
          }
        }
        table{
          border-collapse: collapse;
        }
        td,th{
          padding:5px 10px;
          border: solid 1px #ddd;
        }
      }
    }
  }
</style>
