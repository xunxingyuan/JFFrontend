<template>
  <div class="robotManage container">
    <div class="top">
      <p class="title">机器人管理</p>
    </div>
    <div class="bottom">
      <div class="robotBox">
        <div class="robotItem" v-for="item in robotList">
          <div class="title">{{item.robotName}}</div>
          <div class="ctrl">
            <div class="flexCenter first">
              <p>运行状态</p>
              <span v-if="item.status==='2'" @click="unpublishRobot(item)">已发布</span>
              <span class="unwork" v-if="item.status==='1'" @click="publishRobot(item)">未发布</span>
            </div>
            <div class="flexCenter">
              <p>同步状态</p>
              <span v-if="item.sync==='1'">已同步</span>
              <span class="unwork" v-if="item.sync==='0'" @click="syncRobot(item)">未同步</span>
            </div>
            <!--<span class="view" @click="manageRobot(item)">管理</span>-->
            <!--<span v-if="item.status==='1'" class="view" @click="publishRobot(item)">发布</span>-->
            <!--<span v-if="item.status==='2'" class="view" @click="unpublishRobot(item)">取消发布</span>-->
            <!--<span class="del" @click="delRobot(item)">删除</span>-->
          </div>
          <div class="status">
            <span @click="editRobotMsg(item)">配置</span>
            <span class="del" @click="delRobot(item)">删除</span>
            <!--<div class="unsync" v-if="item.sync==='0'">未同步,<span class="btn" @click="syncRobot(item)">立即同步</span></div>-->
            <!--<div v-if="item.sync==='1'" class="sync">已同步</div>-->
          </div>
        </div>
        <div class="robotItem add" @click="createRobot">
          <i class="fas fa-plus"></i>
          <p>添加机器人</p>
        </div>
      </div>

    </div>
    <edit-robot :typeData="createState" v-if="robotEdit" @close="robotEdit = false" @save="submitCreate"></edit-robot>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import EditRobot from "../../../../components/console/robot/editRobot.vue";

  export default {
    components: {EditRobot},
    name: 'robotManage',
    computed:{
      ...mapGetters({
        robotList: 'getRobotList',
        choseRobot: 'getSelectRobot'
      })
    },
    methods:{
      _initData: function () {
        this.$api.robot.getList().then((res)=>{
          if(res.status === 200){
            this.$store.dispatch('setRobotList',res.data)
          }
        })
      },
      createRobot: function () {
        this.robotEdit = true
      },
      submitCreate: function (data) {
        this.$api.robot.create(data).then((res)=>{
          if(res.status === 200){
            this.$message({
              message: '新增成功',
              type: 'success',
              duration: 1000
            });
            this._initData()
          }else{
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1000
            });
          }
        })
      },
      delRobot: function (item) {
        this.$confirm('此操作将永久删除该机器人, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$api.robot.delRobot({
            robotId: item.robotId
          }).then((res)=>{
            if(res.status === 200){
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 1000
              });
              this._initData()
            }else{
              this.$message({
                message: res.msg,
                type: 'error',
                duration: 1000
              });
            }
          })
        })
      },
      syncRobot: function (item) {
        this.$api.robot.syncRobot({
          robotId: item.robotId
        }).then((res)=>{
          if(res.status === 200){
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1000
            });
          }else{
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1000
            });
          }
          this._initData()
        })
      },
      unpublishRobot: function (item) {
        this.$confirm('此操作将取消发布该机器人, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$api.robot.unPublishRobot({
            robotId: item.robotId
          }).then((res)=>{
            if(res.status === 200){
              this.$message({
                message: '取消发布成功',
                type: 'success',
                duration: 1000
              });
            }else{
              this.$message({
                message: res.msg,
                type: 'error',
                duration: 1000
              });
            }
            this._initData()
          })
        })
      },
      publishRobot: function (item) {
        this.$confirm('此操作将发布该机器人, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$api.robot.publishRobot({
            robotId: item.robotId
          }).then((res)=>{
            if(res.status === 200){
              this.$message({
                message: '发布成功！',
                type: 'success',
                duration: 1000
              });
            }else{
              this.$message({
                message: res.msg,
                type: 'error',
                duration: 1000
              });
            }
            this._initData()
          })
        })
      },
      manageRobot: function (item) {
        this.$store.dispatch('setSelectRobot',item)
        window.sessionStorage.setItem('robotId',item.robotId)
        this.$router.push({
          path: '/console/robot/'+ item.robotId +'/robotService'
        })
      },
      editRobotMsg: function (item) {
        this.$store.dispatch('setSelectRobot',item)
        window.sessionStorage.setItem('robotId',item.robotId)
        this.$router.push({
          name: 'robotMsg'
        })
      }
    },
    data(){
      return {
        robotEdit: false,
        createState: {
          create: true,
          data: ''
        },
      }
    },
    mounted(){}
  }
</script>

<style lang="less">
  @import "../../../../styles/common";
  .robotManage{
    .bottom{
      height: 100%;
      padding: 1rem;
      padding-top: 0;
      .robotBox{
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
        align-items: flex-start;
        justify-content: flex-start;
        background: #fff;
        align-content: flex-start;
        padding: 2.5rem 1rem 1rem 1rem;
        .robotItem:hover{
          box-shadow: 0 0 4px 4px @gray;
        }
        .robotItem{
          width: 18rem;
          height: 12rem;
          min-height: 12rem;
          border: solid 1px #ddd;
          margin-right: 1rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 0 2px 2px @gray;
          border-radius: 2px;
          position: relative;
          .title{
            position: absolute;
            top: -1.5rem;
            left: 5.5rem;
            width: 7rem;
            height: 3rem;
            background: #505050;
            border-radius: 1.5rem;
            text-align: center;
            color: #fff;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            line-height: 3rem;
          }
          .ctrl{
            height: 9rem;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            padding-top: 1.5rem;
            color: #666;
            font-size: 14px;
            .first{
              margin-bottom: 1.5rem;
            }
            span{
              color: @green;
              cursor: pointer;
              margin-left: 2rem;
            }
            .unwork{
              color: #000;
            }
            .unwork:hover{
              color: @blue;
            }
            .view{
              margin-right: 1rem;
            }
          }
          .status{
            height: 3rem;
            display: flex;
            justify-content: center;
            align-items: center;
            border-top: solid 1px #ddd;
            font-size: 14px;
            color: #666;
            span{
              flex: 1;
              line-height: 3rem;
              height: 100%;
              color: @blue;
              cursor: pointer;
            }
            .del{
              color: @black;
              border-left: solid 1px #ddd;
            }
          }
        }
        .add{
          display: flex;
          align-items: center;
          justify-content: center;
          flex-flow: column;
          color: @blue;
          font-size: 24px;
          cursor: pointer;
          p{
            margin-top: 1rem;
            font-size: 18px;
          }
        }
      }
    }
  }
</style>