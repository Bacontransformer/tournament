<template>
  <div class="match-a-container">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button 
        type="primary" 
        icon="el-icon-circle-plus-outline" 
        @click="goToCreate"
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
        label="队伍A部门" 
        min-width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column 
        prop="teamBDepartment" 
        label="队伍B部门" 
        min-width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column 
        prop="gameCount" 
        label="赛制局数" 
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column 
        prop="winScore" 
        label="获胜比分" 
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column 
        label="操作" 
        fixed="right" 
        width="240"
        align="center"
      >
        <template slot-scope="scope">
          <el-tooltip content="修改比赛" placement="top">
            <el-button 
              size="mini" 
              type="primary" 
              icon="el-icon-edit"
              @click="editMatch(scope.row.matchAId)"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除比赛" placement="top">
            <el-button 
              size="mini" 
              type="danger" 
              icon="el-icon-delete"
              @click="deleteMatch(scope.row.matchAId)"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip content="比赛模式" placement="top">
            <el-button 
              size="mini" 
              type="warning" 
              icon="el-icon-setting"
              @click="goToMode(scope.row.matchAId)"
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
import { MessageBox } from 'element-ui';

export default {
  props: ['eventId'],
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
        this.$message.error('数据加载失败');
      } finally {
        this.loading = false;
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
        await MessageBox.confirm('确定删除该比赛?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        const params = new URLSearchParams();
        params.append("matchAId", id);
        await axios.post('/api/admin-match/delete-a', params, {
          headers: { 'admin_token': localStorage.getItem('admin_token') }
        });
        this.$message.success('删除成功');
        this.loadData();
      } catch (error) {
        if (error === 'cancel') {
          this.$message.info('已取消删除');
        } else {
          this.$message.error('删除失败');
          console.error(error);
        }
      }
    },
    goToMode(matchAId) {
      this.$router.push(`/admin/event/match-a/${this.eventId}/mode/${matchAId}`);
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
};
</script>

<style lang="scss" scoped>
.match-a-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .action-bar {
    margin-bottom: 20px;

    .create-btn {
      padding: 12px 24px;
      border-radius: 24px;
      font-size: 14px;
    }
  }

  .custom-table {
    // 使用 ::v-deep 替代 /deep/
    ::v-deep(.el-table__header) th {
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