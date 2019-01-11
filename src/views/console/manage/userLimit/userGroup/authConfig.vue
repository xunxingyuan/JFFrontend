<template>
  <div class="authConfig flex">
    <div class="settingType">
      <el-checkbox-group v-model="robotChoseList" @change="robotListChange">
        <div
          class="typeItem"
          v-for="(item,index) in robotList"
          :class="{'active': selectRobot === item}"
          @click.stop="choseRobot(item)"
          :key="index"
        >
          <el-checkbox :label="item.robotName">{{item.robotName}}</el-checkbox>
        </div>
      </el-checkbox-group>
    </div>
    <div class="settingContent">
      <!--<el-checkbox-group v-model="checkList" @change="authListChange">-->
      <!--<div class="contentMenu">-->
      <!--<el-checkbox label="首页"></el-checkbox>-->
      <!--</div>-->
      <!--</el-checkbox-group>-->
      <el-checkbox-group v-model="checkList" @change="authListChange">
        <div class="contentMenu">
          <el-checkbox label="会话管理"></el-checkbox>
        </div>
      </el-checkbox-group>
      <div class="authContent" style="margin-bottom: 10px" v-if="checkList.indexOf('会话管理')>-1">
        <select-auth @authChanged="authChanged" :categoryData="categoryData" :auth="editAuth"></select-auth>
      </div>
      <el-checkbox-group v-model="checkList" @change="authListChange">
        <div class="contentMenu">
          <el-checkbox label="统计分析"></el-checkbox>
          <div class="authContent second">
            <el-checkbox-group
              v-model="countList"
              @change="secondChange"
              :disabled="checkList.indexOf('统计分析')===-1"
            >
              <el-checkbox label="未识别问题"></el-checkbox>
              <el-checkbox label="业务量统计"></el-checkbox>
              <el-checkbox label="转人工量"></el-checkbox>
              <el-checkbox label="热点"></el-checkbox>
              <el-checkbox label="应答准确率自检"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-checkbox-group>
      <el-checkbox-group v-model="checkList" @change="authListChange">
        <div class="contentMenu">
          <el-checkbox label="机器人设置"></el-checkbox>
          <div class="authContent second">
            <el-checkbox-group
              v-model="countList"
              @change="secondChange"
              :disabled="checkList.indexOf('机器人设置')===-1"
            >
              <el-checkbox label="敏感词管理"></el-checkbox>
              <el-checkbox label="同义词管理"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import SelectAuth from "./selectAuth.vue";

