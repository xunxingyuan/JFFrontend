<template>
  <div class="qualityAnalysis container">
    <section class="partBox" v-if="chosePart=== 1">
      <div class="top">
        <p class="title">知识质量分析</p>
      </div>
      <div class="bottom">
        <div class="content">
          <div class="tools">
            <el-button size="small" type="primary" @click="add = true">+ 添加验证集</el-button>
            <el-button  size="small" @click="chosePart = 3">查看全部报告</el-button>
          </div>
          <div class="showBox">
            <div class="form">
              <table class="gtable">
                <tr class="gheader">
                  <th>序号</th>
                  <th>验证集名称</th>
                  <th>知识库</th>
                  <th>使用渠道</th>
                  <th>最新验证结果</th>
                  <th>操作</th>
                </tr>
                <tr v-for="i in 5">
                  <td>{{i}}</td>
                  <td>法律知识库</td>
                  <td>常用合同-法律</td>
                  <td>企业号</td>
                  <td></td>
                  <td>
                    <span class="edit" style="color: #2B86F6;margin-right: 1rem;" @click="viewAuth">验证集明细列表</span>
                    <span>删除</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="partBox" v-if="chosePart=== 2">
      <div class="top">
        <i class="fas fa-arrow-left" style="margin-right: 1rem" @click="chosePart=1"></i>
        <p class="title">法律知识库 验证集列表</p>
      </div>
      <div class="bottom authPart">
        <div class="authResult">
          <div class="authTitle">
            最新验证结果 2018-11-1 15:07
          </div>
          <div class="authContent">
            <div class="contentItem" v-for="item in authData">
              <p>{{item.name}}</p>
              <span>{{item.value}}</span>
            </div>
          </div>
        </div>
        <div class="authDetail">
          <div class="flex">
            <el-button size="small" type="primary" @click="addQuestion = true">+ 新增问题</el-button>
            <el-button size="small" @click="authConfirm.show= true"><i class="fas fa-caret-right"></i> 开始验证</el-button>
            <el-button size="small" @click="chosePart = 4">查看报告</el-button>
          </div>
          <div class="detailContent">
            <table class="gtable">
              <tr class="gheader">
                <th>序号</th>
                <th>模拟问题</th>
                <th>目标知识</th>
                <th>是否有效</th>
                <th>操作</th>
              </tr>
              <tr v-for="i in 5">
                <td>{{i}}</td>
                <td>可退用流程说明</td>
                <td>可退用费用</td>
                <td>有效</td>
                <td>
                  <span class="edit">编辑</span>
                  <span>删除</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </section>
    <section class="partBox reportBox" v-if="chosePart=== 3">
      <div class="top">
        <i class="fas fa-arrow-left" style="margin-right: 1rem" @click="chosePart=1"></i>
        <p class="title">验证集报告</p>
      </div>
      <div class="bottom">
        <div class="content">
          <div class="tools">
            <p>验证集搜索</p>
            <el-input class="search"></el-input>
          </div>
          <div class="showBox">
            <div class="form">
              <table class="gtable">
                <tr class="gheader">
                  <th>序号</th>
                  <th>状态</th>
                  <th>验证集名称</th>
                  <th>使用渠道</th>
                  <th>验证结果</th>
                  <th>验证结束时间</th>
                  <th>操作</th>
                </tr>
                <tr v-for="i in 5">
                  <td>{{i}}</td>
                  <td>法律知识库</td>
                  <td>常用合同-法律</td>
                  <td>企业号</td>
                  <td></td>
                  <td></td>
                  <td>
                    <span class="edit" style="color: #2B86F6;" @click="viewReportDetail">查看详细报告</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="partBox reportBox" v-if="chosePart=== 4">
      <div class="top">
        <i class="fas fa-arrow-left" style="margin-right: 1rem" @click="chosePart=3"></i>
        <p class="title">法律知识库 验证报告</p>
      </div>
      <div class="bottom authPart">
        <div class="authResult">
          <div class="authTitle">
            验证结束时间 2018-11-1 15:07
          </div>
          <div class="authContent">
            <div class="contentItem" v-for="item in authData">
              <p>{{item.name}}</p>
              <span>{{item.value}}</span>
            </div>
          </div>
        </div>
        <div class="authDetail">
          <div class="detailContent">
            <table class="gtable">
              <tr class="gheader">
                <th>序号</th>
                <th>模拟问题</th>
                <th>目标知识</th>
                <th>实测知识标题</th>
                <th>测试结果</th>
                <th>处理结果</th>
                <th>操作</th>
              </tr>
              <tr v-for="i in 5">
                <td>{{i}}</td>
                <td>可退用流程说明</td>
                <td>可退用费用</td>
                <td>有效</td>
                <td>有效</td>
                <td>有效</td>
                <td>
                  <span class="edit">编辑</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </section>
    <div class="coverBack addBox" v-if="add">
      <div class="centerBox">
        <div class="title">
          <span>新增验证集</span>
          <i class="fas fa-times" aria-hidden="true" @click="add = false"></i>
        </div>
        <div class="content">
          <div class="addItem">
            <span class="text">验证集名称：</span>
            <el-input class="itemInput"></el-input>
          </div>
          <div class="addItem">
            <span class="text">知识库：</span>
            <el-select  class="itemInput"></el-select>
          </div>
          <div class="addItem">
            <span class="text">渠道：</span>
            <div  class="itemInput flex">
              <el-checkbox-group v-model="checkList">
                <el-checkbox :label="item.label" v-for="item in type"></el-checkbox>
              </el-checkbox-group>
            </div>

          </div>
          <div class="addItem">
            <span class="text">验证集描述：</span>
            <el-input class="itemInput"></el-input>
          </div>
        </div>
        <div class="btnGroup">
          <el-button @click="add = false">取消</el-button>
          <el-button type="primary" @click="submitWord">确认</el-button>
        </div>
      </div>
    </div>
    <div class="coverBack addQuestion" v-if="addQuestion">
      <div class="centerBox">
        <div class="title">
          <span>新增问题</span>
          <i class="fas fa-times" aria-hidden="true" @click="addQuestion = false"></i>
        </div>
        <div class="content">
          <div class="addItem">
            <span class="text">问题：</span>
            <el-input class="itemInput"></el-input>
          </div>
          <div class="addItem">
            <span class="text">目标知识：</span>
            <el-select  class="itemInput"></el-select>
          </div>
        </div>
        <div class="btnGroup">
          <el-button @click="addQuestion = false">取消</el-button>
          <el-button type="primary" @click="submitWord">确认</el-button>
        </div>
      </div>
    </div>
    <div class="coverBack authConfirm" v-if="authConfirm.show">
      <div class="centerBox" v-if="authConfirm.confirm">
        <div class="title authTitle">
          <i class="fas fa-times" aria-hidden="true" @click="closeAuthConfirm"></i>
        </div>
        <div class="content">
          <p>确认验证渠道</p>
          <el-checkbox-group v-model="checkList">
            <el-checkbox :label="item.label" v-for="item in type"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="btnGroup">
          <el-button @click="closeAuthConfirm">取消</el-button>
          <el-button type="primary" @click="authConfirm.confirm = false" >确认</el-button>
        </div>
      </div>
      <div class="centerBox" v-if="!authConfirm.confirm">
        <div class="content">
          <div class="flex result"><i class="fas fa-2x fa-check-circle"></i><p>验证提交成功</p></div>
          <div class="flex result"><i class="fas"></i><p>验证报告结果可以在<span @click="viewReport">查看报告</span>查询</p></div>
        </div>
        <div class="btnGroup">
          <el-button type="primary" @click="closeAuthConfirm"> 知道了 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'qualityAnalysis',
    data(){
      return{
        chosePart: 1,
        add: false,
        type:[{
          label: 'CC端'
        },{
          label: '企业号'
        },{
          label: '坐席端'
        },{
          label: '网站'
        },{
          label: '微信'
        }],
        checkList:[],
        authData:[{
          name: '回复率',
          value: '97.00%'
        },{
          name: '准确率',
          value: '97.00%'
        },{
          name: '前三准确率',
          value: '97.00%'
        },{
          name: '前五准确率',
          value: '97.00%'
        }],
        addQuestion: false,
        authConfirm: {
          show: false,
          confirm: true
        }
      }
    },
    methods:{
      viewAuth: function () {
        this.chosePart = 2
      },
      closeAuthConfirm: function () {
        this.authConfirm = {
          show: false,
          confirm: true
        }
      },
      viewReport: function () {
        this.chosePart = 3
        this.authConfirm = {
          show: false,
          confirm: true
        }
      },
      viewReportDetail: function () {
        this.chosePart = 4
      }
    }
  }
