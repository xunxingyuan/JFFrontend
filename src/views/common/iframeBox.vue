<template>
  <div class="iframe container">
    <iframe class="frameBox" :src="srcUrl"></iframe>
  </div>
</template>

<script>
  export default {
    name: 'iframeBox',
    data(){
      return {
        srcUrl: ''
      }
    },
    mounted(){
      this.srcUrl =  this.$route.params.url
    },
    watch: {
      '$route' (to, from) {
        // 对路由变化作出响应...
        this.srcUrl =  this.$route.params.url
      }
    }
  }
</script>

<style lang="less">
.iframe{
  .frameBox{
    width: 100%;
    height: 100%;
    border: none;
  }
}
</style>
