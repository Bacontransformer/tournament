<template>
  <div class="match-container">
    <el-table 
      :data="tableData" 
      border 
      stripe
      style="width: 100%"
      class="optimized-table"
      v-loading="loading"
    >
      <!-- 基础信息列 -->
      <el-table-column 
        prop="teamADepartment" 
        label="A队部门" 
        width="140"
        show-overflow-tooltip
      />
      <el-table-column 
        prop="teamBDepartment" 
        label="B队部门" 
        width="140"
        show-overflow-tooltip
      />
      <el-table-column 
        label="开始时间" 
        width="180"
      >
        <template #default="{row}">
          <div class="time-display">
            <i class="el-icon-time"></i>
            {{ formatTime(row.beginTime) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column 
        prop="venueNumber" 
        label="场地号" 
        width="100"
        align="center"
      />

      <!-- 队员信息列 -->
      <el-table-column label="A队队员" min-width="240">
        <template #default="{row}">
          <div class="player-group">
            <div class="player-item" v-for="i in 4" :key="'A' + i">
              <el-tag v-if="row[`teamAPlayerName${i}`]" size="mini">主力</el-tag>
              {{ row[`teamAPlayerName${i}`] || '待选择' }}
            </div>
            <div class="substitute-group">
              <div v-for="i in 4" :key="'Asub' + i">
                <el-tag v-if="row[`teamASubstitutePlayerName${i}`]" type="info" size="mini">替补{{i}}</el-tag>
                {{ row[`teamASubstitutePlayerName${i}`] || '无替补' }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="B队队员" min-width="240">
        <template #default="{row}">
          <div class="player-group">
            <div class="player-item" v-for="i in 4" :key="'B' + i">
              <el-tag v-if="row[`teamBPlayerName${i}`]" size="mini">主力</el-tag>
              {{ row[`teamBPlayerName${i}`] || '待选择' }}
            </div>
            <div class="substitute-group">
              <div v-for="i in 4" :key="'Bsub' + i">
                <el-tag v-if="row[`teamBSubstitutePlayerName${i}`]" type="info" size="mini">替补{{i}}</el-tag>
                {{ row[`teamBSubstitutePlayerName${i}`] || '无替补' }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column 
        label="操作" 
        width="140" 
        fixed="right"
      >
        <template #default="{row}">
          <div class="action-buttons">
            <el-tooltip content="修改配置" placement="top">
              <el-button 
                type="primary" 
                icon="el-icon-edit" 
                circle
                size="mini"
                @click="handleEdit(row.matchBId)"
              />
            </el-tooltip>
            <el-tooltip content="清空队伍" placement="top">
              <el-button 
                type="danger" 
                icon="el-icon-delete" 
                circle
                size="mini"
                @click="handleClear(row)"
              />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        background
        :current-page="pageQuery.page"
        :page-size="pageQuery.pageSize"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      tableData: [],
      pageQuery: { 
        page: 1, 
        pageSize: 10 
      },
      total: 0,
      loading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    formatTime(timeString) {
      if (!timeString) return '-'
      try {
        const date = new Date(timeString)
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '-')
      } catch {
        return timeString
      }
    },
    async fetchData() {
      this.loading = true
      try {
        const { data } = await axios.post('/api/leader-match/page-b', this.pageQuery, {
          headers: { 'leader_token': localStorage.getItem('leader_token') }
        })
        this.tableData = data.data?.records || []
        this.total = data.data?.total || 0
      } catch (error) {
        this.$message.error(error.response?.data?.message || '数据加载失败')
      } finally {
        this.loading = false
      }
    },
    async handleClear(row) {
      try {
        await this.$confirm(
          `确认清空${row.isTeamA ? 'A' : 'B'}队数据？此操作不可恢复！`,
          '警告',
          {
            type: 'warning',
            confirmButtonClass: 'el-button--danger',
            confirmButtonText: '确认清空',
            cancelButtonText: '取消'
          }
        )
        
        await axios.post('/api/leader-match/delete-b', {
          matchBId: row.matchBId,
          isTeamA: row.isTeamA
        }, {
          headers: { 'leader_token': localStorage.getItem('leader_token') }
        })
        
        this.$message.success('清空成功')
        this.fetchData()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error(error.response?.data?.message || '操作失败')
        }
      }
    },
    handleEdit(matchBId) {
      this.$router.push(`/leader/match-b/edit/${matchBId}`)
    },
    handlePageChange(page) {
      this.pageQuery.page = page
      this.fetchData()
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

.player-group {
  padding: 8px 0;
}

.player-item {
  padding: 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.substitute-group {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #ebeef5;
}

.substitute-group div {
  padding: 2px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #909399;
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