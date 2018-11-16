<template>
  <div class="coverBack varList">
    <div class="centerBox">
      <div class="boxHeader">
        <span>插入<span v-if="type==='local'">本场景</span><span v-if="type==='global'">全局</span><span v-if="type==='common'">通用</span>变量</span>
        <i class="iconfont icon-guanbi" @click="close()"></i>
      </div>
      <div class="boxContent">
        <div class="tableBox">
          <table class="gtable tableNormal">
            <tr class="gheader">
              <th>序号</th>
              <th>变量名</th>
              <th>备注</th>
              <th>操作</th>
            </tr>
            <tr v-for="(data,index) in listData" @click="setListData(data)" :class="{'active': checkListData(data).result,'disable':checkSelected(data) }">
              <td width="150">
                <i class="fa icons_not_chose" style="margin-right: 5px"></i>
                <i class="fa icons_chose" style="margin-right: 5px"></i>
                {{index+1}}
              </td>
              <td width="200">{{data.variableName}}</td>
              <td width="300"><p class="flex" v-html="data.note"></p></td>
              <td width="200" class="ctrl" ><span class="del" @click.stop="deleteVar(data,index)" style="margin: 0">删除</span></td>
            </tr>
          </table>
        </div>
      </div>
      <div class="choseBox">
        <span @click="selectAll()">全选</span>
        <span @click="unSelectAll()">取消选中</span>
      </div>
      <div class="boxSetting">
        <span class="cancel" @click="close()">取消</span>
        <span class="submit" @click="submit()">添加</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'varList',
    props:['listData','type','scenesId','allList'],
    data(){
      return {
        choseList:[]
      }
    },
    methods:{
      async submit(){
        let arrString = []
        this.choseList.forEach((e,index)=>{
          arrString.push(e.variableId)
        })
        if(arrString.length === 0){
          this.$emit('close')
        }else{
          let res = await this.$api.scene.variable.setVariable({
            sceneId: this.scenesId,
            variableIdList: JSON.stringify(arrString)
          },'pushManage')
          if(res.code === 'ok'){
            this.$message({
              message: '新增成功',
              type: 'success',
              duration: 1000
            });
            this.$emit('submit')
            this.$emit('close')
          }else{
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1000
            });
          }
        }
      },
      close: function () {
        this.$emit('close')
      },
      setListData: function (data) {
        if(!this.checkSelected(data)){
          let res = this.checkListData(data)
          if(res.result){
            this.choseList.splice(res.index,1)
          }else{
            this.choseList.push(data)
          }
        }
      },
      checkListData: function (data) {
        let result = false
        let indexNum = -1
        this.choseList.forEach((e,index)=>{
          if(e.variableId === data.variableId){
            result = true
            indexNum = index
          }
        })
        return {
          result: result,
          index: indexNum
        }
      },
      checkSelected: function (data) {
        let result = false
        this.allList.forEach((e)=>{
          if(e.variableId === data.variableId){
            result = true
          }
        })
        return result
      },
      selectAll: function () {
        this.choseList = []
        this.listData.forEach((e)=>{
          if(!this.checkSelected(e)){
            this.choseList.push(e)
          }
        })
      },
      unSelectAll: function () {
        this.choseList = []
      },
      deleteVar: function (data,index) {
        this.$confirm('此操作将永久删除该变量, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.setVariable({
            variableId: data.variableId
          },'delete').then((res)=>{
            if(res.code === 'ok'){
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 1000
              });
              this.$emit('submit')
              this.listData.splice(index,1)
            }else{
              this.$message({
                type: 'error',
                message: '删除失败!',
                duration: 1000
              });
            }
          })
        })
      }
    },
    mounted(){
      this.choseList = []
    }
  }
</script>

<style lang="less">
  .varList{
    .centerBox{
      .boxSetting{
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      .choseBox{
        height: 2rem;
        min-height: 2rem;
        width: 100%;
        padding: 0 1rem;
        text-align: left;
        span{
          display: inline-block;
          height: 1.5rem;
          line-height: 1.5rem;
          border: solid 1px #ddd;
          color: #999;
          font-size: 0.8rem;
          padding: 0 5px;
          cursor: pointer;
        }
      }
      .boxContent{
        .tableBox{
          table{
            tr{
              td{
                line-height: 1.5;
                .icons_chose{
                  display: none;
                }
                .icons_not_chose{
                  display: inline-block;
                }
              }
            }
            .active{
              background: #E7F1FA;
              td{
                word-break: break-all;
                .icons_chose{
                  display: inline-block;
                }
                .icons_not_chose{
                  display: none;
                }
              }
            }
            .disable{
              .icons_chose{
                display: inline-block;
                opacity: 0;
              }
              .icons_not_chose{
                display: none;
              }
              /*background: #999;*/
            }
          }
        }
      }
    }
  }
</style>
