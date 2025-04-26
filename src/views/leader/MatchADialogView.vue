<template>
  <div class="dialog-container">
    <el-form 
      ref="form"
      :model="form" 
      label-width="100px" 
      class="optimized-form"
      label-position="top"
    >
      <div class="form-content">
        <template v-if="form.isTeamA">
          <!-- A队字段 -->
          <div class="team-section">
            <h3 class="team-title">A队配置</h3>
            <el-form-item label="主力球员1" required>
              <el-select 
                v-model="form.teamAPlayer1" 
                filterable
                placeholder="请选择球员"
                class="form-input"
              >
                <el-option 
                  v-for="p in players"
                  :key="p.playerId"
                  :label="`${p.name} (${p.phone})`"
                  :value="p.playerId"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="主力球员2" required>
              <el-select 
                v-model="form.teamAPlayer2" 
                filterable
                placeholder="请选择球员"
                class="form-input"
              >
                <el-option 
                  v-for="p in players"
                  :key="p.playerId"
                  :label="`${p.name} (${p.phone})`"
                  :value="p.playerId"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="替补球员1">
              <el-select 
                v-model="form.teamASubstitutePlayer1" 
                filterable
                placeholder="请选择替补"
                class="form-input"
              >
                <el-option 
                  v-for="p in players"
                  :key="p.playerId"
                  :label="`${p.name} (${p.phone})`"
                  :value="p.playerId"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="替补球员2">
              <el-select 
                v-model="form.teamASubstitutePlayer2" 
                filterable
                placeholder="请选择替补"
                class="form-input"
              >
                <el-option 
                  v-for="p in players"
                  :key="p.playerId"
                  :label="`${p.name} (${p.phone})`"
                  :value="p.playerId"
                />
              </el-select>
            </el-form-item>
          </div>
        </template>

        <template v-else>
          <!-- B队字段 -->
          <div class="team-section">
            <h3 class="team-title">B队配置</h3>
            <el-form-item label="主力球员1" required>
              <el-select 
                v-model="form.teamBPlayer1" 
                filterable
                placeholder="请选择球员"
                class="form-input"
              >
                <el-option 
                  v-for="p in players"
                  :key="p.playerId"
                  :label="`${p.name} (${p.phone})`"
                  :value="p.playerId"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="主力球员2" required>
              <el-select 
                v-model="form.teamBPlayer2" 
                filterable
                placeholder="请选择球员"
                class="form-input"
              >
                <el-option 
                  v-for="p in players"
                  :key="p.playerId"
                  :label="`${p.name} (${p.phone})`"
                  :value="p.playerId"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="替补球员1">
              <el-select 
                v-model="form.teamBSubstitutePlayer1" 
                filterable
                placeholder="请选择替补"
                class="form-input"
              >
                <el-option 
                  v-for="p in players"
                  :key="p.playerId"
                  :label="`${p.name} (${p.phone})`"
                  :value="p.playerId"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="替补球员2">
              <el-select 
                v-model="form.teamBSubstitutePlayer2" 
                filterable
                placeholder="请选择替补"
                class="form-input"
              >
                <el-option 
                  v-for="p in players"
                  :key="p.playerId"
                  :label="`${p.name} (${p.phone})`"
                  :value="p.playerId"
                />
              </el-select>
            </el-form-item>
          </div>
        </template>

        <div class="form-actions">
          <el-button 
            type="primary" 
            @click="handleSubmit"
            :loading="submitting"
            class="submit-btn"
          >
            保存配置
          </el-button>
          <el-button 
            @click="$router.push('/leader/match-a')"
            :disabled="submitting"
          >
            取消
          </el-button>
        </div>
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
        isTeamA: true,
        teamAPlayer1: '',
        teamAPlayer2: '',
        teamASubstitutePlayer1: '',
        teamASubstitutePlayer2: '',
        teamBPlayer1: '',
        teamBPlayer2: '',
        teamBSubstitutePlayer1: '',
        teamBSubstitutePlayer2: ''
      },
      players: [],
      submitting: false
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
          headers: { 
            'leader_token': localStorage.getItem('leader_token') 
          }
        })
        this.players = data.data || []
      } catch (error) {
        this.$message.error('球员加载失败')
        console.error('加载球员失败:', error)
      }
    },
    async loadDetail() {
      try {
        const { data } = await axios.post(
          `/api/leader-match/get-a/${this.matchModeId}`, 
          {},
          {
            headers: { 
              'leader_token': localStorage.getItem('leader_token') 
            }
          }
        )
        this.form = {
          ...this.form,
          ...data.data,
          isTeamA: data.data.isTeamA
        }
      } catch (error) {
        this.$message.error('详情加载失败')
        console.error('加载详情失败:', error)
      }
    },
    async handleSubmit() {
      this.submitting = true
      try {
        await axios.post('/api/leader-match/set-a', this.form, {
          headers: { 
            'leader_token': localStorage.getItem('leader_token') 
          }
        })
        this.$message.success('配置保存成功')
        this.$router.push('/leader/match-a')
      } catch (error) {
        const msg = error.response?.data?.message || '保存失败'
        this.$message.error(msg)
        console.error('保存失败:', error)
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.dialog-container {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  max-width: 480px;
  margin: 20px auto;
}

.optimized-form {
  padding: 16px;
}

.team-title {
  color: #409EFF;
  margin-bottom: 24px;
  text-align: center;
}

.form-input {
  width: 100%;
  max-width: 320px;
}

.el-form-item {
  margin-bottom: 18px;
}

.form-actions {
  text-align: center;
  margin-top: 32px;
}

.submit-btn {
  width: 120px;
}

@media (max-width: 768px) {
  .dialog-container {
    padding: 16px;
    margin: 10px;
  }

  .form-input {
    max-width: 100%;
  }

  .team-title {
    font-size: 1.1em;
    margin-bottom: 18px;
  }

  .el-form-item {
    margin-bottom: 14px;
  }
}
</style>