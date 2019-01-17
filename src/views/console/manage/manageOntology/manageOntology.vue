/*
 * @Author: xunxingyuan 
 * @Date: 2019-01-17 14:23:04 
 * @Last Modified by:   xunxingyuan 
 * @Last Modified time: 2019-01-17 14:23:04 
 */

<template>
  <div class="manageOntology container">
    <div class="top">
      <p class="title">语义网管理</p>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="innerLeft">
          <div class="innerTitle flexCenter">
            <span>语义网列表</span>
            <div class="ctrl">
              <i class="iconfont icon-tianjia" @click="createOntologyCtrl"></i>
              <!--<i class="iconfont icon-bianji"></i>-->
              <i class="iconfont icon-shanchu" @click="deleteOntology()"></i>
            </div>
          </div>
          <div class="innerContent">
            <div class="ontologyList">
              <div
                v-for="(item,index) in list"
                class="ontologyItem"
                :class="{'active': selectOntology.projectId === item.projectId}"
                @click="choseOntology(item,'config')"
                :key="index"
              >
                <div class="name">{{item.displayName}}</div>
                <div class="ctrl">
                  <span @click.stop="choseOntology(item,'edit')">编辑</span>
                  <span @click="exportOntology(item)">导出</span>
                  <span @click.stop="releaseOntology(item)">发布</span>
                </div>
              </div>
              <p v-if="list.length===0" class="tips">暂无语义网</p>
            </div>
          </div>
        </div>
        <div class="innerRight" v-if="showRight === 'config'">
          <div class="rightTop">
            <p>语义网配置</p>
          </div>
          <div class="rightBottom">
            <div class="rightContent">
              <div class="name">
                <p>语义网名称:</p>
                <el-input class="nameInput" v-model="changeName"></el-input>
                <el-button type="primary" @click="changeOntologyName">确认</el-button>
              </div>
              <div class="name">
                <p>语义网状态:</p>
                <span v-if="selectOntology.isPublish===0">未发布</span>
                <span v-if="selectOntology.isPublish===1">已发布(版本号：{{selectOntology.revisionNumber}})</span>
              </div>
              <!--<div class="name" v-if="selectOntology.isPublish===1">-->
              <!--<p>语义网版本号:</p>-->
              <!--<span>{{selectOntology.revisionNumber}}</span>-->
              <!--</div>-->
              <table class="gtable">
                <tr class="gheader">
                  <th>
                    <div class="flex" style="justify-content: space-between;">版本号
                      <table-filter :options="filterData" @selectFilter="choseFilter"></table-filter>
                    </div>
                  </th>
                  <th>时间</th>
                  <th>概要信息</th>
                  <th>操作</th>
                </tr>
                <tr v-for="(item,index) in historyList" :key="index">
                  <td>{{item.revisionNum}}</td>
                  <td>{{new Date(item.timestamp).toLocaleString()}}</td>
                  <td>{{item.summary}}</td>
                  <td>
                    <span class="release" @click="viewHistory(item)">查看详情</span>
                    <span class="release" @click="rollbackVersion(item)">回滚至此版本</span>
                  </td>
                </tr>
              </table>
              <p v-if="historyList.length===0" class="tips">暂无历史版本</p>
            </div>
          </div>
        </div>
        <div class="innerRight" v-if="showRight === 'edit'">
          <div class="topSelect">
            <span
              :class="{'active': item.id === selectType}"
              v-for="(item,index) in type"
              @click="selectType = item.id"
              :key="index"
            >{{item.name}}</span>
          </div>
          <div class="contentBox">
            <semantic-tree v-show="selectType !== 'property'"></semantic-tree>
            <semantic-type @changeName="updateName" v-show="selectNode!==''&&selectType === 'type'"></semantic-type>
            <semantic-property v-show="selectType === 'property'"></semantic-property>
            <semantic-detail v-show="selectType === 'detail'"></semantic-detail>
          </div>
        </div>
      </div>
    </div>
    <div class="addSemantic coverBack" v-if="addCtrl">
      <div class="centerBox">
        <div class="title flex">
          <span>新建语义网</span>
          <i class="iconfont icon-guanbi" aria-hidden="true" @click="closeCreate()"></i>
        </div>
        <div class="content">
          <div class="addItem flex">
            <p>名称:</p>
            <el-input v-model="uploadData.displayName"></el-input>
          </div>
          <div class="addItem flex">
            <p>文件上传:</p>
            <el-switch v-model="uploadInit" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </div>
          <div class="addItem flex" v-if="uploadInit">
            <p></p>
            <el-upload
              ref="uploadData"
              class="upload-demo"
              :data="uploadData"
              :file-list="fileList"
              :auto-upload="false"
              :on-success="uploadSuccess"
              action="/api/ontology"
              :limit="1"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
        </div>
        <div class="btnGroup">
          <el-button type="primary" @click="saveCreate()">确认</el-button>
          <el-button @click="closeCreate()">取消</el-button>
        </div>
      </div>
    </div>
    <div class="historyDetail coverBack" v-if="showHistoryData">
      <div class="centerBox">
        <div class="title flex">
          <span>详情</span>
          <i class="iconfont icon-guanbi" aria-hidden="true" @click="showHistoryData=false"></i>
        </div>
        <div class="content">
          <table class="gtable">
            <tr class="gheader">
              <th>序号</th>
              <th>操作</th>
              <th>源</th>
              <th>元素</th>
            </tr>
            <tr v-for="(item,index) in historyDetailList" :key="index">
              <td>{{index+1}}</td>
              <td>{{item.diffOperation}}</td>
              <td>{{item.sourceDocument}}</td>
              <td>{{item.lineElement}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <el-dialog title="选择导出类型" :visible.sync="dialogVisible" width="30%">
      <div>
        <el-select v-model="defaultType">
          <el-option
            v-for="item in exportType"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="exportData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SemanticTree from "./semantic/semanticTree.vue";
import SemanticType from "./semantic/semanticType.vue";
import SemanticProperty from "./semantic/semanticProperty.vue";
import SemanticDetail from "./semantic/semanticDetail.vue";
import TableFilter from "../../../../components/common/filter.vue";

export default {
  components: {
    SemanticDetail,
    SemanticProperty,
    SemanticType,
    SemanticTree,
    TableFilter
  },
  name: "manageOntology",
  computed: {
    ...mapGetters({
      list: "getOntologyList",
      selectOntology: "getSelectOntology",
      selectNode: "getSelectOntologyNode"
    })
  },
  data() {
    return {
      type: [
        {
          id: "type",
          name: "类"
        },
        {
          id: "property",
          name: "属性"
        },
        {
          id: "detail",
          name: "实例"
        }
      ],
      searchFilter: {
        ontologyId: "",
        filtrate: "all"
      },
      filterData: [
        {
          name: "全部"
        },
        {
          name: "已发布"
        }
      ],
      changeName: "",
      addCtrl: false,
      uploadInit: false,
      uploadData: {
        displayName: ""
      },
      fileList: [],
      showRight: "",
      selectType: "type",
      historyList: [],
      historyDetailList: [],
      showHistoryData: false,
      dialogVisible: false,
      exportType: [
        {
          label: "EXCEL",
          value: "xlsx"
        },
        {
          label: "RDF/XML",
          value: "owl"
        },
        {
          label: "Turtle",
          value: "ttl"
        },
        {
          label: "OWL/XML",
          value: "owx"
        },
        {
          label: "Manchester OWL Syntax",
          value: "omn"
        },
        {
          label: "Functional OWL Syntax",
          value: "ofn"
        }
      ],
      defaultType: "xlsx"
    };
  },
  methods: {
    //导出语义网
    exportOntology: function(item) {
      this.$store.dispatch("setSelectOntology", item);
      this.dialogVisible = true;
    },
    exportData: function() {
      this.dialogVisible = false;
      let url =
        window.location.origin +
        "/api/ontology/" +
        this.selectOntology.projectId +
        "/export?ontologyId=" +
        this.selectOntology.projectId +
        "&format=" +
        this.defaultType;
      window.open(url, "_blank");
    },

    //开始创建
    createOntologyCtrl: function() {
      this.addCtrl = true;
      this.fileList = [];
    },
    choseOntology: function(item, type) {
      this.$store.dispatch("setSelectOntology", item);
      this.changeName = item.displayName;
      this.showRight = type;
      if (type === "config") {
        this.$api.ontology.setSemanticTree(
          {
            projectName: item.displayName
          },
          "detail"
        );
        this.getVersion(item);
      } else if (type === "edit") {
        this.treeRoot = [
          {
            content: "Thing",
            label: "Thing",
            iri: "owl:Thing",
            projectId: item.projectId,
            id: "owl:Thing",
            show: false,
            child: []
          }
        ];
        this.$store.commit("setOntologyTree", this.treeRoot);
        this.$store.dispatch("setSelectOntologyNode", "");
      }
    },
    //筛选
    choseFilter: function(val) {
      console.log(val);
      if (val.name === "全部") {
        this.searchFilter.filtrate = "all";
      } else {
        this.searchFilter.filtrate = "release";
      }
      this.getVersion(this.selectOntology);
    },
    getVersion: function(item) {
      this.searchFilter.ontologyId = item.projectId;
      this.$api.ontology
        .setSemanticTree(this.searchFilter, "version")
        .then(res => {
          if (res.code === "ok") {
            this.historyList = res.changes;
          } else {
            this.historyList = [];
          }
        });
    },
    //保存语义网
    saveCreate: function() {
      if (this.uploadData.displayName !== "") {
        if (this.uploadInit) {
          if (this.$refs.uploadData.uploadFiles.length !== 0) {
            this.$loading();
            this.$refs.uploadData.submit();
          } else {
            this.$message({
              type: "info",
              message: "请选择上传的文件",
              duration: 1000
            });
          }
        } else {
          this.$api.ontology
            .setSemanticTree(
              {
                displayName: this.uploadData.displayName
              },
              "create"
            )
            .then(res => {
              if (res.code === "ok") {
                this.$message({
                  type: "success",
                  message: "创建成功",
                  duration: 1000
                });
                this.$store.dispatch("updateOntologyList");
                this.closeCreate();
              } else {
                this.$message({
                  type: "error",
                  message: res.msg,
                  duration: 1000
                });
              }
            });
        }
      } else {
        this.$message({
          type: "info",
          message: "名称不能为空",
          duration: 1000
        });
      }
    },
    //关闭创建
    closeCreate: function() {
      this.addCtrl = false;
      this.uploadData.displayName = "";
      this.uploadInit = false;
    },
    //删除语义网
    deleteOntology: function() {
      let item = this.selectOntology;
      this.$confirm("此操作将永久删除该语义网, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api.ontology
          .setSemanticTree(
            {
              ontologyId: item.projectId
            },
            "delete"
          )
          .then(res => {
            if (res.code === "ok") {
              this.$message({
                type: "success",
                message: "删除成功",
                duration: 1000
              });
              this.showRight = "";
              this.$store.dispatch("updateOntologyList");
            } else {
              this.$message({
                type: "error",
                message: res.msg,
                duration: 1000
              });
            }
          });
      });
    },
    //上传成功
    uploadSuccess: function() {
      this.$message({
        type: "success",
        message: "创建成功",
        duration: 1000
      });
      this.$loading().close();

      this.$store.dispatch("updateOntologyList");
      this.closeCreate();
    },
    //修改语义网
    changeOntologyName: function() {
      let item = this.selectOntology;
      this.$api.ontology
        .setSemanticTree(
          {
            displayName: this.changeName,
            ontologyId: item.projectId
          },
          "update"
        )
        .then(res => {
          if (res.code === "ok") {
            this.$message({
              type: "success",
              message: "修改成功",
              duration: 1000
            });
            this.$store.dispatch("updateOntologyList");
          } else {
            this.$message({
              type: "error",
              message: res.msg,
              duration: 1000
            });
          }
        });
    },
    //发布语义网
    releaseOntology: function(item) {
      this.$confirm("此操作将发布该语义网, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api.ontology
          .setSemanticTree(
            {
              ontologyId: item.projectId
            },
            "release"
          )
          .then(res => {
            if (res.code === "ok") {
              this.$message({
                type: "success",
                message: "发布成功",
                duration: 1000
              });
              this.$store.dispatch("updateOntologyList");
              //              if(item.projectId === this.selectOntology.projectId){
              //                let data = JSON.parse(JSON.stringify(this.selectOntology))
              //                data.isPublish = 1
              //                this.$store.dispatch('setSelectOntology',data)
              //
              //              }
              setTimeout(() => {
                this.list.forEach(e => {
                  if (e.projectId === item.projectId) {
                    this.choseOntology(e, "config");
                  }
                });
              }, 500);
            } else {
              this.$message({
                type: "error",
                message: res.msg,
                duration: 1000
              });
            }
          });
      });
    },
    updateName: function(val) {
      let arr = this.treeRoot;
      this.updateToTree(arr, this.selectNode.iri, val);
      this.$store.commit("setOntologyTree", arr);
    },
    updateToTree: function(arr, iri, value) {
      arr.forEach((e, index) => {
        if (e.iri === iri) {
          e.displayName = value;
          e.content = value;
        } else {
          if (e.child.length > 0) {
            this.updateToTree(e.child, iri, value);
          }
        }
      });
    },
    viewHistory: function(item) {
      this.historyDetailList = item.diif;
      this.showHistoryData = true;
    },
    //回滚
    rollbackVersion: function(item) {
      this.$confirm("此操作将使语义网回滚至此版本, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api.ontology
          .setSemanticTree(
            {
              ontologyId: this.selectOntology.projectId,
              revisionNum: item.revisionNum
            },
            "rollback"
          )
          .then(res => {
            if (res.code === "ok") {
              this.$message({
                type: "success",
                message: "回滚成功",
                duration: 1000
              });
              this.getVersion(this.selectOntology);
            } else {
              this.$message({
                type: "error",
                message: res.msg,
                duration: 1000
              });
            }
          });
      });
    }
  }
};
</script>

