<template>
  <div class="addSimilar coverBack">
    <div class="centerBox">
      <div class="title">
        <span>添加相似问</span>
        <i class="fas fa-times" aria-hidden="true" @click="close"></i>
      </div>
      <div class="content">
        <div class="inputText">
          <p class="titleText">未识别问题</p>
          <el-input v-model="questionData.question"></el-input>
        </div>
        <p class="intro">知识选择</p>
        <div class="contentData flex">
          <div class="treeBox">
            <div class="title">
              分类
            </div>
            <div class="treeData" v-if="typeData.id === 1">
              <tree-box :treeData="treeData" :config="selfConfig" :selectedItem="choseCategory" @select="handleNodeClick"></tree-box>
            </div>
            <div class="treeData" v-if="typeData.id === 2">
              <tree-box :treeData="treeData" :config="selfConfig" :selectedItem="selectNode" @select="choseNode"></tree-box>
            </div>
            <div class="treeData" v-if="typeData.id === 3">
              <tree-box :treeData="treeData" :config="selfConfig" :selectedItem="selectNode" @select="choseNodeGreeting"></tree-box>
            </div>
          </div>
          <div class="contentBox" v-if="typeData.id === 1">
            <div class="type intro">
              <p>场景</p>
            </div>
            <div class="contentList">
              <div class="listItem flex" v-for="item in sceneList" @click="choseItem(item)">
                <p :title="item.sceneName">{{item.sceneName}}</p>

                <div class="choseFlag">
                  <i class="fa icons_not_chose" v-if="selectItem.sceneId !== item.sceneId"></i>
                  <i class="fa icons_chose" v-else></i>
                </div>
              </div>
              <div style="margin: 1rem 0;">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        @current-change="handleCurrentChange"
                        :page-size="10"
                        :total="totalCount">
                </el-pagination>
              </div>
            </div>
          </div>
          <div class="contentBox" v-if="typeData.id === 2||typeData.id === 3">
            <div class="type intro">
              <p v-if="typeData.id === 2">问答</p>
              <p v-if="typeData.id === 3">寒暄</p>

            </div>
            <div class="contentList">
              <div class="listItem flex" v-for="item in sceneList" @click="choseItem(item)">
                <p :title="item.question">{{item.question}}{{item.question}}{{item.question}}{{item.question}}</p>
                <div class="choseFlag">
                  <i class="fa icons_not_chose" v-if="selectItem.qaId !== item.qaId"></i>
                  <i class="fa icons_chose" v-else></i>
                </div>
              </div>
              <div style="margin: 1rem 0;">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        @current-change="handleCurrentChange"
                        :page-size="10"
                        :total="qaCount">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btnGroup">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import TreeBox from "../../common/tree.vue";
  import treeTools from "../../../utils/tree";

  export default {
    components: {TreeBox},
    name: 'addSimilar',
    props: ['typeData','questionData'],
    data(){
      return {
        treeData: [],
        selfConfig:{
          name: 'categoryName',
          child: 'children',
          id: 'categoryId'
        },
        choseCategory: '',
        searchFilter : {
          page: 0,
          categoryId: '',
          robotId: ''
        },
        sceneList:[],
        totalCount:0,
        selectItem: '',

        //qa
        selectNode:'',
        filterData:{
          categoryId: '',
          pageSize: 10,
          pageNum: 1
        },
        qaCount:0,
        questionList:[]
      }
    },
    methods:{
      close: function () {
        this.$emit('close')
      },
      _initData: function () {
        if(this.typeData.id === 1){
          this.getCategory()
        }else if(this.typeData.id === 2||this.typeData.id === 3){
          this.treeData = [{
            categoryName: '已分类',
            categoryId: '0',
            children:[]
          },{
            categoryName: '未分类',
            categoryId: 'weifenlei',
            children:[]
          }]
        }
      },
      //获取分类树
      getCategory: function () {
        this.$api.scene.category.getTree({
          robotId: this.$route.query.robotId
        }).then((res)=>{
          if(res.status === 200){
            this.treeData = []
            this.treeData.push(res.tree)
          }
        })
      },
      //分类点击
      handleNodeClick: function (val) {
        this.choseCategory = val
        this.searchFilter = {
          page: 0,
          categoryId: val.categoryId,
          robotId: this.$route.query.robotId
        }
        this.getSceneList()
      },
      //获取分类场景
      getSceneList: function () {
        this.checkList = []
        this.$api.scene.scene.getSceneList(this.searchFilter).then((res)=>{
          if(res.status === 200){
            this.sceneList = res.result.list
            this.totalCount = res.result.totalCount
          }
        })
      },
      choseItem: function (item) {
        this.selectItem = item
      },
      handleCurrentChange: function (val) {
        this.searchFilter.page = val-1
        this.filterData.pageNum = val
        if(this.typeData.id === 1){
          this.getSceneList()
        }else if(this.typeData.id === 2){
          this.getCategoryQa(this.selectNode.categoryId)
        }else if(this.typeData.id === 2){
          this.getCategoryGreeting(this.selectNode.categoryId)
        }
      },
      //提交
      submit: function () {
        //检查未识别问题和场景
        if(this.questionData.question&&this.selectItem){
          if(this.typeData.id === 1){
            this.$api.scene.editor.getScenesRoot({
              sceneId: this.selectItem.sceneId
            }).then((res)=>{
              if(res.status === 200){
                let question = res.entry
                let similarList = res.entry.similarQuestionList
                let flag = true
                similarList.forEach((e)=>{
                  if(e === this.questionData.question){
                    flag = false
                  }
                })

                if(flag){
                  similarList.push(this.questionData.question)
                  let reqData = {
                    entranceId: this.selectItem.sceneId,
                    question: question.question,
                    similarQuestionList: JSON.stringify(similarList),
                    sceneId: question.sceneId,
                    slotList: JSON.stringify(question.slotList)
                  }
                  this.$api.scene.editor.editScenesRoot(reqData).then((res)=>{
                    if(res.code === 'ok'){
                      this.$message({
                        message: '添加成功',
                        type: 'success',
                        duration: 1000
                      });
                      this.$emit('addSuccess')
                      this.close()
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
                    type: 'info',
                    message: '已有相同相似问！',
                    duration: 1000
                  });
                }
              }
            })
          }else if(this.typeData.id === 2){
            this.$api.robotAnalysis.qa.getQaDetail({
              qaId: this.selectItem.qaId
            }).then((res)=>{
              if(res.code === 'ok'){
                let questionData = res.result
                let flag = true
                questionData.similarQuestionList.forEach((e)=>{
                  if(e === this.questionData.question){
                    flag = false
                  }
                })
                if(flag){
                  questionData.similarQuestionList.push(this.questionData.question)
                  let reqData = {
                      qaId: questionData.qaId,
                      question: questionData.question,
                      categoryId: questionData.categoryId,
                      similarQuestionList: questionData.similarQuestionList,
                      patternList:questionData.patternList,
                      keywordList:questionData.keywordList,
                      slotList:questionData.slotList,
                      answer:questionData.answer,
                      effDate:questionData.effDate,
                      expDate: questionData.expDate,
                      status: questionData.status
                    }
                  this.$api.robotAnalysis.qa.createQa(reqData).then((res)=>{
                    if(res.code === 'ok'){
                      this.$message({
                        message: '添加成功',
                        type: 'success',
                        duration: 1000
                      });
                      this.$emit('addSuccess')

                      this.close()
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
                    type: 'info',
                    message: '已有相同相似问！',
                    duration: 1000
                  });
                }
              }
            })
          }else if(this.typeData.id === 3){
            this.$api.robotAnalysis.greeting.getQaDetail({
              qaId: this.selectItem.qaId
            }).then((res)=>{
              if(res.code === 'ok'){
                let questionData = res.result
                let flag = true
                questionData.similarQuestionList.forEach((e)=>{
                  if(e === this.questionData.question){
                    flag = false
                  }
                })
                if(flag){
                  questionData.similarQuestionList.push(this.questionData.question)
                  let reqData = {
                    qaId: questionData.qaId,
                    question: questionData.question,
                    categoryId: questionData.categoryId,
                    similarQuestionList: questionData.similarQuestionList,
                    patternList:questionData.patternList,
                    keywordList:questionData.keywordList,
                    slotList:questionData.slotList,
                    answer:questionData.answer,
                    effDate:questionData.effDate,
                    expDate: questionData.expDate,
                    status: questionData.status
                  }
                  this.$api.robotAnalysis.greeting.createQa(reqData).then((res)=>{
                    if(res.code === 'ok'){
                      this.$message({
                        message: '添加成功',
                        type: 'success',
                        duration: 1000
                      });
                      this.$emit('addSuccess')

                      this.close()
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
                    type: 'info',
                    message: '已有相同相似问！',
                    duration: 1000
                  });
                }
              }
            })
          }
        }else{
          this.$message({
            type: 'info',
            message: '请检查未识别问题和场景选择是否完整！',
            duration: 1000
          });
        }
      },


      //qa
      choseNode: function (item) {
        this.activeMode = 1
        this.selectNode = item
        this.filterData.pageNum = 1
        this.searchType = 'category'
        this.getQaCategory(item.categoryId)
        this.getCategoryQa(item.categoryId)
      },
      //寒暄
      choseNodeGreeting: function (item) {
        this.activeMode = 1
        this.selectNode = item
        this.filterData.pageNum = 1
        this.searchType = 'category'
        this.getGreetingCategory(item.categoryId)
        this.getCategoryGreeting(item.categoryId)
      },
      getQaCategory: function (id) {
        if(id!=='weifenlei'){
          this.$api.robotAnalysis.qa.getCategory({
            categoryPId: id
          }).then((res)=>{
            if(res.code === 'ok'){
              let arr = this.treeData
              res.result.forEach((e)=>{
                e.children = []
              })
              treeTools.treeCtrl.addToTree(arr,id,res.result,'children','categoryId')
//              this.treeData = arr
            }
          })
        }
      },
      getGreetingCategory: function (id) {
        if(id!=='weifenlei'){
          this.$api.robotAnalysis.greeting.getCategory({
            categoryPId: id
          }).then((res)=>{
            if(res.code === 'ok'){
              let arr = this.treeData
              res.result.forEach((e)=>{
                e.children = []
              })
              treeTools.treeCtrl.addToTree(arr,id,res.result,'children','categoryId')
//              this.treeData = arr
            }
          })
        }
      },
      //获取目录qa
      getCategoryQa: function (id) {
        this.checkList = []
        if(id!=='weifenlei'){
          this.filterData.categoryId = id
          this.$api.robotAnalysis.qa.getCategoryQa(this.filterData).then((res)=>{
            if(res.code === 'ok'){
              this.sceneList = res.result
              this.qaCount = res.totalSize
            }else{
              this.sceneList = []
              this.qaCount = 0
            }
          })
        }else{
          this.filterData.categoryId = ''
          this.$api.robotAnalysis.qa.getUnCategoryQa({
            pageSize: this.filterData.pageSize,
            pageNum: this.filterData.pageNum
          }).then((res)=>{
            if(res.code === 'ok'){
              this.sceneList = res.result
              this.qaCount = res.totalSize
            }else{
              this.sceneList = []
              this.qaCount = 0
            }
          })
        }
      },
      //获取目录寒暄
      getCategoryGreeting: function (id) {
        this.checkList = []
        if(id!=='weifenlei'){
          this.filterData.categoryId = id
          this.$api.robotAnalysis.greeting.getCategoryQa(this.filterData).then((res)=>{
            if(res.code === 'ok'){
              this.sceneList = res.result
              this.qaCount = res.totalSize
            }else{
              this.sceneList = []
              this.qaCount = 0
            }
          })
        }else{
          this.filterData.categoryId = ''
          this.$api.robotAnalysis.greeting.getUnCategoryQa({
            pageSize: this.filterData.pageSize,
            pageNum: this.filterData.pageNum
          }).then((res)=>{
            if(res.code === 'ok'){
              this.sceneList = res.result
              this.qaCount = res.totalSize
            }else{
              this.sceneList = []
              this.qaCount = 0
            }
          })
        }
      },
    },
    mounted(){
      this._initData()
    }
  }
</script>

<style lang="less">
  .addSimilar{
    .centerBox{
      width: 50rem;
      .content{
        padding: 1rem;
        justify-content: flex-start;
        .intro{
          width: 100%;
          text-align: left;
          margin-bottom: 10px;
        }
        .inputText{
          width: 100%;
          margin-bottom: 10px;
          .titleText{
            text-align: left;
            width: 100%;
            margin-bottom: 10px;
          }
        }
        .contentData{
          flex: 1;
          width: 100%;
          .treeBox{
            border: solid 1px #ddd;
            min-width: 220px;
            display: flex;
            flex-flow: column;
            .title{
              font-size: 14px;
            }
            .treeData{
              flex: 1;
              overflow: auto;
              padding-left: 1rem;
            }
          }
          .contentBox{
            flex: 1;
            margin-left: 1rem;
            display: flex;
            flex-flow: column;
            .intro{
              padding-left: 10px;
            }
            .contentList{
              flex: 1;
              overflow: auto;
              .listItem{
                text-align: left;
                padding-left: 10px;
                padding-right: 10px;
                color: #666;
                width: 100%;
                height: 3rem;
                line-height: 3rem;
                border-bottom: solid 1px #ddd;
                border-top: solid 1px #ddd;
                margin-bottom: -1px;
                justify-content: space-between;
                cursor: pointer;
                overflow: hidden;
              }
              .listItem:hover{
                background: #F2F6FA;
              }
            }
          }
        }
      }
    }
  }
</style>
