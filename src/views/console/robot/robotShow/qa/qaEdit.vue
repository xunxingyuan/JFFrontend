<template>
  <div class="qaEdit" @click="similarDataList = []">
    <same-view @close="showSame = false" @changed="listChange" :sameData="sameData" :type="'edit'" v-if="showSame"></same-view>
    <question-slot v-if="slotShow" :slotData="slot" @editSlotItem="editSlotItem" @close="slotShow = false" @deleteSlot="deleteSlot" @saveSlotItem="saveSlotItem" @cancelSave="cancelSave"></question-slot>
    <div class="qaBox animated fadeInRight">
      <div class="close flexCenter">
        <i class="fas fa-times" @click="close"></i>
      </div>
      <div class="topTitle">
        <p class="title" v-if="editType==='create'">新建</p>
        <p class="title" v-if="editType==='edit'">编辑</p>
      </div>
      <div class="contentInner scrollbar">
        <div class="bgBlock">
          <div class="editItem">
            <div class="itemName">
              <span>*</span>标准问法
            </div>
            <div class="itemContent">
              <el-input v-model="qaData.question" @blur="searchSimilar"></el-input>
            </div>
            <div class="itemCtrl">

            </div>
            <div class="similarBox" v-if="similarDataList.length!==0">
              <p v-for="item in similarDataList">{{item.question}}</p>
            </div>
          </div>
          <div class="editItem">
            <div class="itemName">
              句式
            </div>
            <div class="itemContent">
              <el-input v-model="patternData"></el-input>
              <div class="extra">句式<span class="blue">{{qaData.patternList.length}}</span>个 <span class="blue" @click="viewSameView(0)">查看</span></div>
            </div>
            <div class="itemCtrl flexCenter">
              <div class="add flexCenter" @click="addPattern">
                <i class="fas fa-plus"></i>
              </div>
            </div>
          </div>
          <div class="editItem">
            <div class="itemName">
              相似问法
            </div>
            <div class="itemContent">
              <el-input v-model="similarData"></el-input>
              <div class="extra">相似问法<span class="blue">{{qaData.similarQuestionList.length}}</span>个 <span class="blue" @click="viewSameView(1)">查看</span></div>
            </div>
            <div class="itemCtrl flexCenter">
              <div class="add flexCenter" @click="addSimilar">
                <i class="fas fa-plus"></i>
              </div>
            </div>
          </div>
          <div class="editItem">
            <div class="itemName">
              槽点
            </div>
            <div class="itemContent">
              <el-input v-model="slotData"></el-input>
              <div class="extra">槽点<span class="blue">{{slot.length}}</span>个 <span class="blue" @click="slotShow = true">查看</span></div>
            </div>
            <div class="itemCtrl flexCenter" >
              <div class="add flexCenter" @click="addSlot">
                <i class="fas fa-plus"></i>
              </div>
            </div>
          </div>
        </div>


        <div class="bgBlock">
          <div class="editItem">
            <div class="itemName">
              <span>*</span>标准答案
            </div>
            <div class="itemContent textHtml">

              <el-switch
                      v-model="ifHtml"
                      active-color="#13ce66"
                      inactive-color="#D1D1D1">
              </el-switch>
              <span class="text">是否富文本</span>
            </div>
          </div>
          <div class="editItem replyBox">
            <div class="itemContent">
              <quill-editor :options="editorOption" v-model="qaData.answer"></quill-editor>
            </div>
          </div>
        </div>


        <div class="bgBlock">
          <div class="editItem">
            <div class="itemName">
              <span>*</span>选择分类
            </div>
            <div class="itemContent">
              <el-cascader
                      :options="tree"
                      v-model="selectedOptions"
                      :props="props"
                      change-on-select
                      @change="handleChange">
              </el-cascader>
            </div>
            <div class="itemCtrl">

            </div>
          </div>
          <div class="editItem">
            <div class="itemName">
              <span>*</span>是否有效
            </div>
            <div class="itemContent">
              <el-select v-model="qaData.status">
                <el-option v-for="item in statusOption"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="editItem">
            <div class="itemName">
              <span>*</span>生效时间
            </div>
            <div class="itemContent">
              <el-date-picker
                      v-model="timeData"
                      type="datetimerange"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      @change="submitDate">
              </el-date-picker>
            </div>
            <div class="itemCtrl">

            </div>
          </div>
        </div>

      </div>

      <div class="submitBox flexCenter">
        <el-button @click="submitData" type="primary" title="保存" v-if="userLimit.edit">保存</el-button>
        <el-button @click="submitData('submit')" type="success" v-if="userLimit.edit" title="保存并提交此问答">保存并同步</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import QuillEditor from "vue-quill-editor/src/editor.vue";
  import SameView from "./sameView.vue";
  import QuestionSlot from "../scene/tools/questionSlot.vue";

  export default {
    components: {
      QuestionSlot,
      SameView,
      QuillEditor},
    name: 'qaEdit',
    props:['editType','editData','tree','categoryId','itemType','userLimit'],
    data(){
      return {
        props: {
          label: "categoryName",
          value: 'categoryId',
          children: 'children'
        },
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              [{ 'font': [] }],
              ['clean']                                         // remove formatting button
            ],
          }
        },
        sameData:[],
        showSame: false,
        qaData:{
          checkStatus: 4,
          question: '',
          categoryId: '',
          similarQuestionList: [],
          patternList:[],
          keywordList:[],
          slotList:[],
          answer:'',
          effDate:'',
          expDate: '',
          status: 1
        },
        timeData: [],
        selectType: '',
        patternData: '',
        similarData: '',
        slotData: '',
        selectedOptions: [],
        statusOption:[{
          label: '失效',
          value: 0
        },{
          label: '生效',
          value: 1
        }],
        ifHtml: false,
        //搜索的相似问题
        similarDataList:[],
        slotShow: false,
        slot:[]
      }
    },
    methods:{
      close: function () {
        this.$emit('close')
      },
      //搜索相似问
      searchSimilar: function () {
        if(this.itemType === 'qa'){
          this.$api.robotAnalysis.qa.searchQa({
            question: this.qaData.question,
            pageSize: 5,
            pageNum: 1
          }).then((res)=>{
            if(res.status === 200){
              this.similarDataList = res.result
            }
          })
        }else{
          this.$api.robotAnalysis.greeting.searchQa({
            question: this.qaData.question,
            pageSize: 5,
            pageNum: 1
          }).then((res)=>{
            if(res.status === 200){
              this.similarDataList = res.result
            }
          })
        }

      },

      submitData: function (type) {
        this.qaData.slotList = []
        this.slot.forEach((e)=>{
          this.qaData.slotList.push(e.value)
        })

        let submitData = JSON.parse(JSON.stringify(this.qaData));
        if(submitData.categoryId === 'weifenlei'||!submitData.categoryId){
          submitData.categoryId = ''
        }
        submitData.checkStatus = 4
        if(!this.ifHtml){
          submitData.answer = this.filterHTMLTag(submitData.answer)
        }
        if(this.qaData.question.trim()&&this.qaData.answer.trim()&&this.qaData.effDate.trim()&&this.qaData.expDate.trim()){
          if(submitData.categoryId === '0'){
            this.$message({
              message: '根节点不能添加QA',
              type: 'info',
              duration: 1000
            });
          }else{
            console.log(submitData)
            if(type === 'submit'){
              submitData.comfirm = 'update'
            }
            this.$emit('submit',submitData)

            this.close()
          }
        }else{
          this.$message({
            message: '参数不完整',
            type: 'info',
            duration: 1000
          });
        }
      },
      submitDate: function (val) {
        this.qaData.expDate = val[0]
        this.qaData.effDate = val[1]
      },
      viewSameView: function (type) {
        this.selectType = type
        this.showSame = true
        if(type===0){
          this.sameData = this.qaData.patternList
        }else if(type === 1){
          this.sameData = this.qaData.similarQuestionList
        }else if(type === 2){
          this.sameData = this.qaData.slotList
        }
      },
      listChange: function (arr) {
        if(this.selectType===0){
          this.qaData.patternList = arr
        }else if(this.selectType === 1){
          this.qaData.similarQuestionList = arr
        }else if(this.selectType === 2){
          this.qaData.slotList = arr
        }
      },
      addPattern: function () {
        if(this.patternData.trim()){
          this.qaData.patternList.push(this.patternData)
          this.patternData = ''
          if(this.selectType===0){
            this.sameData = this.qaData.patternList
          }
        }
      },
      addSimilar: function () {
        if(this.similarData.trim()){
          if(this.qaData.similarQuestionList.indexOf(this.similarData)===-1){
            this.qaData.similarQuestionList.push(this.similarData)
            this.similarData = ''
            if(this.selectType === 1){
              this.sameData = this.qaData.similarQuestionList
            }
          }else{
            this.$message({
              message: '已有相同相似问法',
              type: 'info',
              duration: 1000
            });
          }
        }
      },
      addSlotData: function () {
        if(this.slotData.trim()){
          this.qaData.slotList.push(this.slotData)
          this.slotData = ''
          if(this.selectType === 2){
            this.sameData = this.qaData.slotList
          }
        }
      },
      checkType: function () {
        if(this.editType ==='edit'&&this.editData){
          this.qaData = this.editData
          this.timeData =[]
          this.timeData.push(new Date(this.qaData.expDate))
          this.timeData.push(new Date(this.qaData.effDate))
          this.qaData.slotList.forEach((e)=>{
            this.slot.push({
              value: e,
              edit: false
            })
          })

        }else{
          this.sameData=[]
          let date = new Date();
          let date10 = new Date();
          date10.setFullYear(date.getFullYear()+10)
          this.timeData =[]
          this.timeData.push(date)
          this.timeData.push(date10)


          let Y = date.getFullYear() + '-';
          let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          let D = date.getDate() + ' ';
          let h = date.getHours() + ':';
          let m = date.getMinutes() + ':';
          let s = date.getSeconds();
          let Y10 =  date.getFullYear()+ 10 + '-';
          let now = Y+M+D+h+m+s
          let ten = Y10+M+D+h+m+s

          this.qaData = {
            checkStatus: 4,
            question: '',
            categoryId: this.categoryId,
            similarQuestionList: [],
            patternList:[],
            keywordList:[],
            slotList:[],
            answer:'',
            effDate: ten,
            expDate: now,
            status: 1
          }
        }
        this.getCategoryList()
      },
      handleChange: function (val) {
        let len = val.length-1
        this.qaData.categoryId = val[len]
      },
      getCategoryList: function () {
        let arr = []
        this.getArrlist(this.tree,arr)
        let categoryList = []
        this.getCategory(arr,this.categoryId,categoryList)
        this.selectedOptions = categoryList
      },
      getArrlist: function (tree,arr) {
        tree.forEach((e)=>{
          arr.push(e)
          if(e.children.length>0){
            this.getArrlist(e.children,arr)
          }
        })
      },
      getCategory: function (arr,id,result) {
        arr.forEach(e=>{
          if(e.categoryId === id){
            result.unshift(id)
            if(e.categoryId!=='0'){
              this.getCategory(arr,e.categoryPid,result)
            }
          }
        })
      },
      //去除html
      filterHTMLTag: function (msg) {
        let result = msg.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
        result = result.replace(/[|]*\n/, '') //去除行尾空格
        result = result.replace(/&npsp;/ig, ''); //去掉npsp
        return result;
      },


      //添加槽点
      addSlot: function () {
        if(this.slotData!==''){
          this.slot.push({
            value: this.slotData,
            edit: false
          })
          this.slotData = ''
        }
      },
      deleteSlot: function (index){
        this.slot.splice(index,1)
      },
      editSlotItem: function (val){
        this.slot.forEach((e,index)=>{
          if(index === val){
            e.edit = true
          }else{
            e.edit = false
          }
        })
      },
      saveSlotItem: function (val){
        this.slot.forEach((e,index)=>{
          if(index === val.index){
            e.value =  val.value
            e.edit = false
          }
        })
      },
      cancelSave: function (val) {
        this.slot.forEach((e,index)=>{
          if(index === val){
            e.edit = false
          }
        })
      }
    },
    mounted(){
      this.checkType()
    },
    watch: {
      editType: function () {
        this.checkType()
      }
    }
  }
