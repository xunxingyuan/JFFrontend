<template>
  <div class="coverContain" v-if="node.selectState === 'jump'||node.selectState === 'condition'||node.moveSelect === 'cover'||node.selectState === 'jumpChose'||node.selectState === 'conditionChose'||node.moveSelect === 'show'||node.selectState==='jumpNodeCover'||node.selectState==='jumpNode'">
    <div class="nodeCover" @click.stop="" v-if="node.selectState === 'jump'||node.selectState === 'condition'||node.moveSelect === 'cover'||node.selectState==='jumpNodeCover'">

    </div>
    <div class="jumpChoseBox" v-if="node.selectState === 'jumpChose' " @click.stop="choseItemRelation(node)" >
      <span v-if="(node.nodeId === jumpData.to)||node.answerId === jumpData.to" class="icons_chose_circle fa"></span>
      <span class="icons_chose_not_circle fa" v-else></span>
    </div>
    <div class="jumpChoseBox" v-if="node.selectState === 'conditionChose'" @click.stop="selectConditionData(node)">
      <span v-if="checkCondition(node.nodeId)" class="icons_chose fa"></span>
      <span class="icons_not_chose fa" v-else></span>
    </div>
    <div class="jumpChoseBox" v-if="node.moveSelect === 'show'" @click.stop="choseMove(node)">
      <span v-if="moveResult.hasOwnProperty('nodeId')&&(moveResult.nodeId === node.nodeId)" class="icons_chose fa"></span>
      <span class="icons_not_chose fa" v-else></span>
    </div>
    <div class="jumpChoseBox jump" v-if="node.selectState === 'jumpNode'" @click.stop="">

    </div>
  </div>

</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'nodeCover',
    props:['node'],
    methods:{
      //关联问题
      choseItemRelation: function (item) {
        console.log(item)
        if(item.answerId){
          this.$store.dispatch('setJumpData',{
            type: 'to',
            value: item.answerId,
            answer: true
          })
        }else{
          this.$store.dispatch('setJumpData',{
            type: 'to',
            value: item.nodeId,
            answer: false
          })
        }

      },
      //选择条件
      selectConditionData: function (item) {
        let conditionData = this.selectCondition
        if(this.selectCondition.indexOf(item.nodeId) === -1){
          conditionData.push(item.nodeId)
        }else{
          conditionData.splice(this.selectCondition.indexOf(item.nodeId),1)
        }
        this.$store.dispatch('setSelectConditions',conditionData)
      },
      //选择移动节点
      choseMove: function (item) {
        this.$store.dispatch('setMoveResultNode',item)
      },
      checkCondition: function (id) {
        return this.selectCondition.indexOf(id)!==-1
      }
    },
    computed:{
      ...mapGetters({
        jumpData: 'getJumpData',
        selectCondition: 'getSelectConditions',
        moveResult: 'getMoveResultNode'
      })
    },
  }
</script>

<style lang="less">
  .coverContain{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .nodeCover{
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(255,255,255,0.5);
      z-index: 1000;
    }
    .jumpChoseBox{
      position: absolute;
      width: 100%;
      height: 100%;
      background: transparent;
      z-index: 1000;
      .fa{
        position: absolute;
        right: -5px;
        top: -5px;
      }
    }
    .jump{
      box-shadow: 0 0 10px #2b86f6;
    }
  }
</style>
