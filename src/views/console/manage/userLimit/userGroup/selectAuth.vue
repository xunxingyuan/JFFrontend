<template>
  <div class="selectAuth">
    <el-checkbox-group class="authType" v-model="checkTypeList" @change="pushUpdate">
      <div class="typeItemData" v-for="item in typeList" :class="{'active': selectType=== item.value}" @click="choseType(item)">
        <el-checkbox :label="item.name">{{item.name}}</el-checkbox>
      </div>
    </el-checkbox-group>
    <div class="treeBox">
      <div class="flex authDetail">
        <span style="margin-right: 1rem">内容权限</span>
        <el-checkbox-group v-model="checkAuthList" @change="changeAuth">
          <el-checkbox v-for="(item,index) in authData" :label="item.name" :key="index">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </div>

      <div v-for="item in typeList">
        <el-tree
                :key="item.value"
                :check-strictly="true"
                v-show="selectType=== item.value"
                :data="categoryData[item.value]"
                show-checkbox
                node-key="categoryId"
                @check-change="handleCheckChange"
                :default-checked-keys="checkData"
                :props="defaultProps">
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'selectAuth',
    props:['categoryData','auth'],
    data(){
      return {
        typeList:[{
          name: '多轮会话',
          value: 'scene',
          checkData:[],
          checkAuthList:[],
          id: ''
        },{
          name: '一问一答',
          value: 'qa',
          checkData:[],
          checkAuthList:[],
          id: ''
        },{
          name: '寒暄',
          value: 'greeting',
          checkData:[],
          checkAuthList:[],
          id: ''
        }],
        authData:[{
          name: '审核'
        },{
          name: '新建'
        },{
          name: '编辑'
        },{
          name: '查看'
        },{
          name: '删除'
        }],
        checkData:[],
        checkAuthList:[],
        selectType: 'scene',
        checkTypeList:[],
        defaultProps:{
          children: 'children',
          label: 'categoryName'
        }
      }
    },
    methods:{
      //获取状态
      getUpdate: function (val,arr) {
        this.typeList.forEach((ele)=>{
          if(ele.value === val){
            let data ={
              'audit': 0,
              'categoryIds': ele.checkData,
              'conversationType': val,
              'create': 0,
              'delete': 0,
              'edit': 0,
              'view': 0
            }
            if(ele.id){
              data.conversationId = ele.id
            }
            ele.checkAuthList.forEach((ele1)=>{
              if(ele1 ==='审核'){
                data.audit = 1
              }else if(ele1 ==='新建'){
                data.create = 1
              }else if(ele1 ==='编辑'){
                data.edit = 1
              }else if(ele1 ==='查看'){
                data.view = 1
              }else if(ele1 ==='删除'){
                data.delete = 1
              }
            })
            arr.push(data)
          }
        })
      },
      pushUpdate: function () {
        let updateData = []
        this.checkTypeList.forEach(e=>{
          if(e === '多轮会话'){
            this.getUpdate('scene',updateData)
          }else if(e === '一问一答'){
            this.getUpdate('qa',updateData)
          }else if(e === '寒暄'){
            this.getUpdate('greeting',updateData)
          }
        })
        this.$emit('authChanged',updateData)
      },
      choseType: function (item) {
        this.selectType = item.value
        this.checkAuthList = item.checkAuthList
        this.checkData = item.checkData
      },
      changeAuth: function () {
        this.typeList.forEach((e)=>{
          if(e.value === this.selectType){
            e.checkAuthList = this.checkAuthList
          }
        })
        this.pushUpdate()
      },
      handleCheckChange: function (data, checked, indeterminate) {
        if(checked){
          this.checkData.push(data.categoryId)
        }else{
          let index = this.checkData.indexOf(data.categoryId)
          this.checkData.splice(index,1)
        }
//        console.log(this.checkData)
        this.typeList.forEach((e)=>{
          if(e.value === this.selectType){
            e.checkData = this.checkData
          }
        })
        this.pushUpdate()
      },
      getTreeData: function () {
        this.checkTypeList = []
        this.auth.categoryPermissions.forEach((e)=>{
          if(e.conversationType === 'qa'){
            this.checkTypeList.push('一问一答')
            this.addToAuth('qa',e)
          }else if(e.conversationType === 'greeting'){
            this.checkTypeList.push('寒暄')
            this.addToAuth('greeting',e)
          }else if(e.conversationType === 'scene'){
            this.addToAuth('scene',e)
            this.checkTypeList.push('多轮会话')
            this.choseType(this.typeList[0])
          }
        })
      },
      addToAuth: function (id,e) {
        this.typeList.forEach((ele)=>{
          if(ele.value === id){
            ele.checkData = e.categoryIds
            ele.checkAuthList = []
            ele.id = e.conversationId
            if(e.audit===1){
              ele.checkAuthList.push('审核')
            }
            if(e.create===1){
              ele.checkAuthList.push('新建')
            }
            if(e.edit===1){
              ele.checkAuthList.push('编辑')
            }
            if(e.delete===1){
              ele.checkAuthList.push('删除')
            }
            if(e.view===1){
              ele.checkAuthList.push('查看')
            }
          }
        })
      }
    },
    mounted(){
      this.getTreeData()
    },
    watch:{
      'auth': function () {
        console.log(this.auth)
        this.getTreeData()
      }
    }
  }
</script>

<style lang="less">
  .selectAuth{
    width: 100%;
    height: 100%;
    border: solid 1px #ddd;
    display: flex;
    flex-flow: column;
    .authType{
      min-height: 40px;
      height: 40px;
      background: #f4f4f4;
      width: 100%;
      display: flex;
      .typeItemData{
        text-align: center;
        height: 40px;
        width: 120px;
        line-height: 40px;
        cursor: pointer;
      }
      .active{
        background: #fff;
      }
    }
    .treeBox{
      flex: 1;
      overflow: auto;
      padding: 0 1rem;
      padding-bottom: 1rem;
      .authDetail{
        display: flex;
        height: 40px;
        width: 100%;
        border-bottom: solid 1px #ddd;
        line-height: 40px;
        font-size: 14px;
        color: #666;
      }
    }
  }
</style>
