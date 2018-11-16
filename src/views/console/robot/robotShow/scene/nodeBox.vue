<template>
  <div class="nodeBox">
    <div v-if="Array.isArray(nodeData)" v-for="(node,index) in nodeData" class="nodeContain flex" :class="checkPosition(index,nodeData.length)">
      <div class="lineBox">
        <span class="midLine"></span>
        <span class="leftTopLine"></span>
        <span class="leftBotLine"></span>
        <span class="leftMidLine"></span>
        <div class="arrow"></div>
      </div>
      <!--跳转问题-->
      <div :nodeId="node.nodeId" class="nodeBlock scenes" @click="changeQuestion(node,nodeData)" v-if="node.hasOwnProperty('question')">
        <p class="top">场景：{{node.scenesName}}</p>
        <p class="mid" v-html="node.question"></p>
        <div class="bot">
          <i @click.stop="delFilter(node)" class="fa fa-trash-o" aria-hidden="true"></i>
        </div>
        <node-cover :node="node"></node-cover>
        <i class="fa icons_jump_scenes"></i>
      </div>
      <!--&lt;!&ndash;最终回答&ndash;&gt;-->
      <!--<div :nodeId="node.answerId" class="nodeBlock answer" @dblclick = "doubleClick" @click="changeQuestion(node,nodeData)" v-else-if="node.hasOwnProperty('answer')&&node.answer!==null&&node.nodeType===1" :class="{'active': selectQuestion.hasOwnProperty('answer')&&selectQuestion.answerId=== node.answerId }">-->
        <!--<p class="top">结果回答</p>-->
        <!--<p class="mid" ><i class="fa icons_robot"></i><span v-html="node.content"></span></p>-->
        <!--<div class="bot">-->
          <!--<i @click.stop="testQuestion(node)" class="fa fa-play-circle" aria-hidden="true"></i>-->
          <!--<i @click.stop="delFilter(node)" class="fa fa-trash-o" aria-hidden="true"></i>-->
        <!--</div>-->
        <!--<node-cover :node="node"></node-cover>-->
      <!--</div>-->
      <!--机器回答-->
      <div :nodeId="node.nodeId" class="nodeBlock reply" @dblclick = "doubleClick" @click="changeQuestion(node,nodeData)" v-else-if="node.nodeType=== 0" :ref="node.nodeId" :class="{'active': selectQuestion.nodeId=== node.nodeId}">
        <div class="topContain">追问</div>
        <div class="midContain"><i class="fa icons_robot"></i><span v-html="node.content"></span></div>
        <div class="botContain">
          <i @click.stop="delFilter(node)" class="fas fa-trash" aria-hidden="true"></i>
        </div>
        <node-cover :node="node"></node-cover>
      </div>
      <!--回答条件-->
      <div :nodeId="node.nodeId" class="nodeBlock condition" @dblclick = "doubleClick" @click="changeQuestion(node,nodeData)" v-else :ref="node.nodeId" :class="{'active': !selectQuestion.hasOwnProperty('answerId') && selectQuestion.nodeId === node.nodeId}">
        <div class="topContain" v-if="node.nodeType=== 1||node.nodeType=== 2">单选选项</div>
        <div class="topContain" v-else-if="node.nodeType=== 3">多选选项</div>
        <div class="topContain" v-else-if="node.nodeType=== 4">文本输入</div>
        <div class="topContain" v-else-if="node.nodeType=== 5">时间输入</div>
        <div class="topContain" v-else-if="node.nodeType=== 6">地址输入</div>
        <div class="topContain" v-else>选项</div>

        <div class="midContain" v-html="node.content"></div>
        <div class="botContain">
          <!--<i @click.stop="testQuestion(node)" class="fa fa-play-circle" aria-hidden="true"></i>-->
          <i @click.stop="delFilter(node)" class="fas fa-trash" aria-hidden="true"></i>
        </div>
        <node-cover :node="node"></node-cover>
      </div>
      <div class="lineBox">
        <span class="midLine" v-if="(node.nodes!==null&&node.nodes!==undefined&&node.nodes.length!==0)||(node.jumpTo!== -1&&node.jumpTo!== '-1'&&node.jumpTo!== null&&node.jumpTo!== 'null'&&node.jumpTo!== undefined)||node.answer!==null"></span>
        <span class="rightTopLine" v-if="node.answer===null"></span>
        <div class="resize" v-if="node.nodes!==null&&node.nodes!==undefined&&node.nodes.length!==0">
          <i v-if="node.cover" class="fa icons_resize_reduce_new" @click="changeShow(node)"></i>
          <i  class="fa icons_resize_add_new" @click="changeShow(node)" v-else></i>
        </div>
      </div>
      <node-box v-if="node.nodes!==null&&!node.cover" :nodeData = node.nodes></node-box>
      <node-box v-if="node.answer!==null&&!node.cover" :nodeData = node.answer></node-box>

    </div>
    <div v-if="!Array.isArray(nodeData)" class="flex">
      <div class="lineBox">
        <span class="midLine"></span>
        <!--<span class="leftTopLine"></span>-->
        <!--<span class="leftBotLine"></span>-->
        <span class="leftMidLine"></span>
        <div class="arrow"></div>
      </div>
      <!--最终回答-->
      <div :ref="nodeData.answerId" :nodeId="nodeData.answerId" class="nodeBlock answer" @dblclick = "doubleClick" @click="changeQuestion(nodeData,nodeData)" :class="{'active': selectQuestion.answerId=== nodeData.answerId }">
        <p class="topContain">结果回答</p>
        <p class="midContain" ><i class="fa icons_robot"></i><span v-html="nodeData.content"></span></p>
        <div class="botContain">
          <!--<i @click.stop="testQuestion(nodeData)" class="fa fa-play-circle" aria-hidden="true"></i>-->
          <i @click.stop="delFilter(nodeData)" class="fas fa-trash" aria-hidden="true"></i>
        </div>
        <node-cover :node="nodeData"></node-cover>

      </div>

    </div>
  </div>
