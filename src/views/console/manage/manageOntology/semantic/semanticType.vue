<template>
  <div class="semanticType">
    <!--<semantic-tree></semantic-tree>-->
    <div class="content scrollbar">
      <section>
        <p class="title"><span v-if="node === 'owl:Thing'"></span><span v-else>{{selectNode.subject.browserText}}</span>的具体描述</p>
        <div class="inputItem">
          <p>名称</p>
          <div class="inputContent">
            <input class="inputTag" type="text" v-model="selectNode.subject.browserText"/>
            <!--<div class="addBtn">-->
            <!--<span class="basic active">基础词</span>-->
            <!--<span class="word">短语</span>-->
            <!--<span class="add">增加</span>-->
            <!--</div>-->
          </div>

        </div>
        <div class="inputItem">
          <p>域节点</p>
          <input type="radio" name="fieldRadio" id="isField" value="2" v-model="isClass"/>
          <label for="isField" style="margin: 0 5px;">是</label>
          <input type="radio" name="fieldRadio" id="notField" value="1" v-model="isClass"/>
          <label for="notField" style="margin: 0 5px;">否</label>
        </div>
        <div class="inputItem">
          <p>通用域路径</p>
          <input class="inputTag" type="text" v-model="selectNode.baseClass" />
        </div>
        <div class="inputItem">
          <p>同义词</p>
          <add-same :sameList="sameWordList"  @changeList="setSameList"></add-same>
        </div>
        <div class="inputItem">
          <p>用户同义词</p>
          <add-same :sameList="userSameWordList"  @changeList="setUserSameList"></add-same>
        </div>
        <div class="inputItem">
          <p>词性</p>
          <select v-model="selectNode.partOfSpeech">
            <option :value="type.value" v-for="type in typeList">{{type.label}}</option>
          </select>
        </div>
        <div class="inputItem">
          <p>类型</p>
          <select v-model="selectNode.labelType">
            <option :value="type.value" v-for="type in labelTypeList">{{type.label}}</option>
          </select>
        </div>
        <div class="inputItem">
          <p>父类</p>
          <input class="inputTag" type="text" v-model="parentData"  readonly/>
        </div>
        <div class="inputItem">
          <p class="flex" style="align-items: center">属性 <span class="smallBtn btn_normal" @click="addPropertyItem()">添加</span> </p>
          <div v-for="(item,index) in selectPropertyList" style="margin-bottom: 5px;">
            <select v-model="selectPropertyList[index].iri">
              <option :value="type.iri" v-for="type in propertyList">{{type.content}}</option>
            </select>
            <input  class="inputTag innerInput" v-model="item.value"/>
            <i style="margin-left: 10px" class="fa icons_del_small" @click="delPropertyItem(index)"></i>
          </div>


          <!--<input style="display: block;margin-bottom: 5px" v-for="item in selectNode.propertyList" v-model="item.browserText" type="text" disabled/>-->
          <!--<el-select v-model="selectPropertyList" multiple placeholder="请选择">-->
          <!--<el-option-->
          <!--v-for="(item,index) in propertyList"-->
          <!--:key="index"-->
          <!--:label="item.content"-->
          <!--:value="item.iri">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--<input class="innerInput" type="text"/>-->
        </div>
      </section>
      <div class="btnGroup">
        <span class="submit" @click="saveChange()">提交</span>
        <span class="cancel" @click="reset()">重置</span>
      </div>
    </div>
  </div>
</template>

<script>
  import semanticTree from "./semanticTree.vue"
  import { mapGetters, mapActions } from 'vuex'
  import AddSame from "./addSame.vue";

  export default {
    name: 'semanticType',
    components:{
      AddSame,
      semanticTree
    },
    computed:{
      ...mapGetters({
        node: 'getSelectOntologyNode',
        selectOntology: 'getSelectOntology',
        propertyList: 'getPropertyList',
        treeRoot: 'getOntologyTree',
        classMsg:'getSelectedClassMsg'
      })
    },
    data(){
      return {
        selectNode: {
          isClass:1,
          baseClass:'',
          subject:{
            browserText: '',
            iri: ''
          },
          parents:[{
            browserText: ''
          }],
          partOfSpeech: 1,
          labelType: 1,
          valueList:[]
        },
        typeList:[
          {
            label: '名词',
            value: 1
          },{
            label: '数词',
            value: 5
          },{
            label: '动词',
            value: 9
          },{
            label: '未知词性',
            value: 44
          }
        ],
        labelTypeList:[{
          label: '基础词',
          value: 1
        },{
          label: '短语',
          value: 2
        }],
        sameWordList:[],
        userSameWordList: [],
        selectPropertyList:[],
        isClass:1,
        parentData: ''
      }
    },
    mounted(){
      // if(this.node){
      //   this.selectNode = this.classMsg
      //   console.log(this.selectNode)
      // }
    },
    watch:{
      classMsg: function () {
        if(this.classMsg){
          this.selectNode = this.classMsg
          this.isClass = this.classMsg.isClass
          this.sameWordList = this.classMsg.synonyms
          this.selectPropertyList = []
          this.userSameWordList = this.classMsg.userSynonyms
          if(this.classMsg.hasOwnProperty('parents')&&this.classMsg.parents.length>0){
            this.parentData = this.classMsg.parents[0].browserText
          }
          if (this.classMsg.propertyList.length > 0){
            this.classMsg.propertyList.forEach((e,index)=>{
              this.selectPropertyList.push({
                iri: e.iri,
                browserText: e.browserText,
                value: this.classMsg.valueList[index]
              })
            })
          }

        }
      }
    },
    methods:{
      setSameList: function (item) {
        this.sameWordList = item
      },
      setUserSameList: function (item) {
        this.userSameWordList = item
      },
      //提交修改
      saveChange: function () {
        this.selectNode.synonyms = []
        this.selectNode.userSynonyms = []
        this.selectNode.propertyList = []
        this.selectNode.valueList = []
        this.sameWordList.forEach((e)=>{
          this.selectNode.synonyms.push(e)
        })
        this.userSameWordList.forEach((e)=>{
          this.selectNode.userSynonyms.push(e)
        })
        this.selectPropertyList.forEach((e)=>{
          this.selectNode.propertyList.push({
            browserText: e.browserText,
            iri: e.iri
          })
          this.selectNode.valueList.push(e.value)
        })
        this.selectNode.isClass = +this.isClass
        let data={
          ontologyId: this.selectOntology.projectId,
          selection: '('+this.classMsg.subject.iri+ ')',
          frame: JSON.stringify(this.selectNode)
        }
        this.$api.ontology.setSemanticClass(data,'update').then((res)=>{
          if(res.code === 'ok'){
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            this.$emit('changeName',this.selectNode.subject.browserText)
          }
        })
      },
      //增加属性
      addPropertyItem: function () {
        this.selectPropertyList.push({
          iri: '',
          browserText: '',
          value: ''
        })
      },
      //删除属性
      delPropertyItem: function (index) {
        this.selectPropertyList.splice(index,1)
      },
      //重置
      reset: function () {
        this.$api.ontology.setSemanticClass({
          ontologyId: this.selectOntology.projectId,
          selection: '('+this.node.iri+')'
        },'get').then((res)=>{
          if(res.code==='ok'){
            this.$store.dispatch('setSelectedClassMsg',res.frame)
          }
        })
      }
    }
  }
</script>

<style lang="less">

  .contain .botPart .rightPart .semanticType .content{
    padding: 0 1rem;
  }
</style>
