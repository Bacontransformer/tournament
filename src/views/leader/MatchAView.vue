<template>
  <div class="match-container">
    <el-table 
      :data="matchList" 
      border 
      stripe
      style="width: 100%"
      class="optimized-table"
      v-loading="loading"
    >
      <!-- 队伍信息列 -->
      <el-table-column 
        prop="teamADepartment" 
        label="A队部门" 
        align="center"
        min-width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column 
        prop="teamBDepartment" 
        label="B队部门" 
        align="center"
        min-width="120"
        show-overflow-tooltip
      ></el-table-column>

      <!-- 时间列 -->
      <el-table-column 
        label="开始时间" 
        align="center"
        width="180"
      >
        <template #default="{row}">
          <div class="time-display">
            <i class="el-icon-time"></i>
            {{ formatDateTime(row.beginTime) }}
          </div>
        </template>
      </el-table-column>

      <!-- 球员信息列 -->
      <el-table-column 
        label="A队球员" 
        align="center"
        width="220"
      >
        <template #default="{row}">
          <div class="player-list">
            <div class="main-player">
              {{ row.teamAPlayer1Name || '待选择' }}
            </div>
            <div class="main-player">
              {{ row.teamAPlayer2Name || '待选择' }}
            </div>
            <div 
              v-if="row.teamASubstitutePlayer1Name" 
              class="substitute-player"
            >
              <el-tag type="info" size="mini">替补</el-tag>
              {{ row.teamASubstitutePlayer1Name }}
            </div>
            <div 
              v-if="row.teamASubstitutePlayer2Name" 
              class="substitute-player"
            >
              <el-tag type="info" size="mini">替补</el-tag>
              {{ row.teamASubstitutePlayer2Name }}
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column 
        label="B队球员" 
        align="center"
        width="220"
      >
        <template #default="{row}">
          <div class="player-list">
            <div class="main-player">
              {{ row.teamBPlayer1Name || '待选择' }}
            </div>
            <div class="main-player">
              {{ row.teamBPlayer2Name || '待选择' }}
            </div>
            <div 
              v-if="row.teamBSubstitutePlayer1Name" 
              class="substitute-player"
            >
              <el-tag type="info" size="mini">替补</el-tag>
              {{ row.teamBSubstitutePlayer1Name }}
            </div>
            <div 
              v-if="row.teamBSubstitutePlayer2Name" 
              class="substitute-player"
            >
              <el-tag type="info" size="mini">替补</el-tag>
              {{ row.teamBSubstitutePlayer2Name }}
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column 
        label="操作" 
        width="160" 
        align="center"
        fixed="right"
      >
        <template #default="{row}">
          <div class="action-buttons">
            <el-tooltip content="修改配置" placement="top">
              <el-button 
                size="mini" 
                type="primary" 
                icon="el-icon-edit"
                @click="handleEdit(row.matchModeId)"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip content="清空队伍" placement="top">
              <el-button 
                size="mini" 
                type="danger" 
                icon="el-icon-delete"
                @click="handleDelete(row)"
                circle
              ></el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        background
        @current-change="handlePageChange"
        :current-page="queryParams.page"
        :page-size="queryParams.pageSize"
        layout="total, prev, pager, next"
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
      matchList: [],
      loading: false
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    formatDateTime(cellValue) {
      if (!cellValue) return '-'
      try {
        const date = new Date(cellValue)
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '-')
      } catch {
        return cellValue
      }
    },
    async loadData() {
      this.loading = true
      try {
        const { data } = await axios.post('/api/leader-match/page-a', this.queryParams, {
          headers: {
            'leader_token': localStorage.getItem('leader_token'),
            'Content-Type': 'application/json'
          }
        })
        this.matchList = data.data?.records || []
        this.total = data.data?.total || 0
      } catch (error) {
        console.error('加载失败:', error)
        this.$message.error(error.response?.data?.message || '数据加载失败')
      } finally {
        this.loading = false
      }
    },
    async handleDelete(row) {
      try {
        await this.$confirm(
          `确认清空${row.isTeamA ? 'A' : 'B'}队球员数据？此操作不可恢复！`, 
          '警告', 
          {
            type: 'warning',
            confirmButtonClass: 'el-button--danger',
            confirmButtonText: '确认清空',
            cancelButtonText: '取消'
          }
        )

        await axios.post('/api/leader-match/delete-a', {
          matchModeId: row.matchModeId,
          isTeamA: row.isTeamA
        }, {
          headers: {
            'leader_token': localStorage.getItem('leader_token'),
            'Content-Type': 'application/json'
          }
        })

        this.$message.success('清空操作成功')
        this.loadData()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('操作失败:', error)
          this.$message.error(error.response?.data?.message || '操作失败')
        }
      }
    },
    handleEdit(matchModeId) {
      this.$router.push(`/leader/match-a/edit/${matchModeId}`)
    },
    handlePageChange(page) {
      this.queryParams.page = page
      this.loadData()
    }
  }
}
</script>

<style scoped>
.match-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
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

.time-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #409EFF;
  font-size: 0.95em;
}

.player-list {
  padding: 8px 0;
}

.main-player {
  padding: 4px 0;
  font-weight: 500;
}

.substitute-player {
  color: #909399;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.pagination-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .match-container {
    padding: 16px;
    margin: 10px;
  }

  .time-display {
    flex-direction: column;
    gap: 2px;
  }

  .optimized-table::v-deep .el-table__header th {
    padding: 8px 0;
  }

  .optimized-table::v-deep .el-table__body td {
    padding: 6px 0;
  }
}
</style>