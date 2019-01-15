<template>
  <div class="container robotMsg">
    <div class="top">
      <p class="title">
        <i class="fas fa-arrow-left" @click="back"></i>
        {{choseRobot.robotName}}配置
      </p>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="editItem robotStatus">
          <div class="editBlock ctrl">
            <p class="title">当前状态</p>
            <div class="status" v-if="status === '1'">
              <i class="iconfont icon-zanting"></i>
              <span>暂停运行</span>
            </div>
            <div class="status" v-if="status === '2'" style="color:#6ce26c;">
              <i class="iconfont icon-yunhang"></i>
              <span>正在运行</span>
            </div>
            <div class="btnBox">
              <p v-if="status === '1'" @click="publishRobot">启动运行</p>
              <p
                v-if="status === '2'"
                style="background:#fff;border-top: solid 1px #ddd;color: #333;border-bottom: solid 1px #ddd"
                @click="unpublishRobot"
              >停止运行</p>
            </div>
          </div>
          <div class="editBlock">
            <p class="title">运行信息</p>
            <!--<div class="itemDetail">-->
            <!--<div class="intro">-->
            <!--运行状态-->
            <!--</div>-->
            <!--<div class="editData">-->
            <!--<el-switch-->
            <!--v-model="choseRobot.status"-->
            <!--@change="changeState"-->
            <!--active-color="#13ce66"-->
            <!--active-value="2"-->
            <!--inactive-value="1"-->
            <!--inactive-color="#ff4949">-->
            <!--</el-switch>-->
            <!--</div>-->
            <!--</div>-->
            <div class="itemDetail">
              <div class="intro">知识数量</div>
              <div class="editData">--</div>
            </div>
            <div class="itemDetail">
              <div class="intro">创建时间</div>
              <div class="editData">{{new Date(choseRobot.createdTime).toLocaleString()}}</div>
            </div>
            <div class="itemDetail">
              <div class="intro">运行时间</div>
              <div class="editData">{{new Date(choseRobot.publishedTime).toLocaleString()}}</div>
            </div>
            <div class="itemDetail">
              <div class="intro">上次更新时间</div>
              <div class="editData">{{new Date(choseRobot.publishedTime).toLocaleString()}}</div>
            </div>
          </div>
        </div>
        <div class="editItem second">
          <p class="title">机器人信息</p>
          <div class="itemDetail">
            <div class="intro">机器人名称（必填）</div>
            <div class="editData">
              <el-input v-model="choseRobot.robotName"></el-input>
            </div>
          </div>

          <div class="itemDetail desc">
            <div class="intro">机器人描述</div>
            <div class="editData">
              <el-input
                v-model="choseRobot.robotDesc"
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
              ></el-input>
            </div>
          </div>
          <div class="itemDetail">
            <div class="intro">机器人语义网</div>
            <div class="editData">
              <el-select v-model="robotOntology">
                <el-option
                  v-for="item in ontologyList"
                  :key="item.projectId"
                  :label="item.displayName"
                  :value="item.projectId"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="itemDetail">
            <div class="intro">是否启用语义网</div>
            <div class="editData">
              <el-switch v-model="ifOntology" active-color="#2b86f6"></el-switch>
            </div>
          </div>

          <!--<div class="itemDetail">-->
          <!--<div class="intro">-->
          <!--使用的知识库-->
          <!--</div>-->
          <!--<div class="editData">-->
          <!--<el-select></el-select>-->
          <!--</div>-->
          <!--</div>-->
          <!--<div class="itemDetail">-->
          <!--<div class="intro">-->
          <!--使用的语义网-->
          <!--</div>-->
          <!--<div class="editData">-->
          <!--<el-select></el-select>-->
          <!--</div>-->
          <!--</div>-->
          <!--<div class="itemDetail channelBox">-->
          <!--<div class="intro">-->
          <!--配置的渠道-->
          <!--</div>-->
          <!--<div class="editData ">-->
          <!--<el-checkbox v-for="channel in channels" :label="channel" :key="channel">{{channel}}</el-checkbox>-->
          <!--</div>-->
          <!--</div>-->
          <div class="btn">
            <el-button type="primary" @click="changeMsg">提交</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "robotMsg",
  computed: {
    ...mapGetters({
      choseRobot: "getSelectRobot",
      ontologyList: "getOntologyList"
    })
  },
  methods: {
    back: function() {
      this.$router.go(-1);
    },
    changeState: function(val) {
      console.log(val);
      if (val === "1") {
        this.unpublishRobot();
      } else if (val === "2") {
        this.publishRobot();
      }
    },
    unpublishRobot: function() {
      let item = this.choseRobot;
      this.$api.robot
        .unPublishRobot({
          robotId: item.robotId
        })
        .then(res => {
          if (res.status === 200) {
            this.$message({
              message: "停止成功！",
              type: "success",
              duration: 1000
            });
            this.status = "1";
          } else {
            this.$message({
              message: res.msg,
              type: "error",
              duration: 1000
            });
          }
        });
    },
    publishRobot: function() {
      let item = this.choseRobot;
      this.$api.robot
        .publishRobot({
          robotId: item.robotId
        })
        .then(res => {
          if (res.status === 200) {
            this.$message({
              message: "启动成功！",
              type: "success",
              duration: 1000
            });
            this.status = "2";
          } else {
            this.$message({
              message: res.msg,
              type: "error",
              duration: 1000
            });
          }
        });
    },
    //提交语义网选择
    submitOntology: function(data) {
      return this.$api.robot.setRobotOntology(data);
    },
    //获取选择的语义网信息
    getOntologyMsg: function(id) {
      return new Promise((resolve, reject) => {
        this.$api.ontology
          .getOntologyService({
            ontologyId: id
          })
          .then(response => {
            if (response.code === "ok") {
              let data = {
                robotId: this.choseRobot.robotId,
                online: this.ifOntology,
                ontoUrl: response.url,
                ontoName: ""
              };
              this.ontologyList.forEach(element => {
                if (element.projectId === this.robotOntology) {
                  data.ontoName =
                    element.displayName +
                    "/" +
                    window.sessionStorage.getItem("user");
                }
              });

              this.submitOntology(data).then(res => {
                if (res.status === 200) {
                  resolve();
                } else {
                  this.$message({
                    message: res.msg,
                    type: "error",
                    duration: 1000
                  });
                  reject();
                }
              });
            } else {
              this.$message({
                message: response.msg,
                type: "error",
                duration: 1000
              });
              reject();
            }
          });
      });
    },
    //提交机器人信息
    submitRobotMsg: function() {
      this.$api.robot
        .editRobot({
          robotId: this.choseRobot.robotId,
          robotDesc: this.choseRobot.robotDesc,
          robotName: this.choseRobot.robotName,
          status: this.choseRobot.status
        })
        .then(res => {
          if (res.status === 200) {
            this.$message({
              message: "修改成功！",
              type: "success",
              duration: 1000
            });
          } else {
            this.$message({
              message: res.msg,
              type: "error",
              duration: 1000
            });
          }
        });
    },

    changeMsg: function() {
      if (this.robotOntology) {
        this.getOntologyMsg(this.robotOntology).then(() => {
          this.submitRobotMsg();
        });
      } else {
        if (this.ifOntology) {
          this.$message({
            message: "请选择语义网",
            type: "error",
            duration: 1000
          });
        } else {
          this.submitRobotMsg();
        }
      }
    },
    initOntology: function() {
      this.$api.robot
        .getRobotOntology({
          robotId: this.choseRobot.robotId
        })
        .then(res => {
          if (res.status === 200) {
            if (res.data && res.data.ontoName) {
              let ontologyName = res.data.ontoName.split("/")[0];
              this.ontologyList.forEach(e => {
                if (e.displayName === ontologyName) {
                  this.robotOntology = e.projectId;
                }
              });
              this.ifOntology = res.data.online === "true" || res.data.online;
            }
          }
        });
    }
  },
  data() {
    return {
      channels: ["微信", "企业号", "微博"],
      value2: "",
      status: "1",
      robotOntology: "",
      ifOntology: false
    };
  },
  mounted() {
    this.initOntology();
  },
  watch: {
    choseRobot: function() {
      this.status = this.choseRobot.status;
      this.initOntology();
    }
  }
};
</script>

