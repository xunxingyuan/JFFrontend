<template>
  <div class="semanticTree">
    <div class="ctrl flex">
      <span>类</span>
      <div class="ctrlBtn">
        <i class="iconfont icon-fangdajing"  @click="searchAction()"></i>
        <i class="iconfont icon-tianjia" @click="addNode()"></i>
        <i class="iconfont icon-bianji" @click="updateNode()"></i>
        <i class="iconfont icon-shanchu" @click="delNode()"></i>

      </div>
    </div>
    <div style="overflow: auto;padding-left: 1rem" class="scrollbar">
      <tree-box :treeData="treeRoot"  :config="selfConfig" :selectedItem="selectedMenu" @select="handleNodeClick"></tree-box>
    </div>

    <div class="searchNode coverBack" v-if="searchNode">
      <div class="centerBox">
        <div class="title flex">
          <span>搜索语义网</span>
          <i class="iconfont icon-guanbi" aria-hidden="true" @click="searchNode = false"></i>
        </div>
        <div class="content">
          <el-input placeholder="搜索节点名称" @keyup.enter.native="searchNodeAction" v-model="searchWord.searchString"> <i slot="suffix" class="el-input__icon el-icon-search" @click="searchNodeAction"></i></el-input>
          <div class="searchResult">
            <div v-for="(item,index) in searchNodeList" class="searchItem" @click="searchTreeNode(item)">
              {{index+1 + (searchWord.page-1)*30}}、{{item.browserText}}
            </div>
          </div>
          <div class="searchPage">
            <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    layout="total,prev, pager, next"
                    :page-size="30"
                    :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import TreeBox from "../../../../../components/common/tree.vue";

  export default {
    components: {
      TreeBox,
    },
    name: 'semanticTree',
    data(){
      return{
        selectedMenu: '',
        ctrlData: '',
        searchNodeList:[],
        selectedResult:'',
        selfConfig:{
          name: 'content',
          child: 'child',
          id: 'iri'
        },
        searchNode: false,
        searchWord: {
          ontologyId: '',
          searchString: '',
          page: 1
        },
        total: 0
      }
    },
    computed:{
      ...mapGetters({
        treeRoot: 'getOntologyTree',
        selectOntology: 'getSelectOntology',
        node: 'getSelectOntologyNode'
      })
    },
    methods:{
      //遍历添加子节点
      addChildNode: function (arr,id,data) {
        arr.forEach((e)=>{
          if(e.iri === id){
            e.child = data
            e.showChild = true
          }else if(e.child.length>0){
            this.addChildNode(e.child,id,data)
          }
        })
      },
      handleCurrentChange: function (val) {
        this.searchWord.page = val
        this.searchCtrl()
      },
      handleNodeClick: function (data) {
        let arr = this.treeRoot
        this.selectedMenu = data
        this.$api.ontology.setSemanticClassTree({
          ontologyId: this.selectOntology.projectId,
          selection: '('+data.iri+')',
        },'get').then((res)=>{
          if(res.code === 'ok'){
            let child = res.children
            child.forEach((e)=>{
              e.child = []
            })
            this.addChildNode(arr,data.iri,child)
            this.$store.commit('setOntologyTree',arr)
          }
        })
        this.$store.dispatch('setSelectOntologyNode','')
        if(data.iri !== 'owl:Thing'){
          this.$store.dispatch('setSelectOntologyNode',data)
          this.$api.ontology.setSemanticClass({
            ontologyId: this.selectOntology.projectId,
            selection: '('+data.iri+')'
          },'get').then((res)=>{
            if(res.code==='ok'){
              this.$store.dispatch('setSelectedClassMsg',res.frame)
            }
          })
          this.$api.ontology.setSemanticInstance({
            ontologyId: this.selectOntology.projectId,
            selection: '('+data.iri+')'
          },'get').then((res)=>{
            if(res.code==='ok'){
              this.$store.dispatch('setSelectedClassInstance',res.individuals)
            }
          })
        }
      },
      //搜索节点
      searchNodeAction: function(){
        this.searchWord.page = 1
        if (this.searchWord.searchString.trim()){
          this.searchCtrl()
        }
      },
      searchCtrl: function () {
        this.searchWord.ontologyId = this.selectOntology.projectId
        this.$api.ontology.setSemanticClassTree(this.searchWord,'search').then( res => {
          if (res.code === 'ok'){
            console.log('search success')
            this.searchNodeList = res.result.pageElements;
            this.total = res.result.totalElements
          }
        })
      },
      searchAction: function () {
        this.searchNode = true
      },
      //新增节点
      addNode: function () {
        let choseIri = ''
        let data = {
          ontologyId: '',
          selection: '',
          content: '',
        }
        if(this.node === ''){
          data.ontologyId = this.selectOntology.projectId
          data.selection = '(owl:Thing)'
          choseIri = 'owl:Thing'
        }else{
          data.ontologyId = this.selectOntology.projectId
          data.selection = '('+ this.node.iri + ')'
          choseIri = this.node.iri
        }
        this.$prompt('请输入名称', '新增节点', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          data.content = value
          if(data.content){
            this.$api.ontology.setSemanticClassTree(data,'create').then((res)=>{
              if(res.code === 'ok'){
                this.$message({
                  type: 'success',
                  message: '新增成功',
                  duration: 1000
                });
                let addData = {
                  iri: res.node[0],
                  content: value,
                  child: []
                }
                let arr = this.treeRoot
                this.addToTree(arr,choseIri,addData)
                this.$store.commit('setOntologyTree',arr)
              }
            })
          }
        })
      },
      //删除节点
      delNode: function () {
        if(this.node === ''){
          this.$message({
            type: 'info',
            message: '请选择需要删除的节点',
            duration: 1000
          });
        }else if(this.node){
          this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.$api.ontology.setSemanticClassTree({
              ontologyId: this.selectOntology.projectId,
              selection: '('+ this.node.iri + ')'
            },'delete').then((res)=>{
              if(res.code === 'ok'){
                this.$message({
                  type: 'success',
                  message: '删除成功',
                  duration: 1000
                });
                let arr = this.treeRoot
                this.deleteFromTree(arr,this.node.iri)
                this.$store.commit('setOntologyTree',arr)
                this.$store.dispatch('setSelectOntologyNode','')
                this.$store.dispatch('setSelectedClassMsg','')
              }
            })
          })
        }
      },
      //修改节点
      updateNode: function () {
        if(this.node === ''){
          this.$message({
            type: 'info',
            message: '请选择需要修改的节点',
            duration: 1000
          });
        }else if(this.node){
          this.$prompt('请输入名称', '修改节点', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: this.node.displayName
          }).then(({ value }) => {
            if(value){
              this.$api.ontology.setSemanticClassTree({
                ontologyId: this.selectOntology.projectId,
                selection: '('+ this.node.iri + ')',
                name: value
              },'update').then((res)=>{
                if(res.code === 'ok'){
                  this.$message({
                    type: 'success',
                    message: '修改成功',
                    duration: 1000
                  });
                  let arr = this.treeRoot
                  this.updateToTree(arr,this.node.iri,value)
                  this.$store.commit('setOntologyTree',arr)
                }

              })
            }
          })
        }

      },


      addToTree: function (arr,iri,node) {
        arr.forEach((e)=>{
          if(e.iri === iri){
            e.child.push(node)
          }else{
            if(e.child.length>0){
              this.addToTree(e.child,iri,node)
            }
          }
        })
      },
      deleteFromTree: function (arr,iri) {
        arr.forEach((e,index)=>{
          if(e.iri === iri){
            arr.splice(index,1)
          }else{
            if(e.child.length>0){
              this.deleteFromTree(e.child,iri)
            }
          }
        })
      },
      updateToTree: function (arr,iri,value) {
        arr.forEach((e,index)=>{
          if(e.iri === iri){
            e.displayName = value
          }else{
            if(e.child.length>0){
              this.updateToTree(e.child,iri,value)
            }
          }
        })
      },
      searchTreeNode: function (item) {
        this.$api.ontology.setSemanticClassTree({
          ontologyId: this.selectOntology.projectId,
          selection: item.iri
        },'getNode').then((res)=>{

        })
      }
    },


  }
