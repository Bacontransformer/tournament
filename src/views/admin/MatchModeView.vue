<template>
  <div>
    <el-button 
      type="primary" 
      @click="handleCreate"
      style="margin-bottom:20px"
    >+ 新建</el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="mode" label="模式"></el-table-column>
      <el-table-column prop="venueNumber" label="场地编号"></el-table-column>
      <el-table-column prop="refereeName" label="主裁判"></el-table-column>
      <el-table-column prop="substituteRefereeName" label="替补裁判"></el-table-column>
      <el-table-column label="开始时间">
        <template slot-scope="scope">
          {{ formatDateTime(scope.row.beginTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
          <el-button 
            size="mini" 
            type="danger" 
            @click="handleDelete(scope.row)"
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
  props: ['matchAId'],
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
    formatDateTime(datetimeStr) {
      if (!datetimeStr) return '-';
      const date = new Date(datetimeStr);
      return date.toLocaleString();
    },
    async loadData() {
      try {
        const res = await axios.post('/api/admin-match/page-a-mode', {
          matchAId: this.matchAId,
          page: this.currentPage,
          pageSize: this.pageSize
        }, {
          headers: { 'admin_token': localStorage.getItem('admin_token') }
        });
        this.tableData = res.data.data.records;
        this.total = res.data.data.total;
      } catch (error) {
        console.error('加载数据失败:', error);
        this.$message.error('数据加载失败');
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.loadData();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.loadData();
    },
    handleCreate() {
      this.$router.push(`/admin/event/match-a/${this.$route.params.eventId}/mode-dialog/${this.matchAId}`);
    },
    handleEdit(row) {
      this.$router.push(`/admin/event/match-a/${this.$route.params.eventId}/mode-dialog/${this.matchAId}/${row.matchModeId}`);
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该记录吗？', '提示', { type: 'warning' });
        const params = new URLSearchParams();
        params.append("matchModeId", row.matchModeId);
        await axios.post('/api/admin-match/delete-a-mode', 
          params,
          { headers: { 'admin_token': localStorage.getItem('admin_token') } }
        );
        this.$message.success('删除成功');
        this.loadData();
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error);
          this.$message.error('删除失败');
        }
      }
    }
  }
}
</script>