<template>
  <div class="console">
    <router-view/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "console",
  computed: {
    ...mapGetters({
      userAuth: "getUserAuth"
    })
  },
  data() {
    return {
      resultNav: [],
      navList: [
        {
          name: "会话管理",
          icon: "icon-huihuaguanli",
          url: "",
          showChild: true,
          id: 2,
          child: [
            {
              name: "多轮会话",
              url: "scene",
              path: "robot",
              id: 21
            },
            {
              name: "一问一答",
              url: "qa",
              path: "robot",
              id: 22
            },
            {
              name: "寒暄",
              url: "greeting",
              path: "robot",
              id: 23
            }
            //            {
            //              name: '会话设置',
            //              url: 'qaSetting',
            //              path: 'robot'
            //            }
          ]
        },
        //          {
        //            name:'服务管理',
        //            icon: 'icon-fuwuguanli',
        //            url: 'robotService',
        //            showChild: false,
        //            child: [],
        //            path: 'robot'
        //          },
        {
          name: "统计分析",
          icon: "icon-tongjiyouhua",
          showChild: true,
          id: 3,
          url: "",
          child: [
            {
              name: "未识别问题",
              url: "unknownQuestion",
              src: "robot",
              path: "robot",
              id: 31
            },
            {
              name: "业务量统计",
              url: "serviceCount",
              src: "robot",
              path: "robot",
              id: 32
            },
            {
              name: "转人工量",
              url: "transPerson",
              src: "robot",
              path: "robot",
              id: 33
            },
            {
              name: "热点",
              url: "hotPoint",
              src: "robot",
              path: "robot",
              id: 34
            },
            {
              name: "应答准确率自检",
              url: "qualityAnalysis",
              src: "robot",
              path: "robot",
              id: 35
            }
          ]
        },
        //          {
        //          name:'语义网',
        //          icon: 'icon-changjinglinghuo',
        //          url: 'ontology',
        //          showChild: false,
        //          child: [],
        //          path: 'robot'
        //        },
        {
          name: "机器人设置",
          icon: "icon-jiqiren",
          url: "",
          showChild: true,
          id: 4,
          child: [
            {
              name: "敏感词管理",
              url: "sensitiveWord",
              src: "robot",
              path: "robot",
              id: 41
            },
            {
              name: "同义词管理",
              url: "nearWord",
              src: "robot",
              path: "robot",
              id: 42
            }
          ]
        }
        //          {
        //          name:'通用设置',
        //          icon: 'icon-shezhi',
        //          url: 'commonSetting',
        //          showChild: false,
        //          child: [],
        //          path: 'robot'
        //        }
      ]
    };
  },
  methods: {
    _initData: function() {
      this.$api.robot.getList().then(res => {
        if (res.status === 200) {
          this.$store.dispatch("setRobotList", res.data);
          this.$api.user.userGroup.getUserAuth().then(resp => {
            if (resp.status === 200) {
              let auth = {};
              if (role !== "admin") {
                auth = {
                  admin: false,
                  data: resp.data
                };
              } else {
                auth = {
                  admin: true,
                  data: resp.data
                };
              }
              this.$store.dispatch("setUserAuth", auth);
              this._initAuthData(auth);
            } else {
              this.$message({
                type: "error",
                message: resp.msg,
                duration: 1000
              });
            }
          });
        }
      });
      this.$api.ontology.setSemanticTree("", "get").then(res => {
        if (res.code === "ok") {
          this.$store.dispatch("setOntologyList", res.projects);
        }
      });

      let userId =
        window.sessionStorage.getItem("userId") || this.$route.query.userId;
      let role = window.sessionStorage.getItem("userRole");
    },
    _initAuthData: function(userAuth) {
      let robotId =
        window.sessionStorage.getItem("robotId") || this.$route.query.robotId;
      this.resultNav = [];
      if (userAuth.admin) {
        this.resultNav = this.navList;
      } else {
        let list = userAuth.data.menuAuthority[robotId];
        if (list) {
          this.navList.forEach(e => {
            if (list.indexOf(e.id.toString()) !== -1) {
              let result = JSON.parse(JSON.stringify(e));
              result.child = [];
              e.child.forEach(ele => {
                if (list.indexOf(ele.id.toString()) !== -1) {
                  result.child.push(ele);
                }
              });
              if (e.id === 2) {
                let qaAuth = userAuth.data.categoryAuthority[robotId];
                if (qaAuth) {
                  qaAuth.forEach(ele => {
                    if (ele.conversationType === "scene") {
                      result.child.push({
                        name: "多轮会话",
                        url: "scene",
                        path: "robot",
                        id: 21
                      });
                    } else if (ele.conversationType === "qa") {
                      result.child.push({
                        name: "一问一答",
                        url: "qa",
                        path: "robot",
                        id: 22
                      });
                    } else if (ele.conversationType === "greeting") {
                      result.child.push({
                        name: "寒暄",
                        url: "greeting",
                        path: "robot",
                        id: 23
                      });
                    }
                  });
                }
              }
              this.resultNav.push(result);
            }
          });
        }
      }
      this.$store.dispatch("setUserMenu", this.resultNav);
    },
    _initAuth: function() {
      this._initAuthData(this.userAuth);
    }
  },
  mounted() {
    this._initData();
  },

  watch: {
    $route: function() {
      this._initAuth();
    }
  }
};
</script>

<style lang="less">
.console {
  height: 100%;
}
</style>
