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
              <tree-box :showAll="true" :treeData="treeData" :config="selfConfig" :selectedItem="choseCategory" @select="handleNodeClick"></tree-box>
            </div>
          </div>
          <div class="right">
            <p class="rightTitle">场景</p>
            <div class="scenesList scrollbar">
              <div @click="choseScenesItem(item)" class="item" v-for="item in scenesData" :class="{'active':choseScenes.sceneId === item.sceneId }">
                <p>{{item.sceneName}}</p>
                <span>
                  <i class="fa icons_not_chose" v-if="choseScenes.sceneId !== item.sceneId"></i>
                  <i class="fa icons_chose" v-else></i>
                </span>
              </div>
              <p class="tips" v-if="scenesData.length===0">暂无数据</p>
              <div class="pageBox" style="margin-top: 1rem">
                <el-pagination
                        background
                        @current-change="handleCurrentChange"
                        layout="total,prev, pager, next"
                        :total="totalCount">
                </el-pagination>
              </div>
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
  import nodeBox from './nodeBox.vue'
  import { mapGetters, mapActions } from 'vuex'
  import TreeBox from "../../../../../components/common/tree.vue";

  export default {
    name: 'questionJumpScenes',
    components:{
      TreeBox,
      nodeBox
    },
    data(){
      return {
        selfConfig:{
          name: 'categoryName',
          child: 'children',
          id: 'categoryId'
        },
        choseCategory: '',
        choseRobot:{
          robotId: ''
        },
        searchFilter:{
          page: 1,
          categoryId: '',
          robotId: ''
        },
        totalCount: 0,
        scenesData:[],


        selectedNode: '',

        treeData: [],
        treeList:[],



        choseScenes: '',
        scenesDataTree: '',
        showScenes: false
      }
    },
    computed:{
      ...mapGetters({
        state: 'getQuestionEditState',
        question: 'getSelectQuestion',
        jumpData: 'getJumpData',
      }),
    },
    methods:{
      //获取分类树
      getCategory: function () {
        this.$api.scene.category.getTree({
          robotId: this.choseRobot.robotId
        }).then((res)=>{
          if(res.status === 200){
            this.treeData = []
            this.treeList = []
            res.tree.categoryName = "全部分类"
            this.treeData.push(res.tree)
            this.getTreeList(this.treeData,this.treeList)
          }
        })
      },
      getTreeList: function (tree,arr) {
        if(tree.length>0){
          tree.forEach((e)=>{
            arr.push(e)
            if(e.children.length>0){
              this.getTreeList(e.children,arr)
            }
          })
        }
      },
      //分类点击
      handleNodeClick: function (val) {
        this.choseCategory = val
        this.searchFilter = {
          page: 0,
          categoryId: val.categoryId,
          robotId: this.choseRobot.robotId
        }
        this.getSceneList()
      },
      //获取分类场景
      getSceneList: function () {
        this.$api.scene.scene.getSceneList(this.searchFilter).then((res)=>{
          if(res.status === 200){
            this.scenesData = res.result.list
            this.totalCount = res.result.totalCount
          }
        })
      },
      handleCurrentChange: function (val) {
        this.searchFilter.page = val
        this.getSceneList()
      },
      close: function () {
        this.$store.dispatch('closeQuestionEdit')
      },
      //选择场景
      choseScenesItem: function (item) {
        if(this.question.sceneId === item.sceneId){
          this.$message({
            message: '不能选择当前场景',
            type: 'info',
            duration: 1000
          });
        }else{
          if(this.choseScenes.sceneId === item.sceneId){
            this.choseScenes = ''
          }else{
            this.choseScenes = item
            this.$api.scene.editor.getScenesById({
              id: item.sceneId
            }).then((res)=>{

              if(res.status === 200){
                let data = res.root
                if(data!==null&&data.nodes!==null){
                  data.nodes.forEach((e)=>{
                    this.setSelectedState(e)
                  })
                  data.rollback = res.actions
                }
                this.scenesDataTree = data
                this.showScenes = true
              }
            })
          }
        }



      },
      //提交跳转选择
      submit: function () {
        let _self = this
        let data = {
          from: this.question.nodeId,
          to: this.jumpData.to
        }
        this.$api.scene.editor.nodeJump(data).then((res)=>{
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
        if(item.nodeType === 0){
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
    mounted(){
      this.choseRobot.robotId = window.sessionStorage.getItem('robotId')
      this.getCategory()
    },
    watch:{
      state: function () {
        this.choseRobot.robotId = window.sessionStorage.getItem('robotId')
        this.getCategory()
      }
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
      background: #fff;
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
              padding-left: 1rem;
            }
          }
          .right{
            flex: 2;
            padding-left: 1rem;
            display: flex;
            flex-flow: column;
            background: #fff;
            .rightTitle{
              height: 2rem;
              line-height: 2rem;
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
    //内嵌场景页
    .scenesChose{
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      border: none;
      overflow: auto;
      z-index: 10;
      display: flex;
      background: #ffffff;
      padding: 3.6rem 1rem 1rem 1rem;
      padding-right: 2rem;
      .topPart{
        position: fixed;
        top: 0;
        left: 0;
        height: 3rem;
        width: 100%;
        background: #2B86F6;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
        p{
          font-size: 0.9rem;
          color: #fff;
        }
        button{
          width: 96px;
          height: 36px;
          background: #2FD8D6;
          border-radius: 2px;
          outline: none;
          border: none;
          color: #ffffff;
          margin-left: 2rem;
          cursor: pointer;
        }
        span{
          margin-left: 2rem;
          color: #fff;
        }
      }
      .first{
        height: 3.6rem;
        width: 9rem;
        min-width: 9rem;
        border: solid 1px #ddd;
        border-radius: 3px;
        font-size: 0.8rem;
        color: #666;
      }
      .line{
        width: 1rem;
        min-width: 1rem;
        height: 3.6rem;
        position: relative;
        span{
          width: 100%;
          height: 1px;
          background: #ddd;
        }
        .coverRight{
          position: absolute;
          right: -1px;
          width: 1px;
          height: 1.8rem;
          top: 0;
          background: #ffffff;
          z-index: 1000;
        }
      }
    }
  }
</style>
