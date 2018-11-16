<template>
  <div class="sensitiveWord container">
    <div class="top">
      <p class="title">敏感词管理</p>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="tools">
          <div class="flex">
            <el-button size="small" type="primary" @click="addWord">+添加敏感词</el-button>
          </div>
          <div>
            <el-input placeholder="输入敏感词" v-model="searchFilter.sensitiveWord" @keyup.enter.native="searchWordCtrl">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="searchWordCtrl"></i>
            </el-input>
          </div>
        </div>
        <div class="showBox">
          <div class="form">
            <table class="gtable">
              <tr class="gheader">
                <th>序号</th>
                <th>敏感词类型</th>
                <th>敏感词内容</th>
                <th>操作</th>
              </tr>
              <tr v-for="(item,index) in wordList">
                <td>{{index+1}}</td>
                <td>{{returnType(item.sensitiveType)}}</td>
                <td>{{item.sensitiveWord}}</td>
                <td>
                  <span class="edit" @click="editWord(item)">编辑</span>
                  <span @click="deleteWord(item)">删除</span>
                </td>
              </tr>
            </table>
            <p v-if="wordList.length===0" class="tips">暂无敏感词</p>
          </div>
          <div class="pageBox" v-if="wordList.length!==0">
            <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    :page-size="searchFilter.rows"
                    layout="total,prev, pager, next"
                    :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="editSensitive coverBack" v-if="editBox">
      <div class="centerBox">
        <div class="title">
          <span>敏感词</span>
          <i class="fas fa-times" aria-hidden="true" @click="editBox = false"></i>
        </div>
        <div class="content">
          <div class="addItem">
            <span class="text">敏感词：</span>
            <el-input class="itemInput" v-model="choseWord"></el-input>
          </div>
          <div class="addItem">
            <span class="text">分类：</span>
            <el-select class="itemInput" v-model="choseType">
              <el-option
                      v-for="item in typeData"
                      :key="item.typeCode"
                      :label="item.typeName"
                      :value="item.typeCode"></el-option>
            </el-select>
          </div>
        </div>
        <div class="btnGroup">
          <el-button @click="editBox = false">取消</el-button>
          <el-button type="primary" @click="submitWord">确认</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sensitiveWord',
    data(){
      return {
        searchFilter: {
          robotId: '',
          sensitiveType: '',
          sensitiveWord: '',
          page: 1,
          rows: 10
        },
        choseItem: '',
        choseType: '',
        choseWord: '',
        typeData:[],
        editBox: false,
        wordList:[],
        total: 0,
        editType: 'create'
//        searchFilter:{
//          robotId: ''
//        }
      }
    },
    methods:{
      _initData: function () {

        this.$api.robotAnalysis.word.sensitive.getType().then((res)=>{
          if(res.msg === 'ok'){
            this.typeData =  res.data
          }
        })
        this.searchWord()

      },
      searchWordCtrl: function () {
        this.searchFilter.page = 1
        this.searchWord()
      },
      handleCurrentChange: function (val) {
        this.searchFilter.page = val
        this.searchWord()
      },
      searchWord: function () {
        let robotId = this.$route.query.robotId
        this.searchFilter.robotId = robotId
        this.$api.robotAnalysis.word.sensitive.getWords(this.searchFilter).then((res)=>{
          if(res.msg==='ok'){
            this.wordList = res.data.rows
            this.total = res.data.total
          }
        })
      },
      addWord: function () {
        this.editBox = true
        this.editType = 'create'
      },
      submitWord: function () {
        let robotId = this.$route.query.robotId
        if(this.editType === 'edit'){
          this.$api.robotAnalysis.word.sensitive.updateWord({
            robotId: robotId,
            sensitiveId: this.choseItem.sensitiveId,
            sensitiveType: this.choseType,
            sensitiveWord: this.choseWord
          }).then((res)=>{
            if(res.msg==='ok'){
              this.$message({
                type: 'success',
                message: '更新成功',
                duration: 1000
              });
              this.editBox = false
              this._intiData()
            }else{
              this.$message({
                type: 'error',
                message: res.msg,
                duration: 1000
              });
            }
          })
        }else if(this.editType === 'create'){
          this.$api.robotAnalysis.word.sensitive.addWord({
            robotId: robotId,
            sensitiveType: this.choseType,
            sensitiveWord: this.choseWord
          }).then((res)=>{
            if(res.msg==='ok'){
              this.$message({
                type: 'success',
                message: '添加成功',
                duration: 1000
              });
              this.editBox = false
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

      },
      editWord: function (item) {
        this.editBox = true
        this.editType = 'edit'
        this.choseItem = item
        this.choseType = item.sensitiveType
        this.choseWord = item.sensitiveWord
      },
      deleteWord: function (item) {
        let robotId = this.$route.query.robotId
        this.$confirm('此操作将永久删除该敏感词, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$api.robotAnalysis.word.sensitive.deleteWord({
            robotId: robotId,
            sensitiveId: item.sensitiveId,
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
      returnType: function (code) {
        let type = ''
        this.typeData.forEach((e)=>{
          if(e.typeCode === code){
            type = e.typeName
          }
        })
        return type
      }
    },
    mounted(){
      this._initData()
    },
    watch:{
      '$route': function () {
        if(this.$route.name === 'sensitiveWord'){
          this._initData()
          this.wordList = []
        }
      }
    }
  }
</script>

<style lang="less">
  .sensitiveWord{
    .bottom{
      .content{
        background: #fff;
        padding: 1rem;
        .chartBox{
          display: flex;
          height: 25rem;
          width: 100%;
          align-items: center;
          padding: 1rem;
          #pieBox{
            width: 30rem;
            height: 100%;
          }
          #lineBox{
            flex: 1;
            height: 100%;
          }
        }
        .showBox{
          .tips{
            margin-top: 3rem;
            font-size: 14px;
            color: #666;
          }
          .edit{
            color: #2B86F6;
            margin-right: 1rem;
            cursor: pointer;
          }
          .pageBox{
            margin-top: 1rem;
          }
        }
      }
    }
    .editSensitive{
      .centerBox{
        height: 25rem;
        .content{
          .addItem{
            .text{
              width: 5rem;
            }
          }
        }
      }
    }
  }
</style>