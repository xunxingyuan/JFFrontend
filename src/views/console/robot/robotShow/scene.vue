<template>
  <div class="scene container">
    <div class="top">
      <p class="title">多轮问答</p>
      <div class="topTools">
        <span
          v-for="item in sceneMode"
          class="flexCenter"
          :class="{'active': activeMode === item.id}"
          @click="activeMode = item.id"
        >{{item.name}}</span>
      </div>
    </div>
    <div class="bottom">
      <div class="content">
        <div class="innerLeft">
          <div class="innerTitle flexCenter">
            <span>分类</span>
            <div class="ctrl" v-if="userAuth.admin">
              <i class="iconfont icon-tianjia" @click="createCategory"></i>
              <i class="iconfont icon-bianji" @click="renameCategory"></i>
              <!--<i class="iconfont icon-fangdajing"></i>-->
              <i class="iconfont icon-shanchu" @click="removeCategory"></i>
            </div>
          </div>
          <div class="innerContent">
            <div class="treeBox" @click="choseRoot">
              <!--<el-tree :data="treeData" node-key="categoryId" :default-checked-keys="extendKey"  :props="defaultProps" @node-click="handleNodeClick"></el-tree>-->
              <tree-box
                :showAll="true"
                :treeData="treeData"
                :config="selfConfig"
                :selectedItem="choseCategory"
                @select="handleNodeClick"
              ></tree-box>
              <p
                v-if="treeData.length===0"
                style="margin-top: 2rem;margin-left:-1rem;font-size: 14px"
              >暂无分类目录</p>
            </div>
          </div>
        </div>
        <div class="innerRight scrollbar" v-show="activeMode === 1">
          <div
            class="rightTop"
            style="margin-bottom: 10px;display: flex;align-items: center;justify-content: space-between"
          >
            <div>
              <el-button
                type="primary"
                size="small"
                @click="addSceneItem"
                v-if="sceneLimit.create"
              >+ 新建场景</el-button>
            </div>
            <div>
              <el-input
                style="width: 200px"
                size="small"
                placeholder="请输入内容"
                v-model="searchWord"
                @keyup.enter.native="searchQa"
              >
                <i slot="suffix" class="el-input__icon el-icon-search" @click="searchQa"></i>
              </el-input>
              <el-button size="small" @click="showFilter = !showFilter">高级搜索</el-button>
            </div>

            <!--<el-button size="small">通用设置</el-button>-->
          </div>
          <div class="rightTools" v-if="checkList.length>0">
            <div class="toolsBox">
              <el-checkbox v-model="checkPage" label="本页全选" @change="choseOrUnChose"></el-checkbox>
              <div class="flex" style="margin-left: 2rem">
                <span
                  class="toolsItem"
                  v-for="(item,index) in checkTypeList"
                  :key="index"
                >{{item.name}}</span>
              </div>
            </div>
          </div>
          <div class="rightBottom">
            <div class="rightContent">
              <div class="filterBox" v-if="showFilter">
                <div class="filterItem">
                  <span class="itemName">搜索类型</span>
                  <el-checkbox-group v-model="selectTypeData" @change="handleCheckedTypesChange">
                    <el-checkbox
                      v-for="(type,index) in typeList"
                      :label="type.name"
                      :key="index"
                    >{{type.name}}</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="filterItem">
                  <span class="itemName">启用状态</span>
                  <el-select size="small" v-model="searchFilterNew.status" @change="searchQa">
                    <el-option
                      v-for="(item,index) in statusList"
                      :label="item.name"
                      :value="item.value"
                      :key="index"
                    ></el-option>
                  </el-select>
                </div>
                <div class="filterItem">
                  <span class="itemName">创建时间</span>
                  <el-date-picker
                    v-model="selectCreateTime"
                    @change="timeCreateChange"
                    size="small"
                    type="datetimerange"
                    value-format="timestamp"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </div>

                <div class="filterItem">
                  <span class="itemName">修改时间</span>
                  <el-date-picker
                    v-model="selectUpdateTime"
                    @change="timeUpdateChange"
                    size="small"
                    type="datetimerange"
                    value-format="timestamp"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </div>
              </div>
              <table class="gtable">
                <tr class="gheader">
                  <th>序号</th>
                  <th>场景</th>
                  <th>创建人</th>
                  <th>启用状态</th>
                  <th>编辑状态</th>
                  <th>创建时间</th>
                  <th>修改时间</th>
                  <th width="250">操作</th>
                </tr>
                <tr v-for="(item,index) in sceneList" :key="index">
                  <th>
                    <el-checkbox-group v-model="checkList">
                      <el-checkbox
                        :label="totalCount- 10*(searchFilter.page-1)-index"
                        :key="index+1"
                      ></el-checkbox>
                    </el-checkbox-group>
                    <!--{{index+1}}-->
                  </th>
                  <td
                    style="color: #2B86F6;"
                    @click="editScenesContent(item)"
                    :title="item.sceneName"
                  >
                    <div class="text">{{item.sceneName}}</div>
                  </td>
                  <td :title="item.createdBy">
                    <div class="text">{{item.createdBy}}</div>
                  </td>
                  <td>
                    <span v-if="item.status === 0" style="color: #666">未生效</span>
                    <span v-else style="color: #6ce26c">生效</span>
                  </td>
                  <td>编辑中</td>
                  <td :title="new Date(item.created).toLocaleString()">
                    <div class="text">{{new Date(item.created).toLocaleString()}}</div>
                  </td>
                  <td :title="new Date(item.updated).toLocaleString()">
                    <div class="text">{{new Date(item.updated).toLocaleString()}}</div>
                  </td>

                  <td>
                    <span class="edit" v-if="sceneLimit.submit">
                      <el-popover placement="bottom-start" width="13rem" trigger="hover">
                        <p>确定这个场景通过审核吗？</p>
                        <div style="text-align: center; margin-top: 1rem;">
                          <el-button type="primary" size="mini">通过</el-button>
                          <el-button size="mini" type="text">取消</el-button>
                        </div>
                        <span slot="reference">审核</span>
                      </el-popover>
                    </span>
                    <span
                      class="release"
                      @click.stop="releaseScene(item)"
                      v-if="sceneLimit.submit"
                    >同步场景</span>
                    <span class="edit" @click.stop="editScenes(item)" v-if="sceneLimit.edit">编辑</span>
                    <span
                      class="del"
                      @click.stop="removeScenes(item.sceneId)"
                      v-if="sceneLimit.delete"
                    >删除</span>
                  </td>
                </tr>
              </table>
              <p v-if="sceneList.length===0" class="tips">暂无相关场景</p>
              <div class="pageBox">
                <el-pagination
                  background
                  @current-change="handleCurrentChange"
                  layout="total,prev, pager, next"
                  :total="totalCount"
                ></el-pagination>
              </div>
            </div>
          </div>
        </div>
        <div class="innerRight" v-if="activeMode === 2&&!showAimlEditor">
          <div class="rightTop">
            <el-button type="primary" size="small" @click="uploadAiml">导入源码</el-button>
          </div>
          <div class="rightBottom">
            <div class="rightContent aimlContain">
              <div
                v-for="(item,index) in aimlList"
                class="aimlBox"
                @click="editAimlContent(item)"
                :key="index"
              >
                <div class="icon">aiml</div>
                <span>{{item.aimlName}}</span>
                <i title="删除" @click.stop="deleteAiml(item)" class="del fas fa-times"></i>
                <i title="发布" @click.stop="releaseAiml(item)" class="release fas fa-sync"></i>
              </div>
              <div class="aimltips" v-if="aimlList.length === 0">暂无相关AIML文件</div>
            </div>
          </div>
        </div>
        <div class="innerRight aimlBox" v-if="activeMode === 2&&showAimlEditor">
          <div class="rightTop" style="margin-bottom: 1rem;justify-content: flex-start;">
            <el-button type="primary" size="small" @click="saveAimlContent">保存</el-button>
            <el-button type="primary" size="small" @click="showAimlEditor = false">返回</el-button>
          </div>
          <div class="rightBottom aimlEditor">
            <ace-editor
              v-model="aimlCode"
              @init="editorInit"
              lang="html"
              theme="twilight"
              width="100%"
              height="100%"
            ></ace-editor>
          </div>
        </div>
      </div>
    </div>
    <section class="addScenesBox" v-if="addScenes">
      <div class="addBox" @click.stop>
        <div class="addTitle flexCenter">
          <span>场景</span>
          <i class="fas fa-times" aria-hidden="true" @click="addScenes = false"></i>
        </div>
        <div class="addContent">
          <div class="addItem">
            <p>场景名称：</p>
            <div class="itemInput">
              <el-input v-model="scenesDataInput" placeholder="请输入内容"></el-input>
              <span class="tips">仅用于命名区分场景名称，不作为计算判断使用</span>
            </div>
          </div>
          <div class="addItem">
            <p>场景分类：</p>
            <div class="itemInput">
              <el-cascader
                :props="cascaderConf"
                :options="treeData"
                v-model="selectedOptions"
                change-on-select
                @change="handleChange"
              ></el-cascader>
            </div>
          </div>
          <div class="addItem" v-if="selectedScenes!== ''">
            <p>启用状态：</p>
            <div class="itemInput">
              <el-switch
                v-model="scenesState"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </div>
          </div>
          <div class="addItem" v-if="selectedScenes=== ''">
            <p>文件上传:</p>
            <div class="itemInput">
              <el-switch v-model="initUpload" active-color="#13ce66" inactive-color="#D1D1D1"></el-switch>
            </div>
          </div>
        </div>
        <div class="addBtn">
          <el-button @click="addScenes = false">取消</el-button>
          <el-button type="primary" @click="createScenes()">确认</el-button>
        </div>
      </div>
      <div class="fileUpload" v-if="initUpload">
        <el-upload
          class="upload-demo"
          drag
          :file-list="fileListScene"
          ref="uploadScene"
          :auto-upload="false"
          :on-change="checkSceneFile"
          :data="uploadScene"
          :before-upload="beforeSceneUpload"
          :on-success="handleSceneUploadSuccess"
          :on-error="handleError"
          action="/api/scene"
          :limit="1"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传arff文件，且不超过10Mb</div>
        </el-upload>
      </div>
    </section>
    <section class="uploadAimlBox coverBack" v-if="showAimlUpload">
      <div class="centerBox">
        <div class="title">
          <span>源码上传</span>
          <i class="fas fa-times" aria-hidden="true" @click="showAimlUpload = false"></i>
        </div>
        <div class="content">
          <div class="addItem">
            <span>名称：</span>
            <el-input class="itemInput" v-model="serverName"></el-input>
          </div>
          <el-upload
            class="upload-demo"
            ref="upload"
            drag
            :file-list="fileList"
            :data="uploadArgs"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :on-change="checkFile"
            :on-success="handleUploadSuccess"
            :on-error="handleError"
            action="/api/scene/upload"
            :limit="1"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传aiml，且不超过10Mb</div>
          </el-upload>
        </div>
        <div class="btnGroup">
          <el-button @click="showAimlUpload = false">取消</el-button>
          <el-button type="primary" @click="submitUpload">确认</el-button>
        </div>
      </div>
    </section>
    <section class="showSceneEdit" v-if="sceneEdit">
      <scenes-box :scenes="selectedScenes" @close="sceneEdit = false" :userLimit="sceneLimit"></scenes-box>
    </section>
  </div>
