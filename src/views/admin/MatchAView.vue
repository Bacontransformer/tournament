<template>
    <div>
      <el-button 
        type="primary" 
        style="margin-bottom:20px"
        @click="goToCreate"
      >+ 新建比赛</el-button>
  
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="teamADepartment" label="队伍A部门"></el-table-column>
        <el-table-column prop="teamBDepartment" label="队伍B部门"></el-table-column>
        <el-table-column prop="gameCount" label="赛制局数"></el-table-column>
        <el-table-column prop="winScore" label="获胜比分"></el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button 
              size="mini" 
              @click="editMatch(scope.row.matchAId)"
            >修改</el-button>
            <el-button 
              size="mini" 
              type="danger" 
              @click="deleteMatch(scope.row.matchAId)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-pagination
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next"
        style="margin-top:20px"
      ></el-pagination>
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
        total: 0
      }
    },
    created() {
      this.loadData();
    },
    methods: {
      async loadData() {
        try {
          const res = await axios.post('/api/admin-match/page-a', {
            eventId: this.eventId,
            page: this.currentPage,
            pageSize: this.pageSize
          }, {
            headers: { 'admin_token': localStorage.getItem('admin_token') }
          });
          this.tableData = res.data.data.records;
          this.total = res.data.data.total;
        } catch (error) {
          console.error('加载数据失败:', error);
        }
      },
      goToCreate() {
        this.$router.push(`/admin/event/match-a/${this.eventId}/edit`);
      },
      editMatch(id) {
        this.$router.push(`/admin/event/match-a/${this.eventId}/edit/${id}`);
      },
      async deleteMatch(id) {
        try {
          await axios.post('/api/admin-match/delete-a', { matchAId: id }, {
            headers: { 'admin_token': localStorage.getItem('admin_token') }
          });
          this.$message.success('删除成功');
          this.loadData();
        } catch (error) {
          this.$message.error('删除失败');
          console.error(error);
        }
      },
      handlePageChange(page) {
        this.currentPage = page;
        this.loadData();
      },
      handleSizeChange(size) {
        this.pageSize = size;
        this.loadData();
      }
    }
  }
  </script>