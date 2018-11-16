<template>
  <div class="commonTree">
    <div v-for="(item,index) in treeData" class="commonTreeItem" :class="{'midBlock': index!== treeData.length-1}">
      <div class="showCtrl flexCenter" v-if="item[config.child].length>0" @click.stop="showHide(index)" :class="{'activeItem': selectedItem[config.id]=== item[config.id]}">
        <div class="ctrlInner flexCenter">
          <!--<i class="fas fa-plus fa-1x" v-show="!checkShow(index)"></i>-->
          <!--<i class="fas fa-minus fa-1x" v-show="checkShow(index)"></i>-->
          <span v-show="!checkShow(index)">+</span>
          <span v-show="checkShow(index)">-</span>
        </div>
      </div>
      <div @click="showChildCtrl(item,index)"  class="commonTreeNode" :class="{'lastOne': index=== treeData.length-1,'activeItem': selectedItem[config.id]=== item[config.id]}">{{item[config.name]}}</div>
      <div class="childBox" v-if="checkShow(index)">
        <tree-box :treeData.sync="item[config.child]" :config="config" @select="selectItem" :selectedItem="selectedItem"></tree-box>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props:['treeData','config','selectedItem'],
    name: 'treeBox',
    data(){
      return{
        showList:[],
      }
    },
    methods:{
      showHide: function (index) {
        let num = this.showList.indexOf(index)
        if(num ===-1){
          this.showList.push(index)
        }else{
          this.showList.splice(num,1)
        }
      },
      showChildCtrl: function (item,index) {
        this.selectItem(item)
        this.showHide(index)
      },
      checkShow: function (index) {
        let num = this.showList.indexOf(index)
        if(num ===-1){
          return false
        }else{
          return true
        }
      },
      //传递选择
      selectItem: function (item) {
        this.$emit('select',item)
      }
    }
  }
</script>

<style lang="less" scoped>
  .commonTree{
    .commonTreeItem{
      position: relative;
      .showCtrl{
        position: absolute;
        left: -1rem;
        z-index: 10;
        top: 0;
        height: 2rem;
        width: 2rem;
        background: transparent;
        cursor: pointer;
        .ctrlInner{
          height: 1rem;
          width: 1rem;
          background: #fff;
          border: solid 1px #ddd;
          border-radius: 2px;
          color: #666;
          .fas{
            font-size: 8px;
            color: #999;
          }
          span{
            line-height: 1rem;
          }
        }
      }
      .commonTreeNode{
        height: 2rem;
        line-height: 2rem;
        width: 100%;
        text-align: left;
        padding-left: 1rem;
        border-left: dashed 1px #ddd;
        margin-left: -1px;
        position: relative;
        cursor: pointer;
        background: #fff;
        font-size: 14px;
      }
      .commonTreeNode:hover{
        background: #E4F0FF;
      }
      .commonTreeNode:before{
        content: '';
        width: 1rem;
        height: 1px;
        border-top: dashed 1px #ddd;
        /*background: #ddd;*/
        position: absolute;
        bottom: 1rem;
        left: 0;
      }
      .childBox{
        margin-left: 1.5rem;
        /*border-left: dashed 1px #ddd;*/
      }
      .activeItem{
        background: #E4F0FF;
      }
    }
    .midBlock{
      border-left: dashed 1px #ddd;
      margin-left: -1px;
    }

    .lastOne:after{
      content: '';
      width: 1px;
      height: 1rem;
      position: absolute;
      left: -1px;
      bottom: 0;
      background: #fff;
    }
  }
</style>
