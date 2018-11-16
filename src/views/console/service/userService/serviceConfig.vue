<template>
  <div class="serviceConfig coverBack">
    <div class="centerBox">
      <div class="title"><p>服务配置</p><i class="iconfont icon-guanbi" aria-hidden="true" @click="close()"></i></div>
      <div class="content">
        <div class="chose">
          <span :class= "{'active':choseItemIndex=== index}" v-for="(item,index) in choseList" @click="choseType(index)">{{item.name}}</span>
        </div>
        <div v-if="choseItemIndex === 0" class="headerContent scrollbar">
          <span class="add" @click="addHeaderItem">新增</span>
          <table class="gtable">
            <tr class="gheader">
              <th>类别</th>
              <th>值</th>
              <th>备注</th>
              <th>操作</th>
            </tr>
            <tr v-for="(data,index) in header">
              <td width="50">
                <div class="inputBox">
                  <input v-model="data.paramName">
                </div>
              </td>
              <td width="100">
                <div class="inputBox">
                  <input v-model="data.paramValue">
                </div>
              </td>
              <td width="50">
                <div class="inputBox">
                  <input v-model="data.paramDesc">
                </div>
              </td>
              <td width="50">
                <div class="inputBox">
                  <span class="del" @click="removeHeader(index)">删除</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div v-if="choseItemIndex === 1" class="headerContent scrollbar">
          <span class="add" @click="addParamItem">新增</span>
          <table class="gtable">
            <tr class="gheader">
              <th>参数名称</th>
              <th>是否必须</th>
              <th>参数值</th>
              <th>参数类型</th>
              <th>参数条件</th>
              <th>参数范围</th>
              <th>参数描述</th>
              <th>操作</th>
            </tr>
            <tr v-for="(data,index) in params">
              <td width="100">
                <div class="inputBox">
                  <input v-model="data.paramName">
                </div>
              </td>
              <td width="100">
                <div class="inputBox">
                  <select v-model="data.necessary">
                    <option value="true">是</option>
                    <option value="false">否</option>
                  </select>
                </div>
              </td>
              <td width="100">
                <div class="inputBox">
                  <input v-model="data.paramValue">
                </div>
              </td>
              <td width="50">
                <div class="inputBox type">
                  <select v-model="data.paramType">
                    <option value="1">STRING</option>
                    <option value="2">INT</option>
                    <option value="3">DOUBLE</option>
                    <option value="4">DATE</option>
                    <option value="5">TIMESTAMP</option>
                    <option value="6">OBJECT</option>
                    <option value="7">BOOLEAN</option>
                    <option value="8">BYTE</option>
                    <option value="9">FILE</option>
                    <option value="10">JSON</option>
                  </select>
                </div>
              </td>
              <td width="100">
                <div class="inputBox">
                  <input v-model="data.paramPattern">
                </div>
              </td>
              <td width="100">
                <div class="inputBox">
                  <input v-model="data.paramRange">
                </div>
              </td>
              <td width="100">
                <div class="inputBox">
                  <input v-model="data.paramDesc">
                </div>
              </td>
              <td width="50">
                <div class="inputBox">
                  <span class="del" @click="removeParam(index)">删除</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div v-if="choseItemIndex === 2" class="responseContent">
          <div class="desc">
            <div class="descItem">
              <p>返回码:</p>
              <input v-model="response.responseCode"/>
            </div>
            <div class="descItem">
              <p>返回消息:</p>
              <input v-model="response.responseMsg"/>
            </div>
            <div class="descItem">
              <p>返回类型:</p>
              <select v-model="response.responseType">
                <option value="1">NORMAL_STRING</option>
                <option value="2">JSON</option>
                <option value="3">FILE</option>
                <option value="4">XML</option>
                <option value="5">HTML</option>
              </select>
            </div>
          </div>
          <div class="data">
            <div class="ctrl"><span class="itemTitle">返回数据:</span> <span class="add" @click="addResponseItem">新增</span></div>
            <table class="gtable">
              <tr class="gheader">
                <th>名称</th>
                <th>类型</th>
                <th>描述</th>
                <th>操作</th>
              </tr>
              <tr v-for="(item,index) in response.responseParams">
                <td width="100">
                  <div class="inputBox">
                    <input v-model="item.paramName">
                  </div>
                </td>
                <td width="100">
                  <div class="inputBox">
                    <select v-model="item.paramType">
                      <option value="1">STRING</option>
                      <option value="2">INT</option>
                      <option value="3">DOUBLE</option>
                      <option value="4">DATE</option>
                      <option value="5">TIMESTAMP</option>
                      <option value="6">OBJECT</option>
                      <option value="7">BOOLEAN</option>
                      <option value="8">BYTE</option>
                      <option value="9">FILE</option>
                      <option value="10">JSON</option>
                    </select>
                  </div>
                </td>
                <td width="100">
                  <div class="inputBox">
                    <input v-model="item.paramDesc">
                  </div>
                </td>
                <td width="50">
                  <span class="del" @click="removeResponseItem(index)">删除</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="btnGroup flex">
        <el-button type="primary" @click="submit()">确定</el-button>
        <el-button @click="close()">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'serviceConfig',
    props:['configData'],
    methods:{
      close: function () {
        this.$emit('close')
      },
      choseType: function (index) {
        this.choseItemIndex = index
      },
      addHeaderItem: function () {
        this.header.push({
          paramDesc:"",
          paramName:"",
          paramValue:"",
        })
      },
      removeHeader: function (index) {
        this.header.splice(index,1)
      },
      addParamItem: function () {
        this.params.push({
          necessary: true,
          paramDesc:"",
          paramName:"",
          paramPattern:"",
          paramRange:"",
          paramType:1,
          paramValue:"",
        })
      },
      removeParam: function (index) {
        this.params.splice(index,1)
      },
      addResponseItem: function () {
        this.response.responseParams.push({
          paramDesc:"",
          paramName:"",
          paramType:1
        })
      },
      removeResponseItem: function (index) {
        this.response.responseParams.splice(index,1)
      },
      submit: function () {
        this.$emit('submit',{
          headerParams: this.header,
          requestParams: this.params,
          response: this.response
        })
      }
    },
    data(){
      return {
        choseItemIndex: 0,
        header: [],
        params: [],
        response: '',
        choseList:[{
          id:1,
          name: '请求头'
        },{
          id:2,
          name: '请求参数'
        },{
          id:3,
          name: '返回数据'
        }]
      }
    },
    mounted(){
      this.header = this.configData.headerParams
      this.params = this.configData.requestParams
      this.response = this.configData.response
    }
  }
