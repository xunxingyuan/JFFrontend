<template>
  <div class="coverBack variableBox">
    <div class="centerBox animated fadeInRight">
      <div class="boxHeader">
        <span>管理变量</span>
        <i class="iconfont icon-guanbi" @click="close()"></i>
      </div>
      <div class="boxContent scrollbar">
        <div class="varList">
          <div class="flex">
            <p>可选变量列表</p>
            <div class="varCtrl">
              <span class="insert">
                插入变量
                <div class="addType">
                  <p @click="addVar('local')">本场景变量</p>
                  <p @click="addVar('global')">全局变量</p>
                  <p @click="addVar('common')">通用变量</p>
                </div>
              </span>
              <span class="mid">|</span>
              <span @click="createVar('create')">创建变量</span>
            </div>
          </div>
        </div>
        <div class="tableBox">
          <table class="gtable tableNormal">
            <tr class="gheader">
              <th>变量名</th>
              <th>适用范围</th>
              <th>变量说明</th>
              <th>操作</th>
            </tr>
            <tr v-for="data in varLists" :class="{'active': data.variableName===choseVar.variableName}">
              <td width="200" style="color: #2B86F6">{{data.variableName}}</td>
              <td width="200">
                <span v-if="data.variableType===0">全局有效</span>
                <span v-if="data.variableType===1">仅本场景（新建）</span>
                <span v-if="data.variableType===2">仅本场景（追问）</span>
                <span v-if="data.variableType===3">通用变量</span>
              </td>
              <td width="200" ><p v-html="data.note" class="flex"></p></td>
              <td width="250" class="ctrl">
                <span class="copy variable" @click="copy()" :data-clipboard-text="'${'+ data.variableName + '}'">复制</span>
                <span class="del" @click.stop="deleteVar(data)">删除</span>
                <span class="edit" @click.stop="createVar('edit',data)" style="color: #666">编辑</span>
                <span class="del" @click.stop="editVar(data)">表达式</span>
              </td>

            </tr>
          </table>

        </div>
      </div>
      <!--<div class="boxSetting">-->
        <!--<p>选中变量的表达式为：</p>-->
        <!--<div class="valueBox">-->
          <!--<p class="choseData" v-html="editExpression"></p>-->
          <!--&lt;!&ndash;<span @click="editVar()" :class="{'active': choseVar!==''}">编辑表达式</span>&ndash;&gt;-->
        <!--</div>-->
      <!--</div>-->
    </div>

    <var-list v-if="showList" @close="closeList()" @submit="getVarList()" :allList="varLists" :type="addType" :scenesId="selectSceneId" :listData="lists"></var-list>
    <add-var v-if="showAdd" @close="closeAdd()" @changed="updateName" @submit="getVarList()" :type="addOrEdit" :scenesId="selectSceneId" :varData="editVarData"></add-var>
    <edit-var v-if="showEdit" @close="closeEdit()" @submit="updateExpression" :scenesId="selectSceneId"  :expression="editExpression" :varData="choseVar" :varList="varLists"></edit-var>
  </div>
</template>

