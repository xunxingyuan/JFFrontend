<template>
  <div class="robotService container">
    <div class="top">
      <p class="title">服务管理</p>
    </div>
    <div class="bottom">
      <div class="content">
        <service></service>
      </div>
    </div>
  </div>
</template>

<script>
  import service from "./robotServicce/robotService.vue";

  export default {
    name: 'robotService',
    components:{
      service
    }
  }
</script>

<style lang="less">
  .robotService{
    .bottom{
      .content{
        padding: 1rem;
        background: #fff;
      }
    }
  }
</style>
