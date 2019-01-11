<template>
  <div class="groupDetail container">
    <div class="top">
      <p class="title">
        <i class="fas fa-arrow-left" @click="back"></i> 用户信息
      </p>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="flex">
          <el-button type="primary" @click="newGroupUser">+新增用户</el-button>
        </div>
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
                  <span class="view" @click="deleteGroupUser(item)">删除</span>
                </div>
              </td>
            </tr>
          </table>
          <p v-if="userList.length===0" style="font-size: 14px;color: #666;margin-top: 2rem;">暂无相关用户</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "groupDetail",
  data() {
    return {
      userList: []
    };
  },
  methods: {
    back: function() {
      this.$router.go(-1);
    },
    newGroupUser: function() {
      this.$router.push({
        name: "newGroupUser",
        query: {
          groupId: this.$route.query.groupId
        }
      });
    },
    editGroupUser: function(item) {
      window.sessionStorage.setItem("userEdit", JSON.stringify(item));
      this.$router.push({
        name: "newGroupUser",
        query: {
          type: "edit",
          groupId: this.$route.query.groupId,
          userId: item.userId
        }
      });
    },
    deleteGroupUser: function(item) {
      this.$confirm(
        "此操作将从用户组删除该用户（不会删除该用户）, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$api.user.userGroup
          .delGroupUser({
            userId: item.userId,
            groupId: this.$route.query.groupId
          })
          .then(res => {
            if (res.status === 200) {
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
              this._initData();
            } else {
              this.$message({
                message: res.msg,
                type: "error",
                duration: 1000
              });
            }
          });
      });
    },
    _initData: function() {
      this.$api.user.userGroup
        .getGroupUserList({
          groupId: this.$route.query.groupId
        })
        .then(res => {
          if (res.status === 200) {
            this.userList = res.data;
          }
        });
    }
  },
  mounted() {
    this._initData();
  },
  watch: {
    $route: function() {
      if (this.$route.name === "groupDetail") {
        this._initData();
      }
    }
  }
};
</script>

<style lang="less">
.groupDetail {
  .bottom {
    padding: 0 1rem;
    .content {
      background: #fff;
      padding: 1rem;
    }
  }
}
</style>
