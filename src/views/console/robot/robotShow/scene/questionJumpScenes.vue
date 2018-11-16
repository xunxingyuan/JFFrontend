<template>
  <div class="questionJumpScenes" v-if="state.choseScene">
    <div class="contain">
      <div class="title">
        <p>跳转到其他场景</p>
        <i class="iconfont icon-guanbi" @click="close()"></i>
      </div>
      <div class="content">
        <div class="contentBox">
          <div class="left">
            <p class="innerTitle">分类</p>
            <div class="innerBoxNew scrollbar">
              <common-tree :treeData="treeData" :getFunction="getCategoryChild"  :selectedNode="selectedNode" @selectMenu="setSelectNode"></common-tree>
            </div>
          </div>
          <div class="right">
            <p class="rightTitle">场景</p>
            <div class="scenesList scrollbar">
              <div @click="choseScenesItem(item)" class="item" v-for="item in scenesData" :class="{'active':choseScenes.scenesId === item.scenesId }">
                <p>{{item.scenesName}}</p>
                <span>
                  <i class="fa icons_not_chose" v-if="choseScenes.scenesId !== item.scenesId"></i>
                  <i class="fa icons_chose" v-else></i>
                </span>
              </div>
              <p class="tips" v-if="scenesData.length===0">暂无数据</p>
            </div>
          </div>
        </div>
      </div>
      <div class="btnGroup">
        <span class="submit" @click="submit()">提交</span>
        <span class="cancel" @click="close()">取消</span>
      </div>
    </div>
    <div class="scenesChose scrollbar" v-if="showScenes">
      <div class="topPart">
        <p>选择一个追问进行跳转</p>
        <button @click="choseNode()">确定</button>
        <span @click="showScenes = false">取消</span>
      </div>
      <div class="first flexCenter">
        {{scenesDataTree.question}}
      </div>
      <div class="line flexCenter">
        <span></span>
        <span class="coverRight"></span>
      </div>
      <div v-if="scenesDataTree!==null&&scenesDataTree.nodes!==null&&scenesDataTree.nodes.length !== 0">
        <node-box :nodeData="scenesDataTree.nodes"></node-box>
      </div>
    </div>
  </div>
</template>

<script>
//  import commonTree from '../../../components/common/tools/commonTree.vue'
  import nodeBox from './nodeBox.vue'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'questionJumpScenes',
    components:{
      commonTree,
      nodeBox
    },
    data(){
      return {
        selectedNode: '',
        scenesData:[],
        treeData: [],
        choseScenes: '',
        scenesDataTree: '',
        showScenes: false
      }
    },
    computed:{
      ...mapGetters({
        categoryTree: 'getCategoryTree',
        state: 'getQuestionEditState',
        question: 'getSelectQuestion',
        jumpData: 'getJumpData',
      }),
    },
    methods:{
      //获取子类
      getCategoryChild: function (data) {
        this.getScenes(data)
        return new Promise((resolve,reject)=>{
          let reqData = {
            categoryPid: data.id
          }
          this.$api.category.getList(reqData).then((res)=>{
            if(res.status===200){
              res.result.forEach((e)=>{
                e.label = e.categoryName
                e.id = e.categoryId
                e.show = false
              })
              resolve(res.result)
            }else{
              reject(res.result)
            }
          })
        })
      },
      setSelectNode: function (val) {
        this.selectedNode = val
      },
      //获取场景
      getScenes: function (data) {
        console.log(data)
        this.$api.scene.getCategoryById(data).then((res)=>{
          this.scenesData = res.result
        })
      },
      close: function () {
        this.$store.dispatch('closeQuestionEdit')
      },
      //获取目录
      getPath: function () {
        this.treeData = []
        if(this.categoryTree){
          this.categoryTree.forEach((e)=>{
            this.treeData.push(e)
          })
        }
      },
      //选择场景
      choseScenesItem: function (item) {
        if(this.choseScenes.scenesId === item.scenesId){
          this.choseScenes = ''
        }else{
          this.choseScenes = item
          this.$api.scene.editor.getScenesById({
            id: item.scenesId
          }).then((res)=>{
            console.log(res)
            let data = res.result
            if(data!==null&&data.nodes!==null){
              data.nodes.forEach((e)=>{
                this.setSelectedState(e)
              })
              data.rollback = res.actions
            }
            this.scenesDataTree = data
            this.showScenes = true
          })
        }
      },
      //提交跳转选择
      submit: function () {
        let _self = this
        console.log(this.question)
        console.log(this.choseScenes)
        let data = {
          reactId: this.question.reactId,
          scenesId: this.choseScenes.scenesId,
          content: '',
          jumpTo: this.jumpData.to
        }
        this.$api.scene.editor.updateQuestionNode(data).then((res)=>{
          if(res.code === 'ok'){
            _self.$message({
              message: '保存成功',
              type: 'success',
              duration: 1000
            });
            _self.$store.dispatch('updateQuestionTree')
            _self.close()
          }else{
            _self.$message({
              message: res.msg,
              type: 'error',
              duration: 1000
            });
          }
        })
      },
      //初始化
      setSelectedState: function(item) {
        if(item.leaf === null||item.leaf === 'null'){
          item.selectState = 'jump'
        }else if(item.type === 0){
          item.selectState = 'jumpChose'
        }else{
          item.selectState = 'jump'
        }
        if(item.nodes!==null&&item.nodes.length!==0){
          item.nodes.forEach((e)=>{
            this.setSelectedState(e)
          })
        }
      },
      choseNode: function () {
        if(this.jumpData.to){
          this.showScenes = false
        }
      }
    },
    watch:{
      categoryTree: function () {
        this.getPath()
      }
    },
    mounted(){
      this.getPath()
    }
  }
