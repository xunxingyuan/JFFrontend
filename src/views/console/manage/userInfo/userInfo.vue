<template>
  <div class="userInfo container">
    <div class="top">
      <p class="title">个人信息</p>
    </div>
    <div class="bottom">
      <div class="content tagContainBox">
        <div class="tagItem">
          <span :class="{'active': choseTag.name === item.name}" v-for="(item,index) in tagList" @click="choseItem(item,index)">{{item.name}}</span>
          <div class="tagBottomLine"></div>
        </div>
        <div class="tagContain" v-if="activeIndex === 0">
          <div class="inputInner">
            <p class="name">用户ID</p>
            <el-input class="input unactive" v-model="userInfo.userId" readonly></el-input>
          </div>
          <div class="inputInner">
            <p class="name">邮箱</p>
            <el-input class="input unactive" v-model="userInfo.email" readonly></el-input>
          </div>
          <div class="inputInner">
            <p class="name">用户头像</p>
            <div class="input flex" style="align-items: center;">
              <img v-if="userInfoData.icon" class="icon" :src="userInfoData.icon"  />
              <span v-else class="icon icons_user_new"></span>
              <div class="change">
                <span>修改头像</span>
                <input type="file" ref="uploadFile" class="uploadFile" accept="image/*" @change="processFile($event)" />
              </div>
              <span class="change" @click="userInfoData.icon = ''">恢复默认</span>
            </div>
          </div>
          <div class="inputInner">
            <p class="name">用户名</p>
            <el-input class="input unactive" v-model="userInfo.username" readonly></el-input>
          </div>
          <!--<div class="inputInner">-->
            <!--<p class="name">真实姓名</p>-->
            <!--<el-input class="input " v-model="userInfoData.trueName"></el-input>-->
          <!--</div>-->
          <div class="inputInner">
            <p class="name">修改时间</p>
            <span class="input">{{new Date(userInfo.appliedDate).toLocaleString()}}</span>
          </div>
          <div class="inputInner">
            <p class="name">所属用户组</p>
            <span class="input"></span>
          </div>
          <div class="inputInner">
            <p class="name"></p>
            <span class="input">
              <el-button type="primary" @click="saveUserInfo">保存</el-button>
            </span>
          </div>
        </div>
        <div class="tagContain" v-if="activeIndex === 1">
          <div class="inputInner">
            <p class="name">当前密码</p>
            <el-input class="input" type="password" v-model="passwordData.old"></el-input>
          </div>
          <div class="inputInner">
            <p class="name">新密码</p>
            <el-input class="input" type="password" v-model="passwordData.new1"></el-input>
          </div>
          <div class="inputInner">
            <p class="name">确认新密码</p>
            <el-input class="input" type="password" v-model="passwordData.new2"></el-input>
          </div>
          <div class="inputInner">
            <p class="name"></p>
            <span class="input">
              <el-button type="primary" @click="changePassword">保存</el-button>
            </span>
          </div>
        </div>
        <div class="tagContain" v-if="activeIndex === 2">
          <div class="inputInner">
            <p class="name">当前手机号码</p>
            <el-input class="input unactive" v-model="userInfo.phone" readonly></el-input>
          </div>
          <div class="inputInner">
            <p class="name">新手机号码</p>
            <el-input class="input"></el-input>
          </div>
          <div class="inputInner">
            <p class="name">验证码</p>
            <div class="input flex">
              <el-input></el-input>
              <el-button>发送</el-button>
            </div>
          </div>
          <div class="inputInner">
            <p class="name"></p>
            <span class="input">
              <el-button type="primary">保存</el-button>
            </span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import md5 from 'js-md5'

  export default {
    name: 'userInfo',
    data(){
      return {
        tagList:[{
          name: '基本信息'
        },{
          name: '密码修改'
        },{
          name: '手机号修改'
        }],
        choseTag: {
          name: '基本信息'
        },
        activeIndex: 0,
        userInfoData:{
          id: '1000001',
          mail: 'giantan@qq.com',
          name: 'gde',
          icon: '',
          trueName: '张三',
          time: '永久',
          group: '管理员'
        },
        upload: '',
        passwordData:{
          old: '',
          new1: '',
          new2: ''
        },
        userInfo: {
          appliedDate: 1542339280321,
          email: "",
          notified: true,
          password: "",
          phone: '',
          status: 1,
          userId: "",
          username: "",
          verifiedDate: '',
        }
      }
    },
    methods:{
      choseItem: function (item,index) {
        this.choseTag = item
        this.activeIndex = index
      },
      processFile: function (e) {
        console.log(e)
        let _self = this
        this.upload = e.target.files[0]
        this.userInfoData.icon = URL.createObjectURL(this.upload);
      },
      changePassword: function () {
        if(this.passwordData.old.trim()&&this.passwordData.new1.trim()&&this.passwordData.new2.trim()){
          if(this.passwordData.new1 === this.passwordData.new2){
            if(this.passwordData.new1.length>=6){
              this.$api.user.updateUser({
                userId: this.userInfo.userId,
//                username: this.userInfo.username,
                oldPassword: md5.base64(this.passwordData.old),
                password: md5.base64(this.passwordData.new1)
              }).then((res)=>{
                if(res.status === 200){
                  this.$message({
                    type: 'success',
                    message: '更新密码成功',
                    duration: 1000
                  });
                }else{
                  this.$message({
                    type: 'error',
                    message: res.msg,
                    duration: 1000
                  });
                }
              })
            }else{
              this.$message({
                type: 'info',
                message: '密码需要6位及以上',
                duration: 1000
              });
            }
          }else{
            this.$message({
              type: 'info',
              message: '新密码不一致',
              duration: 1000
            });
          }

        }else{
          this.$message({
            type: 'info',
            message: '输入项不能为空',
            duration: 1000
          });
        }
      },
      saveUserInfo: function () {
        this.$store.dispatch('setUserIcon',this.userInfoData.icon)
      }
    },
    mounted(){
      this.userInfo =  JSON.parse(window.sessionStorage.getItem('userInfo'))
    }
  }
</script>

<style lang="less">
.userInfo{
  .bottom{
    padding: 0 1rem;
    .content{
      padding: 0;
      .tagContain{
        padding-top: 2rem;
        .inputInner{
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          .name{
            width: 8rem;
            text-align: right;
            margin-right: 1rem;
            color: #666;
          }
          .input{
            width: 25rem;
            font-size: 14px;
            .icon{
              width: 45px;
              height: 45px;
              border-radius: 22.5px;
            }
            .change{
              margin-left: 1rem;
              color: #2B86F6;
              font-size: 14px;
              cursor: pointer;
              position: relative;
              .uploadFile{
                position: absolute;
                width: 100%;
                height: 100%;
                opacity: 0;
                left: 0;
                top: 0;
              }
            }
          }
          .unactive{
            input{
              background: #EEEEEE;
              border: solid 1px #ddd;
            }
          }
        }
      }
    }
  }
}
</style>