<style lang="less">
.robotMsg {
  .top {
    .fas {
      font-size: 14px;
      color: #666;
    }
  }
  .bottom {
    padding: 0 1rem;
    padding-bottom: 1rem;
    overflow: auto;
    .content {
      padding: 0;
      width: 1000px;
      height: auto;
      .editItem {
        text-align: left;
        border-bottom: solid 1px #ddd;
        padding: 1rem;
        margin-bottom: 1rem;
        .title {
          color: #333;
          font-weight: 600;
        }
        .itemDetail {
          font-size: 14px;
          display: flex;
          align-items: center;
          margin-top: 1rem;
          color: #666;
          .intro {
            width: 10rem;
            text-align: right;
            margin-right: 1rem;
          }
          .editData {
            flex: 1;
            max-width: 20rem;
          }
        }
        .desc {
          align-items: flex-start;
        }
        .channelBox {
          align-items: flex-start;
          .editData {
            display: flex;
            flex-flow: column;
            .el-checkbox {
              margin-left: 0;
            }
          }
        }
      }
      .robotStatus {
        padding: 0;
        height: 14rem;
        display: flex;
        align-items: center;
        border: none;
        .editBlock {
          background: #fff;
          height: 100%;
          border: solid 1px #ddd;
          .title {
            height: 3rem;
            line-height: 3rem;
            padding: 0 1rem;
          }
        }
        .editBlock:nth-child(1) {
          flex: 1;
          margin-right: 1rem;
          height: 100%;
        }
        .editBlock:nth-child(2) {
          flex: 2;
        }
        .ctrl {
          display: flex;
          flex-flow: column;
          padding: 0;
          height: 100%;
          .btnBox {
            height: 3rem;
            background: #2b86f6;
            color: #fff;
            line-height: 3rem;
            text-align: center;
            cursor: pointer;
          }
          .status {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-bottom: 1.5rem;
            .iconfont {
              font-size: 48px;
              margin-right: 5px;
            }
          }
        }
        .itemDetail {
          .intro {
            width: 15rem;
            text-align: right;
            margin-right: 1rem;
          }
        }
      }
      .second {
        background: #fff;
        border: solid 1px #ddd;
      }
      .btn {
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
