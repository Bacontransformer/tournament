<template>
  <div class="match-b-container">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button 
        type="primary" 
        icon="el-icon-circle-plus-outline" 
        @click="handleCreate"
        class="create-btn"
      >
        新建比赛
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
        prop="teamADepartment" 
        label="A队部门" 
        min-width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column 
        prop="teamBDepartment" 
        label="B队部门" 
        min-width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column 
        prop="venueNumber" 
        label="场地编号" 
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column 
        label="开始时间" 
        width="180"
        align="center"
      >
        <template #default="{ row }">
          {{ formatTime(row.beginTime) }}
        </template>
      </el-table-column>
      <el-table-column 
        prop="refereeName" 
        label="主裁判" 
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column 
        label="状态" 
        width="120"
        align="center"
      >
        <template #default="{ row }">
          <el-tag 
            :type="statusTagType(row.status)" 
            size="small"
          >
            {{ statusMap[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column 
        label="操作" 
        fixed="right" 
        width="200"
        align="center"
      >
        <template #default="{ row }">
          <el-tooltip content="修改比赛" placement="top">
            <el-button 
              size="mini" 
              type="primary" 
              icon="el-icon-edit"
              @click="handleEdit(row.matchBId)"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除比赛" placement="top">
            <el-button 
              size="mini" 
              type="danger" 
              icon="el-icon-delete"
              @click="handleDelete(row.matchBId)"
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
        :current-page="queryParams.page"
        :page-size="queryParams.pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tableData: [],
      total: 0,
      loading: false,
      queryParams: {
        eventId: this.$route.params.eventId,
        page: 1,
        pageSize: 10
      },
      statusMap: {
        0: '未开始',
        1: '进行中',
        2: '已结束'
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const { data } = await axios.post('/api/admin-match/page-b', this.queryParams, {
          headers: { 'admin_token': localStorage.getItem('admin_token') }
        });
        this.tableData = data.data.records;
        this.total = data.data.total;
      } catch (error) {
        this.$message.error('获取数据失败');
      } finally {
        this.loading = false;
      }
    },
    handleCreate() {
      this.$router.push(`/admin/event/match-b/${this.queryParams.eventId}/edit`);
    },
    handleEdit(id) {
      this.$router.push(`/admin/event/match-b/${this.queryParams.eventId}/edit/${id}`);
    },
    async handleDelete(id) {
      try {
        const params = new URLSearchParams();
        params.append('matchId', id);
        await axios.post('/api/admin-match/delete-b', params, {
          headers: { 'admin_token': localStorage.getItem('admin_token') }
        });
        this.$message.success('删除成功');
        this.fetchData();
      } catch (error) {
        this.$message.error('删除失败');
      }
    },
    handlePageChange(page) {
      this.queryParams.page = page;
      this.fetchData();
    },
    formatTime(time) {
      return new Date(time).toLocaleString();
    },
    statusTagType(status) {
      // 根据状态返回不同的标签类型
      switch (status) {
        case 0:
          return 'info'; // 未开始
        case 1:
          return 'warning'; // 进行中
        case 2:
          return 'success'; // 已结束
        default:
          return 'default';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.match-b-container {
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