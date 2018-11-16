<template>
  <div>
    <VueUEditor @ready="editorReady" ueditorPath="/ueditor1.4.3.3/"></VueUEditor>
  </div>
</template>

<script>
  import VueUEditor from 'vue-ueditor'
  export default {
    name: 'editor',
    components:{
      VueUEditor
    },
    props:['content'],
    data(){
      return{
        editData: ''
      }
    },
    methods:{
      editorReady: function (editorInstance) {
        editorInstance.setContent(this.content)
        editorInstance.addListener('contentChange',()=>{
//          console.log('changed',editorInstance.getContent())
          this.$emit('changed',editorInstance.getContent())
        })
      }
    },
    mounted(){

    }
  }
</script>

<style lang="less">

</style>
