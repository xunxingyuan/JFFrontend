<template>
  <div class="practice">
    <section class="firstContent">
      <div class="search">
        <div class="flex">
          <!--<el-button type="primary"><i class="fa fa-plus" aria-hidden="true"></i> 新增场景</el-button>-->
          <span class="add" @click="add()"><i class="fa fa-plus" aria-hidden="true" style="margin-right: 5px"></i>添加</span>
          <span class="add" @click="uploadShow = true"><i class="fa fa-plus" aria-hidden="true" style="margin-right: 5px"></i>批量导入</span>
          <!--<span class="add" @click="textAna = true">文本分析</span>-->
          <!--<span class="add" @click="textCompare = true">文本对比</span>-->
          <!--<span class="common" @click="setCommonSetting()"><i class="fa icon_setting" aria-hidden="true"></i> 通用设置</span>-->
        </div>
        <!--<el-input-->
          <!--placeholder="请输入搜索场景关键词"-->
          <!--suffix-icon="el-icon-search"-->
          <!--v-model="searchInput">-->
        <!--</el-input>-->
      </div>
      <div class="content flex">
        <div class="selectCtrl" v-if="selectItem.length!==0">
          <span @click="selectAll()">选中当页</span>
          <span @click="delChose()">删除选中</span>
          <span @click="selectItem = []">取消选中</span>
        </div>
        <table class="gtable">
          <tr class="gheader">
            <th></th>
            <th>内容</th>
            <th>操作</th>
          </tr>
          <tr v-for="item in practiceList.list">
            <td width="20"><input v-model="selectItem" :value="item.id" type="checkbox" /></td>
            <td><span>{{item.content}}</span></td>
            <td width="150" class="ctrl">
              <span class="edit" @click.stop="edit(item)">编辑</span>
              <span class="del" @click.stop="delConfirm(item)">删除</span>
            </td>
          </tr>
        </table>
        <p v-if="practiceList.hasOwnProperty('list')&&practiceList.list.length===0">暂无数据</p>
      </div>
    </section>
    <el-pagination v-if="practiceList.total>20"
      layout="prev, pager, next,jumper"
      @current-change="handleCurrentChange"
      :page-size="20"
      :current-page="practiceList.pageNum"
      :total="practiceList.total">
    </el-pagination>

    <div class="uploadBox coverBack" v-if="uploadShow">
      <div class="centerBox">
        <div class="title flex">
          <p>文件上传</p>
          <i @click="close()" aria-hidden="true" class="iconfont icon-guanbi"></i>
        </div>
        <div class="content">
          <el-upload
            class="upload-demo"
            :data="fileData"
            drag
            action="/backServer/trainSet/import"
            :limit= 'uploadLimit' >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </div>
        <!--<div class="btnGroup">-->
          <!--<el-button type="primary">确定</el-button>-->
          <!--<el-button @click="uploadShow = false">取消</el-button>-->
        <!--</div>-->
      </div>
    </div>
    <div class="coverBack" v-if="editAna">
      <div class="centerBox">
        <div class="title flex">
          <p>训练内容</p>
          <i @click="editAna = false" aria-hidden="true" class="iconfont icon-guanbi"></i>
        </div>
        <div class="content">
          <el-input type="textarea" :autosize="{ minRows: 12, maxRows: 12}" resize="none" v-model="selectText.data">

          </el-input>
        </div>
        <div class="btnGroup">
          <el-button type="primary" @click="saveEditData()">确定</el-button>
          <!--<el-button @click="textAna = false">取消</el-button>-->
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'practice',
    data(){
      return {
        searchInput: '',
        selectItem:[],
        uploadShow: false,
        textAna: false,
        textCompare: false,
        editAna: false,
        uploadLimit: 1,
        selectText:{
          data: '',
          type: 'add',
          unitId: ''
        }
      }
    },
    computed:{
      ...mapGetters({
        filterData: 'getPracticeFilter',
        practiceList: 'getCategoryPractice',
        activeCategory: 'getActiveCategory'
      })
    },
    methods:{
      handleCurrentChange: function (val) {
        let filter = {
          categoryId: this.filterData.categoryId,
          page: val,
          rows: 20
        }
        this.$store.dispatch('getPracticeList',filter)
      },
      edit: function (item) {
        this.selectText.unitId = item.unitId
        this.selectText.data = item.content
        this.selectText.type = 'edit'
        this.editAna = true
      },
      saveEdit: function () {
        this.$api.setTrainSet({
          unitId: this.selectText.unitId,
          content: this.selectText.data
        },'update').then((res)=>{
          if(res.code === 'ok'){
            this.selectText.data = ''
            this.updateList()
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.editAna = false
          }
        })
      },
      add: function () {
        this.editAna = true
        this.selectText.unitId = ''
        this.selectText.data = ''
        this.selectText.type = 'add'
      },
      saveAdd: function () {
        this.$api.setTrainSet({
          categoryId: this.activeCategory.categoryId,
          content: this.selectText.data
        },'add').then((res)=>{
          if(res.code === 'ok'){
            this.$message({
              type: 'success',
              message: '新增成功'
            });
            this.updateList()
            this.editAna = false
          }
        })
      },
      updateList: function () {
        this.$store.dispatch('getPracticeList',this.filterData)
      },
      del: function (item) {
        let arr = []
        arr.push(item.unitId)

        this.$api.setTrainSet({
          unitIdList: JSON.stringify(arr)
        },'delete').then((res)=>{
          if(res.code === 'ok'){
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.updateList()

          }
        })
      },
      delConfirm: function (item) {
        this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.del(item)
        })
      },
      delChose: function () {
        this.$confirm('此操作将永久删除选中的内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.setTrainSet({
            unitIdList: JSON.stringify(this.selectItem)
          },'delete').then((res)=>{
            if(res.code ==='ok'){
              this.selectItem = []
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.updateList()
            }
          })
        })
      },
      //选中当页所有
      selectAll: function () {
        this.selectItem = []
        this.practiceList.list.forEach((e)=>{
          this.selectItem.push(e.id)
        })
      },
      close: function () {
        this.updateList()
        this.uploadShow = false
      },
      saveEditData: function () {
        if(this.selectText.type === 'add'){
          this.saveAdd()
        }else if(this.selectText.type === 'edit'){
          this.saveEdit()
        }
      }
    },
    watch:{
      practiceList: function () {
        this.selectItem = []
      }
    }
  }