export default {
  components: { SelectAuth },
  name: "authConfig",
  props: ["robotList", "edit"],
  data() {
    return {
      robotChoseList: [],
      selectRobot: "",
      checkList: [],
      categoryData: "",
      countList: [],
      robotAuthList: [],
      selectAuth: "",
      //正在编辑的权限
      editAuth: {
        botId: "",
        categoryPermissions: [],
        menuIds: []
      },
      //权限确认
      authResult: [],
      //目录标示
      menuTag: [
        {
          name: "首页",
          tag: 1
        },
        {
          name: "会话管理",
          tag: 2
        },
        {
          name: "统计分析",
          tag: 3
        },
        {
          name: "机器人设置",
          tag: 4
        }
      ],
      //二级目录
      secondMenuTag: [
        {
          name: "未识别问题",
          tag: 31
        },
        {
          name: "业务量统计",
          tag: 32
        },
        {
          name: "转人工量",
          tag: 33
        },
        {
          name: "热点",
          tag: 34
        },
        {
          name: "应答准确率自检",
          tag: 35
        },
        {
          name: "敏感词管理",
          tag: 41
        },
        {
          name: "同义词管理",
          tag: 42
        }
      ]
    };
  },
  methods: {
    //authChange
    menuSelectChange: function() {
      this.authResult.forEach(e => {
        if (e.botId === this.editAuth.botId) {
          e.conversationPermissions = this.editAuth.categoryPermissions;
          e.menuIds = this.editAuth.menuIds;
        }
      });
      this.emitAuthResult();
    },
    //推送变更到结果
    emitAuthResult: function() {
      let result = [];
      this.robotList.forEach(e => {
        this.robotChoseList.forEach(ele => {
          if (ele === e.robotName) {
            this.authResult.forEach(ele1 => {
              if (ele1.botId === e.robotId) {
                result.push(ele1);
              }
            });
          }
        });
      });
      this.$emit("authChange", result);
    },

    //选择变更
    authListChange: function() {
      //        console.log(this.checkList)
      //this.editAuth.menuIds
      this.editAuth.menuIds = [];
      this.countList.forEach(e => {
        this.secondMenuTag.forEach(ele => {
          if (ele.name === e) {
            this.editAuth.menuIds.push(ele.tag);
          }
        });
      });
      this.checkList.forEach(e => {
        this.menuTag.forEach(ele => {
          if (ele.name === e) {
            this.editAuth.menuIds.push(ele.tag);
          }
        });
      });
      this.menuSelectChange();
    },
    //二级目录变更
    secondChange: function() {
      //        console.log(this.countList)
      this.editAuth.menuIds = [];
      this.checkList.forEach(e => {
        this.menuTag.forEach(ele => {
          if (ele.name === e) {
            this.editAuth.menuIds.push(ele.tag);
          }
        });
      });
      this.countList.forEach(e => {
        this.secondMenuTag.forEach(ele => {
          if (ele.name === e) {
            this.editAuth.menuIds.push(ele.tag);
          }
        });
      });
      this.menuSelectChange();
    },
    //机器人选择变更
    robotListChange: function() {
      //        console.log(this.robotChoseList)
      this.emitAuthResult();
    },
    //检查是否存在
    checkExit: function(arr, name, id) {
      let flag = false;
      arr.forEach((e, index) => {
        if (e[name] === id) {
          flag = index + 1;
          return flag;
        }
      });
      return flag;
    },
    choseRobot: function(item) {
      this.selectRobot = item;
      let checkResult = this.checkExit(this.authResult, "botId", item.robotId);
      if (checkResult) {
        this.editAuth = JSON.parse(
          JSON.stringify(this.authResult[checkResult - 1])
        );
        this.countList = [];
        this.checkList = [];

        this.editAuth.menuIds.forEach(e => {
          if (parseInt(e) < 10) {
            this.menuTag.forEach(ele => {
              if (ele.tag === parseInt(e)) {
                this.checkList.push(ele.name);
              }
            });
          } else {
            this.secondMenuTag.forEach(ele => {
              if (ele.tag === parseInt(e)) {
                this.countList.push(ele.name);
              }
            });
          }
        });
      } else {
        this.editAuth = {
          botId: item.robotId,
          categoryPermissions: [],
          menuIds: []
        };
        this.countList = [];
        this.checkList = [];
        this.authResult.push(this.editAuth);
      }
      this.getMenu();
      window.sessionStorage.setItem("robotId", item.robotId);
    },
    getRobotAuth: function(robotId) {
      return new Promise((resolve, reject) => {
        this.$api.user.userGroup
          .getGroupAuth({
            groupId: this.$route.query.groupId,
            botId: robotId
          })
          .then(res => {
            if (res.status === 200) {
              this.authResult.push(res.data);

              resolve();
            } else {
              reject();
            }
          });
      });
    },
    authChanged: function(val) {
      this.editAuth.categoryPermissions = val;
      this.menuSelectChange();
    },
    getAllAuth: function() {
      return new Promise((resolve, reject) => {
        let count = 0;
        this.robotList.forEach(e => {
          this.getRobotAuth(e.robotId).then(() => {
            count += 1;
            if (count === this.robotList.length) {
              resolve();
            }
          });
        });
      });
    },
    _initData: function() {
      this.authResult = [];
      this.robotChoseList = [];
      this.robotList.forEach(e => {
        this.robotChoseList.push(e.robotName);
      });

      this.getAllAuth().then(() => {
        this.choseRobot(this.robotList[0]);
        this.getMenu();
      });
    },
    getMenu: function() {
      if (!this.selectRobot) {
        this.selectRobot = this.robotList[0];
      }
      this.authResult.forEach(e => {
        if (e.botId === this.selectRobot.robotId) {
          this.editAuth = e;
          this.$api.user.menu
            .getAllMenu({
              botId: this.selectRobot.robotId
            })
            .then(res => {
              if (res.status === 200) {
                this.categoryData = res.data;
              }
            });
        }
      });
    }
  },
  mounted() {
    if (this.robotList.length > 0) {
      this._initData();
    }
  },
  watch: {
    $route: function() {
      if (this.$route.name === "newGroup") {
        this._initData();
      }
    }
  }
};
</script>

<style lang="less">
.authConfig {
  font-size: 14px;
  height: auto;
  /*max-height: 35rem;*/
  .settingType {
    width: 9rem;
    .typeItem {
      height: 40px;
      margin-bottom: 10px;
      line-height: 40px;
      border: solid 1px #ddd;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      background: #f4f4f4;
    }
    .active {
      background: #fff;
      border-right: solid 1px #fff;
      position: relative;
    }
    .active::before {
      content: "";
      height: 100%;
      width: 1px;
      background: #fff;
      position: absolute;
      right: -1px;
      top: 0;
    }
  }
  .settingContent {
    margin-left: -1px;
    flex: 1;
    height: 100%;
    border: solid 1px #ddd;
    padding: 1rem;
    /*display: flex;*/
    /*flex-flow: column;*/
    .contentMenu {
      text-align: left;
      margin-bottom: 1rem;
      .authContent {
        flex: 1;
        width: 100%;
        overflow: auto;
        margin-top: 10px;
      }
      .second {
        border: solid 1px #ddd;
        min-height: 40px;
        display: flex;
        align-items: center;
        padding-left: 1rem;
      }
    }
    .authList {
      width: 100%;
      min-height: 40px;
      height: 40px;
      border: solid 1px #ddd;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      margin-bottom: 1rem;
    }
  }
}
</style>
