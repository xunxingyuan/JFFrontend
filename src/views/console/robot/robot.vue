<template>
  <div class="robot">
    <robot-top @createRobot="createRobot"></robot-top>
    <keep-alive>
      <router-view />
    </keep-alive>

    <edit-robot :typeData="createState" v-if="robotEdit" @close="robotEdit = false" @save="submitCreate"></edit-robot>
  </div>
</template>

<script>
  import RobotTop from "../../../components/header/robotTop.vue";
  import { mapGetters, mapActions } from 'vuex'
  import EditRobot from "../../../components/console/robot/editRobot.vue";

  export default {
    components: {
      EditRobot,
      RobotTop
    },
    name: 'robot',
    computed:{
      ...mapGetters({
        robotList: 'getRobotList',
        userNav: 'getUserMenu'
      })
    },
    methods:{
      _initData: function () {
        let route = this.$route
        let userId = window.sessionStorage.getItem('userId')


        if(!route.params.id&&this.$route.name==='robot'){
          if(this.robotList.length>0){
            this.$store.dispatch('setSelectRobot',this.robotList[0])
            window.sessionStorage.setItem('robotId',this.robotList[0].robotId)
            let flag = ''
            this.userNav.forEach((e)=>{
              if(e.url){
                flag = flag ? flag : e.url
              }else{
                e.child.forEach((ele)=>{
                  if(ele.url){
                    flag = flag ? flag : ele.url
                  }
                })
              }
            })
            if(flag){
              this.$router.push({
                path: '/console/robot/'+ this.robotList[0].robotId +'/' + flag
              })
            }else{
              this.$message({
                message: '当前用户无任何权限！',
                type: 'info',
                duration: 1000
              });
//              this.$router.go(-1)
            }
          }
        }
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
              message: res.data.msg,
              type: 'success',
              duration: 1000
            });
          }
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
    mounted(){
      this._initData()
    },
    watch:{
      robotList: function () {
        this._initData()
      }
    }
  }
</script>

<style lang="less">
  .robot{
    height: 100%;
    display: flex;
    flex-flow: column;
    .tips{
      color: #666;
      margin-top: 3rem;
    }
  }
</style>