</script>

<style lang="less">
  .serviceConfig{
    .centerBox{
      width: 60rem;
      height: 35rem;
      .btnGroup{
        .el-button{
          height: 2.5rem;
        }
      }
      .content{
        display: block;
        padding: 1rem 2rem;
        .responseContent{
          overflow: auto;
          height: 20rem;
          padding: 0 1rem;
          display: flex;
          .desc{
            width: 15rem;
            padding-right: 1rem;
            border-right: solid 1px #ddd;
            height: 100%;
            .descItem{
              margin-bottom: 1rem;
              p{
                text-align: left;
                width: 100%;
                margin-bottom: 5px;
                font-size: 0.8rem;
              }
              input{
                width: 100%;
                height: 2rem;
                padding: 0 8px;
                outline: none;
                border: solid 1px #ddd;
              }
              input:focus{
                border: solid 1px #00aaec;
              }
              select{
                height: 2rem;
                width: 100%;
                border: solid 1px #ddd;
              }
            }
          }
          .data{
            flex: 1;
            height: 18rem;
            padding: 0 1rem;
            overflow: auto;
            .ctrl{
              font-size: 0.8rem;
              text-align: left;
              margin-bottom: 0.5rem;
              .itemTitle{
                color: #000;
                font-weight: 600;
              }
              .add{
                width: 72px;
                height: 24px;
                display: inline-block;
                line-height: 24px;
                text-align: center;
                font-size: 0.7rem;
                border: solid 1px #ddd;
                margin-left: 1rem;
                cursor: pointer;
              }
              .add:focus{
                border: solid 1px #00aaec;
              }
            }
            .del{
              margin-left: 1rem;
            }
          }
        }
        .headerContent,.data{
          overflow: auto;
          height: 20rem;
          padding: 0 1rem;
          .inputBox{
            flex: 1;
            height: 100%;
            border: none;
            margin-left: -1px;
            margin-bottom: -1px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-left: 1rem;
            input{
              width: 100%;
              height: 100%;
              padding: 0 10px;
              outline: none;
              border-radius: 2px;
              border: none;
              background: transparent;
            }
            input:focus{
              border: solid 1px #2B86F6;
            }
            .del{
              width: 100%;
            }
          }

          .gtable{
            tr{
              td{
                padding: 0;
                margin: 0;
              }
            }
          }
          .add{
            align-self: flex-start;
            width: 72px;
            height: 24px;
            line-height: 24px;
            color: #666666;
            border: solid 1px #ddd;
            display: block;
            font-size: 0.7rem;
            margin-bottom: 1rem;
            cursor: pointer;

          }
          .add:hover{
            border: solid 1px #00aaec;
          }
        }
        .chose{
          font-size: 0.9rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
          span{
            border: solid 1px #ddd;
            display: inline-block;
            line-height: 2;
            padding: 0 1rem;
            margin-left: -1px;
            cursor: pointer;
          }
          .active{
            background: #00aaec;
            color: #fff;
            border: solid 1px #00aaec;
          }
        }
        .item{
          display: flex;
          align-items: center;
          position: relative;
          width: 100%;
          /*margin-bottom: 1rem;*/
          p{
            flex: 1;
            width: 6rem;
            height: 2.2rem;
            line-height: 2.2rem;
            text-align: left;
            font-size: 0.9rem;
            color: #666;
            border: solid 1px #ddd;
            padding-left: 1rem;
            margin-bottom: -1px;
            margin-left: -1px;
          }

          .type{
            flex: 2;
          }

          .fa{
            margin-left: 1rem;
            min-width: 16px;
            min-height: 16px;
          }
        }
      }
    }
  }
</style>
