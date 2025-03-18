<template>
    <div>
      <el-button 
        @click="$router.go(-1)" 
        style="margin-bottom:20px"
      >返回活动列表</el-button>
      
      <el-button 
        type="primary" 
        style="margin-bottom:20px"
        @click="dialogVisible = true"
      >新建比赛</el-button>
  
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="teamADepartment" label="队伍A部门" width="120"></el-table-column>
        <el-table-column prop="teamBDepartment" label="队伍B部门" width="120"></el-table-column>
        <el-table-column label="当前小节" width="100">
          <template slot-scope="scope">
            第{{ scope.row.currentSection }}节
          </template>
        </el-table-column>
        <el-table-column label="比分" width="120">
          <template slot-scope="scope">
            {{ scope.row.teamAScore }} : {{ scope.row.teamBScore }}
          </template>
        </el-table-column>
        <el-table-column prop="venueNumber" label="场地编号" width="100"></el-table-column>
        <el-table-column label="比赛状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="statusType[scope.row.status]">
              {{ statusText[scope.row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" width="180">
          <template slot-scope="scope">
            {{ formatDateTime(scope.row.beginTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页 -->
      <el-pagination
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next"
        style="margin-top:20px"
      ></el-pagination>
  
      <!-- 新建对话框 -->
      <el-dialog title="新建比赛B" :visible.sync="dialogVisible" width="600px">
        <el-form :model="form" label-width="120px">
          <el-form-item label="每小节分数" required>
            <el-input-number 
              v-model="form.sectionScore"
              :min="1"
            ></el-input-number>
          </el-form-item>
          
          <el-form-item label="场地编号" required>
            <el-input-number
              v-model="form.venueNumber"
              :min="1"
            ></el-input-number>
          </el-form-item>
  
          <el-form-item label="开始时间" required>
            <el-date-picker
              v-model="form.beginTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
  
          <el-form-item label="队伍A部门">
            <el-input v-model="form.teamADepartment"></el-input>
          </el-form-item>
  
          <el-form-item label="队伍B部门">
            <el-input v-model="form.teamBDepartment"></el-input>
          </el-form-item>
        </el-form>
  
        <span slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCreate">保存</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: ['eventId'],
    data() {
      return {
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        dialogVisible: false,
        statusText: {
          0: '未开始',
          1: '进行中',
          2: '已结束'
        },
        statusType: {
          0: 'info',
          1: 'warning',
          2: 'success'
        },
        form: {
          eventId: this.eventId,
          sectionScore: 21,
          venueNumber: 1,
          beginTime: '',
          teamADepartment: '',
          teamBDepartment: ''
        }
      }
    },
    created() {
      this.loadData();
    },
    methods: {
      async loadData() {
        try {
          const res = await axios.post('/api/admin-match/page-b', {
            eventId: this.eventId,
            page: this.currentPage,
            pageSize: this.pageSize
          }, {
            headers: { 'admin_token': localStorage.getItem('admin_token') }
          });
  
          this.tableData = res.data.data.records;
          this.total = res.data.data.total;
        } catch (error) {
          console.error('加载比赛数据失败:', error);
        }
      },
      async handleCreate() {
        try {
          await axios.post('/api/admin-match/save-b', this.form, {
            headers: { 'admin_token': localStorage.getItem('admin_token') }
          });
          this.$message.success('创建成功');
          this.dialogVisible = false;
          this.loadData();
        } catch (error) {
          this.$message.error('创建失败');
          console.error(error);
        }
      },
      formatDateTime(datetimeStr) {
        if (!datetimeStr) return '-';
        const date = new Date(datetimeStr);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      },
      handlePageChange(page) {
        this.currentPage = page;
        this.loadData();
      },
      handleSizeChange(size) {
        this.pageSize = size;
        this.loadData();
      },
      handleEdit(row) {
        // 待实现编辑逻辑
        console.log('编辑比赛:', row);
      }
    }
  }
  </script>
  
  <style scoped>
  .el-table {
    margin-top: 20px;
  }
  </style>