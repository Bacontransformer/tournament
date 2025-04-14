<template>
    <div class="container">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="teamADepartment" label="A队部门" width="120"/>
        <el-table-column prop="teamBDepartment" label="B队部门" width="120"/>
        <el-table-column prop="beginTime" label="开始时间" width="180"/>
        <el-table-column prop="venueNumber" label="场地编号" width="100"/>
        
        <!-- 队员信息 -->
        <el-table-column label="A队队员">
          <template v-slot="{row}">
            <div v-for="i in 4" :key="'A'+i">
              {{ row[`teamAPlayerName${i}`] || '无' }}
            </div>
            <div v-for="i in 4" :key="'Asub'+i">
              替补{{i}}：{{ row[`teamASubstitutePlayerName${i}`] || '无' }}
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="B队队员">
          <template v-slot="{row}">
            <div v-for="i in 4" :key="'B'+i">
              {{ row[`teamBPlayerName${i}`] || '无' }}
            </div>
            <div v-for="i in 4" :key="'Bsub'+i">
              替补{{i}}：{{ row[`teamBSubstitutePlayerName${i}`] || '无' }}
            </div>
          </template>
        </el-table-column>
  
        <el-table-column label="操作" width="150">
          <template v-slot="{row}">
            <el-button @click="handleEdit(row.matchBId)" type="primary" size="small">修改</el-button>
            <el-button @click="handleClear(row)" type="danger" size="small">清空</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    data() {
      return {
        tableData: [],
        pageQuery: { page: 1, pageSize: 10 }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        try {
          const { data } = await axios.post('/api/leader-match/page-b', this.pageQuery, {
            headers: { 'leader_token': localStorage.getItem('leader_token') }
          })
          this.tableData = data.data.records
        } catch (error) {
          this.$message.error('数据加载失败')
        }
      },
      handleEdit(matchBId) {
        this.$router.push(`/leader/match-b/edit/${matchBId}`)
      },
      async handleClear(row) {
        try {
          await axios.post('/api/leader-match/delete-b', {
            matchBId: row.matchBId,
            isTeamA: row.isTeamA
          }, {
            headers: { 'leader_token': localStorage.getItem('leader_token') }
          })
          this.$message.success('清空成功')
          this.fetchData()
        } catch (error) {
          this.$message.error('操作失败')
        }
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
  </style>