<template>
  <div class="robotNav mini scrollbar" :class="theme">
    <div class="test flexCenter" v-if="testPart">
      <button @click="showTest = true" ><i class="iconfont icon-huihuaguanli1"></i><span class="text">测试对话</span></button>
    </div>
    <section class="navBox">
      <div class="nav" v-for="item in navList">
        <section class="navItem" @click.stop="activeNav(item)" :class="{'active':activeItem.name === item.name}">
          <div class="icon flexCenter">
            <i class="iconfont" :class="item.icon"></i>
          </div>
          <p class="navText">{{item.name}}</p>
          <div class="showlist" v-show="item.child.length>0">
            <i class="fas fa-angle-down" v-if="item.showChild"></i>
            <i class="fas fa-angle-up" v-else></i>
          </div>
        </section>
        <section class="navItem second" v-for="nav in item.child" v-show="item.showChild" @click="activeSecond(nav,item)" :class="{'activeSecond':activeSecondItem.name === nav.name}">
          <div class="icon flexCenter">
            <i class="iconfont"></i>
          </div>
          <p class="navText">{{nav.name}}</p>
          <div class="showlist"></div>
        </section>
      </div>
    </section>
    <test-part v-if="showTest" @close="showTest = false"></test-part>
  </div>
</template>

<script>
  import TestPart from "../console/robot/testPart.vue";

  export default {
    components: {TestPart},
    props:['navList','testPart','theme'],
    name: 'commonNav',
    data(){
      return {
        activeItem: '',
        showTest: false,
        activeSecondItem: ''
      }
    },
    methods:{
      activeNav: function (item) {
        this.activeItem = item
        item.showChild = !item.showChild
//        this.$emit('childChange',item)

        if(item.url){
          let route = {
            name: item.url
          }
          if(item.hasOwnProperty('path')&&item.path === 'robot'){
            route.params = {
              id: window.sessionStorage.getItem('robotId')
            }
          }
          this.$router.push(route)
          this.$emit('choseNav',route)
        }
      },
      activeSecond: function (item,father) {
        this.activeItem = father
        if(item.url){
          if(item.src){
            let url = {
              name: item.url,
              query:{
                robotId: window.sessionStorage.getItem('robotId')
              }
            }
            if(item.hasOwnProperty('path')&&item.path === 'robot'){
              url.params = {
                id: window.sessionStorage.getItem('robotId')
              }
            }
            this.$router.push(url)
            this.$emit('choseNav',url)
          }else{
            let route = {
              name: item.url
            }
            if(item.hasOwnProperty('path')&&item.path === 'robot'){
              route.params = {
                id: window.sessionStorage.getItem('robotId')
              }
            }
            this.$router.push(route)
            this.$emit('choseNav',route)
          }
        }
      }
    },
    mounted(){
      this.navList.forEach((e)=>{
        if(e.url === this.$route.name){
          this.activeItem = e
        }else if(e.child.length>0){
          e.child.forEach((ele)=>{
            if(ele.url === this.$route.name){
              this.activeItem = e
              this.activeSecondItem = ele
            }
          })
        }
      })
    },
    watch:{
      '$route': function () {
//        console.log(this.$route)
        this.navList.forEach((e)=>{
          if(e.url === this.$route.name){
            this.activeItem = e
          }else if(e.child.length>0){
            e.child.forEach((ele)=>{
              if(ele.url === this.$route.name){
                this.activeItem = e
                this.activeSecondItem = ele
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="less">
  @import "../../styles/common";

  .robotNav{
    background: @gray;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    padding-bottom: 3rem;
    border-right: solid 1px #ddd;
    width: 4rem;
    transition: ease-in 0.5s;
    .test{
      height: 4rem;
      button{
        background: #fff;
        color: @blue;
        outline: none;
        border: solid 1px @blue;
        width: 3rem;
        min-width: 3rem;
        height: 3rem;
        border-radius: 1.5rem;
        i{
          margin: 0;
        }
      }
      .text{
        display: none;
      }
    }
    .navBox{
      .nav{
        .navItem{
          /*padding: 0 1rem;*/
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 3rem;
          color: #333;
          cursor: pointer;
          .icon{
            width: 4rem;
            min-width: 4rem;
            height: 3rem;
          }
          .navText{
            display: none;
            width: 7rem;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            text-align: left;
            /*margin-right: 1rem;*/
            /*padding-left: 0.5rem;*/
          }
          .showlist{
            width: 1rem;
            display: none;
            i{
              font-size: 14px;
            }
          }
        }
        .navItem:hover{
          background: #e1e1e1;
        }
        .second{
          color: #666;
          display: none;
        }
        .active{
          background: @blue;
          color: #fff;
        }
        .active:hover{
          background: @blue;
          color: #fff;
        }
      }
    }
  }
  .robotNav:hover{

    width: 13rem;
    padding-bottom: 3rem;
    border-right: solid 1px #ddd;
    .test{
      button{
        height: 2rem;
        width: 7rem;
        min-width: 7rem;
        background: #fff;
        color: @blue;
        outline: none;
        border-radius: 2px;
        border: solid 1px @blue;
        i{
          margin-right: 8px;
        }
      }
      .text{
        display: inline-block;
      }

    }
    .navBox{
      .nav{
        .navItem{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 3rem;
          color: #333;
          cursor: pointer;
          /*padding-right: 1rem;*/
          .navText{
            display: flex;
            /*width: 7rem;*/
          }
          .showlist{
            width: 1rem;
            display: block;
            i{
              font-size: 14px;
            }
          }
        }
        .second{
          /*padding-left: 1.5rem;*/
          overflow: hidden;
        }
        .active{
          background: @blue;
          color: #fff;
        }
        .activeSecond{
          color: @blue;
          border-right: solid 2px @blue;
        }

      }
    }
  }

  .black{
    background: @blackNew;
    .navBox{
      .nav{
        .navItem{
          color: #fff;
        }
        .navItem:hover{
          background: #31313c;
        }
      }
    }
  }
  .black:hover{
    .navBox{
      .nav{
        .navItem{
          color: #fff;
        }
      }
    }
  }

</style>
