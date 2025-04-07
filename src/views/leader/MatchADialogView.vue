<!-- src/views/leader/MatchADialogView.vue -->
<template>
  <div class="dialog-container">
    <el-form label-width="140px" style="max-width:600px;margin:0 auto">
      <template v-if="form.isTeamA">  <!-- 修改为使用form.isTeamA -->
        <!-- A队完整球员字段 -->
        <el-form-item label="A队球员1">
          <el-select v-model="form.teamAPlayer1" filterable style="width:100%">
            <el-option
              v-for="p in players"
              :key="p.playerId"
              :label="`${p.name} (${p.phone})`"
              :value="p.playerId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="A队球员2">
          <el-select v-model="form.teamAPlayer2" filterable style="width:100%">
            <el-option
              v-for="p in players"
              :key="p.playerId"
              :label="`${p.name} (${p.phone})`"
              :value="p.playerId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="A队替补1">
          <el-select v-model="form.teamASubstitutePlayer1" filterable style="width:100%">
            <el-option
              v-for="p in players"
              :key="p.playerId"
              :label="`${p.name} (${p.phone})`"
              :value="p.playerId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="A队替补2">
          <el-select v-model="form.teamASubstitutePlayer2" filterable style="width:100%">
            <el-option
              v-for="p in players"
              :key="p.playerId"
              :label="`${p.name} (${p.phone})`"
              :value="p.playerId">
            </el-option>
          </el-select>
        </el-form-item>
      </template>

      <template v-else>
        <!-- B队完整球员字段 -->
        <el-form-item label="B队球员1">
          <el-select v-model="form.teamBPlayer1" filterable style="width:100%">
            <el-option
              v-for="p in players"
              :key="p.playerId"
              :label="`${p.name} (${p.phone})`"
              :value="p.playerId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="B队球员2">
          <el-select v-model="form.teamBPlayer2" filterable style="width:100%">
            <el-option
              v-for="p in players"
              :key="p.playerId"
              :label="`${p.name} (${p.phone})`"
              :value="p.playerId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="B队替补1">
          <el-select v-model="form.teamBSubstitutePlayer1" filterable style="width:100%">
            <el-option
              v-for="p in players"
              :key="p.playerId"
              :label="`${p.name} (${p.phone})`"
              :value="p.playerId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="B队替补2">
          <el-select v-model="form.teamBSubstitutePlayer2" filterable style="width:100%">
            <el-option
              v-for="p in players"
              :key="p.playerId"
              :label="`${p.name} (${p.phone})`"
              :value="p.playerId">
            </el-option>
          </el-select>
        </el-form-item>
      </template>

      <div style="text-align:center;margin-top:30px">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="$router.push('/leader/match-a')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['matchModeId'],
  data() {
    return {
      form: {
        isTeamA: '',  
        // A队字段
        teamAPlayer1: '',
        teamAPlayer2: '',
        teamASubstitutePlayer1: '',
        teamASubstitutePlayer2: '',
        // B队字段
        teamBPlayer1: '',
        teamBPlayer2: '',
        teamBSubstitutePlayer1: '',
        teamBSubstitutePlayer2: ''
      },
      players: []
    }
  },
  async created() {
    await this.loadPlayers()
    if (this.matchModeId) {
      await this.loadDetail()
    }
  },
  methods: {
    async loadPlayers() {
      try {
        const { data } = await axios.get('/api/leader-match/player-info', {
          headers: { 'leader_token': localStorage.getItem('leader_token') }
        })
        this.players = data.data
      } catch (error) {
        console.error('加载球员失败:', error)
      }
    },
    async loadDetail() {
      try {
        const { data } = await axios.post(`/api/leader-match/get-a/${this.matchModeId}`, {}, {
          headers: { 'leader_token': localStorage.getItem('leader_token') }
        })
        this.form = { 
          ...this.form, // 保留初始结构
          ...data.data  // 覆盖后端数据
        }
        // 确保同步isTeamA到form对象
        this.form.isTeamA = data.data.isTeamA
      } catch (error) {
        console.error('加载详情失败:', error)
      }
    },
    async handleSubmit() {
      try {
        // 现在form包含isTeamA字段
        await axios.post('/api/leader-match/set-a', this.form, {
          headers: { 'leader_token': localStorage.getItem('leader_token') }
        })
        this.$router.push('/leader/match-a')
      } catch (error) {
        console.error('保存失败:', error)
        this.$message.error('保存失败: ' + (error.response?.data?.message || '未知错误'))
      }
    }
  }
}
</script>

<style scoped>
.dialog-container {
  padding: 30px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,.1);
}
</style>