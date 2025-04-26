<template>
  <div class="match-mode-container">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button 
        type="primary" 
        icon="el-icon-circle-plus-outline" 
        @click="handleCreate"
        class="create-btn"
      >
        新建模式
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-table 
      :data="tableData" 
      style="width: 100%"
      border
      stripe
      v-loading="loading"
      class="custom-table"
    >
      <el-table-column 
        prop="mode" 
        label="模式" 
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column 
        prop="venueNumber" 
        label="场地编号" 
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column 
        prop="refereeName" 
        label="主裁判" 
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column 
        prop="substituteRefereeName" 
        label="替补裁判" 
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column 
        label="开始时间" 
        width="180"
        align="center"
      >
        <template #default="{ row }">
          {{ formatDateTime(row.beginTime) }}
        </template>
      </el-table-column>
      <el-table-column 
        label="操作" 
        width="200"
        align="center"
      >
        <template #default="{ row }">
          <el-tooltip content="修改模式" placement="top">
            <el-button 
              size="mini" 
              type="primary" 
              icon="el-icon-edit"
              @click="handleEdit(row)"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除模式" placement="top">
            <el-button 
              size="mini" 
              type="danger" 
              icon="el-icon-delete"
              @click="handleDelete(row)"
              circle
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
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
      total: 0,
      loading: false
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
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
      } finally {
        this.loading = false;
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
        await axios.post('/api/admin-match/delete-a-mode', params, {
          headers: { 'admin_token': localStorage.getItem('admin_token') }
        });
        this.$message.success('删除成功');
        this.loadData();
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error);
          this.$message.error('删除失败');
        }
      }
    },
    formatDateTime(datetimeStr) {
      if (!datetimeStr) return '-';
      const date = new Date(datetimeStr);
      return date.toLocaleString();
    }
  }
};
</script>

<style lang="scss" scoped>
.match-mode-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .action-bar {
    margin-bottom: 20px;

    .create-btn {
      padding: 12px 24px;
      border-radius: 24px;
      font-size: 14px;
    }
  }

  .custom-table {
    ::v-deep(.el-table__header th) {
      background-color: #f0f9eb;
      color: #333;
      font-weight: bold;
    }

    ::v-deep(.el-table__row--striped) {
      background-color: #fafafa;
    }

    ::v-deep(.el-table__row:hover) {
      background-color: #f5f7fa;
    }

    .el-button {
      margin: 0 4px;
      transition: all 0.3s;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .pagination-wrapper {
    margin-top: 24px;
    display: flex;
    justify-content: center; /* 居中对齐 */
  }
}
</style>