</script>

<style lang="less">
  .practice{
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    .firstContent{
      flex: 1;
      position: relative;
      .gtable{
        tr td{
          padding: 10px;
        }
      }
      .content{
        .selectCtrl{
          position: absolute;
          top: 0.5rem;
          left: 1rem;
          height: 3rem;
          width: 90%;
          background: #fff;
          border: solid 1px #ddd;
          box-shadow: 0 0 5px #ddd;
          display: flex;
          padding: 0 1rem;
          align-items: center;
          span{
            border: solid 1px #00aaec;
            height: 32px;
            line-height: 32px;
            padding: 0 1rem;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 1rem;
            font-size: 0.8rem;
          }
          span:hover{
            background: #2B86F6;
            color: #fff;
          }
        }
      }
      .search{
        .add{
          position: relative;
          .upload{
            position: absolute;
            width: 100%;
            height: 100%;
            background: transparent;
            left: 0;
            top: 0;
            opacity: 0;
            cursor: pointer;
          }
        }
      }
    }
    .el-pagination{
      margin: 10px 0;
    }
    .uploadBox{
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background: rgba(0,0,0,0.7);
      z-index: 1000;
      .centerBox{
        height: 30rem;
        .content{
          .inputItem{
            width: 100%;
            padding: 0 3rem;
            align-items: center;
            margin-bottom: 1.5rem;
            font-size: 0.8rem;
            span{
              width: 6rem;
            }
          }
        }
      }

    }
  }
</style>
