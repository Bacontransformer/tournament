<template>
  <div class="container">
    <el-form 
      :model="form" 
      label-width="140px" 
      label-position="right"
      label-suffix="："
      class="form"
    >
      <!-- 队伍选择 -->
      <el-form-item label="队伍A" required>
        <el-select 
          v-model="form.teamAId"
          placeholder="请选择队伍A"
          class="input"
          filterable
          clearable
          :loading="loading"
          @clear="form.teamAId = null"
        >
          <el-option 
            v-for="team in teamList" 
            :key="team.teamId" 
            :value="team.teamId"
          >
            <div class="team-option">
              <span class="team-name">{{ team.name }}</span>
              <span class="team-department">{{ team.department }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="队伍B" required>
        <el-select 
          v-model="form.teamBId"
          placeholder="请选择队伍B"
          class="input"
          filterable
          clearable
          :loading="loading"
          @clear="form.teamBId = null"
        >
          <el-option 
            v-for="team in teamList" 
            :key="team.teamId" 
            :value="team.teamId"
          >
            <div class="team-option">
              <span class="team-name">{{ team.name }}</span>
              <span class="team-department">{{ team.department }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 比赛设置 -->
      <el-form-item label="赛制局数" required>
        <el-select v-model="form.gameCount" class="input">
          <el-option :value="1" label="1局"/>
          <el-option :value="3" label="3局"/>
        </el-select>
      </el-form-item>

      <el-form-item label="单局获胜分" required>
        <el-input-number 
          v-model="form.winScore" 
          :min="1"
          controls-position="right"
          class="input"
        >
          <template #append>分</template>
        </el-input-number>
      </el-form-item>

      <!-- 参赛限制 -->
      <el-form-item label="最大参赛次数">
        <el-input-number 
          v-model="form.maxParticipationTimes" 
          :min="1" 
          :max="100"
          class="input"
        />
      </el-form-item>

      <el-form-item label="最大替补人数">
        <el-input-number 
          v-model="form.maxSubstitutePlayer" 
          :min="0"
          class="input"
        />
      </el-form-item>

      <!-- 年龄限制 -->
      <el-form-item label="最小队伍年龄和">
        <el-input-number 
          v-model="form.minTeamAgeSum" 
          :min="0"
          class="input"
        />
      </el-form-item>

      <el-form-item label="最大队伍年龄和">
        <el-input-number 
          v-model="form.maxTeamAgeSum" 
          :min="form.minTeamAgeSum"
          class="input"
        />
        <el-tooltip 
          content="队伍所有成员年龄总和限制" 
          placement="top"
        >
          <i class="el-icon-question tip-icon"/>
        </el-tooltip>
      </el-form-item>

      <el-form-item class="button-group">
        <el-button type="primary" @click="submit" size="medium">保存配置</el-button>
        <el-button @click="$router.go(-1)" size="medium">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['eventId', 'matchAId'],
  data() {
    return {
      loading: false,
      teamList: [],
      form: {
        matchAId: null,
        eventId: this.eventId,
        teamAId: null,
        teamBId: null,
        gameCount: 1,
        winScore: 21,
        maxParticipationTimes: 10,
        minTeamAgeSum: 0,
        maxTeamAgeSum: 1000,
        maxSubstitutePlayer: 10,
      }
    }
  },
  watch: {
    'form.minTeamAgeSum'(newVal) {
      if (this.form.maxTeamAgeSum < newVal) {
        this.form.maxTeamAgeSum = newVal
      }
    }
  },
  created() {
    this.loadTeamData();
    if (this.matchAId) {
      this.loadData();
    }
  },
  methods: {
    async loadTeamData() {
      try {
        this.loading = true;
        const res = await axios.get('/api/admin-match/team-info', {
          headers: { 'admin_token': localStorage.getItem('admin_token') }
        });
        this.teamList = res.data.data || [];
      } catch (error) {
        this.$message.error('加载队伍信息失败');
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async loadData() {
      try {
        const res = await axios.get(`/api/admin-match/match-a/${this.matchAId}`, {
          headers: { 'admin_token': localStorage.getItem('admin_token') }
        });

        const data = res.data.data;
        data.beginTime = data.beginTime?.replace('T', ' ') || '';

        Object.assign(this.form, data);
      } catch (error) {
        console.error('加载比赛数据失败:', error);
      }
    },
    async submit() {
      try {
        if (this.form.teamAId === this.form.teamBId) {
          this.$message.error('队伍A和队伍B不能相同');
          return;
        }

        const url = this.matchAId
          ? '/api/admin-match/update-a'
          : '/api/admin-match/save-a';

        await axios.post(url, this.form, {
          headers: { 'admin_token': localStorage.getItem('admin_token') }
        });

        this.$message.success('配置保存成功');
        this.$router.go(-1);
      } catch (error) {
        this.$message.error('保存失败: ' + (error.response?.data?.message || '服务器错误'));
        console.error(error);
      }
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: top;
  min-height: 100vh;
}

.form {
  width: 450px;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.el-form-item {
  margin-bottom: 24px;
}

.input {
  width: 100%;
}

.button-group {
  text-align: center;
}

.team-option {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 8px 0;
}

.team-name {
  flex: 2;
  padding-right: 10px;
  font-weight: 500;
}

.team-department {
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
  .form {
    width: 100%;
    padding: 20px;
  }
  
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>