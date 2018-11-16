<template>
  <div class="sameView animated fadeInRight">
    <div class="title">
      <p>管理槽点</p>
      <i @click="close()" aria-hidden="true" class="iconfont icon-guanbi"></i>
    </div>
    <div class="content">
      <div class="topContent flex">
        <p>全部(<span>{{slotData.length}}个</span>)</p>
        <el-input v-model="searchKey">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="addSlot topContent flex" v-if="editState">
        <p style="width: 20%;min-width: 20%;">槽点内容</p>
        <el-input placeholder="多同类槽点可用英文逗号隔开" v-model="slotAddValue" class="slotValue" style="width: 50%"></el-input>
        <el-select v-model="slotType" placeholder="请选择槽点类型" style="margin: 0 5px;">
          <el-option
            v-for="item in slotOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span class="btn blue"  @click="addSlotContent()">增加</span>
      </div>
      <div class="midContent scrollbar">
        <div class="sameItem flex" v-for="(item,index) in slotData" v-if="searchKey === ''||item.value.indexOf(searchKey)>-1">
          <div class="text">
            <p v-if="!item.edit">{{item.value}}</p>
            <el-input  v-model="changeSlotItem" v-else></el-input>
          </div>
          <div class="ctrl">
            <i class="fa icons_edit_small" v-if="!item.edit" @click="editSlotItem(item,index)"></i>
            <i class="fa icons_del_small" v-if="!item.edit" @click="deleteSlot(index)"></i>
            <i class="fa icons_save" v-if="item.edit" @click="saveSlotItem(item,index)"></i>
            <i class="fa icons_cancel_save" v-if="item.edit" @click="cancelSave(index)"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'questionSlot',
    props:['slotData'],
    data(){
      return {
        changeSlotItem: '',
        searchKey: '',
        slotAddValue: '',
        slotType: '',
        slotOptions:[{
          value: '1',
          label: '指定类'
        },{
          value: '2',
          label: '指定类所有子类'
        },{
          value: '3',
          label: '指定类及其所有子类'
        },{
          value: '4',
          label: '指定类直接父类'
        },{
          value: '5',
          label: '指定类所有祖先类'
        },{
          value: '6',
          label: '指定属性'
        },{
          value: '7',
          label: '指定属性值'
        },{
          value: '8',
          label: '指定概念'
        }],
        editState: false
      }
    },
    methods:{
      close: function () {
        this.$emit('close')
      },
      //删除相似问
      deleteSlot: function (index){
        this.$emit('deleteSlot',index)
//        this.slot.splice(index,1)
      },
      editSlotItem: function (item,index){
        this.$emit('editSlotItem',index)
        this.changeSlotItem  = item.value
        this.editState = true
      },
      saveSlotItem: function (item,index){
        this.$emit('saveSlotItem',{
          index: index,
          value: this.changeSlotItem
        })

//        item.value = this.changeSlotItem
//        item.edit = false
        this.editState = false

      },
      cancelSave: function (index) {
        this.$emit('cancelSave',index)
//        item.edit = false
        this.editState = false
      },
      //添加槽点
      addSlotContent: function () {
        this.slotAddValue = this.slotAddValue.trim()
        let arr = this.slotAddValue.split(',')
        switch (this.slotType){
          case '1':
            if(arr.length===1){
              this.changeSlotItem += ',' + '[$C{' + this.slotAddValue + '}]'
            }else{
              arr.forEach((e)=>{
                this.changeSlotItem += ',' + '[$C{' + e + '}]'
              })
            }
            this.slotAddValue = ''
            break;
          case '2':
            if(arr.length===1){
              this.changeSlotItem += ',' + '[$C{' + this.slotAddValue + '/*}]'
            }else{
              arr.forEach((e)=>{
                this.changeSlotItem += ',' + '[$C{' + e + '/*}]'
              })
            }
            this.slotAddValue = ''
            break;
          case '3':
            if(arr.length===1){
              this.changeSlotItem += ',' + '[$C{//' + this.slotAddValue + '}]'
            }else{
              arr.forEach((e)=>{
                this.changeSlotItem += ',' + '[$C{//' + e + '}]'
              })
            }
            this.slotAddValue = ''
            break;
          case '4':
            if(arr.length===1){
              this.changeSlotItem += ',' + '[$C{../' + this.slotAddValue + '}]'
            }else{
              arr.forEach((e)=>{
                this.changeSlotItem += ',' + '[$C{../' + e + '}]'
              })
            }
            this.slotAddValue = ''
            break;
          case '5':
            if(arr.length===1){
              this.changeSlotItem += ',' + '[$C{..//' + this.slotAddValue + '}]'
            }else{
              arr.forEach((e)=>{
                this.changeSlotItem += ',' + '[$C{..//' + e + '}]'
              })
            }
            this.slotAddValue = ''
            break;
          case '6':
            if(arr.length===1){
              this.changeSlotItem += ',' + '[$P{' + this.slotAddValue + '}]'
            }else{
              arr.forEach((e)=>{
                this.changeSlotItem += ',' + '[$P{' + e + '}]'
              })
            }
            this.slotAddValue = ''
            break;
          case '7':
            if(arr.length===1){
              this.changeSlotItem += ',' + '[$V{' + this.slotAddValue + '}]'
            }else{
              arr.forEach((e)=>{
                this.changeSlotItem += ',' + '[$V{' + e + '}]'
              })
            }
            this.slotAddValue = ''
            break;
          case '8':
            if(arr.length===1){
              this.changeSlotItem += ',' + '[$T{' + this.slotAddValue + '}]'
            }else{
              arr.forEach((e)=>{
                this.changeSlotItem += ',' + '[$T{' + e + '}]'
              })
            }
            this.slotAddValue = ''
            break;
          default:
            break;
        }
      }

    }
  }
</script>

<style lang="less">

</style>
