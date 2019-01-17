/*
 * @Author: xunxingyuan 
 * @Date: 2019-01-17 14:24:47 
 * @Last Modified by:   xunxingyuan 
 * @Last Modified time: 2019-01-17 14:24:47 
 */
<template>
  <div class="qualityAnalysis container">
    <section class="partBox" v-if="chosePart=== 1">
      <div class="top">
        <p class="title">应答准确率自检</p>
      </div>
      <div class="bottom">
        <div class="content">
          <div class="tools">
            <el-button size="small" type="primary" @click="addValidation">+ 添加验证集</el-button>
            <el-button size="small" @click="viewAllReport">查看全部报告</el-button>
          </div>
          <div class="showBox">
            <div class="form">
              <table class="gtable">
                <tr class="gheader">
                  <th>序号</th>
                  <th>验证集名称</th>
                  <th>知识库</th>
                  <!--<th>使用渠道</th>-->
                  <!--<th>最新验证结果</th>-->
                  <th>操作</th>
                </tr>
                <tr v-for="(item,index) in validationList" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{item.setName}}</td>
                  <td>{{getRepository(item.repositoryId)}}</td>
                  <!--<td>企业号</td>-->
                  <!--<td></td>-->
                  <td>
                    <span
                      class="edit"
                      style="color: #2B86F6;margin-right: 1rem;"
                      @click="viewAuth(item)"
                    >验证集明细列表</span>
                    <span @click="deleteValidation(item)">删除</span>
                  </td>
                </tr>
              </table>
              <p class="tips" v-if="validationList.length===0">暂无相关数据</p>
            </div>
            <div style="margin-top: 10px" class="pageBox" v-if="validationList.length!==0">
              <el-pagination
                background
                layout="total, prev, pager, next"
                @current-change="handleCurrentChange"
                :page-size="filterData.rows"
                :total="validationTotal"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="partBox" v-if="chosePart=== 2">
      <div class="top">
        <i class="fas fa-arrow-left" style="margin-right: 1rem" @click="chosePart=1"></i>
        <p class="title">验证集列表</p>
      </div>
      <div class="bottom authPart">
        <div class="authResult">
          <div class="authTitle flex">最新验证结果
            <div v-if="reportDetail" style="margin-left: 1rem">
              <span v-if="reportDetail.success === '0'" style="color: #FF0000">验证失败</span>
              <span v-if="reportDetail.success === '1'" style="color: #6ce26c">验证成功</span>
            </div>
            <div v-else style="color: #2B86F6;margin-left: 1rem;">尚未进行验证</div>
          </div>
          <div class="authContent">
            <div class="contentItem" v-for="item in authData">
              <p>{{item.name}}</p>
              <span>{{item.value}}</span>
            </div>
          </div>
        </div>
        <div class="authDetail">
          <div class="flex">
            <el-button size="small" type="primary" @click="addValidationDataCtrl">+ 新增问题</el-button>
            <el-button size="small" @click="authValidation">
              <i class="fas fa-caret-right"></i> 开始验证
            </el-button>
            <el-button v-if="reportDetail" size="small" @click="viewReportDetailNew">查看报告</el-button>
          </div>
          <div class="detailContent">
            <table class="gtable">
              <tr class="gheader">
                <th>序号</th>
                <th>模拟问题</th>
                <th>目标知识</th>
                <!--<th>是否有效</th>-->
                <th>操作</th>
              </tr>
              <tr v-for="(item,index) in validationPageData">
                <td>{{index+1}}</td>
                <td :title="item.question">
                  <div class="text">{{item.question}}</div>
                </td>
                <td :title="item.content">
                  <div class="text">{{item.content}}</div>
                </td>
                <!--<td>有效</td>-->
                <td>
                  <span class="edit" @click="editValidationData(item)">编辑</span>
                  <span @click="deleteValidationData(item)">删除</span>
                </td>
              </tr>
            </table>
            <p class="tips" v-if="validationPageData.length===0">暂无相关数据</p>

            <div style="margin-top: 10px" class="pageBox" v-if="validationPageData.length!==0">
              <el-pagination
                background
                layout="total, prev, pager, next"
                @current-change="handleCurrentChange1"
                :page-size="validationFilter.rows"
                :total="detailTotal"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="partBox reportBox" v-if="chosePart=== 3">
      <div class="top">
        <i class="fas fa-arrow-left" style="margin-right: 1rem" @click="chosePart=1"></i>
        <p class="title">验证集报告</p>
      </div>
      <div class="bottom">
        <div class="content">
          <div class="tools">
            <p>验证集搜索</p>
            <el-input class="search"></el-input>
          </div>
          <div class="showBox">
            <div class="form">
              <table class="gtable">
                <tr class="gheader">
                  <th>序号</th>
                  <th>验证集名称</th>
                  <th>状态</th>
                  <!--<th>使用渠道</th>-->
                  <th>验证结果</th>
                  <th>验证开始时间</th>
                  <th>验证结束时间</th>
                  <th>操作</th>
                </tr>
                <tr v-for="(item,index) in allReportsList">
                  <td>{{index+1}}</td>
                  <td>{{item.data.setName}}</td>
                  <td>
                    <span v-if="item.report">已经完成</span>
                    <span v-else>尚未验证</span>
                  </td>
                  <!--<td>企业号</td>-->
                  <td>
                    <div v-if="item.report">
                      <span v-if="item.report.success == '0'" style="color: #FF0000">验证失败</span>
                      <span v-if="item.report.success == '1'" style="color: #6ce26c">验证成功</span>
                    </div>
                    <div v-else>
                      <span>尚未验证</span>
                    </div>
                  </td>
                  <td>
                    <div v-if="item.report">{{new Date(item.report.startTime).toLocaleString()}}</div>
                    <div v-else>
                      <span>尚未验证</span>
                    </div>
                  </td>
                  <td>
                    <div v-if="item.report">{{new Date(item.report.endTime).toLocaleString()}}</div>
                    <div v-else>
                      <span>尚未验证</span>
                    </div>
                  </td>
                  <td>
                    <span
                      v-if="item.report"
                      class="edit"
                      style="color: #2B86F6;"
                      @click="viewReportDetail(item)"
                    >查看详细报告</span>
                  </td>
                </tr>
              </table>
              <p class="tips" v-if="allReportsList.length===0">暂无相关数据</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="partBox reportBox" v-if="chosePart=== 4">
      <div class="top">
        <i class="fas fa-arrow-left" style="margin-right: 1rem" @click="back"></i>
        <p class="title">验证报告</p>
      </div>
      <div class="bottom authPart">
        <div class="authResult">
          <!--<div class="authTitle">-->
          <!--验证结束时间 {{new Date(reportDetail.endTime).toLocaleString()}}-->
          <!--</div>-->
          <div class="authContent">
            <div class="contentItem" v-for="item in authData">
              <p>{{item.name}}</p>
              <span>{{item.value}}</span>
            </div>
          </div>
        </div>
        <div class="authDetail">
          <div class="detailContent">
            <table class="gtable">
              <tr class="gheader">
                <th>序号</th>
                <th>模拟问题</th>
                <th>目标知识</th>
                <th>是否命中</th>
                <th>测试结果</th>
                <th>处理结果</th>
                <th>操作</th>
              </tr>
              <tr v-for="(item,index) in reportDetailList">
                <td>{{index+1}}</td>
                <td :title="item.question">
                  <div class="text">{{item.question}}</div>
                </td>
                <td :title="item.knowledge">
                  <div class="text">{{item.knowledge}}</div>
                </td>
                <td>
                  <span v-if="item.hit === '0'" style="color: #FF0000">未命中</span>
                  <span v-if="item.hit === '1'" style="color: #6ce26c">命中</span>
                </td>
                <td>{{item.testResult}}</td>
                <td>{{item.processResult}}</td>
                <td>
                  <span class="edit">编辑</span>
                </td>
              </tr>
            </table>
            <p class="tips" v-if="reportDetailList.length===0">暂无相关数据</p>
          </div>
        </div>
      </div>
    </section>
    <div class="coverBack addBox" v-if="add">
      <div class="centerBox">
        <div class="title">
          <span>新增验证集</span>
          <i class="fas fa-times" aria-hidden="true" @click="add = false"></i>
        </div>
        <div class="content">
          <div class="addItem">
            <span class="text">验证集名称：</span>
            <el-input class="itemInput" v-model="validationData.setName"></el-input>
          </div>
          <div class="addItem">
            <span class="text">知识库：</span>
            <el-select class="itemInput" v-model="validationData.repositoryId">
              <el-option
                v-for="item in libraryList"
                :key="item.repositoryId"
                :label="item.repositoryName"
                :value="item.repositoryId"
              ></el-option>
            </el-select>
          </div>
          <!--<div class="addItem">-->
          <!--<span class="text">渠道：</span>-->
          <!--<div  class="itemInput flex">-->
          <!--<el-checkbox-group v-model="validationData.channel">-->
          <!--<el-checkbox :label="item.label" v-for="item in type"></el-checkbox>-->
          <!--</el-checkbox-group>-->
          <!--</div>-->
          <!--</div>-->
          <div class="addItem">
            <span class="text">验证集描述：</span>
            <el-input class="itemInput" v-model="validationData.setDesc"></el-input>
          </div>
        </div>
        <div class="btnGroup">
          <el-button @click="add = false">取消</el-button>
          <el-button type="primary" @click="submitValidation">确认</el-button>
        </div>
      </div>
    </div>
    <div class="coverBack addQuestion" v-if="addQuestion">
      <div class="centerBox">
        <div class="title">
          <span>问题</span>
          <i class="fas fa-times" aria-hidden="true" @click="addQuestion = false"></i>
        </div>
        <div class="content">
          <div class="addItem">
            <span class="text">问题：</span>
            <el-input class="itemInput" v-model="validationDetailData.question"></el-input>
          </div>
          <div class="addItem">
            <span class="text">目标知识：</span>
            <el-select
              class="itemInput"
              v-model="validationDetailData.knowledgeId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入知识关键字"
              @change="knowledgeChange"
              :remote-method="remoteMethod"
            >
              <el-option
                v-for="item in knowledgeList"
                :key="item.qaId"
                :label="item.question"
                :value="item.qaId"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="btnGroup">
          <el-button @click="addQuestion = false">取消</el-button>
          <el-button type="primary" @click="submitQuestion">确认</el-button>
        </div>
      </div>
    </div>
    <div class="coverBack authConfirm" v-if="authConfirm.show">
      <div class="centerBox" v-if="authConfirm.confirm">
        <div class="title authTitle">
          <i class="fas fa-times" aria-hidden="true" @click="closeAuthConfirm"></i>
        </div>
        <div class="content">
          <p>确认验证渠道</p>
          <!--<el-checkbox-group v-model="checkList">-->
          <!--<el-checkbox :label="item.label" v-for="item in type"></el-checkbox>-->
          <!--</el-checkbox-group>-->
        </div>
        <div class="btnGroup">
          <el-button @click="closeAuthConfirm">取消</el-button>
          <el-button type="primary" @click="authConfirm.confirm = false">确认</el-button>
        </div>
      </div>
      <div class="centerBox" v-if="!authConfirm.confirm">
        <div class="content">
          <div class="flex result">
            <i class="fas fa-2x fa-check-circle"></i>
            <p>验证提交成功</p>
          </div>
          <div class="flex result">
            <i class="fas"></i>
            <p>
              验证报告结果可以在
              <span @click="viewReportDetailNew">查看报告</span>查询
            </p>
          </div>
        </div>
        <div class="btnGroup">
          <el-button type="primary" @click="closeAuthConfirm">知道了</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "qualityAnalysis",
  data() {
    return {
      filterData: {
        page: 1,
        rows: 10,
        robotId: ""
      },
      chosePart: 1,
      prePart: 1,
      add: false,

      //验证集列表数据
      validationList: [],
      libraryList: [],
      validationData: {
        setName: "",
        setDesc: "",
        robotId: "",
        channel: [],
        repositoryId: ""
      },
      validationTotal: 0,

      //验证集详情
      validationPageData: [],
      validationFilter: {
        setId: "",
        page: 1,
        rows: 10
      },
      detailTotal: 0,
      knowledgeList: [],
      validationDetailData: {
        question: "",
        knowledgeId: "",
        content: "",
        setId: ""
      },

      //所有报告
      allReportsList: [],
      //报告内容
      reportDetail: "",
      reportDetailList: [],

      type: [
        {
          label: "CC端"
        },
        {
          label: "企业号"
        },
        {
          label: "坐席端"
        },
        {
          label: "网站"
        },
        {
          label: "微信"
        }
      ],
      checkList: [],
      authData: [
        {
          name: "回复率",
          value: "暂无数据",
          id: 1
        },
        {
          name: "准确率",
          value: "暂无数据",
          id: 2
        },
        {
          name: "前三准确率",
          value: "暂无数据",
          id: 3
        },
        {
          name: "前五准确率",
          value: "暂无数据",
          id: 4
        }
      ],
      addQuestion: false,
      authConfirm: {
        show: false,
        confirm: true
      }
    };
  },
  methods: {
    _initData: function() {
      this.filterData.robotId = this.$route.query.robotId;
      this.$api.robotAnalysis.validation.getLibrary().then(res => {
        if (res.status === 200) {
          this.libraryList = res.data;
          this.$api.robotAnalysis.validation
            .getList(this.filterData)
            .then(res => {
              if (res.status === 200) {
                this.validationList = res.data.rows;
                this.validationTotal = res.data.total;
              }
            });
        }
      });
    },
    viewAuth: function(item) {
      this.prePart = 1;
      this.chosePart = 2;
      this.validationFilter.setId = item.setId;
      //        this.getAllReportData()
      this.getKnowledgeList("");
      this.getValidationDetail();
      this.getValidationReport(item.setId);
    },
    closeAuthConfirm: function() {
      this.authConfirm = {
        show: false,
        confirm: true
      };
    },
    back: function() {
      this.chosePart = this.prePart;
    },
    //      viewReport: function () {
    //        this.chosePart = 4
    //        this.authConfirm = {
    //          show: false,
    //          confirm: true
    //        }
    //      },
    viewReportDetail: function(item) {
      this.prePart = 3;
      this.chosePart = 4;
      this.getValidationReport(item.data.setId);
    },
    viewReportDetailNew: function() {
      this.prePart = 2;
      this.chosePart = 4;
      this.authConfirm = {
        show: false,
        confirm: true
      };
      this.getValidationReport(this.validationFilter.setId);
    },
    getRepository: function(val) {
      let name = "";
      this.libraryList.forEach(e => {
        if (e.repositoryId === val) {
          name = e.repositoryName;
        }
      });
      return name;
    },
    //添加验证集
    addValidation: function() {
      this.validationData.robotId = this.$route.query.robotId;
      this.add = true;
    },
    handleCurrentChange: function(val) {
      this.filterData.page = val;
      this._initData();
    },
    handleCurrentChange1: function(val) {
      this.validationFilter.page = val;
      this.getValidationDetail();
    },
    //保存验证集
    submitValidation: function() {
      if (
        this.validationData.setName.trim() &&
        this.validationData.repositoryId
      ) {
        this.$api.robotAnalysis.validation
          .addValidation(this.validationData)
          .then(res => {
            if (res.status === 200) {
              this.add = false;
              this.$message({
                type: "success",
                message: "创建成功",
                duration: 1000
              });
              this._initData();
            } else {
              this.$message({
                type: "error",
                message: res.msg,
                duration: 1000
              });
            }
          });
      } else {
        this.$message({
          type: "info",
          message: "请检查输入数据项是否缺失",
          duration: 1000
        });
      }
    },
    //删除验证集
    deleteValidation: function(item) {
      this.$confirm("此操作将永久删除该验证集, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api.robotAnalysis.validation
          .deleteValidation({
            setId: item.setId
          })
          .then(res => {
            if (res.status === 200) {
              this.add = false;
              this.$message({
                type: "success",
                message: "删除成功",
                duration: 1000
              });
              this._initData();
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

    //获取知识
    getKnowledgeList: function(val) {
      this.$api.robotAnalysis.validation
        .getKnowledgeList({
          robotId: this.$route.query.robotId,
          str: val
        })
        .then(res => {
          if (res.status === 200) {
            this.knowledgeList = res.data;
          }
        });
    },
    remoteMethod: function(query) {
      this.getKnowledgeList(query);
    },
    knowledgeChange: function(val) {
      console.log(val);
      this.knowledgeList.forEach(e => {
        if (e.qaId === val) {
          this.validationDetailData.content = e.question;
        }
      });
    },
    addValidationDataCtrl: function() {
      this.validationDetailData = {
        question: "",
        knowledgeId: "",
        content: "",
        setId: ""
      };
      this.addQuestion = true;
    },
    //添加/修改问题
    submitQuestion: function() {
      this.validationDetailData.setId = this.validationFilter.setId;

      if (
        this.validationDetailData.question.trim() &&
        this.validationDetailData.knowledgeId &&
        this.validationDetailData.content.trim()
      ) {
        if (this.validationDetailData.hasOwnProperty("dataId")) {
          this.$api.robotAnalysis.validation
            .updateValidationData(this.validationDetailData)
            .then(res => {
              if (res.status === 200) {
                this.$message({
                  type: "success",
                  message: "提交成功",
                  duration: 1000
                });
                this.getValidationDetail();
                this.addQuestion = false;
              } else {
                this.$message({
                  type: "error",
                  message: res.msg,
                  duration: 1000
                });
              }
            });
        } else {
          this.$api.robotAnalysis.validation
            .addValidationQestion(this.validationDetailData)
            .then(res => {
              if (res.status === 200) {
                this.$message({
                  type: "success",
                  message: "提交成功",
                  duration: 1000
                });
                this.getValidationDetail();
                this.addQuestion = false;
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
          message: "请检查输入数据项是否缺失",
          duration: 1000
        });
      }
    },
    //删除验证集数据项
    deleteValidationData: function(item) {
      this.$confirm("此操作将永久删除该问题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api.robotAnalysis.validation
          .deleteValidationData({
            dataId: item.dataId
          })
          .then(res => {
            if (res.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功",
                duration: 1000
              });
              this.getValidationDetail();
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
    //获取验证集数据
    getValidationDetail: function() {
      this.$api.robotAnalysis.validation
        .getValidationDetailList(this.validationFilter)
        .then(res => {
          if (res.status === 200) {
            this.validationPageData = res.data.rows;
            this.detailTotal = res.data.total;
          }
        });
    },
    //编辑数据
    editValidationData: function(item) {
      this.validationDetailData = {
        dataId: item.dataId,
        question: item.question,
        knowledgeId: item.knowledgeId,
        content: item.content,
        setId: item.setId
      };
      this.knowledgeList = [];
      this.knowledgeList.push({
        qaId: item.knowledgeId,
        question: item.content
      });
      this.addQuestion = true;
    },

    //开始验证
    authValidation: function() {
      this.$confirm("对该验证集进行验证, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api.robotAnalysis.validation
          .authValidation({
            robotId: this.$route.query.robotId,
            setId: this.validationFilter.setId
          })
          .then(res => {
            if (res.status === 200) {
              this.$message({
                type: "success",
                message: "提交验证成功",
                duration: 1000
              });
              this.getKnowledgeList("");
              this.getValidationDetail();
              this.getValidationReport(this.validationFilter.setId);
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

    //获取报告
    viewAllReport: function() {
      this.prePart = 1;
      this.chosePart = 3;
      this.getAllReportData();
    },

    //获取报告请求
    getAllReportData: function() {
      this.$api.robotAnalysis.validation
        .getAllReport({
          robotId: this.$route.query.robotId
        })
        .then(res => {
          if (res.status === 200) {
            this.allReportsList = res.data;
          }
        });
    },
    //获取验证集报告
    getValidationReport: function(setId) {
      //        this.reportDetail = ''
      this.$api.robotAnalysis.validation
        .getAllReport({
          robotId: this.$route.query.robotId
        })
        .then(res => {
          if (res.status === 200) {
            this.allReportsList = res.data;
            this.allReportsList.forEach(e => {
              if (
                e.report.hasOwnProperty("setId") &&
                e.report.setId === setId
              ) {
                this.reportDetail = e.report;
              }
            });
          }
        });

      this.$api.robotAnalysis.validation
        .getValidationReport({
          setId: setId
        })
        .then(res => {
          if (res.status === 200) {
            //            this.reportDetail = res.data
            this.reportDetailList = res.data;
            //            if(this.reportDetail){
            //              this.authData.forEach((e)=>{
            //                if(e.id === 4){
            //                  e.value = res.data.validationRight
            //                }
            //              })
            //            }else{
            //              this.authData = [{
            //                name: '回复率',
            //                value: '暂无数据',
            //                id: 1
            //              },{
            //                name: '准确率',
            //                value: '暂无数据',
            //                id: 2
            //              },{
            //                name: '前三准确率',
            //                value: '暂无数据',
            //                id: 3
            //              },{
            //                name: '前五准确率',
            //                value: '暂无数据',
            //                id: 4
            //              }]
            //            }
          }
        });
    }
  },
  mounted() {
    this._initData();
  },
  watch: {
    $route: function() {
      if (this.$route.name === "qualityAnalysis") {
        this._initData();
      }
    }
  }
};
</script>

<style lang="less">
.qualityAnalysis {
  .partBox {
    display: flex;
    flex-flow: column;
    height: 100%;
    .bottom {
      padding: 0 1rem;
      .content {
        border: solid 1px #ddd;
        background: #fff;
        padding-top: 1rem;
        .tools {
          justify-content: flex-start;
        }
      }
    }
    .authPart {
      padding: 0 1rem;
      display: flex;
      flex-flow: column;
      .authResult,
      .authDetail {
        background: #fff;
      }
      .authResult {
        height: 9rem;
        width: 100%;
        margin-bottom: 1rem;
        /*font-size: 14px;*/
        color: #666;
        .authTitle {
          height: 2rem;
          line-height: 2rem;
          text-align: left;
          padding: 0 1rem;
        }
        .authContent {
          height: 7rem;
          width: 100%;

          display: flex;
          align-items: center;
          .contentItem {
            flex: 1;
            height: 50%;
            border-left: solid 1px #ddd;
            text-align: left;
            padding-left: 2rem;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            flex-flow: column;
            span {
              font-size: 1.3rem;
              margin-top: 10px;
              color: #000;
            }
          }
          .contentItem:nth-child(1) {
            border: none;
          }
        }
      }
      .authDetail {
        flex: 1;
        width: 100%;
        padding: 1rem;
        overflow: auto;
        .detailContent {
          margin-top: 1rem;
          .edit {
            color: #2b86f6;
            margin-right: 1rem;
          }
        }
      }
    }
  }
  .reportBox {
    .bottom {
      padding: 0 1rem;
      .content {
        background: #fff;
        padding-top: 1rem;
        .tools {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          .search {
            width: 15rem;
            input {
              background: transparent;
            }
          }
        }
      }
    }
  }
  .addQuestion {
    .centerBox {
      height: 25rem;
      width: 30rem;
      .content {
        .addItem {
          .text {
            width: 5rem;
            font-size: 14px;
            text-align: right;
          }
        }
      }
    }
  }
  .addBox {
    .centerBox {
      height: 25rem;
      width: 40rem;
      .content {
        padding: 1rem 2rem;
        .addItem {
          .text {
            width: 6rem;
            font-size: 14px;
            text-align: right;
          }
        }
      }
    }
  }
  .authConfirm {
    .centerBox {
      height: 15rem;
      width: 35rem;
      .authTitle {
        background: #fff;
        display: flex;
        justify-content: flex-end;
      }
      .btnGroup {
        padding: 0 1rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      .content {
        text-align: left;
        font-size: 14px;
        p {
          width: 100%;
          margin-bottom: 10px;
        }
        .result {
          width: 100%;
          align-items: center;
          .fas {
            color: #11c115;
            width: 2rem;
            margin-right: 1rem;
          }
          p {
            margin-bottom: 0;
            span {
              margin: 0 10px;
              color: #2b86f6;
              cursor: pointer;
            }
          }
        }
        .result:nth-child(1) {
          margin-bottom: 1rem;
        }
      }
    }
  }
}
</style>
