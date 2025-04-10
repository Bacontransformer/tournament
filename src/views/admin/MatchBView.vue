<template>
  <div class="container">
    <el-button type="primary" @click="handleCreate">新建比赛</el-button>
    
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="teamADepartment" label="A队部门"></el-table-column>
      <el-table-column prop="teamBDepartment" label="B队部门"></el-table-column>
      <el-table-column prop="venueNumber" label="场地编号"></el-table-column>
      <el-table-column prop="beginTime" label="开始时间">
        <template v-slot="{row}">{{ formatTime(row.beginTime) }}</template>
      </el-table-column>
      <el-table-column prop="refereeName" label="主裁判"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template v-slot="{row}">{{ statusMap[row.status] }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button size="mini" @click="handleEdit(row.matchBId)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.matchBId)">删除</el-button>
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
      tableData: [],
      total: 0,
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
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const { data } = await axios.post('/api/admin-match/page-b', this.queryParams, {
          headers: { 'admin_token': localStorage.getItem('admin_token') }
        })
        this.tableData = data.data.records
        this.total = data.data.total
      } catch (error) {
        this.$message.error('获取数据失败')
      }
    },
    handleCreate() {
      this.$router.push(`/admin/event/match-b/${this.queryParams.eventId}/edit`)
    },
    handleEdit(id) {
      this.$router.push(`/admin/event/match-b/${this.queryParams.eventId}/edit/${id}`)
    },
    async handleDelete(id) {
      try {
        const params = new URLSearchParams()
        params.append('matchId', id)
        await axios.post('/api/admin-match/delete-b', params, {
          headers: { 'admin_token': localStorage.getItem('admin_token') }
        })
        this.fetchData()
        this.$message.success('删除成功')
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    handlePageChange(page) {
      this.queryParams.page = page
      this.fetchData()
    },
    formatTime(time) {
      return new Date(time).toLocaleString()
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