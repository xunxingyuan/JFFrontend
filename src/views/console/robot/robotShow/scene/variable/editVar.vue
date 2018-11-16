<template>
  <div class="editVar animated fadeInRight">
    <textarea v-model="editData">

    </textarea>
    <p class="tips">示例：在上方编辑框输入文本，单个变量运算要写在${变量名}中。</p>
    <a class="tips" href="rulers.html" target="_blank" type="">表达式规则</a>
    <div class="btnGroup">
      <span class="auth" @click="auth()">验证表达式</span>
      <div>
        <span class="submit" @click="save()">保存</span>
        <span class="cancel" @click="close()">取消</span>
      </div>

    </div>
    <!--<div class="checkExpression">-->

    <!--</div>-->
  </div>
</template>

<script>
  export default {
    name: 'editVar',
    data(){
      return {
        editData: ''
      }
    },
    props:['expression','varData','scenesId','varList'],
    methods:{
      close: function () {
        this.$emit('close')
      },
      save: function () {
        this.$api.scene.variable.ctrlExpression({
          variableId: this.varData.variableId,
          content: this.editData
        },'update').then((res)=>{
          if(res.code === 'ok'){
            this.$message({
              message: '保存成功',
              type: 'success',
              duration: 1000
            });
            this.$emit('submit',this.editData)
            this.close()
          }
        })
      },
      //验证表达式
      auth: function () {
        let varData = ''
        this.varList.forEach((e,index)=>{
          if(index === 0){
            varData  = e.variableName
          }else{
            varData += ','+ e.variableName
          }
        })
        this.$api.scene.variable.checkRulers({
          expression: this.editData,
          params: varData
        }).then((res)=>{
          if(res.code === 200){
            this.$message({
              message: res.data,
              type: 'success',
              duration: 2000
            });
          }else{
            this.$message({
              message: res.data,
              type: 'info',
              duration: 2000
            });
          }
        })
      }
    },
    mounted(){
      if(this.expression){
        this.editData = this.expression.content
      }else{
        this.editData = ''
      }
    },
    watch:{
      expression: function () {
        if(this.expression){
          this.editData = this.expression.content
        }else{
          this.editData = ''
        }
      }
    }
  }
</script>

<style lang="less">
  .editVar{
    width: 30rem;
    padding: 1rem;
    height: 30rem;
    margin-left: 1rem;
    background: #fff;
    display: flex;
    flex-flow: column;
    .btnGroup{
      height: 3rem;
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      align-self: flex-end;
      .cancel,.submit,.auth{
        width: 100px;
        height: 32px;
        display: inline-block;
        line-height: 32px;
        border-radius: 3px;
        margin-left: 1rem;
        cursor: pointer;
        font-size: 0.9rem;
      }
      .auth{
        border: solid 1px #2B86F6;
        color: #2B86F6;
        margin: 0;
      }
      .cancel{
        border: solid 1px #ddd;
        color: #666;
        background: #f9f9f9;
      }
      .submit{
        background: #2B86F6;
        color: #fff;
      }
      .cancel:hover{
        color: #333;
        border: solid 1px #999;
      }
      .submit:hover{
        background: #00bfff;
      }
    }
    .tips{
      height: 2rem;
      display: flex;
      align-items: center;
      text-align: left;
      font-size: 0.8rem;
      color: #999;
      margin: 0;
    }
    textarea{
      flex: 1;
      padding: 10px;
      outline: none;
      resize: none;
    }
    .checkExpression{
      position: absolute;
      background: #fff;
      border: solid 1px #ddd;
      width: 29rem;
      height: 10rem;
      top: 16rem;
      left: 0.5rem;
    }
  }
</style>