</script>

<style lang="less">
.qualityAnalysis{
  .partBox{
    display: flex;
    flex-flow: column;
    height: 100%;
    .bottom{
      .content{
        background: #fff;
        padding-top: 1rem;
        .tools{
          justify-content: flex-start;
        }
      }
    }
    .authPart{
      padding: 0 1rem;
      display: flex;
      flex-flow: column;
      .authResult,.authDetail{
        background: #fff;
      }
      .authResult{
        height: 9rem;
        width: 100%;
        margin-bottom: 1rem;
        /*font-size: 14px;*/
        color: #666;
        .authTitle{
          height: 2rem;
          line-height: 2rem;
          text-align: left;
          padding: 0 1rem;
        }
        .authContent{
          height: 7rem;
          width: 100%;

          display: flex;
          align-items: center;
          .contentItem{
            flex: 1;
            height: 50%;
            border-left: solid 1px #ddd;
            text-align: left;
            padding-left: 2rem;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            flex-flow: column;
            span{
              font-size: 1.3rem;
              margin-top: 10px;
              color: #000;
            }
          }
          .contentItem:nth-child(1){
            border: none;
          }

        }
      }
      .authDetail{
        flex: 1;
        width: 100%;
        padding: 1rem;
        overflow: auto;
        .detailContent{
          margin-top: 1rem;
          .edit{
            color: #2B86F6;
            margin-right: 1rem;
          }
        }
      }
    }
  }
  .reportBox{
    .bottom{
      padding: 0 1rem;
      .content{
        background: #fff;
        padding-top: 1rem;
        .tools{
          display: flex;
          align-items: center;
          justify-content: flex-start;
          .search{
            width: 15rem;
            input{
              background: transparent;
            }
          }
        }
      }
    }
  }
  .addQuestion{
    .centerBox{
      height: 25rem;
      width: 30rem;
      .content{
        .addItem{
          .text{
            width: 5rem;
            font-size: 14px;
            text-align: right;
          }
        }
      }
    }
  }
  .addBox{
    .centerBox{
      height: 25rem;
      width: 40rem;
      .content{
        padding: 1rem 2rem;
        .addItem{
          .text{
            width: 6rem;
            font-size: 14px;
            text-align: right;
          }
        }
      }
    }
  }
  .authConfirm{
    .centerBox{
      height: 15rem;
      width: 35rem;
      .authTitle{
        background: #fff;
        display: flex;
        justify-content: flex-end;
      }
      .btnGroup{
        padding: 0 1rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      .content{
        text-align: left;
        font-size: 14px;
        p{
          width: 100%;
          margin-bottom: 10px;
        }
        .result{
          width: 100%;
          align-items: center;
          .fas{
            color: #11C115;
            width: 2rem;
            margin-right: 1rem;
          }
          p{
            margin-bottom: 0;
            span{
              margin: 0 10px;
              color: #2B86F6;
              cursor: pointer;
            }
          }
        }
        .result:nth-child(1){
          margin-bottom: 1rem;
        }
      }
    }
  }
}
</style>
