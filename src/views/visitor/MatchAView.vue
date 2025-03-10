<template>
    <div class="finished-view">
      <el-form :model="queryForm" @submit.native.prevent="handleSearch" inline>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态">
            <el-option label="未开始" value="0"></el-option>
            <el-option label="进行中" value="1"></el-option>
            <el-option label="已结束" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="球员">
          <el-input v-model="queryForm.player" placeholder="请输入球员"></el-input>
        </el-form-item>
        <el-form-item label="院系">
          <el-input v-model="queryForm.department" placeholder="请输入院系"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
  
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="matchModeId" label="比赛ID"></el-table-column>
        <el-table-column prop="mode" label="模式"></el-table-column>
        <el-table-column prop="beginTime" label="开始时间"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ getStatusLabel(scope.row.status) }}
          </template>
        </el-table-column>
        <!-- 其他列根据需要添加 -->
      </el-table>
  
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryForm.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        queryForm: {
          status: '0', // 默认状态为“未开始”
          player: '',
          department: '',
          page: 1,
          pageSize: 10
        },
        tableData: [],
        total: 0
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
      getStatusLabel(status) {
        switch (status) {
          case 0:
            return '未开始';
          case 1:
            return '进行中';
          case 2:
            return '已结束';
          default:
            return '未知';
        }
      },
      handleSearch() {
        this.queryForm.page = 1; // 重置页码
        this.fetchData();
      },
      handleSizeChange(newSize) {
        this.queryForm.pageSize = newSize;
        this.fetchData();
      },
      handleCurrentChange(newPage) {
        this.queryForm.page = newPage;
        this.fetchData();
      },
      async fetchData() {
        try {
          let url;
          const params = {
            page: this.queryForm.page,
            pageSize: this.queryForm.pageSize,
            player: this.queryForm.player,
            department: this.queryForm.department
          };
  
          switch (this.queryForm.status) {
            case '0':
              url = '/api/match-a/unstart';
              break;
            case '1':
              url = '/api/match-a/started';
              break;
            case '2':
              url = '/api/match-a/finished';
              break;
            default:
              url = '/api/match-a/started'; // 默认查询进行中的比赛
          }
  
          const response = await axios.get(url, { params });
          this.tableData = response.data.data.records;
          this.total = response.data.data.total;
        } catch (error) {
          console.error('查询失败', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .finished-view {
    padding: 20px;
  }
  </style>