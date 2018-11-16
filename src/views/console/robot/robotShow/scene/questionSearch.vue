<template>
  <div class="questionSearch" v-if="state.searchQuestion">
    <div class="contain">
      <div class="title">
        <p>查询</p>
        <i class="iconfont icon-guanbi" @click="close()"></i>
      </div>
      <div class="content">
        <div class="node">
          <span class="icon"><i class="fa icons_robot_pic"></i></span>
          <div class="text scrollbar">
            <div class="contentText" v-html="selectNodeData.text"></div>
            <span v-for="(item,index) in selectNodeData.conditions">
              {{index+1}}、{{item}}<br/>
            </span>
          </div>
        </div>
        <div class="mid">
          <span class="line"></span>
          <div class="arrow">
            <span class="arrowPart1"></span>
            <span class="arrowPart2"></span>
          </div>
          <span class="line"></span>

        </div>
        <div class="type">

          <p>命中类型：
            <span v-if="!selectMenu.hasOwnProperty('type')">多轮会话</span>
            <span v-else>一问一答</span>
          </p>

          <p v-if="!selectMenu.hasOwnProperty('type')">分类目录:
            <span v-if="selectMenu === ''">暂无匹配数据</span>
            <span v-else><span v-for="item in selectMenu.categories">{{item.name}}/</span></span>
          </p>
          <p v-else>分类目录:
            <span>{{selectMenu.categories}}</span>
          </p>
          <p v-if="!selectMenu.hasOwnProperty('type')">多轮对话场景:
            <span v-if="selectMenu === ''">暂无匹配数据</span>
            <span v-else>{{selectMenu.scenes.scenesName}}</span>
          </p>
          <p v-else>一问一答场景:
            <span>{{selectMenu.scenes}}</span>
          </p>
        </div>
      </div>
      <div class="btnGroup">
        <span class="cancel" @click="close()">取消</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'questionPractice',
    components:{

    },
    data(){
      return {
        selectedNode: '',
      }
    },
    computed:{
      ...mapGetters({
        state: 'getQuestionEditState',
        selectNodeData: 'getSearchQuestionNode',
        selectMenu: 'getSearchNodeData'
      }),
    },
    methods:{
      close: function () {
        this.$store.dispatch('closeQuestionEdit',{
          type: 'searchQuestion'
        })
      },
    },
    mounted(){

    }
  }
</script>

<style lang="less">
  .questionSearch{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 2002;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    .contain{
      width: 32rem;
      height: 30rem;
      display: flex;
      flex-flow: column;
      padding: 0;
      .title,.content,.btnGroup{
        width: 100%;
      }
      .title{
        height: 3rem;
        min-height: 3rem;
        background: #f3f3f3;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        font-weight: 600;
      }
      .content{
        height: 25rem;
        padding: 1rem;
        display: flex;
        flex-flow: column;
        align-items: flex-start;
        justify-content: space-around;
        .node{
          display: flex;
          width: 100%;
          max-height: 13rem;
          .icon{
            margin-left: 1rem;
          }
          .text{
            overflow: auto;
            margin-left: 1rem;
            border: solid 1px #ddd;
            padding: 1rem;
            position: relative;
            border-radius: 6px;
            font-size: 0.8rem;
            text-align: left;
            line-height: 1.5;
            max-width: 70%;
            span{
              margin-top: 5px;
              display: block;
              background: #f4f4f4;
              color: #2B86F6;
              width: 100%;
              min-height: 1.5rem;
              line-height: 1.5rem;
              padding: 0 5px;
            }
          }
          .text:before{
            content: '';
            z-index: 1;
            width: 6px;
            height: 6px;
            transform: rotate(-45deg);
            border-top: solid 1px #ddd;
            border-left: solid 1px #ddd;
            border-right: none;
            border-bottom: none;
            background: #fff;
            position: absolute;
            top: 18px;
            left: -5px;
            /*box-shadow: 0 0 5px #999;*/
          }
        }
        .mid{
          margin: 1rem 0;
          width: 100%;
          display: flex;
          align-items: center;
          .line{
            flex: 1;
            height: 1px;
            background: #ddd;
          }
          .arrow{
            margin-top: -1rem;
            height: 2rem;
            width: 3rem;
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            .arrowPart1,.arrowPart2{
              width: 1rem;
              height: 1rem;
              border-left: solid 2px #ddd;
              border-bottom: solid 2px #ddd;
              transform: rotate(-45deg);
            }
            .arrowPart2{
              margin-top: -0.5rem;
            }
          }
        }
        .type{
          width: 100%;
          padding-left: 1rem;
          p{
            width: 100%;
            font-size: 0.9rem;
            line-height: 1.5;
            text-align: left;
            font-weight: 600;
            margin-bottom: 10px;
            span{
              font-weight: 500;
              color: #333;
            }
          }
        }
      }
      .btnGroup{
        height: 4rem;
        min-height: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 1rem;
        font-size: 0.9rem;
        span{
          height: 2rem;
          width: 6rem;
          line-height: 2rem;
        }
        .submit{
          background: #2B86F6;
          color: #fff;
          margin-right: 1rem;
          cursor: pointer;
        }
        .cancel{
          color: #666;
          border: solid 1px #DDDDDD;
          cursor: pointer;
        }
        .submit:active{
          background: #00bfff;
        }
        .cancel:active{
          color: #333;
        }
      }
    }
  }
</style>