</template>

<script>
  import nodeCover from './nodeCover.vue'
  import draggable from 'vuedraggable'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'nodeBox',
    props:['nodeData'],
    data(){
      return{
        secondCover: true
      }
    },
    components:{
      nodeCover,
      draggable
    },
    computed:{
      ...mapGetters({
        jumpData: 'getJumpData',
        tree: 'getQuestionTree',
        selectCondition: 'getSelectConditions',
        jumpCover: 'getJumpCover',
        selectQuestion: 'getSelectQuestion',
        moveResult: 'getMoveResultNode',
        jumpScenes: 'getJumpScenes'

      })
    },
    methods:{
      checkPosition: function (index,len) {
        if((index === 0)&&len!==1){
          return 'start'
        }else if(index === (len-1)||len === 1){
          return 'end'
        }else{
          return 'middle'
        }
      },
      changeShow: function (node) {
        if(node.cover){
          node.cover = false
          this.$store.dispatch('setJumpCoverLine',true)
        }else{
          node.cover = true
          this.$store.dispatch('setJumpCoverLine',false)
        }
      },
      //选中节点
      changeQuestion: function (node,group) {
        this.$store.dispatch('setAddQuestionLevel','')
        if(node.hasOwnProperty('question')){
          this.$store.dispatch('setJumpScenes',node)
          this.$store.dispatch('setScenesHistory',{
            type: 'add',
            data: node
          })
        }else {
          if(node.nodeType===1||node.nodeType===2){
            this.$store.dispatch('setSelectQuestion',{
              select: node,
              group: group
            })
          }else{
            this.$store.dispatch('setSelectQuestion',{
              select: node,
              group: ''
            })
          }
        }
      },
      //推送块位置信息
      pushLocationAndJump: function () {
        if(Array.isArray(this.nodeData)&&this.nodeData){
          //推送追问和条件
          this.nodeData.forEach((e)=>{
            if(e.jumpTo !== -1&&e.jumpTo!== '-1'&&e.jumpTo!==null&&e.jumpTo!=='null'&&e.jumpTo!==undefined&&this.$refs[e.nodeId]){
//            console.log('跳转：'+ e.nodeId +'到' + e.jumpTo )
              this.$store.dispatch('pushJumpData',{
                from: e.nodeId,
                to: e.jumpTo
              })
            }
            if(this.$refs[e.nodeId]&&(e.nodeType === 1||e.nodeType === 2||e.nodeType === 3||e.nodeType === 4||e.nodeType === 5||e.nodeType === 6)&&this.$refs[e.nodeId][0].offsetLeft&&this.$refs[e.nodeId][0].clientWidth){
              this.$store.dispatch('pushLocationData',{
                id: e.nodeId,
                left: this.$refs[e.nodeId][0].offsetLeft+ this.$refs[e.nodeId][0].clientWidth+16,
                top: this.$refs[e.nodeId][0].offsetTop+ this.$refs[e.nodeId][0].clientHeight/2 +3
              })
            }else if(this.$refs[e.nodeId]&&e.nodeType === 0&&this.$refs[e.nodeId][0].offsetLeft&&this.$refs[e.nodeId][0].clientWidth){
              this.$store.dispatch('pushLocationData',{
                id: e.nodeId,
                reactId: e.nodeId,
                left: this.$refs[e.nodeId][0].offsetLeft -5,
                top: this.$refs[e.nodeId][0].offsetTop+30
              })
            }else if(this.$refs[e.nodeId]){

            }
          })
        }else{
          //推送结果位置
          if(this.$refs[this.nodeData.answerId]&&this.$refs[this.nodeData.answerId].offsetLeft&&this.$refs[this.nodeData.answerId].clientWidth){
            this.$store.dispatch('pushLocationData',{
              id: this.nodeData.answerId,
              reactId: this.nodeData.answerId,
              left: this.$refs[this.nodeData.answerId].offsetLeft -5,
              top: this.$refs[this.nodeData.answerId].offsetTop+30
            })
          }

        }
      },
      //删除节点
      delFilter: function (item) {
        let _self = this
        console.log(item)
        if(item.hasOwnProperty('answerId')){
          this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.$api.scene.editor.deleteQuestionNodeAnswer({
              answerId: item.answerId
            }).then((res)=>{
              _self.$message({
                message: '删除成功',
                type: 'success',
                duration: 1000
              });
              _self.$store.dispatch('updateQuestionTree')
            })
          })
        }else if(item.hasOwnProperty('question')){
          this.$confirm('此操作将永久删除该场景跳转, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.$api.scene.editor.delQuestionJump({
              reactId: item.reactId
            }).then((res)=>{
              _self.$message({
                message: '删除成功',
                type: 'success',
                duration: 1000
              });
              _self.$store.dispatch('updateQuestionTree')
            })
          })
        }else{
          this.$confirm('此操作将永久删除该项及其子项, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.$api.scene.editor.delQuestionById({
              nodeId: item.nodeId
            }).then((res)=>{
              console.log(res)
              _self.$message({
                message: '删除成功',
                type: 'success',
                duration: 1000
              });
              _self.$store.dispatch('updateQuestionTree')
            })
          })
        }
      },
      //模拟对话
      testQuestion: function (data) {
        console.log(data)
        this.$store.dispatch('setAutoId',data)
        this.$store.dispatch('setQuestionEdit',{
          type: 'auto',
        })
      },
      //双击
      doubleClick: function (e) {
        this.$store.dispatch('setQuestionEdit',{
          type: 'nodeShow'
        })
      }
    },
    mounted(){
      this.$nextTick(()=>{
        this.pushLocationAndJump()
      })
//      this.hideFilter = []
    },
    watch:{
      tree: function () {
        this.$nextTick(()=>{
          this.pushLocationAndJump()
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .nodeBox{
    .icons_jump_scenes{
      position: absolute;
      left: -12.5px;
      top: 1.2rem;
    }
    .nodeContain{
      border-left: solid 1px #ddd;
    }
    .end{
      border-left: solid 1px #ffffff;
      .lineBox{
        .leftBotLine{
          height: 1.8rem;
          width: 1px;
          left: -1px;
          top: 0;
          background: #ddd;
          z-index: 10;
        }
      }
    }
    .start{
      .lineBox{
        .leftTopLine{
          height: 1.8rem;
          width: 1px;
          left: -1px;
          top: 0;
          background: #ffffff;
          z-index: 10;
        }
      }
    }
    .middle{
      .lineBox{
        .leftMidLine{
          height: 1.8rem;
          width: 1px;
          left: -1px;
          top: 0;
          background: #ddd;
          z-index: 10;
        }
      }
    }
  }
</style>