<style lang="less">
@import "../../../../styles/common";
.manageOntology {
  .bottom {
    padding: 0 1rem;
    .content {
      border: solid 1px #ddd;
      padding: 1rem;
      background: #fff;
      display: flex;
      .innerLeft {
        .innerContent {
          .ontologyList {
            height: 100%;
            overflow: auto;
            .tips {
              height: 3rem;
              line-height: 3rem;
              width: 100%;
              color: #666;
              font-size: 14px;
              text-align: center;
            }
          }
          .ontologyItem {
            width: 100%;
            height: 3rem;
            border-bottom: solid 1px #ddd;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .name {
              width: 50%;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              text-align: left;
              padding: 0 1rem;
            }
            .ctrl {
              span {
                margin-right: 1rem;
                color: @blue;
                cursor: pointer;
              }
            }
          }
          .active {
            background: #e4f0ff;
          }
        }
      }
      .innerRight {
        .rightBottom {
          .rightContent {
            padding: 1rem 0;
            .tips {
              height: 3rem;
              line-height: 3rem;
              width: 100%;
              color: #666;
              font-size: 14px;
              text-align: center;
            }
            .name {
              margin-bottom: 1rem;
              font-size: 14px;
              display: flex;
              align-items: center;
              p {
                width: 6rem;
                text-align: left;
              }
              .nameInput {
                width: 10rem;
              }
            }
          }
        }
        .topSelect {
          width: 100%;
          height: 2rem;
          min-height: 2rem;
          display: flex;
          span {
            width: 4rem;
            height: 2rem;
            line-height: 2rem;
            border: solid 1px #ddd;
            border-bottom: none;
            background: rgba(247, 249, 253, 1);
            border-radius: 2px 2px 0 0;
            font-size: 0.8rem;
            margin-right: 0.5rem;
            cursor: pointer;
            margin-top: 1px;
          }
          .active,
          span:hover {
            border-bottom: none;
            color: #2b86f6;
            z-index: 10;
            background: #fff;
          }
        }
        .contentBox {
          flex: 1;
          border: solid 1px #ddd;
          overflow: hidden;
          display: flex;
          padding: 1rem;
        }
      }
    }
  }
  .addSemantic {
    .centerBox {
      height: 30rem;

      .content {
        .addItem {
          margin-bottom: 1.5rem;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          p {
            width: 60px;
            min-width: 60px;
            font-size: 0.8rem;
            text-align: right;
            margin-right: 30px;
          }
        }
      }
    }
  }
  .historyDetail {
    .centerBox {
      width: 50rem;
      .content {
        display: block;
        overflow: auto;
        padding: 1rem;
      }
    }
  }
}
</style>
