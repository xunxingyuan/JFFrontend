<template>
  <div class="talkRecord">
    <div class="testBox animated fadeInRight">
      <div class="title flex">
        <div class="left">
          <p>正常回答</p>
        </div>
        <i @click="closeTest()" aria-hidden="true" class="fas fa-times"></i>
      </div>
      <div class="content">
        <div class="inner scrollbar" id="testReplyBox">
          <div class="talk" v-for="(item,index) in talkList" :key="index+1" :class="item.type" v-if="item.text!==''">
            <span class="icon"><i class="fa icons_robot_pic"></i><i class="fa icons_user_pic"></i></span>
            <div class="textBox">
              <div class="text">
                <p v-html="item.text"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'talkRecord',
    props:['talkList'],
    methods:{
      closeTest: function () {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="less">
  .talkRecord {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    z-index: 101;
    right: 0;
    top: 0;
    .testBox {
      margin-right: 0.5rem;
      width: 30rem;
      height: 35rem;
      background: #fff;
      border-radius: 2px;
      /*align-self: flex-start;*/
      flex-flow: column;
      .title {
        background: #2B86F6;
        border-radius: 2px 2px 0 0;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 1rem;
        height: 3rem;
        min-height: 3rem;
        .left{
          text-align: left;
          flex: 1;
          margin-right: 1rem;
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          p {
            /*height: 2.5rem;*/
            /*line-height: 2.5rem;*/
            font-size: 0.9rem;
            color: #fff;
            width: 100%;
            text-align: left;
          }
          span{
            font-size: 12px;
            color: #D1E6FF;
            text-align: left;
          }
        }
        i{
          color: #fff;
          min-width: 18px;
        }
      }

      .content {
        height: 32rem;
        position: relative;
        background: #F4F6F8;
        .inner {
          position: absolute;
          height: 100%;
          width: 100%;
          left: 0;
          right: 0;
          top: 0;
          overflow: auto;
          padding: 1rem;
          .talk {
            margin-bottom: 10px;
            /*min-height: 3rem;*/
            height: auto;
            display: flex;
            align-items: center;
            .icon {
              width: 2.7rem;
              min-width: 2.7rem;
              height: 2.7rem;
              border-radius: 1.3rem;
              /*border: solid 1px #999;*/
              align-self: flex-start;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #999;
            }
            .textBox{
              width: 100%;
              display: flex;
              flex-flow: column;
              .text {
                flex: 1;
                width: auto;
                max-width: 80%;
                display: flex;
                word-break: break-all;
                padding: 0.5rem;
                color: #000;
                border-radius: 6px;
                font-size: 0.7rem;
                text-align: left;
                height: auto;
                position: relative;
                .innerItem{
                  /*height: 1.5rem;*/
                  width: 100%;
                  background: #F4F4F4;
                  color: #2B86F6;
                  line-height: 1.5rem;
                  margin-bottom: 5px;
                  margin-top: 5px;
                  padding-left: 0.5rem;
                  padding-right: 0.5rem;
                  cursor: pointer;
                  display: flex;
                }
                .practice{
                  position: absolute;
                  width: 30px;
                  height: 24px;
                  left: -30px;
                  bottom: 2px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 10px;
                  color: #2B86F6;
                  cursor: pointer;
                  i{
                    margin-right: 2px;
                  }
                }
                .search{
                  position: absolute;
                  width: 30px;
                  height: 24px;
                  right: -30px;
                  bottom: 2px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 10px;
                  color: #2B86F6;
                  cursor: pointer;
                  i{
                    margin-right: 2px;
                  }
                }

                /*margin-top: 1rem;*/
              }
              .time{
                height: 1.2rem;
                line-height: 1.2rem;
                font-size: 12px;
                color: #999;
              }
            }
          }
          .robotPart{
            justify-content: flex-start;
            .icon {
              margin-right: 0.8rem;
              /*background: #fff;*/
              /*border: solid 1px #ddd;*/
              .icons_user_pic{
                display: none;
              }
            }
            .textBox{
              align-items: flex-start;
              .text{
                background: #fff;
                border: solid 1px #ddd;
                .practice{
                  display: none;
                }
                .search{
                  display: flex;
                }
              }
              .time{
                text-align: left;
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
                top: 10px;
                left: -5px;
                /*box-shadow: 0 0 5px #999;*/
              }
            }

          }
          .user {
            display: flex;
            justify-content: flex-start;
            flex-direction: row-reverse;
            .icon {
              margin-left: 0.8rem;
              /*background: #E4EFFB;*/
              /*border: solid 1px #ACCBEE;*/
              .icons_robot_pic{
                display: none;
              }
            }
            .textBox{
              align-items: flex-end;

              .text{
                background: #E4EFFB;
                border: solid 1px #ACCBEE;
                .practice{
                  display: flex;
                }
                .search{
                  display: none;
                }
              }
              .time{
                text-align: right;
              }
              .text:before{
                content: '';
                z-index: 1;
                width: 6px;
                height: 6px;
                background: #E4EFFB;
                transform: rotate(-45deg);
                border-top: none;
                border-left: none;
                border-right: solid 1px #ACCBEE;
                border-bottom: solid 1px #ACCBEE;
                position: absolute;
                top: 10px;
                right: -5px;
                /*box-shadow: 0 0 5px #999;*/
              }
            }
          }
        }
      }
      .input {
        height: 8rem;
        width: 100%;
        position: relative;
        flex-flow: column;
        .timeSelect{
          position: absolute;
          top: 2rem;
          left: 0.5rem;
        }
        .change{
          height: 1.4rem;
          min-height: 1.4rem;
          width: 100%;
          background: #ECF4FE;
          color: #2B86F6;
          font-size: 12px;
          line-height: 1.2rem;
          cursor: pointer;
        }
        .inputBox {
          flex: 1;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: solid 1px #EEEEEE;
          .el-textarea{
            width: 100%;
            textarea{
              border: none;
              font-size: 14px;
              resize: none;
            }
          }
        }
        .submit {
          height: 36px;
          min-height: 36px;
          display: flex;
          margin-bottom: 10px;
          align-items: center;
          justify-content: flex-end;
          span{
            width: 84px;
            height: 28px;
            line-height: 28px;
            background: #F9F9F9;
            border: solid 1px #eee;
            margin-right: 1rem;
            font-size: 14px;
            color: #ccc;
            cursor: pointer;
            border-radius: 2px;
          }
          span:hover{
            color: #2B86F6;
            border: solid 1px #2B86F6;
          }
        }
        .active{
          span{
            color: #2B86F6;
            border: solid 1px #2B86F6;
          }
        }
        .ctrlBox{
          flex: 1;
          border-top: solid 1px #EEEEEE;
          span{
            width: 11rem;
            height: 42px;
            line-height: 42px;
            color: #333;
            border: solid 1px #ddd;
            border-radius: 2px;
            font-size: 14px;
            cursor: pointer;
          }
          span:nth-child(1){
            background: #2B86F6;
            color: #fff;
            border: none;
            margin-right: 1rem;
          }
        }
      }
    }
    .choseRobot{
      width: 50%;
      height: 10rem;
      background: #fff;
      position: relative;
      p{
        margin-right: 1rem;
      }
      .icons_close{
        position: absolute;
        right: 1rem;
        top: 1rem;
      }
      .comfirm{
        margin-left: 1rem;
      }
    }
  }

</style>