</script>

<style lang="less">
  .qaEdit{
    width: 100%;
    height: 100%;
    z-index:101;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .qaBox{
      width: 35rem;
      height: 100%;
      background: #fff;
      position: relative;
      padding-bottom: 3.5rem;
      display: flex;
      flex-flow: column;
      .contentInner{
        flex: 1;
        overflow: auto;
        overflow-x: hidden;
        padding: 0 1rem;
        .bgBlock{
          background: #F6F6F6;
          padding-top: 12px;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }
      }
      .close{
        position: absolute;
        width: 40px;
        height: 40px;
        left: -20px;
        top: 1rem;
        background: #fff;
        border-radius: 20px;
        color: #666;
        cursor: pointer;
      }
      .topTitle{
        width: 100%;
        .title{
          width: 100%;
          height: 3rem;
          line-height: 3rem;
          padding: 0 20px;
          text-align: left;
          color: #333;
        }
      }
      .editItem{
        padding: 0 10px;
        display: flex;
        align-items: flex-start;
        margin-bottom: 10px;
        font-size: 14px;
        position: relative;
        .similarBox{
          text-align: left;
          position: absolute;
          left: 7.2rem;
          top: 2.7rem;
          background: #fff;
          width: 15rem;
          border: solid 1px #ddd;
          border-radius: 3px;
          z-index: 10;
          p{
            height: 40px;
            line-height: 40px;
            padding: 0 1rem;
            width: 15rem;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
          }
        }
        .itemName{
          width: 6rem;
          height: 40px;
          line-height: 40px;
          min-width: 6rem;
          text-align: right;
          padding-right: 2rem;
          span{
            color: #FF0000;
          }
        }
        .itemContent{
          flex: 1;
          text-align: left;
          position: relative;
          .extra{
            width: 100%;
            margin-top: 10px;
          }
          .blue{
            color: #2B86F6;
          }

        }
        .itemCtrl{
          margin-left: 10px;
          width: 2rem;
          min-width: 2rem;
          height: 40px;

          .add{
            background: #fff;
            width: 2rem;
            height: 2rem;
            border: solid 1px #ddd;
            color: #666;
            cursor: pointer;
          }
          .add:hover{
            color: #3a8ee6;
            border: solid 1px #3a8ee6;
          }
        }
        .textHtml{
          display: flex;
          align-items: center;
          height: 40px;
          font-size: 12px;
          color: #666;
          .text{
            margin-left: 10px;
          }
        }
      }
      .replyBox{
        position: relative;
        margin-top: -10px;
        height: 13rem;
        .itemContent{
          width: 100%;
          display: flex;
          flex-flow: column;
          .quill-editor{
            width: 100%;
            flex: 1;
            height: 10rem;
            background: #fff;
            .ql-editor{
              background: #fff;
            }
          }
        }

      }
      .submitBox{
        position: absolute;
        bottom: 0;
        height: 3.5rem;
        left: 0;
        background: #ecf1f7;
        width: 100%;
        .submit{
          margin-right: 2rem;
          margin-left: 2rem;
        }
      }
    }
  }
</style>