</script>

<style lang="less">
  .questionJumpScenes{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    .contain{
      width: 45rem;
      height: 34rem;
      display: flex;
      flex-flow: column;
      padding: 0;
      .title,.content,.btnGroup{
        width: 100%;
      }
      .title{
        height: 3rem;
        min-height: 3rem;
        background: #f3f3f3;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        font-weight: 600;
      }
      .content{
        height: 27rem;
        padding: 1rem;
        .contentBox{
          width: 100%;
          height: 100%;
          display: flex;
          .left{
            flex: 1;
            display: flex;
            flex-flow: column;
            border: solid 1px #ddd;
            .innerTitle{
              height: 2rem;
              min-height: 2rem;
              background: #f6f6f6;
              line-height: 2rem;
              border-bottom: solid 1px #ddd;
              text-align: left;
              font-size: 0.9rem;
              padding-left: 1rem;
            }
            .innerBoxNew{
              flex: 1;
              overflow: auto;
              overflow-x: hidden;
            }
          }
          .right{
            flex: 2;
            padding-left: 1rem;
            display: flex;
            flex-flow: column;
            .rightTitle{
              height: 2rem;
              min-height: 2rem;
              text-align: left;
              width: 100%;
              font-size: 0.9rem;
              font-weight: 600;
            }
            .scenesList{
              height: 100%;
              overflow: auto;
              overflow-x: hidden;
              flex: 1;
              .tips{
                font-size: 0.9rem;
                color: #999;
                margin-top: 1rem;
              }
              .item{
                height: 2.5rem;
                border-top: solid 1px #ddd;
                border-bottom: solid 1px #ddd;
                margin-bottom: -1px;
                display: flex;
                align-items: center;
                font-size: 0.9rem;
                cursor: pointer;
                span{
                  min-width: 40px;
                }
              }
              .item:hover{
                background: #E4F0FF;
              }
              .active{
                background: #E4F0FF;
              }
              p{
                flex: 1;
                text-align: left;
                padding-left: 1rem;
                overflow: hidden;
                height: 2.5rem;
                line-height: 2.5rem;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
      .btnGroup{
        height: 4rem;
        min-height: 4rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 1rem;
        font-size: 0.9rem;
        span{
          height: 2rem;
          width: 6rem;
          line-height: 2rem;
        }
        .submit{
          background: #2B86F6;
          color: #fff;
          margin-right: 1rem;
          cursor: pointer;
        }
        .cancel{
          color: #666;
          border: solid 1px #DDDDDD;
          cursor: pointer;
        }
        .submit:active{
          background: #00bfff;
        }
        .cancel:active{
          color: #333;
        }
      }
    }
  }
</style>
