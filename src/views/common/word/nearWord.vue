<template>
  <div class="nearWord container">
    <div class="top">
      <p class="title">同义词管理</p>
    </div>
    <div class="bottom">
      <div class="content">
        <!--<div class="innerLeft">-->
          <!--<div class="innerTitle flexCenter">-->
            <!--<span>同义词分类</span>-->
            <!--<div class="ctrl">-->
              <!--<i class="iconfont icon-tianjia"></i>-->
              <!--<i class="iconfont icon-bianji"></i>-->
              <!--<i class="iconfont icon-fangdajing"></i>-->
              <!--<i class="iconfont icon-shanchu"></i>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="innerContent">-->
            <!--<div class="treeBox">-->
              <!--<tree-box :treeData="treeData" :config="treeConfig" :selectedItem="selectNode" @select="choseNode"></tree-box>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
        <div class="innerRight">
          <div class="rightTop">
            <div>
              <el-button type="primary" size="small" @click="addNearWord">+ 创建词语</el-button>
              <el-button size="small" type="success" @click="syncWord">同步同义词</el-button>
            </div>


            <div class="searchPart">
              <el-input placeholder="输入同义词" v-model="searchFilter.search" @keyup.enter.native="searchWordCtrl">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="searchWordCtrl"></i>
              </el-input>
            </div>
          </div>
          <div class="rightBottom">
            <table class="gtable">
              <tr class="gheader">
                <th>序号</th>
                <th>词语</th>
                <th>同义词</th>
                <th>操作</th>
              </tr>
              <tr v-for="(item,index) in wordList">
                <td>{{index+1}}</td>
                <td>{{item.wordName}}</td>
                <td>{{item.wordSynonym}}</td>
                <td>
                  <span class="edit" @click="editWord(item)">编辑</span>
                  <span class="del" @click="deleteWord(item)">删除</span>
                </td>
              </tr>
            </table>
            <p v-if="wordList.length===0" class="tips">暂无同义词</p>
            <div style="margin-top: 10px" class="pageBox" v-if="wordList.length!==0">
              <el-pagination
                      background
                      layout="total, prev, pager, next"
                      @current-change="handleCurrentChange"
                      :page-size="searchFilter.rows"
                      :total="total">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="addNearWord coverBack" v-if="editShow">
      <div class="centerBox">
        <div class="title">
          <span>同义词</span>
          <i class="fas fa-times" aria-hidden="true" @click="editShow = false"></i>
        </div>
        <div class="content">
          <div class="addItem">
            <span class="text"> 词语：</span>
            <el-input class="itemInput" v-model="choseWord"></el-input>
          </div>
          <div class="addItem">
            <span class="text">同义词：</span>
            <div class="itemInput">
              <el-input  v-model="sameWord"></el-input>
              <el-button type="success" @click="addWord">添加</el-button>
            </div>
          </div>
          <div class="addItem sameList">
            <span class="text"></span>
            <div class="itemInput scrollbar">
              <span v-for="(item,index) in sameList">{{item}} <i class="iconfont icon-guanbi" @click="removeItem(index)"></i></span>
            </div>
          </div>
        </div>
        <div class="btnGroup">
          <el-button @click="editShow = false">取消</el-button>
          <el-button type="primary" @click="submitWord">确认</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TreeBox from "../../../components/common/tree.vue";

  export default {
    components: {TreeBox},
    name: 'nearWord',
    data(){
      return{
        searchFilter: {
          robotId: '',
          page: 1,
          rows: 10,
          search: ''
        },
        wordList:[],
        total: 0,
        editShow: false,
        choseWord: '',
        sameList: [],
        sameWord: '',
        editType: 'create',
        choseItem: ''
      }
    },
    methods:{
      choseNode: function (item) {
        this.selectNode = item
      },
      _initData: function () {
        this.searchData()
      },
      searchData: function () {
        let robotId = this.$route.query.robotId
        this.searchFilter.robotId = robotId
        this.$api.robotAnalysis.word.near.getWords(this.searchFilter).then((res)=>{
          if(res.msg==='ok'){
            this.wordList = res.data.rows
            this.total = res.data.total
          }
        })
      },
      handleCurrentChange: function (val) {
        this.searchFilter.page = val
        this.searchData()
      },
      searchWordCtrl: function () {
        this.searchFilter.page =1
        this.searchData()
      },
      addNearWord: function () {
        this.choseWord = ''
        this.sameList = []
        this.sameWord = ''
        this.editType = 'create'
        this.editShow = true
      },
      addWord: function () {
        if(this.sameList.indexOf(this.sameWord)===-1){
          this.sameList.push(this.sameWord)
          this.sameWord = ''
        }else{
          this.$message({
            type: 'info',
            message: '已存在相同同义词',
            duration: 1000
          });
        }
      },
      removeItem: function (index) {
        this.sameList.splice(index,1)
      },
      editWord: function (item) {
        this.choseItem = item
        this.editType = 'edit'
        this.choseWord = item.wordName
        this.sameWord = ''
        this.sameList = item.wordSynonym.split(',')
        this.editShow = true
      },
      deleteWord: function (item) {
        let robotId = this.$route.query.robotId
        this.$confirm('此操作将永久删除该同义词, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$api.robotAnalysis.word.near.deleteWord({
            robotId: robotId,
            wordId: item.wordId,
          }).then((res)=>{
            if(res.msg==='ok'){
              this.$message({
                type: 'success',
                message: '删除成功',
                duration: 1000
              });
              this._initData()
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
      submitWord: function () {
        let robotId = this.$route.query.robotId
        let data= {
          robotId: '',
          wordName: '',
          wordSynonym: ''
        }
        data.robotId = robotId
        data.wordName = this.choseWord
        this.sameList.forEach((e,index)=>{
          if(index!==0){
            data.wordSynonym += ',' + e
          }else{
            data.wordSynonym = e
          }
        })

        if(data.wordName.trim()&&data.wordSynonym.trim()){
          if(this.editType === 'create'){
            this.$api.robotAnalysis.word.near.createWord(data).then((res)=>{
              if(res.msg==='ok'){
                this.$message({
                  type: 'success',
                  message: '新建成功',
                  duration: 1000
                });
                this.editShow = false
                this._initData()
              }else{
                this.$message({
                  type: 'error',
                  message: res.msg,
                  duration: 1000
                });
              }
            })

          }else{
            data.wordId = this.choseItem.wordId
            this.$api.robotAnalysis.word.near.updateWord(data).then((res)=>{
              if(res.msg==='ok'){
                this.$message({
                  type: 'success',
                  message: '更新成功',
                  duration: 1000
                });
                this.editShow = false
                this._initData()
              }else{
                this.$message({
                  type: 'error',
                  message: res.msg,
                  duration: 1000
                });
              }
            })
          }
        }else{
          this.$message({
            type: 'info',
            message: '词语或者同义词不能为空',
            duration: 1000
          });
        }
      },
      syncWord: function () {
        let robotId = this.$route.query.robotId
        this.$api.robotAnalysis.word.near.syncData({
          robotId: robotId,
        }).then((res)=>{
          if(res.msg==='ok'){
            this.$message({
              type: 'success',
              message: '同步成功',
              duration: 1000
            });
          }else{
            this.$message({
              type: 'error',
              message: res.msg,
              duration: 1000
            });
          }
        })
      }
    },
    mounted(){
      this._initData()
    },
    watch:{
      '$route': function () {
        if(this.$route.name === 'nearWord'){
          this._initData()
          this.wordList = []
        }
      }
    }
  }
</script>

<style lang="less">
  .nearWord{
    .bottom{
      padding: 0 1rem;
      .content{
        border: solid 1px #ddd;
        background: #fff;
        display: flex;
        padding: 0;
        /*padding: 1rem;*/
        .innerRight{
          border: none;
          .rightTop{
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            .searchPart{
              width: 15rem;
            }
          }
        }
        .edit{
          color: #2B86F6;
          margin-right: 1rem;
        }
      }
    }
    .addNearWord{
      .centerBox{
        height: 25rem;
        .content{
          .addItem{
            .text{
              width: 5rem;
            }
            .itemInput{
              display: flex;
            }
          }
          .sameList{
            margin-top: -0.5rem;
            .itemInput{
              max-height: 6rem;
              overflow: auto;
              display: flex;
              flex-wrap: wrap;
              span{
                border: solid 1px #ddd;
                font-size: 12px;
                padding: 2px 5px;
                color: #666;
                border-radius: 2px;
                margin-right: 10px;
                margin-bottom: 5px;
                i{
                  font-size: 12px;
                }
                i:hover{
                  color: #FF0000;
                }
              }
            }
          }

        }
      }
    }
  }
</style>