
<template>
  <div class="optimized-match-container">
    <!-- 增强型查询栏 -->
    <el-card shadow="never" class="query-card">
      <div class="flex-container">
        <el-select 
          v-model="queryForm.status" 
          @change="handleSearch"
          placeholder="比赛状态"
          class="enhanced-select"
          popper-class="status-select-dropdown"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span class="status-tag" :class="`status-${item.value}`">
              {{ item.label }}
            </span>
          </el-option>
        </el-select>

        <el-input
          v-model="queryForm.player"
          placeholder="搜索球员"
          clearable
          suffix-icon="el-icon-user"
          @clear="handleSearch"
          class="enhanced-input"
        />

        <el-input
          v-model="queryForm.department"
          placeholder="搜索院系"
          clearable
          suffix-icon="el-icon-office-building"
          @clear="handleSearch"
          class="enhanced-input"
        />

        <el-button 
          type="primary" 
          icon="el-icon-search" 
          @click="handleSearch"
          class="search-btn"
        >
          筛选
        </el-button>
      </div>
    </el-card>

    <!-- 增强型数据表格 -->
    <el-card v-loading="loading" shadow="never" class="data-card">
      <el-table 
        :data="tableData" 
        stripe
        style="width: 100%"
        empty-text="暂无比赛数据"
        class="enhanced-table"
      >
        <el-table-column label="比赛模式" width="120" align="center">
          <template #default="{ row }">
            <div class="game-mode">
              <el-tag effect="dark" type="info">{{ row.mode }}</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="比赛状态" width="130" align="center">
          <template #default="{ row }">
            <el-tag 
              :type="statusTypeMap[row.status]" 
              effect="dark"
              class="status-tag"
            >
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="对战信息" min-width="260">
          <template #default="{ row }">
            <div class="team-comparison">
              <div class="team-box team-a">
                <h3 class="department">{{ row.teamADepartment }}</h3>
                <div class="scores">
                  <span class="score">{{ row.teamARoundScore1 || 0 }}</span>
                  <span class="separator">:</span>
                  <span class="score">{{ row.teamARoundScore2 || 0 }}</span>
                </div>
              </div>
              
              <div class="vs-circle">
                <span>VS</span>
              </div>

              <div class="team-box team-b">
                <h3 class="department">{{ row.teamBDepartment }}</h3>
                <div class="scores">
                  <span class="score">{{ row.teamBRoundScore1 || 0 }}</span>
                  <span class="separator">:</span>
                  <span class="score">{{ row.teamBRoundScore2 || 0 }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="时间地点" width="200" align="center">
          <template #default="{ row }">
            <div class="time-location">
              <div class="time">
                <i class="el-icon-time"></i>
                {{ formatTime(row.beginTime) }}
              </div>
              <div class="location">
                <i class="el-icon-location-outline"></i>
                场地 {{ row.venueNumber }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }">
            <el-button 
              type="text" 
              icon="el-icon-document" 
              @click="viewDetail(row)"
              class="detail-btn"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination
        class="enhanced-pagination"
        :current-page="queryForm.page"
        :page-sizes="[6, 12, 18, 24]"
        :page-size="queryForm.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>
<script>
import axios from 'axios'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      queryForm: {
        status: '1',
        player: '',
        department: '',
        page: 1,
        pageSize: 6
      },
      tableData: [],
      total: 0,
      statusTypeMap: {
        0: 'info',
        1: 'warning',
        2: 'success'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getStatusLabel(status) {
      return ['未开始', '进行中', '已结束'][status] || '未知'
    },
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm')
    },
    viewDetail(item) {
      const routeMap = {
        0: 'un-start',
        1: 'doing',
        2: 'end'
      }
      this.$router.push({
        name: 'MatchADetail',
        params: { 
          status: routeMap[item.status],
          matchModeId: item.matchModeId 
        }
      })
    },
    async fetchData() {
      try {
        const apiMap = {
          '0': '/api/common/match-a/un-start/page',
          '1': '/api/common/match-a/doing/page',
          '2': '/api/common/match-a/end/page'
        }
        
        const data = {
          page: this.queryForm.page,
          pageSize: this.queryForm.pageSize,
          player: this.queryForm.player,
          department: this.queryForm.department
        }

        const { data: response } = await axios.post(apiMap[this.queryForm.status], data)
        this.tableData = response.data?.records || []
        this.total = response.data?.total || 0
      } catch (error) {
        console.error('获取数据失败:', error)
        this.$message.error('获取数据失败')
      }
    },
    handleSearch() {
      this.queryForm.page = 1
      this.fetchData()
    },
    handleSizeChange(newSize) {
      this.queryForm.pageSize = newSize
      this.fetchData()
    },
    handleCurrentChange(newPage) {
      this.queryForm.page = newPage
      this.fetchData()
    }
  }
}
</script>

<style scoped>
.optimized-match-container {
  padding: 20px;
  background: #f5f7fa;
}

.query-card {
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.flex-container {
  display: flex;
  gap: 12px;
  padding: 10px;
}

.enhanced-select {
  width: 160px;
}

.enhanced-input {
  flex: 1;
  max-width: 240px;
}

.search-btn {
  padding: 12px 24px;
  border-radius: 6px;
}

.data-card {
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.enhanced-table {
  --el-table-header-bg-color: #f8f9fc;
  --el-table-row-hover-bg-color: #f5f7fa;
}

.team-comparison {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 8px 0;
}

.team-box {
  flex: 1;
  text-align: center;
  padding: 12px;
  border-radius: 6px;
  background: #f8f9fc;
}

.team-a {
  border-right: 2px solid #409EFF;
}

.team-b {
  border-left: 2px solid #F56C6C;
}

.department {
  margin: 0 0 8px;
  font-size: 14px;
  color: #606266;
}

.scores {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}

.score {
  min-width: 30px;
  text-align: center;
}

.separator {
  margin: 0 8px;
  color: #909399;
}

.vs-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #409EFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 16px;
}

.time-location {
  line-height: 1.6;
  color: #606266;
}

.time i,
.location i {
  margin-right: 6px;
}

.detail-btn {
  color: #409EFF;
  font-weight: 500;
}

.enhanced-pagination {
  margin-top: 20px;
  padding: 16px;
  border-top: 1px solid #ebeef5;
}

/* 状态标签样式 */
.status-tag {
  letter-spacing: 1px;
}

.status-0 {
  color: #909399;
  background: #f4f4f5;
}

.status-1 {
  color: #e6a23c;
  background: #fdf6ec;
}

.status-2 {
  color: #67c23a;
  background: #f0f9eb;
}

@media (max-width: 768px) {
  .flex-container {
    flex-wrap: wrap;
  }
  
  .enhanced-input {
    max-width: 100%;
  }
  
  .team-comparison {
    flex-direction: column;
    gap: 12px;
  }
  
  .vs-circle {
    margin: 8px 0;
    transform: rotate(90deg);
  }
}
</style>