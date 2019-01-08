<template>
  <div class="coverBack userGroupEdit" v-if="show">
    <div class="centerBox">
      <div class="title flex">
        <p v-if="groupData.edit">修改用户组</p>
        <p v-else>创建用户组</p>
        <i @click="close()" aria-hidden="true" class="fa icons_close"></i>
      </div>
      <div class="content">
        <div class="steps flexCenter" v-if="activeStep !== 2">
          <div class="stepItem" v-for="(step,index) in stepData" :class="{'active': activeStep === index,'pass': activeStep>index}">
            <div class="line" v-if="index!==0"></div>
            <div class="stepName flexCenter">
              <div class="flexCenter rank">
                <span>{{step.id}}</span>
                <i class="fa icons_done_group"></i>
              </div>
              <p>{{step.name}}</p>
            </div>
          </div>
        </div>
        <div class="settingBox" v-if="activeStep !== 2">
          <div v-if="activeStep === 0">
            <div class="addItemCommon">
              <p><i class="fa">*</i>用户组名称</p>
              <div class="itemContent">
                <el-input v-model="groupData.groupName"></el-input>
              </div>
            </div>
            <div class="addItemCommon">
              <p>有效时间</p>
              <div class="itemContent time">
                <el-radio-group v-model="groupData.effectType">
                  <el-radio :label="0">永久</el-radio>
                  <el-radio :label="1">自定义</el-radio>
                </el-radio-group>
                <el-date-picker
                  v-model="groupData.effectTime"
                  :disabled="groupData.effectType!==1"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </div>
            </div>
            <div class="addItemCommon">
              <p>备注</p>
              <div class="itemContent">
                <el-input v-model="groupData.note"></el-input>
              </div>
            </div>
          </div>
          <div class="inner scrollbar" v-if="activeStep === 1">
            <p class="title">设置权限</p>
          </div>

        </div>

        <div class="success flexCenter" v-if="activeStep === 2">
          <i class="fa icons_save"></i>
          <p v-if="groupData.edit">修改用户组成功</p>
          <p v-else>创建用户组成功</p>

          <span @click="close()">知道了</span>
        </div>
      </div>
      <div class="btnGroup">
        <el-button v-if="activeStep === 0" @click="close()">取消</el-button>
        <el-button v-if="activeStep === 0" type="primary" @click="toNext()">下一步</el-button>
        <el-button v-if="activeStep === 1" @click="toPrev()">上一步</el-button>
        <el-button v-if="activeStep === 1" type="primary" @click="submit()">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'userGroup',
    props:['show','groupData','menuData','categoryData','permission'],
    data(){
      return {
        stepData:[{
          id: 1,
          name: '基本信息'
        },{
          id: 2,
          name: '设置权限'
        },{
          id: 3,
          name: '完成'
        }],
        activeStep: 0,
        menuList:['首页'],
        categoryList: [],
        selectCategory:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        showSceneSelect: false
      }
    },
    methods:{
      getCheckedNodes() {
        console.log(this.$refs.tree.getCheckedNodes());
        this.showSceneSelect = false
        this.categoryList = this.$refs.tree.getCheckedNodes()
      },
      close: function () {
        this.$emit('closeBox')
        this.showSceneSelect = false
        this.activeStep = 0
      },
      toPrev: function () {
        this.activeStep = 0
        this.showSceneSelect = false
      },
      toNext: function () {
        if(this.groupData.groupName!==''||(this.groupData.groupName!==''&&this.groupData.effectType ===1&&this.groupData.effectTime.length!==0)){
          this.activeStep = 1
        }
      },
      submit: function () {
        this.$emit('editSuccess')
        this.activeStep = 2
      }
    },
    mounted(){

    }
  }
</script>

<style lang="less">
  .userGroupEdit{
    .centerBox{
      width: 40rem;
      .content{
        justify-content: center;
        flex-flow: column;
        .steps{
          height: 6rem;
          min-height: 6rem;
          margin-bottom: 2rem;
          .stepItem{
            flex: 1;
            display: flex;
            align-items: center;
            .line{
              width: 100px;
              height: 1px;
              background: #ddd;
              margin: 0 1rem;
            }
            .stepName{
              color: #ddd;
              position: relative;
              width: 28px;
              .rank{
                min-width: 28px;
                width: 28px;
                height: 28px;
                border-radius: 14px;
                border: solid 1px #ddd;
                font-size: 0.9rem;
                .fa{
                  display: none;
                }
              }
              p{
                position: absolute;
                text-align: center;
                height: 1.5rem;
                bottom: -2rem;
                width: 5rem;
                left: -1.6rem;
                font-size: 0.9rem;
              }

            }
          }
          .active{
            .line{
              background: #2B86F6;
            }
            .stepName{
              .rank{
                background: #2B86F6;
                color: #fff;
                border: none;
              }
              p{
                color: #333;
                font-weight: 600;
              }
            }
          }
          .pass{
            .line{
              background: #2B86F6;
            }
            .stepName{
              .rank{
                border: solid 1px #2B86F6;
                background: #fff;
                color: #333;
                .fa{
                  display: block;
                }
                span{
                  display: none;
                }
              }
              p{
                color: #333;
                font-weight: 500;
              }
            }
          }
        }
        .settingBox{
          flex: 1;
          width: 100%;
          overflow-y: auto;
          /*margin-bottom: 2rem;*/
          position: relative;
          .inner{
            height: 100%;
            display: flex;
            flex-flow: column;
            width: 100%;
            overflow: auto;

            .title{
              height: 1.5rem;
              min-height: 1.5rem;
              background: #fff;
              text-align: left;
              font-size: 0.9rem;
            }
            .authContain{
              flex: 1;
              width: 100%;
              background: #f4f4f4;
              padding: 1rem;
              text-align: left;
              .innerTitle{
                font-size: 0.8rem;
                text-align: left;
                margin-bottom: 10px;
              }
              .innerContain{
                /*background: #fff;*/
                margin-bottom: 10px;
                padding-bottom: 10px;
                /*padding: 10px 0;*/
                border-bottom: solid 1px #ddd;
                text-align: left;
                .el-checkbox{
                  margin: 0;
                  margin-right: 1.5rem;
                }
              }
            }
            .secondChose{
              padding: 0;
              border: solid 1px RGBA(221, 221, 221, 1);
              text-align: right;
              .btn{
                margin: 1rem;
              }
            }

          }
        }
        .success{
          flex-flow: column;
          p{
            margin: 1rem 0;
            font-size: 0.9rem;
          }
          span{
            display: block;
            width:96px;
            height:36px;
            line-height: 36px;
            font-size: 0.9rem;
            background:rgba(249,249,249,1);
            border-radius: 2px;
            color: #333;
            cursor: pointer;
          }
        }
      }
      .btnGroup{
        align-self: flex-end;
        margin-right: 2rem;
      }
      .btnContainer{
        width: 100%;
        text-align: right;
        min-height: 3rem;
        background: RGBA(244, 244, 244, 1);
        padding: 0 1rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        /*.btn{*/
          /*margin-top: 1rem;*/
        /*}*/
      }
    }
  }
</style>
