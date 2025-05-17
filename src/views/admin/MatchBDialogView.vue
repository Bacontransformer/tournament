<template>
  <div class="dialog-container">
    <el-form 
      :model="form" 
      label-width="150px"
      label-position="right"
      label-suffix="："
      class="optimized-form"
    >
      <!-- 场地设置 -->
      <el-form-item label="场地编号" required>
        <el-input-number 
          v-model="form.venueNumber" 
          :min="1"
          controls-position="right"
          class="mid-width"
        />
      </el-form-item>

      <!-- 比赛规则 -->
      <el-form-item label="每小节分数" required>
        <el-input-number 
          v-model="form.sectionScore" 
          :min="1"
          controls-position="right"
          class="mid-width"
        >
          <template #append>分</template>
        </el-input-number>
      </el-form-item>

      <!-- 队伍选择 -->
      <el-form-item label="队伍A" required>
        <el-select 
          v-model="form.teamAId" 
          filterable
          clearable
          placeholder="请选择队伍A"
          class="mid-width"
        >
          <el-option 
            v-for="team in teams" 
            :key="team.teamId" 
            :value="team.teamId"
            :label="`${team.department} - ${team.name}`"
          >
            <div class="team-option">
              <span class="department">{{ team.department }}</span>
              <span class="name">{{ team.name }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="队伍B" required>
        <el-select 
          v-model="form.teamBId" 
          filterable
          clearable
          placeholder="请选择队伍B"
          class="mid-width"
        >
          <el-option 
            v-for="team in teams" 
            :key="team.teamId" 
            :value="team.teamId"
            :label="`${team.department} - ${team.name}`"
          >
            <div class="team-option">
              <span class="department">{{ team.department }}</span>
              <span class="name">{{ team.name }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 裁判选择 -->
      <el-form-item label="主裁判" required>
        <el-select 
          v-model="form.refereeId" 
          filterable
          clearable
          placeholder="请选择主裁判"
          class="mid-width"
        >
          <el-option 
            v-for="referee in referees" 
            :key="referee.refereeId" 
            :value="referee.refereeId"
            :label="`${referee.name} (${referee.phone})`"
          >
            <div class="referee-option">
              <span class="name">{{ referee.name }}</span>
              <span class="phone">{{ referee.phone }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="替补裁判">
        <el-select 
          v-model="form.substituteRefereeId" 
          filterable
          clearable
          placeholder="请选择替补裁判"
          class="mid-width"
        >
          <el-option 
            v-for="referee in referees" 
            :key="referee.refereeId" 
            :value="referee.refereeId"
            :label="`${referee.name} (${referee.phone})`"
          >
            <div class="referee-option">
              <span class="name">{{ referee.name }}</span>
              <span class="phone">{{ referee.phone }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 参赛限制 -->
      <el-form-item label="最大替补人数">
        <el-input-number 
          v-model="form.maxSubstitutePlayer" 
          :min="0"
          class="mid-width"
        />
      </el-form-item>

      <!-- 年龄限制 -->
      <el-form-item label="最小队伍年龄和">
        <el-input-number 
          v-model="form.minTeamAgeSum" 
          :min="0"
          class="mid-width"
        />
      </el-form-item>

      <el-form-item label="最大队伍年龄和">
        <el-input-number 
          v-model="form.maxTeamAgeSum" 
          :min="form.minTeamAgeSum"
          class="mid-width"
        />
        <el-tooltip content="队伍所有成员年龄总和限制" placement="top">
          <i class="el-icon-question tip-icon"/>
        </el-tooltip>
      </el-form-item>

      <!-- 时间选择 -->
      <el-form-item label="开始时间" required>
        <el-date-picker 
          v-model="form.beginTime" 
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择比赛时间"
          class="mid-width"
          :picker-options="pickerOptions"
        />
      </el-form-item>

      <!-- 操作按钮 -->
      <el-form-item class="form-actions">
        <el-button @click="handleCancel" size="medium">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleSubmit" 
          size="medium"
          :loading="submitting"
        >
          保存配置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['matchBId'],
  data() {
    return {
      form: {
        matchBId: '',
        eventId: this.$route.params.eventId,
        venueNumber: 1,
        sectionScore: 21,
        teamAId: '',
        teamBId: '',
        refereeId: '',
        substituteRefereeId: '',
        maxSubstitutePlayer: 10,
        beginTime: '',
        minTeamAgeSum: 0,
        maxTeamAgeSum: 1000
      },
      teams: [],
      referees: [],
      submitting: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    };
  },
  watch: {
    'form.minTeamAgeSum'(newVal) {
      if (this.form.maxTeamAgeSum < newVal) {
        this.form.maxTeamAgeSum = newVal;
      }
    },
    'form.teamAId'(newVal) {
      if (newVal && newVal === this.form.teamBId) {
        this.$nextTick(() => {
          this.form.teamBId = '';
          this.$message.warning('队伍A和队伍B不能相同');
        });
      }
    },
    'form.teamBId'(newVal) {
      if (newVal && newVal === this.form.teamAId) {
        this.$nextTick(() => {
          this.form.teamAId = '';
          this.$message.warning('队伍A和队伍B不能相同');
        });
      }
    }
  },
  async mounted() {
    await this.fetchOptions();
    if (this.matchBId) {
      this.fetchMatchData();
    }
  },
  methods: {
    async fetchOptions() {
      try {
        const [teamRes, refereeRes] = await Promise.all([
          axios.get('/api/admin-match/team-info', {
            headers: { 'admin_token': localStorage.getItem('admin_token') }
          }),
          axios.get('/api/admin-match/referee-info', {
            headers: { 'admin_token': localStorage.getItem('admin_token') }
          })
        ]);
        this.teams = teamRes.data.data || [];
        this.referees = refereeRes.data.data || [];
      } catch (error) {
        this.$message.error('获取选项失败');
        console.error(error);
      }
    },
    async fetchMatchData() {
      try {
        const { data } = await axios.get(`/api/admin-match/match-b/${this.matchBId}`, {
          headers: { 'admin_token': localStorage.getItem('admin_token') }
        });
        this.form = {
          ...this.form,
          ...data.data,
          beginTime: data.data.beginTime?.replace('T', ' ') || ''
        };
      } catch (error) {
        this.$message.error('获取比赛数据失败');
        console.error(error);
      }
    },
    handleCancel() {
      this.$confirm('确认放弃修改？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.go(-1);
      });
    },
    async handleSubmit() {
      try {
        this.submitting = true;
        
        if (this.form.teamAId === this.form.teamBId) {
          this.$message.error('队伍A和队伍B不能相同');
          return;
        }

        const payload = {
          ...this.form,
          eventId: Number(this.form.eventId)
        };

        const url = this.matchBId ? '/api/admin-match/update-b' : '/api/admin-match/save-b';
        await axios.post(url, payload, {
          headers: {
            'admin_token': localStorage.getItem('admin_token'),
            'Content-Type': 'application/json'
          }
        });

        this.$message.success('配置保存成功');
        this.$router.go(-1);
      } catch (error) {
        const msg = error.response?.data?.message || '服务器错误';
        this.$message.error(`保存失败: ${msg}`);
        console.error('保存失败:', error);
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.dialog-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.optimized-form {
  margin: 0 auto;
}

.mid-width {
  width: 300px;
}

.el-form-item {
  margin-bottom: 24px;
}

.form-actions {
  text-align: center;
  margin-top: 40px;
}

.team-option,
.referee-option {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.department {
  flex: 1;
  color: #909399;
  font-size: 12px;
  margin-right: 10px;
}

.name {
  flex: 2;
  font-weight: 500;
}

.phone {
  flex: 1;
  color: #909399;
  font-size: 12px;
  text-align: right;
}

.tip-text {
  color: #909399;
  font-size: 12px;
  margin-left: 8px;
}

.tip-icon {
  margin-left: 8px;
  color: #909399;
  cursor: help;
}

@media (max-width: 768px) {
  .dialog-container {
    padding: 20px;
    margin: 10px;
  }

  .mid-width {
    width: 100%;
  }

  .el-form-item {
    margin-bottom: 20px;
  }
  
  .el-date-editor {
    width: 100%;
  }
}
</style>