<template>
  <div class="filter">
    <i class="iconfont icon-shaixuan"></i>
    <div class="filterOptionBox" v-if="options">
      <div class="filterItem" v-for="item in options" @click="choseFilter(item)" :class="{'active': choseItem.name == item.name }">{{item.name}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'tableFilter',
    props:['options'],
    data(){
      return {
        choseItem: ''
      }
    },
    methods:{
      choseFilter: function (item) {
        this.choseItem = item
        this.$emit('selectFilter',item)
      }
    }
  }
</script>

<style lang="less">
  .filter{
    width: 1rem;
    height: 1rem;
    margin-left: 10px;
    position: relative;
    .filterOptionBox{
      display: none;
      position: absolute;
      right: 0;
      top: 1rem;
      border: solid 1px #ddd;
      box-shadow: 0 0 3px #ddd;
      min-width: 8rem;
      background: #fff;
      .filterItem{
        height: 2rem;
        line-height: 2rem;
        padding: 0 10px;
        cursor: pointer;
      }
      .active,.filterItem:hover{
        background: #2B86F6;
        color: #fff;
      }
    }
  }
  .filter:hover{
    .filterOptionBox{
      display: block;
    }
  }

</style>
