<template>
  <div class="console">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'console',
    methods: {
      _initData: function () {
        this.$api.robot.getList().then((res)=>{
          if(res.status === 200){
            this.$store.dispatch('setRobotList',res.data)
          }
        })
        this.$api.ontology.setSemanticTree('','get').then((res)=>{
          if(res.code === 'ok'){
            this.$store.dispatch('setOntologyList',res.projects)
          }
        })
      }
    },
    mounted(){
      this._initData()
    }
  }
</script>

<style lang="less">
.console{
  height: 100%;
}
</style>
