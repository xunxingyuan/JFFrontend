<template>
  <div class="innerScene" v-if="show">
    <div class="scenesChose scrollbar">
      <div class="topPart">
        <!--<p>选择一个追问进行跳转</p>-->
        <button @click="close()">返回</button>
        <!--<span @click="showScenes = false">取消</span>-->
      </div>
      <div class="first flexCenter">
        {{scenesDataTree.question}}
      </div>
      <div class="line flexCenter">
        <span></span>
        <span class="coverRight"></span>
      </div>
      <div v-if="scenesDataTree!==null&&scenesDataTree.nodes!==null&&scenesDataTree.nodes.length !== 0">
        <node-box :nodeData="scenesDataTree.nodes"></node-box>
      </div>
    </div>
  </div>

</template>

<script>
  import nodeBox from './nodeBox.vue'

  export default {
    name: 'innerScene',
    props:['scenesDataTree','show'],
    components:{
      nodeBox
    },
    methods:{
      close: function () {
        this.$emit('closeScenes')
        this.$store.dispatch('setJumpScenes','')
      }
    }
  }
</script>

<style lang="less">
  .innerScene{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    .scenesChose{
      .topPart{
        justify-content: flex-start;
        background: transparent;
      }
    }
  }

</style>
