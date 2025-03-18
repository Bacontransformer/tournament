<template>
  <div>
    <el-button type="primary" @click="goToCreate">+ 新建</el-button>
    
    <el-table 
      :data="tableData" 
      style="width: 100%"
      @row-click="handleRowClick"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="name" label="活动名称" width="180"></el-table-column>
      <el-table-column prop="stadium" label="体育馆"></el-table-column>
      <el-table-column label="赛事类型">
        <template slot-scope="scope">
          {{ scope.row.matchType === '传统比赛' ? '传统比赛' : '趣味赛' }}
        </template>
      </el-table-column>
      <el-table-column label="日期范围" width="220">
        <template slot-scope="scope">
          {{ formatDate(scope.row.beginTime) }} 至 {{ formatDate(scope.row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="requiredAreaCount" label="场地需求"></el-table-column>
      <el-table-column prop="requiredRefereeCount" label="裁判需求"></el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          {{ formatDateTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button 
            size="mini" 
            @click.stop="editEvent(scope.row.eventId)"
          >修改</el-button>
          <el-button 
            size="mini" 
            type="danger" 
            @click.stop="deleteEvent(scope.row.eventId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handlePageChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    handleRowClick(row) {
      const pathType = row.matchType === '传统比赛' ? 'match-a' : 'match-b';
      this.$router.push(`/admin/event/${pathType}/${row.eventId}`);
    },
    tableRowClassName() {
      return 'clickable-row';
    },
    formatDate(dateStr) {
      return dateStr ? new Date(dateStr).toISOString().split('T')[0] : '-';
    },
    formatDateTime(datetimeStr) {
      if (!datetimeStr) return '-';
      const date = new Date(datetimeStr);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },
    async loadData() {
      try {
        const res = await axios.post('/api/event/page-event', {
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
      this.$router.push('/admin/event/edit');
    },
    editEvent(id) {
      this.$router.push(`/admin/event/edit/${id}`);
    },
    async deleteEvent(id) {
      try {
        await axios.post('/api/event/delete', id, {
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
    }
  }
};
</script>

<style scoped>
.clickable-row { 
  cursor: pointer; 
  transition: background-color 0.3s;
}
.clickable-row:hover {
  background-color: #f5f7fa;
}
</style>