</script>

<style lang="less">
  .semanticTree{
    width: auto;
    min-width: 220px;
    border: solid 1px #ddd;
    height: 100%;
    display: flex;
    flex-flow: column;
    .ctrl{
      min-height: 2.5rem;
      height: 2.5rem;
      line-height: 2.5rem;
      padding-left: 1rem;
      border-bottom: solid 1px #f6f6f6;
      background: #f6f6f6;
      justify-content: space-between;
      span{
        font-size: 12px;
        max-width: 40%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ctrlBtn{
        flex: 1;
        text-align: right;
        margin-right: 0.5rem;
        i{
          margin: 0 0.5rem;
          cursor: pointer;
        }
        i:hover{
          color: #2B86F6;
        }
      }
    }
    .scrollbar{
      flex: 1;
      .backTree{
        margin-top: 10px;
        padding: 5px 10px;
        cursor: pointer;
        background: #fff;
        width: auto;
        border:1px solid #2B86F6;
        border-radius: 4px;
      }
      .resultList{
        list-style: none;
        padding-left: 0;
        li{
          line-height: 36px;
          cursor: pointer;
          text-align: left;
          padding-left: 10px;
          &:hover{
            background: #E4F0FF;
          }
        }
        .activeResult{
          background: #E4F0FF;
        }
      }
    }
    .searchNode{
      .centerBox{
        width: 40rem;
        height: 30rem;
        .content{
          .searchResult{
            margin-top: 1rem;
            height: 18rem;
            width: 100%;
            overflow: auto;
            border: solid 1px #ddd;
            border-radius: 3px;
            .searchItem{
              height: 1.8rem;
              line-height: 1.8rem;
              border-bottom: solid 1px #ddd;
              text-align: left;
              padding: 0 1rem;
              font-size: 14px;
              color: #333;
              cursor: pointer;
            }
            .searchItem:hover{
              color: #2B86F6;
            }
          }
          .searchPage{
            width: 100%;
            height: 3rem;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
        }
      }
    }
  }
</style>