<script>
  import VarList from "./varList.vue";
  import AddVar from "./addVar.vue";
  import EditVar from "./editVar.vue";
  import { mapGetters } from 'vuex'
  import Clipboard from 'clipboard';

  export default {
    components: {
      EditVar,
      AddVar,
      VarList},
    name: 'variable',
    computed:{
      ...mapGetters({
        selectSceneId: 'getScenesId',
      })
    },
    data(){
      return {
        showList: false,
        showAdd: false,
        showEdit: false,
        choseVar:'',
        editVarData: '',
        lists:[],
        varLists:[],
        addOrEdit: '',
        editExpression: '',
        addType: ''
      }
    },
    methods:{
      //变量名更新
      updateName: function (val) {
        this.$emit('changed',val)
      },
      //获取变量列表
      getVarListData: function (type) {
        if(this.selectSceneId){
          return this.$api.getVariable({
            scenesId: this.selectSceneId,
            source: type
          })
        }
      },
      //关闭管理变量
      close: function () {
        this.$emit('close')
        this.$store.dispatch('getGlobalVarList')
      },
      //关闭插入列表
      closeList: function () {
        this.showList = false
      },
      //打开插入列表
      async addVar(type) {
        let res
        this.addType = type
        if(type==='local'){
          res = await this.getVarListData('2')
        }else if(type=== 'global'){
          res = await this.getVarListData('0')
        }else if(type==='common'){
          res = await this.getVarListData('3')
        }
        console.log(res)
        if(res.code === 'ok'){
          if(res.variableList){
            this.lists = res.variableList
          }else{
            this.lists = []
          }
        }else{
          this.lists = []
        }
        this.showList = true
      },
      //关闭创建/修改变量
      closeAdd: function () {
        this.showAdd = false
      },
      //创建/修改变量
      createVar: function (type,data) {
        this.addOrEdit = type
        this.showAdd = true
        this.editVarData = data
      },
      //关闭编辑框
      closeEdit: function () {
        this.showEdit = false
      },
      //编辑表达式
      editVar: function (data) {
        this.choseVariable(data)
        if(this.choseVar){
          this.showEdit = true
        }
      },
      //删除变量
      deleteVar: function (data) {
        let varlist = []
        varlist.push(data.variableId)
        this.$confirm('此操作将从列表中删除该变量, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.scene.variable.setVariable({
            sceneId: this.selectSceneId,
            variableIdList: JSON.stringify(varlist)
          },'deleteManage').then((res)=>{
            if(res.code === 'ok'){
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 1000
              });
              this.getVarList()
            }else{
              this.$message({
                type: 'error',
                message: '删除失败!',
                duration: 1000
              });
            }
          })
        })
      },
      getVarList: function () {
        this.varLists = []
        this.$api.scene.variable.setVariable({
          sceneId: this.selectSceneId
        },'getManage').then((res)=>{
          if(res.code === 'ok'){
            if(res.result){
              this.varLists = res.result
            }else{
              this.varLists = []
            }
          }else{
            this.varLists = []
          }
          this.$emit('varListChange',this.varLists)
        })

//        this.getVarListData('1')
      },
      copy: function () {
        let clipboard = new Clipboard('.variable')
        clipboard.on('success', e => {
          clipboard.destroy()
        })
      },
      choseVariable: function (data) {
        this.choseVar = data
        this.$api.scene.variable.ctrlExpression({
          variableId: data.variableId
        },'get').then((res)=>{
          if(res.code === 'ok'){
            if(res.expression){
              this.editExpression = res.expression
            }else{
              this.editExpression = ''
            }
          }else{
            this.editExpression = ''
          }
        })
      },
      updateExpression: function (val) {
        this.editExpression = val
      }
    },
    mounted(){
      this.getVarList()
    }
  }
</script>

<style lang="less">
  .variableBox{
    z-index: 10003;
    .centerBox{
      width: 45rem;
      .boxContent{
        display: flex;
        flex-flow: column;
        .varList{
          font-size: 0.9rem;
          height: 2rem;
          min-height: 2rem;
          .flex{
            justify-content: space-between;
            align-items: center;
            height: 2rem;
            p{
              height: 100%;
            }
            .varCtrl{
              height: 100%;
              .mid{
                margin: 0 0.5rem;
                cursor: default;
              }
              span{
                color: #2B86F6;
                cursor: pointer;
              }
              .insert{
                position: relative;
                .addType{
                  display: none;
                  position: absolute;
                  top: 1.2rem;
                  left: 0;
                  width: 120px;
                  height: 7rem;
                  padding: 0.5rem 0;
                  border-radius: 2px;
                  box-shadow: 1px 0 4px #BFBFBF;
                  background: #fff;
                  p{
                    width: 100%;
                    padding: 0 1rem;
                    text-align: left;
                    color: #333;
                    font-size: 0.9rem;
                    height: 2rem;
                    line-height: 2rem;
                  }
                  p:hover{
                    background: #eeeeee;
                    color: #2B86F6;
                  }
                }
              }
              .insert:hover{
                .addType{
                  display: block;
                }
              }
            }
          }
        }
        .tableBox{
          flex: 1;
          border: solid 1px #DDDDDD;
          table{
            tr{
              td{
                word-break: break-all;
                line-height: 1.5;
              }
            }
            .active{
              background: #E7F1FA;
            }
            .edit:hover{
              color: #2B86F6;
            }
          }
        }
      }
      .boxSetting{
        p{
          font-size: 0.8rem;
          margin-bottom: 5px;
        }
        .valueBox{
          display: flex;
          align-items: center;
          justify-content: space-between;
          .choseData{
            margin-bottom: 0;
            overflow: hidden;
            height: 2rem;
            line-height: 2rem;
            flex: 1;
            background: #ECECEC;
            margin-right: 1rem;
            padding: 0 1rem;
            /*color: #00ff00;*/
          }
          span{
            color: #666;
          }
          .active{
            color: #2B86F6;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
