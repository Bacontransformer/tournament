<template>
  <div class="player-container">
    <div class="action-bar">
      <el-button 
        type="primary" 
        @click="handleCreate"
        icon="el-icon-circle-plus"
        class="create-btn"
      >
        新建队员
      </el-button>
    </div>

    <el-table 
      :data="playerList" 
      border 
      stripe
      style="width: 100%"
      class="optimized-table"
      v-loading="loading"
    >
      <el-table-column 
        prop="name" 
        label="姓名" 
        align="center"
        min-width="120"
      ></el-table-column>
      <el-table-column 
        prop="gender" 
        label="性别" 
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column 
        prop="age" 
        label="年龄" 
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column 
        prop="department" 
        label="部门" 
        align="center"
        min-width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column 
        prop="phone" 
        label="电话" 
        align="center"
        min-width="150"
      ></el-table-column>
      <el-table-column 
        prop="role" 
        label="角色" 
        align="center"
        min-width="120"
      ></el-table-column>
      <el-table-column 
        label="操作" 
        align="center" 
        width="200"
      >
        <template v-slot="{ row }">
          <div class="action-buttons">
            <el-button 
              size="mini" 
              type="primary" 
              @click="handleEdit(row)"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button 
              size="mini" 
              type="danger" 
              @click="handleDelete(row)"
              icon="el-icon-delete"
              circle
            ></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrapper">
      <el-pagination 
        background
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange"
        :current-page="queryParams.page" 
        :page-sizes="[10, 20, 30]" 
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next" 
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      queryParams: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      playerList: [],
      loading: false
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const { data } = await axios.post('/api/player/page', this.queryParams, {
          headers: { 'leader_token': localStorage.getItem('leader_token') }
        })
        this.playerList = data.data?.records || []
        this.total = data.data?.total || 0
      } catch (error) {
        console.error('加载数据失败:', error)
        this.$message.error('数据加载失败')
      } finally {
        this.loading = false
      }
    },
    handleCreate() {
      this.$router.push('/leader/player/edit')
    },
    handleEdit(row) {
      this.$router.push(`/leader/player/edit/${row.playerId}`)
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该队员？此操作不可恢复！', '警告', {
          type: 'warning',
          confirmButtonClass: 'el-button--danger',
          cancelButtonText: '取消',
          confirmButtonText: '确认删除'
        })
        
        const params = new URLSearchParams()
        params.append('id', row.playerId)
        await axios.post('/api/player/delete', params, {
          headers: { 'leader_token': localStorage.getItem('leader_token') }
        })
        
        this.$message.success('删除成功')
        this.loadData()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
          this.$message.error(error.response?.data?.message || '删除失败')
        }
      }
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.queryParams.page = val
      this.loadData()
    }
  }
}
</script>

<style scoped>
.player-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.action-bar {
  margin-bottom: 24px;
}

.create-btn {
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.optimized-table {
  margin: 20px 0;
  border-radius: 6px;
  overflow: hidden;
}

.optimized-table::v-deep .el-table__header th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

.optimized-table::v-deep .el-table__row--striped {
  background-color: #fafafa;
}

.optimized-table::v-deep .el-table__row:hover {
  background-color: #f5f7fa;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-buttons .el-button {
  margin: 0;
  transition: all 0.2s;
}

.action-buttons .el-button:hover {
  transform: scale(1.15);
}

.pagination-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .player-container {
    padding: 16px;
    margin: 10px;
  }

  .action-buttons {
    flex-wrap: wrap;
    gap: 4px;
  }

  .create-btn {
    width: 100%;
    margin-bottom: 12px;
  }

  .optimized-table::v-deep .el-table__header th {
    padding: 8px 0;
  }

  .optimized-table::v-deep .el-table__body td {
    padding: 6px 0;
  }
}
</style>