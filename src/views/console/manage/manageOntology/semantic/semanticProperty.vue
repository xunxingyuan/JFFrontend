<template>
  <div class="semanticProperty semanticType">
    <div class="detailItem">
      <div class="ctrl flex">
        <span>属性</span>
        <div class="ctrlBtn">
          <i class="iconfont icon-tianjia" aria-hidden="true" @click="addProperty()"></i>
          <!--<i class="fa fa-pencil-square-o" aria-hidden="true"></i>-->
          <i class="iconfont icon-shanchu" aria-hidden="true" @click="delProperty()"></i>
        </div>
      </div>
      <div class="list">
        <p v-for="item in propertyList" :class="{'active':selectProperty.content===item.content }" @click="selectPropertyData(item)">{{item.content}}</p>
      </div>
    </div>
    <div class="content scrollbar" v-if="properTyResult!==''">
      <section>
        <p class="title"><span>{{selectProperty.content}}</span>的具体描述</p>
        <div class="inputItem">
          <p>名称</p>
          <input class="inputTag" type="text" v-model="properTyResult.subject.browserText"/>
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
          <select v-model="properTyResult.partOfSpeech">
            <option :value="type.value" v-for="type in typeList">{{type.label}}</option>
          </select>
        </div>
        <div class="inputItem">
          <p>类型</p>
          <select v-model="properTyResult.labelType">
            <option :value="type.value" v-for="type in labelTypeList">{{type.label}}</option>
          </select>
        </div>
      </section>

      <div class="btnGroup">
        <span class="submit" @click="submit()">提交</span>
        <span class="cancel" @click="reset()">重置</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import AddSame from "./addSame.vue";

  export default {
    components: {AddSame},
    name: 'semanticProperty',
    computed:{
      ...mapGetters({
        node: 'getSelectOntologyNode',
        selectOntology: 'getSelectOntology',
        propertyList: 'getPropertyList'
      })
    },
    data(){
      return  {
        typeList:[{
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
        }],
        labelTypeList:[{
          label: '基础词',
          value: 1
        },{
          label: '短语',
          value: 2
        }],
        selectNode: {
          propertyList:[],
          propertyValues:[],
          subject:{
            content: '',
            iri: '',
            projectId: ''
          },
        },
        selectProperty: '',
        properTyResult: '',
        sameWordList:[],
        userSameWordList: []
      }
    },
    methods:{
      selectPropertyData: function (item) {
        this.selectProperty = item
        let data = {
          ontologyId: this.selectOntology.projectId,
          selection: '('+ item.iri + ')'
        }
        this.$api.ontology.setSemanticProperty(data,'get').then((res)=>{
          if(res.code === 'ok'){
            this.properTyResult = res.frame
            this.sameWordList = this.properTyResult.synonyms
            this.userSameWordList = this.properTyResult.userSynonyms
          }
        })
      },
      setSameList: function (item) {
        this.sameWordList = item
      },
      setUserSameList: function (item) {
        this.userSameWordList = item
      },
      addProperty: function () {
        this.$prompt('请输入属性名称', '新增属性', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.$api.ontology.setSemanticProperty({
            ontologyId: this.selectOntology.projectId,
            content: value
          },'create').then((res)=>{
            if(res.code === 'ok'){
              this.$message({
                type: 'success',
                message: '新增成功'
              });
              this.$store.dispatch('updatePropertyList')
            }
          })
        })
      },
      submit: function () {
        this.properTyResult.synonyms = []
        this.properTyResult.userSynonyms = []

        this.sameWordList.forEach((e)=>{
          this.properTyResult.synonyms.push(e)
        })
        this.userSameWordList.forEach((e)=>{
          this.properTyResult.userSynonyms.push(e)
        })

        let data = {
          ontologyId: this.selectOntology.projectId,
          selection: '(' + this.selectProperty.iri + ')',
          frame: JSON.stringify(this.properTyResult)
        }
        this.$api.ontology.setSemanticProperty(data,'update').then((res)=>{
          if(res.code==='ok'){
            this.$message({
              type: 'success',
              message: '修改成功',
              duration: 1000
            });
//            this.$store.dispatch('updatePropertyList')
          }
        })
      },
      delProperty: function () {
        if(this.selectProperty){
          let data={
            ontologyId: this.selectOntology.projectId,
            selection: '(' + this.selectProperty.iri + ')',
          }
          this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.ontology.setSemanticProperty(data,'delete').then((res)=>{
              if(res.code==='ok'){
                this.$message({
                  type: 'success',
                  message: '删除成功',
                  duration: 1000
                });
                this.properTyResult = ''
                this.$store.dispatch('updatePropertyList')
              }
            })
          })
        }
      },
      //重置
      reset: function () {
        let data = {
          ontologyId: this.selectOntology.projectId,
          selection: '('+ this.selectProperty.iri + ')'
        }
        this.$api.ontology.setSemanticProperty(data,'get').then((res)=>{
          if(res.code === 'ok'){
            this.properTyResult = res.frame
            this.sameWordList = this.properTyResult.synonyms
            this.userSameWordList = this.properTyResult.userSynonyms
          }
        })
      },
      init(){
        let data = {
          ontologyId: this.selectOntology.projectId
        }
        this.$api.ontology.setSemanticProperty(data,'list').then( res => {
          if (res.code === 'ok'){
            console.log(res.data)
          }
        })
      }
    },
    mounted(){
      this.selectNode = this.node
      this.properTyResult = ''
    },
    watch:{
      selectOntology: function () {
        if(this.selectOntology){
          this.init();
        }
      }
    }
  }
</script>

<style lang="less">
  .semanticProperty{
    .detailItem{
      .list{
        p{
          cursor: pointer;
          height: 3rem;
          line-height: 3rem;
          text-align: left;
          padding: 0 1rem;
          font-size: 0.8rem;
        }
        .active{
          background: #E4F0FF;
        }
      }
    }
  }

</style>


