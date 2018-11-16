<template>
  <div class="coverBack addVar">
    <div class="centerBox animated fadeInRight">
      <div class="boxHeader">
        <span v-if="type==='create'">创建变量</span>
        <span v-if="type==='edit'">修改变量</span>
        <i class="iconfont icon-guanbi" @click="close()"></i>
      </div>
      <div class="boxContent">
        <div class="addItem">
          <p>变量名</p>
          <div class="itemContent">
            <el-input v-model="name"></el-input>
          </div>
        </div>
        <div class="addItem">
          <p>作用范围</p>
          <div class="itemContent">
            <el-select v-model="typeValue" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="addItem">
          <p>备注</p>
          <div class="itemContent">
            <el-input v-model="note"></el-input>
          </div>
        </div>
      </div>
      <div class="boxSetting">
        <span class="cancel" @click="close()">取消</span>
        <span class="submit" @click="save()">提交</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'addVar',
    props:['scenesId','type','varData'],
    data(){
      return {
        choseList:[],
        options: [{
          value: 0,
          label: '全局'
        }, {
          value: 1,
          label: '仅本场景'
        }],
        typeValue: 1,
        name: '',
        note: '',
        oldName: ''
      }
    },
    methods:{
      close: function () {
        this.$emit('close')
      },
      save: function () {
        if(this.type === 'create'){
          this.create()
        }else if(this.type === 'edit'){
          this.edit()
        }
      },
      async create() {
        if(this.name.trim()!==''){
          let res = await this.$api.scene.variable.setVariable({
            sceneId: this.scenesId,
            variableName: this.name.trim(),
            variableType: this.typeValue,
            note: this.note
          },'create')
          if(res.code === 'ok'){
            this.$message({
              message: '新增成功',
              type: 'success',
              duration: 1000
            });
            this.$emit('close')
            this.$emit('submit')
          }else{
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1000
            });
          }
        }else{
          this.$message({
            message: '变量名不能为空',
            type: 'info',
            duration: 1000
          });
        }
      },
      async edit(){
        if(this.name.trim()!==''){
          let res = await this.$api.scene.variable.setVariable({
            variableId: this.varData.variableId,
            sceneId: this.scenesId,
            variableName: this.name.trim(),
            variableType: this.typeValue,
            note: this.note
          },'update')
          if(res.code === 'ok'){
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            this.$emit('close')
            this.$emit('submit')
            if(this.oldName !== this.name){
              this.$emit('changed',{
                'old': this.oldName,
                'new': this.name
              })
            }
          }else{
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1000
            });
          }
        }else{
          this.$message({
            message: '变量名不能为空',
            type: 'info',
            duration: 1000
          });
        }
      },
      _initData: function () {
        //初始化类型，全局不能转本场景
        if(this.varData!==undefined){
          if((this.varData.variableType === 0)){
            this.options = [{
              value: 0,
              label: '全局'
            }]
          }else if(this.varData.variableType === 1){
            this.options = [{
              value: 0,
              label: '全局'
            }, {
              value: 1,
              label: '仅本场景（新建）'
            }]
          }else if(this.varData.variableType === 2){
            this.options = [{
              value: 0,
              label: '全局'
            }, {
              value: 2,
              label: '仅本场景（追问）'
            }]
          }
          if(this.varData){
            this.oldName = this.varData.variableName
            this.name = this.varData.variableName
            this.typeValue = this.varData.variableType
            this.note = this.varData.note
          }
        }
      }
    },
    mounted(){
      this._initData()
    },
    watch:{
      varData: function () {
        this._initData()
      }
    }
  }
</script>

<style lang="less">
  .addVar{
    .centerBox{
      width: 25rem;
      height: 25rem;
      .boxSetting{
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      .boxContent{
        width: 100%;
        padding: 0 3rem 0 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        .addItem{
          width: 100%;
          display: flex;
          margin-bottom: 1rem;
          justify-content: center;
          p{
            width: 80px;
            text-align: right;
            padding-right: 1rem;
            height: 40px;
            line-height: 40px;
          }
          .itemContent{
            flex: 1;
            .el-select{
              width: 100%;
            }
          }
        }
      }
    }
  }
</style>
