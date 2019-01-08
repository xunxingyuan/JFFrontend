<template>
  <div class="manageChannel container">
    <div class="top">
      <p class="title">渠道管理</p>
    </div>
    <div class="bottom">
      <div class="content tagContainBox">
        <div class="tagItem">
          <span :class="{'active': choseTag.name === item.name}" v-for="item in tagList" @click="choseTag = item">{{item.name}}</span>
          <div class="tagBottomLine"></div>
        </div>
        <div class="tagContain">
          <p class="introduce">在微信自定义菜单嵌入移动网站版客服咨询页地址</p>
          <span class="tips">* 为了单独统计微信渠道的访问情况，我们已经在移动网站客服咨询页地址后追加了统计参数，请您使用以下地址，客服应答设置采用移动网站的配置</span>
          <div class="inputBox"><input v-model="url"  readonly/></div>
          <p class="third">微信授权接入</p>
          <el-button type="primary">绑定公众号</el-button>
          <div class="tableBox">
            <table class="gtable">
              <tr class="gheader">
                <th>公众号名称</th>
                <th>公众号ID</th>
                <th>
                  绑定时间
                </th>

                <th>操作</th>
              </tr>
              <tr v-for="i in 5">
                <td>极天法律机器人</td>
                <td>1234</td>
                <td>2018-11-06</td>
                <td>
                  <span class="edit">编辑</span>
                </td>
              </tr>
            </table>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'manageChannel',
    data(){
      return {
        tagList:[{
          name: '微信'
        },{
          name: 'APP'
        },{
          name: '移动网站'
        }],
        choseTag: {
          name: '微信'
        },
        url: 'http://192.168.100.248:8080/#/robot/scenes'
      }
    }
  }
</script>

<style lang="less">
  .manageChannel{
    .bottom{
      padding: 0 1rem;
      .content{
        padding: 0;
        .tagContain{
          .tips{
            color: #999;
            margin: 5px 0;
            font-size: 14px;
            display: block;
          }
          .inputBox{
            margin-top: 1rem;
            margin-bottom: 2rem;
            width: 100%;
            height: 3rem;
            input{
              width: 100%;
              height: 3rem;
              padding: 0 10px;
              background: #f0f0f0;
              color: #666;
              border: none;
              outline: none;
            }
          }
          .third{
            margin-bottom: 10px;
          }
        }
      }
    }
  }
</style>
