<!-- src/views/leader/MatchAView.vue -->
<template>
  <div class="container">
    <el-table :data="matchList" border style="width: 100%">
      <el-table-column prop="teamADepartment" label="A队部门" align="center"></el-table-column>
      <el-table-column prop="teamBDepartment" label="B队部门" align="center"></el-table-column>
      <el-table-column 
        prop="beginTime" 
        label="开始时间" 
        align="center"
        :formatter="formatDateTime">
      </el-table-column>

      <!-- A队球员列 -->
      <el-table-column label="A队球员" align="center">
        <template slot-scope="{row}">
          <div>{{ row.teamAPlayer1Name || '未选择' }}</div>
          <div>{{ row.teamAPlayer2Name || '未选择' }}</div>
          <div v-if="row.teamASubstitutePlayer1Name" class="substitute">
            替补：{{ row.teamASubstitutePlayer1Name }}
          </div>
          <div v-if="row.teamASubstitutePlayer2Name" class="substitute">
            {{ row.teamASubstitutePlayer2Name }}
          </div>
        </template>
      </el-table-column>

      <!-- B队球员列 -->
      <el-table-column label="B队球员" align="center">
        <template slot-scope="{row}">
          <div>{{ row.teamBPlayer1Name || '未选择' }}</div>
          <div>{{ row.teamBPlayer2Name || '未选择' }}</div>
          <div v-if="row.teamBSubstitutePlayer1Name" class="substitute">
            替补：{{ row.teamBSubstitutePlayer1Name }}
          </div>
          <div v-if="row.teamBSubstitutePlayer2Name" class="substitute">
            {{ row.teamBSubstitutePlayer2Name }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleEdit(row.matchModeId)">修改</el-button>
          <el-button 
            size="mini" 
            type="danger" 
            @click="handleDelete(row)">
            清空
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handlePageChange"
      :current-page="queryParams.page"
      :page-size="queryParams.pageSize"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
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
      matchList: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    formatDateTime(row, column, cellValue) {
      if (!cellValue) return '-'
      try {
        const [datePart, timePart] = cellValue.split('T')
        return `${datePart} ${timePart.split('.')[0].slice(0,5)}`
      } catch {
        return cellValue
      }
    },
    async loadData() {
      try {
        const { data } = await axios.post('/api/leader-match/page-a', this.queryParams, {
          headers: { 
            'leader_token': localStorage.getItem('leader_token'),
            'Content-Type': 'application/json'
          }
        })
        this.matchList = data.data.records
        this.total = data.data.total
      } catch (error) {
        console.error('加载失败:', error)
        this.$message.error(error.response?.data?.message || '数据加载失败')
      }
    },
    async handleDelete(row) {
      try {
        await this.$confirm(`确认清空${row.isTeamA ? 'A' : 'B'}队球员数据？`, '警告', {
          type: 'warning',
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
        
        await axios.post('/api/leader-match/delete-a', {
          matchModeId: row.matchModeId,
          isTeamA: row.isTeamA
        }, {
          headers: { 
            'leader_token': localStorage.getItem('leader_token'),
            'Content-Type': 'application/json'
          }
        })
        
        this.$message.success('清空成功')
        this.loadData()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
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
.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}
.substitute {
  color: #666;
  font-size: 0.9em;
  margin-top: 4px;
}
</style>