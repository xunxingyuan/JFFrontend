<template>
  <div class="qa container">
    <div class="top">
      <p class="title">一问一答</p>
      <!--<div class="topTools">-->
        <!--<span v-for="item in sceneMode" class="flexCenter" :class="{'active': activeMode === item.id}" @click="activeMode = item.id">{{item.name}}</span>-->
      <!--</div>-->
    </div>
    <div class="bottom">
      <div class="content">
        <div class="innerLeft">
          <div class="innerTitle flexCenter">
            <span>分类</span>
            <div class="ctrl">
              <i class="iconfont icon-tianjia" @click="addCategory"></i>
              <i class="iconfont icon-bianji" @click="editCategory"></i>
              <i class="iconfont icon-fangdajing"></i>
              <i class="iconfont icon-shanchu" @click="delCategory"></i>
            </div>
          </div>
          <div class="innerContent">
            <div class="treeBox">
              <tree-box :treeData="treeData" :config="treeConfig" :selectedItem="selectNode" @select="choseNode"></tree-box>
            </div>
          </div>
        </div>
        <div v-if="activeMode=== 1" class="innerRight scrollbar">
          <div class="rightTop">
            <div class="add">
              <el-button type="primary" size="small" @click="createQa">+ 新建QA</el-button>
              <el-button size="small" @click="showUpload">导入QA</el-button>
            </div>
            <div class="search">
              <el-input
                      size="small"
                      placeholder="请输入内容"
                      v-model="searchWord"
                      @keyup.enter.native="searchQa">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="searchQa"></i>
              </el-input>
            </div>
          </div>
          <div class="rightBottom">
            <div class="rightContent">
              <table class="gtable">
                <tr class="gheader">
                  <th>问题</th>
                  <th>创建时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
                <tr v-for="item in questionList">
                  <td>{{item.question}}</td>
                  <td>{{new Date(item.created).toLocaleString()}}</td>
                  <td><span v-if="item.status===0">有效</span></td>
                  <td>
                    <span class="edit" @click="editQa(item)">编辑</span>
                    <span class="edit" @click="publishAIML(item)">生成AIML</span>
                    <span class="edit" @click="getQaAIML(item)">查看AIML</span>
                    <span class="del" @click="deleteQa(item)">删除</span>
                  </td>
                </tr>
              </table>
              <p v-if="questionList.length===0" class="tips">暂无相关问答</p>
              <div class="pageBox">
                <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="totalCount">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeMode=== 2&&!showAimlEditor" class="innerRight scrollbar">
          <!--<div class="rightTop">-->
            <!--<el-button type="primary" size="small" @click="uploadAiml">导入源码</el-button>-->
          <!--</div>-->
          <div class="rightBottom">
            <div class="rightContent aimlContain" >
              <div v-for="item in aimlList" class="aimlBox" @click="editAimlContent(item)">
                <div class="icon">aiml</div>
                <span>{{item.aimlId}}</span>
                <i title="删除" @click.stop="deleteAiml(item)" class="del fas fa-times"></i>
                <!--<i title="发布" @click.stop="releaseAiml(item)" class="release fas fa-sync"></i>-->
              </div>
              <div class="aimltips" v-if="aimlList.length === 0">暂无相关AIML文件</div>
            </div>
          </div>
        </div>
        <div class="innerRight aimlBox" v-if="activeMode === 2&&showAimlEditor">
          <div class="rightTop" style="margin-bottom: 1rem;justify-content: flex-start;">
            <!--<el-button type="primary" size="small" @click="saveAimlContent">保存</el-button>-->
            <el-button type="primary" size="small" @click="showAimlEditor = false">返回</el-button>
          </div>
          <div class="rightBottom aimlEditor">
            <ace-editor v-model="aimlCode" @init="editorInit" lang="html" theme="twilight" width="100%" height="100%"></ace-editor>
          </div>
        </div>
      </div>
    </div>
    <qa-edit v-if="showEdit" @close="showEdit = false" :tree="treeData" :editType="editType" :categoryId="selectNode.categoryId" :editData="choseEditData" @submit="submitData" @submitAndAiml="submitAndAiml"></qa-edit>
    <div class="importQa coverBack" v-if="importBox">
      <div class="centerBox">
        <div class="title">
          <span>导入QA</span>
          <i class="fas fa-times" aria-hidden="true" @click="importBox = false"></i>
        </div>
        <div class="content">
          <el-upload
                  ref="upload"
                  class="upload-demo"
                  :data="uploadData"
                  drag
                  :action="uploadUrl"
                  :on-success="uploadSucces"
                  :on-error="uploadError"
                  multiple
                  :auto-upload="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
          <!--<div class="addItem flex">-->
            <!--<p>分类:</p>-->
            <!--<div>{{selectNode.categoryName}}</div>-->
          <!--</div>-->
        </div>
        <div class="btnGroup">
          <el-button @click="importBox = false">取消</el-button>
          <el-button type="primary" @click="submitUpload">确认</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import QaEdit from "./qa/qaEdit.vue";
  import aceEditor from 'vue2-ace-editor'
  import TreeBox from "../../../../components/common/tree.vue";
  import treeTools from "../../../../utils/tree"

  export default {
    components: {
      TreeBox,
      QaEdit,
      aceEditor},
    name: 'qa',
    data(){
      return {
        totalCount: 0,
        showEdit: false,
        editType: '',
        treeData:[{
          categoryName: '已分类',
          categoryId: '0',
          children:[]
        },{
          categoryName: '未分类',
          categoryId: 'weifenlei',
          children:[]
        }],
        treeConfig:{
          child: 'children',
          name: 'categoryName',
          id: 'categoryId'
        },
        selectNode: '',
        searchWord: '',
        questionList:[],
        choseEditData: '',
        importBox: false,
        uploadData:{
          botId: '',
          categoryPid: ''
        },
        uploadUrl: '',
        sceneMode:[{
          id:1,
          name: '编辑模式'
        },{
          id: 2,
          name: 'aiml管理'
        }],
        activeMode: 1,
        aimlList: [],
        showAimlEditor: false,
        aimlCode:'',
        selectQa: ''
      }
    },
    methods:{
      _initData: function () {
        this.questionList = []
        this.$api.robotAnalysis.qa.getCategory({
          categoryPId: 0
        }).then((res)=>{
          if(res.code === 'ok'){
            res.result.forEach((e)=>{
              e.children = []
            })
            this.treeData[0].children = res.result
          }
        })
      },
      //获取目录
      getCategory: function (id) {
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
      //获取目录qa
      getCategoryQa: function (id) {
        if(id!=='weifenlei'){
          this.$api.robotAnalysis.qa.getCategoryQa({
            categoryId: id
          }).then((res)=>{
            if(res.code === 'ok'){
              this.questionList = res.result
            }else{
              this.questionList = []
            }
          })
        }else{
          this.$api.robotAnalysis.qa.getUnCategoryQa().then((res)=>{
            if(res.code === 'ok'){
              this.questionList = res.result
            }else{
              this.questionList = []
            }
          })
        }
      },
      //获取目录AIML
      getQaAIML: function (item) {
        this.selectQa = item
        this.$api.robotAnalysis.qa.getQaAiml({
          qaId: item.qaId
        }).then((res)=>{
          if(res.code === 'ok'){
            this.aimlList = res.result
          }else{
            this.aimlList = []
          }
          this.activeMode = 2
        })
      },
      //删除AIML
      deleteAiml: function (item) {
        let arr = []
        arr.push(item.aimlId)
        this.$confirm('此操作将永久删除该AIML, 是否继续?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$api.robotAnalysis.qa.deleteAiml({
            aimlIds: JSON.stringify(arr)
          }).then((res)=>{
            if(res.code === 'ok'){
              this.$message({
                type: 'success',
                message: '删除成功',
                duration: 1000
              });
            }else {
              this.$message({
                type: 'error',
                message: res.msg,
                duration: 1000
              });
            }
            this.getQaAIML(this.selectQa)
          })
        })
      },
      //搜索QA
      searchQa: function () {
        this.$api.robotAnalysis.qa.searchQa({
          str: this.searchWord
        }).then((res)=>{
          if(res.code === 'ok'){
            this.questionList = res.result
          }else{
            this.$message({
              type: 'error',
              message: res.msg,
              duration: 1000
            });
          }
        })
      },
      submitData: function (val) {
//        console.log(val)
        if(this.editType === 'create'){
          val.userId = window.sessionStorage.getItem('user')
        }
        this.$api.robotAnalysis.qa.createQa(val).then((res)=>{
          if(res.code === 'ok'){
            this.$message({
              type: 'success',
              message: '保存成功',
              duration: 1000
            });
          }else {
            this.$message({
              type: 'error',
              message: res.msg,
              duration: 1000
            });
          }
          this.getCategoryQa(this.selectNode.categoryId)
        })
      },
      submitAndAiml: function (val) {
        if(this.editType === 'create'){
          val.userId = window.sessionStorage.getItem('user')
        }
        this.$api.robotAnalysis.qa.createQa(val).then((res)=>{
          if(res.code === 'ok'){
            this.publishAIML(this.selectQa)
          }else {
            this.$message({
              type: 'error',
              message: res.msg,
              duration: 1000
            });
          }
          this.getCategoryQa(this.selectNode.categoryId)
        })
      },
      createQa: function () {
        if(this.selectNode&&this.selectNode.categoryId!=='0'){
          this.showEdit = true
          this.editType = 'create'
          this.choseEditData = ''
        }else{
          this.$message({
            type: 'info',
            message: '请选择新建QA的分类（分类不能为已分类）',
            duration: 1000
          });
        }

      },
      editQa: function (item) {
        this.selectQa = item
        this.$api.robotAnalysis.qa.getQaDetail({
          qaId: item.qaId
        }).then((res)=>{
          if(res.code === 'ok'){
            this.choseEditData = res.result

          }else{
            this.choseEditData = ''
          }
          this.showEdit = true
          this.editType = 'edit'
        })
      },
      deleteQa: function (item) {
        this.$confirm('此操作将永久删除该QA, 是否继续?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$api.robotAnalysis.qa.deleteQa({
            qaId: item.qaId
          }).then((res)=>{
            if(res.code === 'ok'){
              this.$message({
                type: 'success',
                message: '删除QA成功',
                duration: 1000
              });
            }else{
              this.$message({
                type: 'error',
                message: res.msg,
                duration: 1000
              });
            }
            this.getCategoryQa(this.selectNode.categoryId)
          })
        })
      },
      //生成AIML
      publishAIML: function (item) {
        this.$api.robotAnalysis.qa.makeAIML({
          qaId: item.qaId
        }).then((res)=>{
          if(res.code === 'ok'){
            this.$message({
              type: 'success',
              message: '生成成功',
              duration: 1000
            });
          }else{
            this.$message({
              type: 'error',
              message: res.msg,
              duration: 1000
            });
          }
          this.getCategoryQa(this.selectNode.categoryId)
        })
      },
      choseNode: function (item) {
        this.activeMode = 1
        this.selectNode = item
        this.getCategory(item.categoryId)
        this.getCategoryQa(item.categoryId)
      },
      //新增分类
      addCategory: function () {


        if(this.selectNode&&this.selectNode.categoryId!=='weifenlei'){
          this.$prompt('是否在分类：('+ this.selectNode.categoryName+ ')下创建分类？', '分类', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            let data = {
              categoryName: value,
              categoryPid: this.selectNode.categoryId,
              userId: window.sessionStorage.getItem('user')
            }

            this.$api.robotAnalysis.qa.createCategory(data).then((res)=>{
              if(res.code === 'ok'){
                this.$message({
                  type: 'success',
                  message: '创建分类成功',
                  duration: 1000
                });
                this.getCategory(this.selectNode.categoryId)
              }else{
                this.$message({
                  type: 'error',
                  message: res.msg,
                  duration: 1000
                });
              }
            })
          })
        }
      },
      //编辑分类
      editCategory: function () {
        if(this.selectNode&&this.selectNode.categoryId!=='weifenlei'&&this.selectNode.categoryId!=='0'){
          this.$prompt('请输入分类名称', '更新分类', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: this.selectNode.categoryName
          }).then((val)=>{
            let data = {
              categoryId: this.selectNode.categoryId,
              categoryName: val.value,
              categoryPid: this.selectNode.categoryPid,
              userId: window.sessionStorage.getItem('user')
            }

            this.$api.robotAnalysis.qa.createCategory(data).then((res)=>{
              if(res.code === 'ok'){
                this.$message({
                  type: 'success',
                  message: '更新分类成功',
                  duration: 1000
                });
                let arr = this.treeData
                treeTools.treeCtrl.updateToTree(arr,this.selectNode.categoryId,val.value,'children','categoryId','categoryName')

              }else{
                this.$message({
                  type: 'error',
                  message: res.msg,
                  duration: 1000
                });
              }
            })
          })
        }
      },
      editorInit: function () {
        require('brace/ext/language_tools') //language extension prerequsite...
        require('brace/mode/html')
        require('brace/mode/javascript')    //language
        require('brace/mode/less')
        require('brace/theme/chrome')
        require('brace/theme/twilight')
        require('brace/snippets/javascript') //snippet
      },
      saveAimlContent: function () {

      },
      editAimlContent: function (item) {
        this.aimlCode = item.content
        this.showAimlEditor = true
      },
      delCategory: function () {
        if(this.selectNode&&this.selectNode.categoryId!=='weifenlei'&&this.selectNode.categoryId!=='0'){
          this.$confirm('此操作将永久删除该分类及其子分类, 是否继续?', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.$api.robotAnalysis.qa.deleteCategory({
              categoryId: this.selectNode.categoryId
            }).then((res)=>{
              if(res.code === 'ok'){
                this.$message({
                  type: 'success',
                  message: '删除分类成功',
                  duration: 1000
                });

                let arr = this.treeData
                treeTools.treeCtrl.deleteFromTree(arr,this.selectNode.categoryId,'children','categoryId')
//                this.treeData = arr

              }else{
                this.$message({
                  type: 'error',
                  message: res.msg,
                  duration: 1000
                });
              }
            })
          })
        }
      },
      //qa上传
      submitUpload: function () {
        this.$refs.upload.submit();
      },
      showUpload: function () {
        if(this.selectNode&&this.selectNode.categoryId!=='0'&&this.selectNode.categoryId!=='weifenlei'){
          this.importBox = true
          this.uploadData.botId = window.sessionStorage.getItem('robotId')
          this.uploadData.categoryPid = this.selectNode.categoryId
          this.uploadUrl = '/api/'+ this.uploadData.botId + '/qa/importExcel'
        }else{
          this.$message({
            type: 'info',
            message: '请选择上传的分类（不能为根节点和未分类）',
            duration: 1000
          });
        }

      },
      uploadSucces: function () {
        this.$message({
          type: 'success',
          message: '上传成功',
          duration: 1000
        });
        this.importBox = false
      },
      uploadError: function () {
        this.$message({
          type: 'error',
          message: '上传失败',
          duration: 1000
        });
      }
    },
    mounted(){
      this._initData()
    },
    watch:{
      '$route': function () {
        if(this.$route.name === 'qa'){
          this._initData()
        }
      }
    }
  }
</script>

<style lang="less">
  .qa{
    .bottom{
      .content{
        display: flex;
        .innerRight{
          .rightTop{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
</style>