</template>

<script>
import aceEditor from "vue2-ace-editor";
import TreeBox from "../../../../components/common/tree.vue";
import ScenesBox from "./scene/scenesBox.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "scene",
  components: {
    ScenesBox,
    TreeBox,
    aceEditor
  },
  computed: {
    ...mapGetters({
      userAuth: "getUserAuth"
    })
  },
  data() {
    return {
      sceneLimit: {
        edit: true,
        submit: true,
        create: true,
        view: true,
        delete: true
      },
      choseRobot: {
        robotId: ""
      },
      treeData: [],
      treeList: [],
      selfConfig: {
        name: "categoryName",
        child: "children",
        id: "categoryId",
        num: "sceneNum",
        numIntro: "场景数量"
      },
      defaultProps: {
        children: "children",
        label: "categoryName"
      },
      aimlProps: {
        child: "children",
        name: "categoryName",
        id: "categoryId"
      },
      choseCategory: "",
      sceneList: [],
      searchFilter: {
        page: 1,
        categoryId: "",
        robotId: ""
      },
      showFilter: false,
      searchType: "search",
      searchFilterNew: {
        page: 1,
        limit: 10,
        content: "",
        status: 1,
        createdStart: "",
        createdEnd: "",
        updatedStart: "",
        updatedEnd: "",
        scene: 1,
        entrance: 1,
        node: 1,
        answer: 1
      },
      selectTypeData: ["问答名称", "入口问题", "问答内容", "问答回答"],
      selectCreateTime: [],
      selectUpdateTime: [],
      typeList: [
        {
          name: "问答名称"
        },
        {
          name: "入口问题"
        },
        {
          name: "问答内容"
        },
        {
          name: "问答回答"
        }
      ],

      statusList: [
        {
          name: "全部",
          value: ""
        },
        {
          name: "生效",
          value: 1
        },
        {
          name: "未生效",
          value: 0
        }
      ],

      searchWord: "",
      totalCount: 0,
      addScenes: false,
      selectedScenes: "",
      scenesDataInput: "",
      selectedOptions: [],
      scenesState: "",
      sceneType: "",
      cascaderConf: {
        label: "categoryName",
        value: "categoryId"
      },
      typeArr: [
        {
          value: "SE",
          lable: "普通场景"
        },
        {
          value: "AE",
          lable: "AIML场景"
        }
      ],
      initUpload: false,
      extendKey: ["0"],
      sceneMode: [
        {
          id: 1,
          name: "编辑模式"
        },
        {
          id: 2,
          name: "aiml模式"
        }
      ],
      //        sceneMode:[{
      //          id:1,
      //          name: '编辑模式'
      //        }],
      activeMode: 1,
      aimlTree: [],
      aimlList: [],
      aimlCode: "",
      choseAiml: "",
      showAimlEditor: false,
      showAimlUpload: false,
      serverName: "",
      uploadArgs: {
        serviceName: "",
        categoryId: "",
        robotId: ""
      },
      uploadScene: {
        sceneName: "",
        categoryId: "",
        sceneType: "",
        robotId: ""
      },
      sceneEdit: false,
      fileList: [],
      fileListScene: [],
      checkList: [],
      checkPage: false,
      checkTypeList: [
        {
          name: "审核"
        },
        {
          name: "启用"
        },
        {
          name: "停用"
        },
        {
          name: "删除"
        },
        {
          name: "设定有效时间"
        }
      ]
    };
  },
  methods: {
    //修改权限
    changeUserLimit: function() {
      let robotId =
        window.sessionStorage.getItem("robotId") || this.$route.query.robotId;
      if (!this.userAuth.admin) {
        let authData = this.userAuth.data.categoryAuthority[robotId];
        if (authData) {
          authData.forEach(e => {
            if (e.conversationType === "scene") {
              this.sceneLimit.submit = e.audit === 1;
              this.sceneLimit.create = e.create === 1;
              this.sceneLimit.edit = e.edit === 1;
              this.sceneLimit["delete"] = e.delete === 1;
              this.sceneLimit.view = e.view === 1;
            }
          });
        }
      }
    },
    //分类点击
    handleNodeClick: function(val) {
      this.choseCategory = val;
      this.searchType = "node";
      this.searchFilter = {
        page: 1,
        categoryId: val.categoryId,
        robotId: this.choseRobot.robotId
      };
      this.getSceneList();
      this.getAimlListData();
      this.showAimlEditor = false;
    },
    //点击空白
    choseRoot: function() {
      this.choseCategory = "";
    },

    //获取aiml场景
    getAimlListData: function() {
      this.$api.scene.scene
        .getAimlList({
          robotId: this.choseRobot.robotId,
          categoryId: this.choseCategory.categoryId
        })
        .then(res => {
          if (res.status === 200) {
            this.aimlList = res.data;
          } else {
            this.$message({
              type: "error",
              message: res.msg,
              duration: 1000
            });
          }
        });
    },
    //获取分类树
    getCategory: function() {
      let role = window.sessionStorage.getItem("userRole");
      let userId = window.sessionStorage.getItem("userId");
      if (role === "admin") {
        this.$api.scene.category
          .getTree({
            robotId: this.choseRobot.robotId
          })
          .then(res => {
            if (res.status === 200) {
              this.treeData = [];
              this.treeList = [];
              this.treeData = res.tree.children;
              this.getTreeList(this.treeData, this.treeList);
            }
          });
      } else {
        this.$api.user.menu
          .getUserMenu({
            botId: this.choseRobot.robotId,
            userId: userId
          })
          .then(res => {
            if (res.status === 200) {
              this.treeData = [];
              this.treeList = [];
              this.treeData = res.data.scene;
              this.getTreeList(this.treeData, this.treeList);
            }
          });
      }
    },
    handleCurrentChange: function(val) {
      this.searchFilter.page = val;
      this.searchFilterNew.page = val;
      if (this.searchType === "search") {
        this.searchQaCtrl();
      } else {
        this.getSceneList();
      }
    },
    handleCheckedTypesChange: function(val) {
      this.searchFilterNew.content = 0;
      this.searchFilterNew.entrance = 0;
      this.searchFilterNew.node = 0;
      this.searchFilterNew.answer = 0;
      val.forEach(e => {
        if (e === "问答名称") {
          this.searchFilterNew.content = 1;
        } else if (e === "入口问题") {
          this.searchFilterNew.entrance = 1;
        } else if (e === "问答内容") {
          this.searchFilterNew.node = 1;
        } else if (e === "问答回答") {
          this.searchFilterNew.answer = 1;
        }
      });
      this.searchQa();
    },
    timeCreateChange: function(val) {
      if (val) {
        this.searchFilterNew.createdStart = val[0];
        this.searchFilterNew.createdEnd = val[1];
      } else {
        this.searchFilterNew.createdStart = "";
        this.searchFilterNew.createdEnd = "";
      }
      this.searchQa();
    },
    timeUpdateChange: function(val) {
      if (val) {
        this.searchFilterNew.updatedStart = val[0];
        this.searchFilterNew.updatedEnd = val[1];
      } else {
        this.searchFilterNew.updatedStart = "";
        this.searchFilterNew.updatedEnd = "";
      }
      this.searchQa();
    },
    //获取分类场景
    getSceneList: function() {
      this.checkList = [];
      this.$api.scene.scene.getSceneList(this.searchFilter).then(res => {
        if (res.status === 200) {
          this.sceneList = res.result.list;
          this.totalCount = res.result.totalCount;
        }
      });
    },
    //搜索场景
    searchQa: function() {
      this.searchType = "search";
      this.searchFilterNew.page = 1;
      this.searchQaCtrl();
    },
    searchQaCtrl: function() {
      this.searchFilterNew.content = this.searchWord;

      let filerData = {};
      for (let data in this.searchFilterNew) {
        if (this.searchFilterNew[data] !== "") {
          filerData[data] = this.searchFilterNew[data];
        }
      }

      this.$api.scene.scene.searchScenes(filerData).then(res => {
        if (res.status === 200) {
          this.sceneList = res.result.list;
          this.totalCount = res.result.totalCount;
        }
      });
    },

    //创建分类
    createCategory: function() {
      if (!this.choseCategory) {
        this.choseCategory = {
          categoryName: "全部分类",
          categoryId: 0
        };
      }
      this.$prompt(
        "在分类（" +
          this.choseCategory.categoryName +
          ")下创建分类，请输入分类名称",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      ).then(({ value }) => {
        this.$api.scene.category
          .addCategory({
            categoryName: value,
            categoryPid: this.choseCategory.categoryId,
            robotId: this.choseRobot.robotId
          })
          .then(res => {
            if (res.status === 200) {
              this.$message({
                message: "创建成功",
                type: "success",
                duration: 1000
              });
              let categoryData = {
                categoryName: value,
                categoryId: res.categoryId,
                categoryPid: this.choseCategory.categoryId,
                robotId: this.choseRobot.robotId,
                children: []
              };
              this.addToPath(
                this.treeData,
                categoryData,
                this.choseCategory.categoryId
              );
            } else {
              this.$message({
                message: res.msg,
                type: "info",
                duration: 1000
              });
            }
          });
      });
    },
    //移除分类
    removeCategory: function() {
      if (this.choseCategory) {
        this.$confirm(
          "是否移除分类：" + this.choseCategory.categoryName,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          }
        ).then(value => {
          this.$api.scene.category
            .deleteCategory({
              categoryId: this.choseCategory.categoryId,
              robotId: this.choseRobot.robotId
            })
            .then(res => {
              if (res.status === 200) {
                this.removeFromPath(
                  this.treeData,
                  this.choseCategory.categoryId
                );
                this.choseCategory = "";
              } else {
                this.$message({
                  message: res.msg,
                  type: "info",
                  duration: 1000
                });
              }
            });
        });
      } else {
        this.$message({
          message: "请先选择需要删除的分类",
          type: "info",
          duration: 1000
        });
      }
    },
    //修改分类名称
    renameCategory: function() {
      if (this.choseCategory) {
        this.$prompt(
          "重命名分类（" +
            this.choseCategory.categoryName +
            "),请输入要修改的分类名称",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          }
        ).then(value => {
          console.log(value);
          this.$api.scene.category
            .editCategory({
              categoryName: value.value,
              categoryId: this.choseCategory.categoryId,
              robotId: this.choseRobot.robotId,
              categoryPid: this.choseCategory.categoryPid
            })
            .then(res => {
              if (res.status === 200) {
                this.renamePath(
                  this.treeData,
                  value,
                  this.choseCategory.categoryId
                );
              } else {
                this.$message({
                  message: res.msg,
                  type: "info",
                  duration: 1000
                });
              }
            });
        });
      } else {
        this.$message({
          message: "请先选择需要重命名的分类",
          type: "info",
          duration: 1000
        });
      }
    },
    //全选反选
    choseOrUnChose: function() {
      let len = this.sceneList.length;
      if (this.checkList.length === len) {
        this.checkList = [];
      } else {
        this.sceneList.forEach((e, index) => {
          let indexResult =
            this.totalCount - 10 * (this.searchFilter.page - 1) - index;

          if (this.checkList.indexOf(indexResult) === -1) {
            this.checkList.push(indexResult);
          }
        });
      }
    },

    //add
    addToPath: function(arr, data, id) {
      arr.forEach(e => {
        if (e.categoryId === id) {
          e.children.push(data);
        } else {
          if (e.children.length !== 0) {
            this.addToPath(e.children, data, id);
          }
        }
      });
    },
    //delete
    removeFromPath: function(arr, id) {
      arr.forEach((e, index) => {
        if (e.categoryId === id) {
          arr.splice(index, 1);
        } else {
          if (e.children.length !== 0) {
            this.removeFromPath(e.children, id);
          }
        }
      });
    },
    //rename
    renamePath: function(arr, name, id) {
      arr.forEach((e, index) => {
        if (e.categoryId === id) {
          e.categoryName = name;
        } else {
          if (e.children.length !== 0) {
            this.renamePath(e.children, name, id);
          }
        }
      });
    },
    //分类变化
    handleChange: function(value) {
      console.log(value);
    },
    //添加场景
    addSceneItem: function() {
      if (this.choseCategory && this.choseCategory.categoryId !== 0) {
        let arr = [];
        this.getPathById(this.treeList, arr, this.choseCategory.categoryId);
        this.selectedOptions = arr;
        this.selectedScenes = "";
        this.scenesDataInput = "";
        this.sceneType = "SE";
        this.scenesState = "1";
        this.addScenes = true;
      } else {
        this.$message({
          message: "请先选择需要创建场景的分类",
          type: "info",
          duration: 1000
        });
      }
    },
    //编辑场景
    editScenes: function(item) {
      this.selectedScenes = item;
      this.scenesDataInput = item.sceneName;
      this.sceneType = item.sceneType;
      this.scenesState = item.status;
      let arr = [];
      this.getPathById(this.treeList, arr, this.choseCategory.categoryId);
      this.selectedOptions = arr;
      this.addScenes = true;
    },
    //编辑场景内容
    editScenesContent: function(item) {
      if (this.sceneLimit.view) {
        this.selectedScenes = item;
        this.sceneEdit = true;
        this.$store.dispatch("setScenesHistory", {
          type: "init",
          data: item
        });
      }
    },
    //提交创建/修改
    createScenes: function() {
      let categoryId = this.selectedOptions[this.selectedOptions.length - 1];

      if (this.scenesDataInput.trim() !== "") {
        let data = {
          robotId: this.choseRobot.robotId,
          sceneName: this.scenesDataInput.trim(),
          categoryId: categoryId,
          sceneType: this.sceneType,
          status: this.scenesState
        };
        if (this.selectedScenes === "") {
          if (this.initUpload) {
            this.uploadScene.sceneName = this.scenesDataInput.trim();
            this.uploadScene.robotId = this.choseRobot.robotId;
            this.uploadScene.categoryId = categoryId;
            this.uploadScene.sceneType = this.sceneType;
            this.uploadScene.status = 0;
            this.$loading();
            this.$refs.uploadScene.submit();
          } else {
            this.$api.scene.scene.addScenes(data).then(res => {
              if (res.code === "ok") {
                this.addScenes = false;
                this.$message({
                  type: "success",
                  message: "添加成功",
                  duration: 1000
                });
                this.getSceneList();
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
          data = {
            robotId: this.choseRobot.robotId,
            sceneId: this.selectedScenes.sceneId,
            sceneName: this.scenesDataInput.trim(),
            categoryId: categoryId,
            sceneType: this.sceneType,
            status: this.scenesState
          };
          this.$api.scene.scene.editScenes(data).then(res => {
            if (res.code === "ok") {
              this.addScenes = false;
              this.$message({
                type: "success",
                message: "修改成功",
                duration: 1000
              });
              this.getSceneList();
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
          message: "场景名称不能为空",
          duration: 1000
        });
      }
    },
    //上传成功
    handleSceneUploadSuccess: function() {
      this.getSceneList();
      this.$loading().close();
      this.addScenes = false;
    },
    //发布场景
    releaseScene: function(item) {
      let _self = this;
      _self
        .$confirm("此操作将同步该场景内容, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.$api.scene.scene
            .releaseScene({
              sceneId: item.sceneId,
              robotId: this.choseRobot.robotId
            })
            .then(res => {
              if (res.code === "ok") {
                this.$message({
                  type: "success",
                  message: "同步成功",
                  duration: 1000
                });
                this.getSceneList();
                this.getAimlListData();
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
    //删除场景
    removeScenes: function(id) {
      let _self = this;
      _self
        .$confirm("此操作将永久删除该场景, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _self
            .$confirm("此操作将永久删除该场景并且不可恢复?", "警告", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {
              let reqData = {
                sceneId: id,
                robotId: this.choseRobot.robotId
              };
              this.$api.scene.scene.deleteScenes(reqData).then(res => {
                if (res.code === "ok") {
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                    duration: 1000
                  });
                  this.getSceneList();
                } else {
                  this.$message({
                    type: "error",
                    message: res.msg,
                    duration: 1000
                  });
                }
              });
            });
        });
    },
    //获取当前场景分类目录
    getPathById: function(tree, arr, id) {
      arr.unshift(id);
      tree.forEach(e => {
        if (e.categoryId === id) {
          if (e.categoryPid !== "0") {
            this.getPathById(tree, arr, e.categoryPid);
          } else {
            arr.unshift("0");
          }
        }
      });
    },
    getTreeList: function(tree, arr) {
      if (tree.length > 0) {
        tree.forEach(e => {
          arr.push(e);
          if (e.children.length > 0) {
            this.getTreeList(e.children, arr);
          }
        });
      }
    },
    editorInit: function() {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/html");
      require("brace/mode/javascript"); //language
      require("brace/mode/less");
      require("brace/theme/chrome");
      require("brace/theme/twilight");
      require("brace/snippets/javascript"); //snippet
    },
    //获取aiml
    editAimlContent: function(item) {
      this.choseAiml = item;
      this.$api.scene.scene
        .getAimlContent({
          robotId: this.choseRobot.robotId,
          aimlId: item.aimlId,
          categoryId: this.choseCategory.categoryId
        })
        .then(res => {
          if (res.status === 200) {
            this.aimlCode = res.data;
            this.showAimlEditor = true;
          } else {
            this.$message({
              type: "error",
              message: res.msg,
              duration: 1000
            });
          }
        });
    },
    //保存
    saveAimlContent: function() {
      this.$api.scene.scene
        .saveAiml({
          robotId: this.choseRobot.robotId,
          aimlId: this.choseAiml.aimlId,
          categoryId: this.choseCategory.categoryId,
          content: this.aimlCode
        })
        .then(res => {
          if (res.status === 200) {
            this.$message({
              type: "success",
              message: "保存成功",
              duration: 1000
            });
          } else {
            this.$message({
              type: "error",
              message: res.msg,
              duration: 1000
            });
          }
        });
    },
    //删除aiml
    deleteAiml: function(item) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api.scene.scene
          .deleteAiml({
            robotId: this.choseRobot.robotId,
            aimlId: item.aimlId,
            categoryId: this.choseCategory.categoryId
          })
          .then(res => {
            if (res.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            } else {
              this.$message({
                type: "info",
                message: res.msg
              });
            }
          });
      });
    },
    //发布
    releaseAiml: function(item) {
      this.$confirm("此操作将发布该aiml文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api.scene.scene
          .releaseAiml({
            robotId: this.choseRobot.robotId,
            aimlId: item.aimlId
          })
          .then(res => {
            if (res.status === 200) {
              this.$message({
                type: "success",
                message: "发布成功!"
              });
            } else {
              this.$message({
                type: "info",
                message: res.msg
              });
            }
          });
      });
    },
    //上传aiml
    uploadAiml: function() {
      if (this.choseCategory) {
        if (this.choseCategory.categoryId != "0") {
          this.showAimlUpload = true;
        } else {
          this.$message({
            type: "info",
            message: "根节点不能上传",
            duration: 1000
          });
        }
      } else {
        this.$message({
          type: "info",
          message: "请先选择导入的分类目录",
          duration: 1000
        });
      }
    },
    checkFile(file, fileList) {
      let index = file.name.lastIndexOf(".") + 1;
      let suffix = file.name.slice(index);
      const isCorretType = suffix === "aiml";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isCorretType) {
        this.$message({
          message: "文件类型只能为aiml！",
          type: "error",
          duration: 1500
        });
        this.fileListScene = [];
        this.$loading().close();
        return false;
      }
      if (!isLt10M) {
        this.$message({
          message: "文件大小不能超过10M！",
          type: "error",
          duration: 1500
        });
        this.fileListScene = [];
        this.$loading().close();
        return false;
      }
      return true;
    },
    checkSceneFile: function(file, fileList) {
      let index = file.name.lastIndexOf(".") + 1;
      let suffix = file.name.slice(index);
      const isCorretType = suffix === "arff";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isCorretType) {
        this.$message({
          message: "文件类型只能为arff",
          type: "error",
          duration: 1500
        });
        this.fileList = [];
        this.$loading().close();
        return false;
      }
      if (!isLt10M) {
        this.$message({
          message: "文件大小不能超过10M！",
          type: "error",
          duration: 1500
        });
        this.fileList = [];
        this.$loading().close();
        return false;
      }
      return true;
    },
    beforeSceneUpload: function(file) {
      let flag = this.checkSceneFile(file);
      if (!flag) {
        return false;
      }
      return true;
    },
    beforeUpload(file) {
      let flag = this.checkFile(file);
      if (!flag) {
        return false;
      }
      if (this.isUploadArff) {
        if (this.serverName === "") {
          this.$message({
            message: "请输入服务名称！",
            duration: 1000
          });
          return false;
        }
      }
      this.uploadArgs.serviceName = this.serverName;
      this.uploadArgs.categoryId = this.choseCategory.categoryId;
      this.uploadArgs.robotId = this.choseRobot.robotId;
      return true;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleUploadSuccess() {
      this.$message({
        message: "上传成功！",
        type: "success",
        duration: 1000
      });
      this.showAimlUpload = false;
      this.getAimlListData();
    },
    handleError() {
      this.$loading().close();
      this.$message({
        message: "上传失败！",
        type: "error",
        duration: 1000
      });
    },
    checkCategoryFromTree: function(tree, id, result, value) {
      tree.forEach(e => {
        if (e.categoryId === id) {
          result = e.children;
          console.log(result);
          result.forEach(ele => {
            if (ele.categoryName === value) {
              this.addToPath(
                this.treeData,
                {
                  categoryName: value,
                  categoryId: ele.categoryId,
                  categoryPid: this.choseCategory.categoryId,
                  robotId: this.choseRobot.robotId,
                  children: []
                },
                this.choseCategory.categoryId
              );
            }
          });
        } else if (e.children.length > 0) {
          this.checkCategoryFromTree(e.children, id, result);
        }
      });
    }
  },
  mounted() {
    this.choseRobot.robotId = window.sessionStorage.getItem("robotId");
    this.getCategory();
    this.changeUserLimit();
  },
  watch: {
    $route: function() {
      this.choseRobot.robotId = window.sessionStorage.getItem("robotId");
      if (this.$route.name === "scene") {
        this.getCategory();
        this.choseCategory = "";
        this.sceneList = [];
        this.changeUserLimit();
      }
    },
    checkList: function() {
      if (this.sceneList.length === this.checkList.length) {
        this.checkPage = true;
      } else {
        this.checkPage = false;
      }
    },
    userAuth: function() {
      if (this.$route.name === "scene") {
        this.changeUserLimit();
      }
    }
  }
};
</script>

<style lang="less">
@import "../../../../styles/common";
.scene {
  .bottom {
    .content {
      display: flex;
      padding-bottom: 1rem;
      .innerLeft {
        .innerContent {
          flex: 1;
          .treeBox {
            height: 100%;
            overflow-y: auto;
            padding-left: 1rem;
            .el-tree-node__content {
              height: 2rem;
            }
          }
        }
      }
    }
  }
  .addScenesBox {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    .addBox {
      width: 30rem;
      height: 30rem;
      background: #fff;
      display: flex;
      flex-flow: column;
      .addTitle {
        height: 3rem;
        background: #f3f3f3;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
      }
      .addContent {
        flex: 1;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        padding-top: 1rem;
        .addItem {
          /*margin-bottom: 1rem;*/
          width: 100%;
          height: 4rem;
          padding: 0 3rem;
          display: flex;
          align-items: center;
          p {
            text-align: left;
            width: 5rem;
            min-width: 5rem;
            font-size: 0.9rem;
          }
          .itemInput {
            flex: 1;
            display: flex;
            position: relative;

            .tips {
              font-size: 12px;
              color: #999;
              position: absolute;
              left: 0;
              bottom: -1rem;
            }
            .el-cascader {
              flex: 1;
            }
          }
        }
        .addItem:nth-child(1) {
          margin-bottom: 0.5rem;
        }
      }
      .addBtn {
        height: 4rem;
      }
    }
    .fileUpload {
      width: 25rem;
      height: 20rem;
      background: #fff;
      margin-left: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
