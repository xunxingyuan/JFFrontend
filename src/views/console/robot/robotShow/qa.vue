<template>
  <div class="qa container">
    <div class="top">
      <p class="title">一问一答</p>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="innerLeft">
          <div class="innerTitle flexCenter">
            <span>分类</span>
            <div class="ctrl" v-if="userAuth.admin">
              <i class="iconfont icon-tianjia" @click="addCategory"></i>
              <i class="iconfont icon-bianji" @click="editCategory"></i>
              <!--<i class="iconfont icon-fangdajing"></i>-->
              <i class="iconfont icon-shanchu" @click="delCategory"></i>
            </div>
          </div>
          <div class="innerContent">
            <div class="treeBox">
              <tree-box :showAll="true" :treeData="treeData" :config="treeConfig" :selectedItem="selectNode" @select="choseNode"></tree-box>
              <p v-if="treeData.length===0" style="margin-top: 2rem;margin-left:-1rem;font-size: 14px">暂无分类目录</p>
            </div>
          </div>
        </div>
        <div v-if="activeMode=== 1" class="innerRight scrollbar">
          <div class="rightTop">
            <div class="add">
              <el-button type="primary" size="small" @click="createQa" v-if="sceneLimit.create">+ 新建问答</el-button>
              <el-button size="small" type="success" @click="createGlobalAiml" v-if="sceneLimit.submit">同步内容</el-button>
              <el-button size="small" @click="showUpload" v-if="sceneLimit.create">导入问答</el-button>
            </div>
            <div class="search flex">
              <el-input
                      size="small"
                      placeholder="请输入内容"
                      v-model="searchWord"
                      @keyup.enter.native="searchQa">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="searchQa"></i>
              </el-input>
              <el-button size="small" @click="showFilter = !showFilter">高级搜索</el-button>
            </div>
          </div>
          <div class="rightTools" v-if="checkList.length>0">
            <div class="toolsBox">
              <el-checkbox v-model="checkPage" label="本页全选" @change="choseOrUnChose"></el-checkbox>
              <div class="flex" style="margin-left: 2rem">
                <span class="toolsItem" v-for="item in checkTypeList">{{item.name}}</span>
              </div>
            </div>
          </div>
          <div class="rightBottom">
            <div class="rightContent">
              <div v-if="showFilter" class="filterBox">
                <div class="filterItem">
                  <span class="itemName">有效时间</span>
                  <el-date-picker
                          v-model="effectTime"
                          @change="timeRangeChange"
                          size="small"
                          type="datetimerange"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                  </el-date-picker>
                </div>
                <div class="filterItem">
                  <span class="itemName">是否分类</span>
                  <el-select size="small" v-model="filterData.isUnCategory">
                    <el-option v-for="(item,index) in categoryType" :label="item.label" :value="item.value" :key="index"></el-option>
                  </el-select>

                </div>
              </div>
              <table class="gtable">
                <tr class="gheader">
                  <!--<th width="40"></th>-->
                  <th style="padding-left: 1rem;">序号</th>
                  <th>问题标题</th>
                  <th>创建时间</th>
                  <!--<th>创建人</th>-->
                  <th width="150">
                    <div class="flex">
                      <span>启用状态</span>
                      <table-filter :options="filterDataChose" @selectFilter="changeFilter"></table-filter>
                    </div>
                  </th>
                  <th>编辑状态</th>
                  <th width="250">操作</th>
                </tr>
                <tr v-for="(item,index) in questionList">
                  <!--<td>-->

                    <!--&lt;!&ndash;<el-checkbox @change="choseItem(index)"  :checked="checkState(index)"></el-checkbox>&ndash;&gt;-->
                  <!--</td>-->
                  <td>
                    <el-checkbox-group v-model="checkList">
                      <el-checkbox :label="totalCount- (filterData.pageNum-1)*10 -index"  :key="index+1"></el-checkbox>
                    </el-checkbox-group>
                    <!--{{index+1}}-->
                    <!--{{totalCount- (filterData.pageNum-1)*10 -index}}-->
                  </td>
                  <td :title="item.question">
                    <div class="text">
                      {{item.question}}
                    </div>
                  </td>
                  <td>{{new Date(item.created).toLocaleString()}}</td>
                  <!--<td>&#45;&#45;</td>-->
                  <td>
                    <span v-if="item.status===0" style="color: #999">失效</span>
                    <span v-if="item.status===1" style="color: #6ce26c">生效</span>
                  </td>
                  <td>编辑中</td>
                  <td>
                    <span class="edit" v-if="sceneLimit.submit">
                      <el-popover
                              placement="bottom-start"
                              width="13rem"
                              trigger="hover"
                              >
                        <p>确定这条问题通过审核吗？</p>
                        <div style="text-align: center; margin-top: 1rem;">
                          <el-button type="primary" size="mini">通过</el-button>
                          <el-button size="mini" type="text">取消</el-button>
                        </div>
                        <span slot="reference">审核</span>
                      </el-popover>
                    </span>
                    <span class="edit" @click="editQa(item)" v-if="sceneLimit.edit||sceneLimit.view">编辑</span>
                    <!--<span class="edit" @click="publishAIML(item)">生成AIML</span>-->
                    <span class="edit" @click="getQaAIML(item)" v-if="sceneLimit.view">查看AIML</span>
                    <span class="del" @click="deleteQa(item)" v-if="sceneLimit.delete">删除</span>
                  </td>
                </tr>
              </table>
              <p v-if="questionList.length===0" class="tips">暂无相关问答</p>
              <div class="pageBox">
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
        </div>
        <div v-if="activeMode=== 2&&!showAimlEditor" class="innerRight scrollbar">
          <!--<div class="rightTop">-->
            <!--<el-button type="primary" size="small" @click="uploadAiml">导入源码</el-button>-->
          <!--</div>-->
          <div class="rightBottom">
            <div class="rightContent aimlContain" >
              <div v-for="item in aimlList" class="aimlBox" @click="editAimlContent(item)">
                <div class="icon">aiml</div>
                <span :title="item.aimlId">{{item.aimlId}}</span>
                <!--<i title="删除" @click.stop="deleteAiml(item)" class="del fas fa-times"></i>-->
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
    <qa-edit :userLimit="sceneLimit" v-if="showEdit" @close="showEdit = false" itemType="qa" :tree="treeData" :editType="editType" :categoryId="transCategoryId" :editData="choseEditData" @submit="submitData" @submitAndAiml="submitAndAiml"></qa-edit>
    <div class="importQa coverBack" v-if="importBox">
      <div class="centerBox">
        <div class="title">
          <span>导入问答</span>
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
  import TableFilter from "../../../../components/common/filter.vue";
  import { mapGetters, mapActions } from 'vuex'


  export default {
    components: {
      TableFilter,
      TreeBox,
      QaEdit,
      aceEditor},
    name: 'qa',
    computed:{
      ...mapGetters({
        userAuth: 'getUserAuth'
      })
    },
    data(){
      return {
        sceneLimit:{
          'edit': true,
          'submit': true,
          'create': true,
          'view': true,
          'delete': true
        },
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

        //分类数据
        categoryType:[{
          label: '已分类',
          value: false
        },{
          label: '未分类',
          value: true
        }],

        filterDataChose:[{
          name:'全部'
        },
//          {
//          name:'待审核'
//        },
          {
          name:'生效'
        },{
          name:'失效'
        }],
        treeConfig:{
          child: 'children',
          name: 'categoryName',
          id: 'categoryId',
          num: 'qaNum',
          numIntro: '问答数量'
        },
        selectNode: '',
        transCategoryId: '',
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
        filterData:{
          categoryId: '',
          pageSize: 10,
          pageNum: 1,
          status: '',
          str: '',
          isUnCategory: false,
          effDate: '',
          expDate: ''
        },
        effectTime:[],
        aimlList: [],
        showAimlEditor: false,
        aimlCode:'',
        selectQa: '',
        checkList:[],
        checkPage: false,
        checkTypeList:[{
          name: '审核'
        },{
          name: '启用'
        },{
          name: '停用'
        },{
          name: '删除'
        },{
          name: '设定有效时间'
        }],
        searchType: 'category',
        showFilter: false
      }
    },
    methods:{
      //修改权限
      changeUserLimit: function () {
        let robotId = window.sessionStorage.getItem('robotId')||this.$route.query.robotId
        if(!this.userAuth.admin){
          let authData = this.userAuth.data.categoryAuthority[robotId]
          authData.forEach((e)=>{
            if(e.conversationType === 'qa'){
              this.sceneLimit.submit =  e.audit === 1
              this.sceneLimit.create =  e.create === 1
              this.sceneLimit.edit =  e.edit === 1
              this.sceneLimit['delete'] =  e.delete === 1
              this.sceneLimit.view =  e.view === 1
            }
          })
        }
      },
      _initData: function () {
        this.questionList = []
        let role = window.sessionStorage.getItem('userRole')
        let userId = window.sessionStorage.getItem('userId')
        if(role === 'admin'){
          this.$api.robotAnalysis.qa.getCategory({
            categoryPId: 0
          }).then((res)=>{
            if(res.code === 'ok'){
              this.treeData = res.result
            }
          })
        }else{
          this.$api.user.menu.getUserMenu({
            botId: window.sessionStorage.getItem('robotId'),
            userId: userId
          }).then((res)=>{
            if(res.status===200){
              this.treeData = res.data.qa
            }
          })
        }
      },
      //获取目录
      getCategory: function (id) {
        if(id!=='weifenlei'){
          this.$api.robotAnalysis.qa.getCategory({
            categoryPId: id
          }).then((res)=>{
            if(res.code === 'ok'){
              if(id=== 0){
                this.treeData = res.result
              }else{
                let arr = this.treeData
                res.result.forEach((e)=>{
                  e.children = []
                })
                treeTools.treeCtrl.addToTree(arr,id,res.result,'children','categoryId')
              }
//              this.treeData = arr
            }
          })
        }
      },
      handleCurrentChange: function (val) {
        this.filterData.pageNum = val

        if(this.searchType === 'category'){
          this.getCategoryQa(this.selectNode.categoryId)
        }else{
          this.searchQaNew()
        }
      },
      timeRangeChange: function (val) {
//        console.log(val)
        if(val){
          this.filterData.expDate = val[0]
          this.filterData.effDate = val[1]
        }else{
          this.filterData.expDate = ''
          this.filterData.effDate = ''
        }
        if(this.searchType === 'category'){
          this.getCategoryQa(this.selectNode.categoryId)
        }else{
          this.searchQaNew()
        }
      },
      //获取目录qa
      getCategoryQa: function (id) {
        this.checkList = []
        if(id!=='weifenlei'){
          this.filterData.categoryId = id

          this.$api.robotAnalysis.qa.searchQaNew(this.filterData).then((res)=>{
            if(res.code === 'ok'){
              this.questionList = res.result
              this.totalCount = res.totalSize
            }else{
              this.questionList = []
              this.totalCount = 0
              this.$message({
                type: 'error',
                message: res.msg,
                duration: 1000
              });
            }
          })
        }else{
          this.filterData.categoryId = ''
          this.$api.robotAnalysis.qa.getUnCategoryQa({
            pageSize: this.filterData.pageSize,
            pageNum: this.filterData.pageNum
          }).then((res)=>{
            if(res.code === 'ok'){
              this.questionList = res.result
              this.totalCount = res.totalSize
            }else{
              this.questionList = []
              this.totalCount = 0
              this.$message({
                type: 'error',
                message: res.msg,
                duration: 1000
              });
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
      //生成aiml
      createGlobalAiml: function () {
        this.$confirm('此操作将所有已保存的问答生成AIML, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.submitAiml()
        })
      },
      //生成aiml
      submitAiml: function () {
        this.$api.robotAnalysis.qa.updateQaAiml({
          isAll: true,
          status: 1,
          checkStatus: 4,
          qaIds: []
        }).then((res)=>{
          if(res.code === 'ok'){
            this.$message({
              type: 'success',
              message: '生成成功',
              duration: 1000
            });
          }else {
            this.$message({
              type: 'error',
              message: res.msg,
              duration: 1000
            });
          }
          if(this.searchType === 'category'){
            this.getCategoryQa(this.selectNode.categoryId)
          }else{
            this.searchQaNew()
          }
        })
      },
      //搜索QA
      searchQa: function () {
        this.filterData.pageNum = 1
        this.searchType = 'search'
        this.searchQaNew()
//        this.$api.robotAnalysis.qa.searchQa({
//          str: this.searchWord
//        }).then((res)=>{
//          if(res.code === 'ok'){
//            this.questionList = res.result
//          }else{
//            this.$message({
//              type: 'error',
//              message: res.msg,
//              duration: 1000
//            });
//          }
//        })
      },
      //搜索qa 新
      searchQaNew: function () {
        this.checkList = []

        this.filterData.categoryId = ''
        this.filterData.str = this.searchWord
        this.filterData.botId = window.sessionStorage.getItem('robotId')


        let filterData = {}
        for(let data in this.filterData){
          if(this.filterData[data]!== ''){
            filterData[data] = this.filterData[data]
          }
        }


        this.$api.robotAnalysis.qa.searchQaNew(filterData).then((res)=>{
          if(res.code === 'ok'){
            this.questionList = res.result
            this.totalCount = res.totalSize
          }else{
            this.$message({
              type: 'error',
              message: res.msg,
              duration: 1000
            });
          }
        })
      },

      changeFilter: function (item) {
        let status = ''
        if(item.name === '生效'){
          status = 1
        }else if(item.name === '失效'){
          status = 0
        }else{
          status = ''
        }
        if(this.searchType === 'category'){
          this.filterData.status = status
          this.getCategoryQa(this.selectNode.categoryId)
        }else{
          this.filterData.status = status
          this.searchQaNew()
        }
      },

      submitData: function (val) {
//        console.log(val)
        if(this.editType === 'create'){
          val.userId = window.sessionStorage.getItem('user')
        }
        this.$api.robotAnalysis.qa.createQa(val).then((res)=>{
          if(res.status === 200){
            this.$message({
              type: 'success',
              message: '保存成功',
              duration: 1000
            });
            if(val.hasOwnProperty('comfirm')){
              this.submitAiml()
            }
          }else {
            this.$message({
              type: 'error',
              message: res.msg,
              duration: 1000
            });
          }
          if(this.searchType === 'category'){
            this.getCategoryQa(this.selectNode.categoryId)
          }else{
            this.searchQaNew()
          }
        })
      },
      submitAndAiml: function (val) {
        if(this.editType === 'create'){
          val.userId = window.sessionStorage.getItem('user')
        }
        this.$api.robotAnalysis.qa.createQaAiml(val).then((res)=>{
          if(res.status === 200){
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

          if(this.searchType === 'category'){
            this.getCategoryQa(this.selectNode.categoryId)
          }else{
            this.searchQaNew()
          }
        })
      },
      createQa: function () {
        if(this.selectNode&&this.selectNode.categoryId!=='0'){
          this.showEdit = true
          this.editType = 'create'
          this.transCategoryId = this.selectNode.categoryId
          this.choseEditData = ''
        }else{
          this.$message({
            type: 'info',
            message: '请选择新建问答的分类',
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
            this.transCategoryId = res.result.categoryId
          }else{
            this.choseEditData = ''
          }
          this.showEdit = true
          this.editType = 'edit'
        })
      },
      deleteQa: function (item) {
        this.$confirm('此操作将永久删除该问答, 是否继续?', '删除', {
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
                message: '删除问答成功',
                duration: 1000
              });
            }else{
              this.$message({
                type: 'error',
                message: res.msg,
                duration: 1000
              });
            }
            if(this.searchType === 'category'){
              this.getCategoryQa(this.selectNode.categoryId)
            }else{
              this.searchQaNew()
            }
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
        this.filterData.pageNum = 1
        this.searchType = 'category'
        this.filterData.str = ''
        this.filterData.isUnCategory= false
        this.filterData.effDate = ''
        this.filterData.expDate=''

//        this.getCategory(item.categoryId)
        this.getCategoryQa(item.categoryId)
      },
      //新增分类
      addCategory: function () {

        if(!this.selectNode){
          this.selectNode = {
            categoryName: '全部分类',
            categoryId: 0
          }
        }
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
                this.selectNode = ''
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
      },
      checkState: function (index) {
        return this.checkList.indexOf(index)>-1
      },
      choseOrUnChose: function () {
        let len = this.questionList.length
        if(this.checkList.length === len){
          this.checkList = []
        }else{
          this.questionList.forEach((e,index)=>{
            let result = this.totalCount- (this.filterData.pageNum-1)*10 -index


            if(this.checkList.indexOf(result) === -1){
              this.checkList.push(result)
            }
          })
        }
      },
      choseItem: function (index) {
        let num = this.checkList.indexOf(index)
        if(num === -1){
          this.checkList.push(index)
        }else{
          this.checkList.splice(num,1)
        }
        console.log(this.checkList)
      },
      checkPageChange: function (val) {
        this.$nextTick(()=>{
          if(val){
            this.questionList.forEach((e,index)=>{
              if(this.checkList.indexOf(index)===-1){
                this.checkList.push(index)
              }
            })
          }
        })
      }
    },
    mounted(){
      this._initData()
      this.changeUserLimit()
    },
    watch:{
      '$route': function () {
        if(this.$route.name === 'qa'){
          this._initData()
          this.selectNode = ''
          this.changeUserLimit()
        }
      },
      checkList: function () {
        if(this.questionList.length === this.checkList.length){
          this.checkPage = true
        }else{
          this.checkPage = false
        }
      },
      'userAuth': function () {
        if(this.$route.name === 'scene'){
          this.changeUserLimit()
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
          position: relative;
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
