<template>
  <div class="qaSetting container">
    <div class="top">
      <p class="title">会话设置</p>
    </div>
    <div class="bottom">
      <div class="content tagContainBox">
        <div class="tagItem">
          <span :class="{'active': choseTag.name === item.name}" v-for="(item,index) in tagList" @click="choseItem(item,index)">{{item.name}}</span>
          <div class="tagBottomLine"></div>
        </div>
        <div class="tagContain" v-if="activeIndex === 0">
          <div class="tools">
            <el-button type="primary">新建变量</el-button>
          </div>
          <div>
            <table class="gtable">
              <tr class="gheader">
                <th>序号</th>
                <th>变量名</th>
                <th>描述</th>
                <th>分类</th>
                <th>性质</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in 5">
                <td>{{item}}</td>
                <td>test</td>
                <td>测试</td>
                <td>合同</td>
                <td>自定义</td>
                <td>
                  <div class="ctrl">
                    <span class="view">编辑</span>
                    <span class="view">删除</span>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="tagContain" v-if="activeIndex === 1">

        </div>
        <div class="tagContain" v-if="activeIndex === 2">
          <div class="inputBox">
            <div class="topPart">
              <span>欢迎语</span>
              <el-switch
                      v-model="value2"
                      active-color="#13ce66"
                      inactive-color="#ddd">
              </el-switch>
            </div>
            <div>
              <el-input
                      type="textarea"
                      :rows="3"
                      placeholder="请输入内容"
                      v-model="textarea">
              </el-input>
            </div>
          </div>
          <div class="inputBox">
            <div class="topPart">
              <span>当用户回答没有命中[条件]时</span>
              <el-switch
                      v-model="value2"
                      active-color="#13ce66"
                      inactive-color="#ddd">
              </el-switch>
            </div>
            <div>
              <el-input
                      type="textarea"
                      :rows="3"
                      placeholder="请输入内容"
                      v-model="textarea">
              </el-input>
            </div>
          </div>
          <div class="inputBox">
            <div class="topPart">
              <span>结束场景语</span>
              <el-switch
                      v-model="value2"
                      active-color="#13ce66"
                      inactive-color="#ddd">
              </el-switch>
            </div>
            <div>
              <el-input
                      type="textarea"
                      :rows="3"
                      placeholder="请输入内容"
                      v-model="textarea">
              </el-input>
            </div>
          </div>
          <div class="inputBox">
            <div class="topPart">
              <span>未能识别用户意图(无法帮助)用户</span>
              <el-switch
                      v-model="value2"
                      active-color="#13ce66"
                      inactive-color="#ddd">
              </el-switch>
            </div>
            <div>
              <el-input
                      type="textarea"
                      :rows="3"
                      placeholder="请输入内容"
                      v-model="textarea">
              </el-input>
            </div>
          </div>
          <el-button type="primary">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'qaSetting',
    data(){
      return {
        tagList:[{
          name: '全局变量'
        },{
          name: '会话优先级'
        },{
          name: '常规回复'
        }],
        choseTag: {
          name: '全局变量'
        },
        activeIndex: 0,
        value2: ''
      }
    },
    methods:{
      choseItem: function (item,index) {
        this.choseTag = item
        this.activeIndex = index
      }
    },
    mounted(){

    }
  }
</script>

<style lang="less">
  .qaSetting{
    .bottom{
      padding: 0 1rem;
      .content{
        padding: 0;
        .tagContain{
          padding-top: 2rem;
          .inputBox{
            width: 50%;
            position: relative;
            margin-bottom: 1rem;
            .topPart{
              width: 100%;
              display: flex;
              justify-content: space-between;
              padding-bottom: 10px;
              span{
                color: #000;
                font-weight: 600;
              }
            }
          }
        }
      }
    }
  }
</style>
