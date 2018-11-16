<template>
  <div class="semanticDetail semanticType">
    <div class="detailItem">
      <div class="ctrl flex">
        <span>与类相关的实例</span>
        <div class="ctrlBtn">
          <i class="iconfont icon-tianjia" aria-hidden="true" @click="addInstance"></i>
          <i class="iconfont icon-shanchu" aria-hidden="true"></i>
        </div>
      </div>
      <div class="list">
        <p v-for="item in selectList" @click="getDetailData(item)" :class="{'active': choseItem.iri === item.iri}">
          {{item.browserText}}
        </p>
      </div>
    </div>
    <div class="content scrollbar" v-if="selectInstance.subject.iri">
      <section>
        <p class="title">{{choseItem.browserText}}的实例描述</p>
        <div class="inputItem">
          <p>名称</p>
          <input class="inputTag" type="text" v-model="instanceName" />
        </div>
        <!--<div class="inputItem">-->
          <!--<p>种类</p>-->
          <!--<input class="inputTag" type="text" v-model="selectInstance.types"  />-->
        <!--</div>-->
        <div class="inputItem">
          <p>同义词</p>
          <add-same :sameList="sameWordList" @changeList="setSameList"></add-same>
        </div>
        <div class="inputItem">
          <p>近义词</p>
          <add-same :sameList="nearWordList" @changeList="setUserSameList"></add-same>
        </div>
      </section>

      <div class="btnGroup">
        <span class="submit" @click="submitChange">提交</span>
        <span class="cancel" @click="refreshData">重置</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import AddSame from "./addSame.vue";
  export default {
    components: {AddSame},
    name: 'semanticDetail',
    computed:{
      ...mapGetters({
        node: 'getSelectOntologyNode',
        selectOntology: 'getSelectOntology',
        selectList: 'getSelectedClassInstance'
      })
    },
    data(){
      return {
        selectInstance:{
          subject:{
            iri: '',
            browserText: ''
          },
          synonyms: [],
          types: [],
          userSynonyms: []
        },
        instanceName: '',
        sameWordList:[],
        nearWordList:[],
        choseItem: '',
      }
    },
    methods:{
      addInstance: function () {
        this.$prompt('请输入实例名称', '新增实例', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.$api.ontology.setSemanticInstance({
            ontologyId: this.selectOntology.projectId,
            selection: this.node.iri,
            instanceName: value
          },'create').then((res)=>{
            if(res.code === 'ok'){
              let list = this.selectList
              list.push(res.individual)
              this.$store.dispatch('setSelectedClassInstance',list)
            }
          })
        })
      },
      getDetailData: function (item) {
        this.choseItem = item
        this.instanceName = item.browserText
        this.$api.ontology.setSemanticInstance({
          ontologyId: this.selectOntology.projectId,
          selection: item.iri,
        },'getDetail').then((res)=>{
          if(res.code === 'ok'){

            this.selectInstance = res.frame
            this.sameWordList = res.frame.synonyms
            this.nearWordList = res.frame.userSynonyms
          }
        })
      },
      submitChange: function () {
        this.selectInstance.synonyms = this.sameWordList
        this.selectInstance.userSynonyms = this.nearWordList
        let data = {
          instanceName: this.instanceName,
          frame: JSON.stringify(this.selectInstance),
          ontologyId: this.selectOntology.projectId,
          selection: this.choseItem.iri
        }
        this.$api.ontology.setSemanticInstance(data,'update').then((res)=>{
          if(res.code === 'ok'){
            this.$message({
              type: 'success',
              message: '更新成功',
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
      },
      refreshData: function () {
        this.getDetailData(this.choseItem)
      },
      deleteDetailDada: function(item){

      },
      setSameList: function (item) {
        this.sameWordList = item
      },
      setUserSameList: function (item) {
        this.userSameWordList = item
      },
    },
    mounted(){

    }
  }
</script>

<style lang="less">
  .semanticDetail{
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

