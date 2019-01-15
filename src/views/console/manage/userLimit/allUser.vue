<template>
  <div class="allUser container">
    <div class="top">
      <p class="title">
        <i class="fas fa-arrow-left" @click="back"></i> 用户信息
      </p>
    </div>
    <div class="bottom">
      <div class="content">
        <div>
          <table class="gtable">
            <tr class="gheader">
              <th>用户名</th>
              <th>创建时间</th>
              <th>手机号码</th>
              <th>邮箱</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item,index) in userList" :key="index">
              <td>
                <i class="iconfont icon-yonghuquanxian1"></i>
                {{item.username}}
              </td>
              <td>{{new Date(item.appliedDate).toLocaleString()}}</td>
              <td>{{item.phone}}</td>
              <td>{{item.email}}</td>
              <td>
                <div class="ctrl">
                  <span class="view" @click="editGroupUser(item)">编辑</span>
                  <span class="view" @click="transUserGroup(item)">用户组管理</span>
                  <span class="view" @click="deleteUser(item)">删除</span>
                </div>
              </td>
            </tr>
          </table>
          <p v-if="userList.length===0" style="font-size: 14px;color: #666;margin-top: 2rem;">暂无相关用户</p>
        </div>
      </div>
    </div>

    <div class="coverBack" v-if="editShow">
      <div class="centerBox">
        <div class="title">
          <span>用户组管理</span>
          <i class="fas fa-times" aria-hidden="true" @click="editShow = false"></i>
        </div>
        <div class="content">
          <div class="flexCenter">
            <p class="intro">用户所在用户组</p>
            <el-select v-model="checkList" multiple placeholder="请选择">
              <el-option
                v-for="item in groupList"
                :key="item.groupId"
                :label="item.groupName"
                :value="item.groupId"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="btnGroup">
          <el-button @click="editShow = false">取消</el-button>
          <el-button type="primary" @click="submitGroup">确认</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "allUser",
  data() {
    return {
      userList: [],
      selectUser: "",
      editShow: false,
      checkList: []
    };
  },
  computed: {
    ...mapGetters({
      groupList: "getUserGroupList"
    })
  },
  methods: {
    back: function() {
      this.$router.go(-1);
    },
    editGroupUser: function(item) {
      window.sessionStorage.setItem("userEdit", JSON.stringify(item));

      this.$router.push({
        name: "newGroupUser",
        query: {
          type: "edit",
          userId: item.userId
        }
      });
    },
    _initData: function() {
      this.$api.user.userGroup.getALLUser().then(res => {
        if (res.status === 200) {
          this.userList = res.data;
        } else {
          this.$message({
            message: res.msg,
            type: "error",
            duration: 1000
          });
        }
      });
    },
    deleteUser: function(item) {
      this.$confirm("此操作将永久该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api.user.userGroup
          .delUser({
            subUserId: item.userId
          })
          .then(res => {
            if (res.status === 200) {
              this.$message({
                type: "success",
                duration: 1000,
                message: "删除成功!"
              });
              this._initData();
            } else {
              this.$message({
                type: "error",
                duration: 1000,
                message: res.msg
              });
            }
          });
      });
    },
    transUserGroup: function(item) {
      this.selectUser = item;
      this.$api.user.userGroup
        .getUserGroupMsg({
          userId: item.userId
        })
        .then(res => {
          if (res.status === 200) {
            this.editShow = true;
            this.checkList = [];
            res.data.forEach(e => {
              this.checkList.push(e.groupId);
            });
          }
        });
    },
    submitGroup: function() {
      let len = this.checkList.length;
      let ids = "";
      this.checkList.forEach((e, index) => {
        if (index !== 0) {
          ids += "," + e;
        } else {
          ids = e;
        }
      });

      this.$api.user.userGroup
        .changeUserGroup({
          groupIds: ids,
          userId: this.selectUser.userId
        })
        .then(res => {
          if (res.status === 200) {
            this.$message({
              type: "success",
              duration: 1000,
              message: "修改成功!"
            });
            this.editShow = false;
          } else {
            this.$message({
              type: "error",
              duration: 1000,
              message: res.msg
            });
          }
        });
    }
  },
  mounted() {
    this._initData();
  },
  watch: {
    $route: function() {
      if (this.$route.name === "allUser") {
        this._initData();
      }
    }
  }
};
</script>

<style lang="less">
.allUser {
  .bottom {
    padding: 0 1rem;
    .content {
      background: #fff;
      padding: 1rem;
    }
  }
  .coverBack {
    .centerBox {
      height: 20rem;
    }
    .content {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      text-align: left;
      .intro {
        margin-right: 10px;
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>
