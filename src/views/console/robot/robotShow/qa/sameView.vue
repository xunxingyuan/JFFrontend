<template>
  <div class="sameView animated fadeInRight" @click.stop="''">
    <div class="title">
      <p>管理</p>
      <i @click="closeBox()" aria-hidden="true" class="iconfont icon-guanbi"></i>
    </div>
    <div class="content">
      <div class="topContent flex">
        <p>全部(<span>{{sameList.length}}个</span>)</p>
        <el-input>
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="midContent scrollbar">
        <div class="sameItem flex" v-for="(item,index) in sameList">
          <div class="text">
            <p v-if="!item.showInput">{{item.question}}</p>
            <el-input v-model="changeSameItem" v-else></el-input>
          </div>
          <div class="ctrl">
            <i class="fa icons_edit_small" v-if="!item.showInput" @click="editSameItem(item)"></i>
            <i class="fa icons_del_small" v-if="!item.showInput" @click="deleteSame(index)"></i>
            <i class="fa icons_save" v-if="item.showInput" @click="saveSameItem(item)"></i>
            <i class="fa icons_cancel_save" v-if="item.showInput" @click="item.showInput = false"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sameView',
    props: ['sameData'],
    data(){
      return {
//        sameOpen: true
        sameList:[],
        changeSameItem: ''
      }
    },
    methods:{
      closeBox: function () {
        this.$emit('close')
      },
      editSameItem: function (item) {
        item.showInput = true
        this.changeSameItem = item.question
      },
      saveSameItem: function (item) {
        item.question = this.changeSameItem
        item.showInput = false
        let arr = []
        this.sameList.forEach(e=>{
          arr.push(e.question)
        })
        this.$emit('changed',arr)
      },
      deleteSame: function(index){
        this.sameData.splice(index,1)
      },
      checkType: function () {
        this.sameList = []
        this.sameData.forEach((e)=>{
          this.sameList.push({
            question: e,
            showInput: false
          })
        })
      }
    },
    mounted(){
      this.checkType()
    },
    watch:{
      sameData: function () {
        this.checkType()
      }
    }
  }
</script>

<style lang="less">
  //相似问题编辑框
  .sameView{
    width: 40rem;
    background: #fff;
    height: 30rem;
    z-index: 10;
    margin-right: 10px;
    align-self: center;
    border-radius: 2px;
    overflow: hidden;
    .title{
      height: 3rem;
      min-height: 3rem;
      background: #f3f3f3;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
    }
    .content{
      height: 27rem;
      flex: 1;
      padding: 1rem 2rem;
      display: flex;
      flex-flow: column;
      font-size: 0.9rem;
      .topContent{
        height: 3rem;
        min-height: 3rem;
        align-items: center;
        justify-content: space-between;
        border-bottom: solid 1px #ddd;
        p{
          width: 50%;
          min-width: 50%;
          text-align: left;
          padding-left: 1rem;
          color: #000;
          font-weight: 600;
          span{
            color: #666;
            font-weight: 500;
          }
        }
      }
      .midContent{
        flex: 1;
        overflow: auto;
        .sameItem{
          font-size: 12px;
          height: 3rem;
          border-bottom: solid 1px #ddd;
          align-items: center;
          width: 100%;
          justify-content: space-between;
          p{
            height: 1.5rem;
            line-height: 1.5rem;
            overflow: hidden;
            text-align: left;
            padding-left: 1rem;
          }
          .ctrl{
            width: 6rem;
            min-width: 6rem;
          }
          .text{
            flex: 1;
          }
        }
        .sameItem:hover{
          background: #F2F6FA;
        }
      }
    }
  }
</style>
