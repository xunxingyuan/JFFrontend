<template>
  <div class="sameView animated fadeInRight">
    <div class="title">
      <p>管理相似问题</p>
      <i @click="close()" aria-hidden="true" class="iconfont icon-guanbi"></i>
    </div>
    <div class="content">
      <div class="topContent flex">
        <p>全部(<span>{{same.length}}个</span>)</p>
        <el-input v-model="searchKey">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="midContent scrollbar">
        <div class="sameItem flex" v-for="(item,index) in same" v-if="searchKey === ''||item.value.indexOf(searchKey)>-1">
          <div class="text">
            <p v-if="!item.edit">{{item.value}}</p>
            <el-input v-model="changeSameItem" v-else></el-input>
          </div>
          <div class="ctrl">
            <i class="fa icons_edit_small" v-if="!item.edit" @click="editSameItem(item,index)"></i>
            <i class="fa icons_del_small" v-if="!item.edit" @click="deleteSame(index)"></i>
            <i class="fa icons_save" v-if="item.edit" @click="saveSameItem(item,index)"></i>
            <i class="fa icons_cancel_save" v-if="item.edit" @click="cancelSaveItem(index)"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'same',
    props:['same'],
    data(){
      return {
        addSameData: '',
        searchKey: ''
      }
    },
    methods:{
      close: function () {
        this.$emit('close')
      },
      //删除相似问
      deleteSame: function (index) {
        this.$emit('deleteSame',index)
//        this.same.splice(index,1)
      },
      //编辑相似问题
      editSameItem: function (item,index) {
        this.$emit('editSameItem',index)
        this.changeSameItem  = item.value
      },
      //保存编辑
      saveSameItem: function (item,index) {
        this.$emit('saveSameItem',{
          index: index,
          value: this.changeSameItem
        })
      },
      //取消保存
      cancelSaveItem: function (index) {
        this.$emit('cancelSaveItem',index)
      }
    }
  }
</script>

<style lang="less">
  .contain .botPart .rightPart .sameView .content{
    position: static;
    padding: 1rem 2rem;
  }
</style>
