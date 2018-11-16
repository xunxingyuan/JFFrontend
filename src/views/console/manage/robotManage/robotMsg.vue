<template>
  <div class="container robotMsg">
    <div class="top">
      <p class="title"><i class="fas fa-arrow-left" @click="back"></i> 机器人配置</p>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="editItem">
          <p class="title">运行信息</p>
          <div class="itemDetail">
            <div class="intro">
              运行中
            </div>
            <div class="editData">
              <el-switch
                      v-model="value2"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
              </el-switch>
            </div>
          </div>
          <div class="itemDetail">
            <div class="intro">
              创建时间
            </div>
            <div class="editData">
              2018年6月18日 00:00

            </div>
          </div>
          <div class="itemDetail">
            <div class="intro">
              上次登录时间
            </div>
            <div class="editData">
              2018年6月18日 00:00

            </div>
          </div>
        </div>
        <div class="editItem second">
          <p class="title">机器人信息</p>
          <div class="itemDetail">
            <div class="intro">
              机器人名称（必填）
            </div>
            <div class="editData">
              <el-input></el-input>
            </div>
          </div>
          <div class="itemDetail desc">
            <div class="intro">
              机器人描述
            </div>
            <div class="editData">

              <el-input type="textarea" :rows="4" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="itemDetail">
            <div class="intro">
              使用的知识库
            </div>
            <div class="editData">
              <el-select></el-select>

            </div>
          </div>
          <div class="itemDetail">
            <div class="intro">
              使用的语义网
            </div>
            <div class="editData">
              <el-select></el-select>

            </div>
          </div>
          <div class="itemDetail channelBox">
            <div class="intro">
              配置的渠道
            </div>
            <div class="editData ">
              <el-checkbox v-for="channel in channels" :label="channel" :key="channel">{{channel}}</el-checkbox>
            </div>
          </div>
        </div>

        <div class="btn">
          <el-button type="primary">提交</el-button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'robotMsg',
    methods:{
      back: function () {
        this.$router.go(-1)
      }
    },
    data(){
      return {
        channels: ['微信','企业号','微博'],
        value2: ''
      }
    }
  }
</script>

<style lang="less">
  .robotMsg{
    .top{
      .fas{
        font-size: 14px;
        color: #666;
      }
    }
    .bottom{
      padding: 0 1rem;
      padding-bottom: 1rem;
      .content{
        background: #fff;
        padding: 0;
        .editItem{
          text-align: left;
          border-bottom: solid 1px #ddd;
          padding: 1rem;
          .title{
            color: #333;
            font-weight: 600;
          }
          .itemDetail{
            font-size: 14px;
            display: flex;
            align-items: center;
            margin-top: 1rem;
            color: #666;
            .intro{
              width: 10rem;
              text-align: right;
              margin-right: 1rem;
            }
            .editData{
              width: 30rem;
            }
          }
          .desc{
            align-items: flex-start;
          }
          .channelBox{
            align-items: flex-start;
            .editData{
              display: flex;
              flex-flow: column;
              .el-checkbox{
                margin-left: 0;
              }
            }
          }
        }
        .second{
          border:none;
        }
        .btn{
          margin-top: 2rem;
          width: 100%;
          text-align: left;
          padding: 1rem;
          padding-left: 5rem;
        }
      }
    }
  }
</style>
