<template>
  <div class="dialog-container">
    <el-form 
      ref="form"
      :model="form" 
      class="optimized-form"
      label-width="100px"
    >
      <div class="form-content">
        <template v-if="form.isTeamA">
          <div class="team-section">
            <h3 class="team-title">A队配置</h3>
            <div class="player-group">
              <el-form-item 
                v-for="i in 4" 
                :key="'A' + i" 
                label="主力球员"
                class="inline-form-item"
              >
                <div class="form-item-content">
                  <span class="player-number">{{ i }}</span>
                  <el-select
                    v-model="form[`teamAPlayerId${i}`]"
                    filterable
                    clearable
                    placeholder="选择球员"
                    class="compact-select"
                  >
                    <el-option
                      v-for="p in players"
                      :key="p.playerId"
                      :label="`${p.name} (${p.phone || '无'})`"
                      :value="p.playerId"
                    />
                  </el-select>
                </div>
              </el-form-item>

              <div class="substitute-title">替补球员</div>
              <el-form-item 
                v-for="i in 4" 
                :key="'Asub' + i" 
                label="替补"
                class="inline-form-item"
              >
                <div class="form-item-content">
                  <span class="player-number">{{ i }}</span>
                  <el-select
                    v-model="form[`teamASubstitutePlayerId${i}`]"
                    filterable
                    clearable
                    placeholder="选择替补"
                    class="compact-select"
                  >
                    <el-option
                      v-for="p in players"
                      :key="p.playerId"
                      :label="`${p.name} (${p.phone || '无'})`"
                      :value="p.playerId"
                    />
                  </el-select>
                </div>
              </el-form-item>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="team-section">
            <h3 class="team-title">B队配置</h3>
            <div class="player-group">
              <el-form-item 
                v-for="i in 4" 
                :key="'B' + i" 
                label="主力球员"
                class="inline-form-item"
              >
                <div class="form-item-content">
                  <span class="player-number">{{ i }}</span>
                  <el-select
                    v-model="form[`teamBPlayerId${i}`]"
                    filterable
                    clearable
                    placeholder="选择球员"
                    class="compact-select"
                  >
                    <el-option
                      v-for="p in players"
                      :key="p.playerId"
                      :label="`${p.name} (${p.phone || '无'})`"
                      :value="p.playerId"
                    />
                  </el-select>
                </div>
              </el-form-item>

              <div class="substitute-title">替补球员</div>
              <el-form-item 
                v-for="i in 4" 
                :key="'Bsub' + i" 
                label="替补"
                class="inline-form-item"
              >
                <div class="form-item-content">
                  <span class="player-number">{{ i }}</span>
                  <el-select
                    v-model="form[`teamBSubstitutePlayerId${i}`]"
                    filterable
                    clearable
                    placeholder="选择替补"
                    class="compact-select"
                  >
                    <el-option
                      v-for="p in players"
                      :key="p.playerId"
                      :label="`${p.name} (${p.phone || '无'})`"
                      :value="p.playerId"
                    />
                  </el-select>
                </div>
              </el-form-item>
            </div>
          </div>
        </template>

        <div class="form-actions">
          <el-button 
            type="primary" 
            @click="handleSubmit"
            :loading="submitting"
            class="submit-btn"
          >
            保存
          </el-button>
          <el-button 
            @click="$router.push('/leader/match-b')"
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
  props: ['matchBId'],
  data() {
    return {
      form: {
        isTeamA: null,
        teamAPlayerId1: null,
        teamAPlayerId2: null,
        teamAPlayerId3: null,
        teamAPlayerId4: null,
        teamASubstitutePlayerId1: null,
        teamASubstitutePlayerId2: null,
        teamASubstitutePlayerId3: null,
        teamASubstitutePlayerId4: null,
        teamBPlayerId1: null,
        teamBPlayerId2: null,
        teamBPlayerId3: null,
        teamBPlayerId4: null,
        teamBSubstitutePlayerId1: null,
        teamBSubstitutePlayerId2: null,
        teamBSubstitutePlayerId3: null,
        teamBSubstitutePlayerId4: null
      },
      players: [],
      submitting: false
    }
  },
  async created() {
    await this.loadPlayers()
    if (this.matchBId) {
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
        const { data } = await axios.get(
          `/api/leader-match/get-b/${this.matchBId}`, 
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
        const payload = {
          matchBId: this.matchBId,
          ...this.form
        }
        await axios.post('/api/leader-match/set-b', payload, {
          headers: { 
            'leader_token': localStorage.getItem('leader_token') 
          }
        })
        this.$message.success('配置保存成功')
        this.$router.push('/leader/match-b')
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
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.2em;
}

.substitute-title {
  color: #909399;
  font-size: 0.95em;
  margin: 20px 0 10px;
  padding-top: 15px;
  border-top: 1px dashed #ebeef5;
}

.form-input {
  width: 100%;
  max-width: 320px;
}

.el-form-item {
  margin-bottom: 16px;
}

.form-actions {
  text-align: center;
  margin-top: 32px;
}

.submit-btn {
  width: 120px;
  margin-right: 20px;
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
    margin-bottom: 15px;
  }

  .substitute-title {
    margin: 15px 0 8px;
  }

  .el-form-item {
    margin-bottom: 12px;
  }
}
</style>