<template>
  <div class="addSame">
    <div class="inputContent">
      <input type="text" v-model="sameWord"/>
      <div class="addBtn">
        <span class="basic" :class="{'active': sameChose === 'basic'}" @click="sameChose='basic'">基础词</span>
        <span class="word" :class="{'active': sameChose === 'word'}" @click="sameChose='word'">短语</span>
        <span class="add" @click="addSame()">增加</span>
      </div>
    </div>
    <div class="chose">
      <span v-for="(item,index) in sameList">{{item}} <i class="fa fa-times" @click="delSame(index)"></i></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'addSame',
    props:['sameList'],
    data(){
      return{
        sameWord: '',
        sameChose: 'basic'
      }
    },
    methods:{
      //添加同义词
      addSame: function () {
        let data
        if(this.sameWord){
          if(this.sameChose==='basic'){
            data = this.sameWord + '[1]'
          }else{
            data = this.sameWord + '[2]'
          }
          if(this.sameList.indexOf(data)===-1){
            this.sameList.push(data)
            this.$emit('changeList',this.sameList)
            this.sameWord = ''
          }
        }
      },
      //删除同义词
      delSame: function (index) {
        this.sameList.splice(index,1)
        this.$emit('changeList',this.sameList)
      },
    }
  }
</script>

<style lang="less">
  .addSame{
    .inputContent{
      display: flex;
      align-items: center;
      .addBtn{
        display: flex;
        align-items: center;
        margin-left: 5px;
        span{
          display: flex;
          justify-content: center;
          align-items: center;
          height: 2rem;
          width: 4rem;
          border: solid 1px #ddd;
          font-size: 0.8rem;
          border-radius: 2px;
          cursor: pointer;
        }
        span:last-child{
          margin-left: 1rem;
        }
        .active,span:active{
          border: solid 1px #2B86F6;
          color: #2B86F6;
        }
      }
    }
    .chose{
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      color: #666;
      span{
        padding: 0 5px;
        height: 1.5rem;
        line-height: 1.5rem;
        font-size: 10px;
        border-radius: 2px;
        border: solid 1px #ddd;
        margin-right: 5px;
      }
    }
    .chose:hover{
      color: #333;
    }
    input{
      outline: none;
      width: 50%;
      height: 2rem;
      border: solid 1px #ddd;
      background:rgba(250,250,250,1);
      border-radius: 2px;
      padding: 0 8px;
    }
    input:focus{
      border: solid 1px #2B86F6;
    }
  }
</style>
