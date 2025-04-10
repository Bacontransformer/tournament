<template>
    <div class="dialog-container">
      <el-form :model="form" label-width="150px" class="form-center">
        <!-- 表单字段 -->
        <el-form-item label="场地编号" required>
          <el-input-number v-model="form.venueNumber" :min="1"></el-input-number>
        </el-form-item>
  
        <el-form-item label="每小节分数" required>
          <el-input-number v-model="form.sectionScore" :min="1"></el-input-number>
        </el-form-item>
  
        <el-form-item label="队伍A" required>
          <el-select v-model="form.teamAId" filterable>
            <el-option
              v-for="team in teams"
              :key="team.teamId"
              :label="`${team.department} - ${team.name}`"
              :value="team.teamId">
            </el-option>
          </el-select>
        </el-form-item>
  
        <el-form-item label="队伍B" required>
          <el-select v-model="form.teamBId" filterable>
            <el-option
              v-for="team in teams"
              :key="team.teamId"
              :label="`${team.department} - ${team.name}`"
              :value="team.teamId">
            </el-option>
          </el-select>
        </el-form-item>
  
        <el-form-item label="主裁判" required>
          <el-select v-model="form.refereeId" filterable>
            <el-option
              v-for="referee in referees"
              :key="referee.refereeId"
              :label="`${referee.name} (${referee.phone})`"
              :value="referee.refereeId">
            </el-option>
          </el-select>
        </el-form-item>
  
        <el-form-item label="替补裁判">
          <el-select v-model="form.substituteRefereeId" filterable>
            <el-option
              v-for="referee in referees"
              :key="referee.refereeId"
              :label="`${referee.name} (${referee.phone})`"
              :value="referee.refereeId">
            </el-option>
          </el-select>
        </el-form-item>
  
        <el-form-item label="最大替补人数">
          <el-input-number v-model="form.maxSubstitutePlayer" :min="0"></el-input-number>
        </el-form-item>
  
        <el-form-item label="最小队伍年龄和">
          <el-input-number 
            v-model="form.minTeamAgeSum" 
            :min="0"
            placeholder="请输入最小年龄和">
          </el-input-number>
        </el-form-item>
  
        <el-form-item label="最大队伍年龄和">
          <el-input-number
            v-model="form.maxTeamAgeSum"
            :min="0"
            placeholder="请输入最大年龄和">
          </el-input-number>
        </el-form-item>
  
        <el-form-item label="开始时间" required>
          <el-date-picker
            v-model="form.beginTime"
            type="datetime" 
            value-format="yyyy-MM-ddTHH:mm:ss.SSS"
            placeholder="选择时间">
          </el-date-picker>
        </el-form-item>
  
        <div class="form-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </div>
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
          venueNumber: 1,  // 初始化默认值
          sectionScore: 1, // 初始化默认值
          teamAId: '',
          teamBId: '',
          refereeId: '',
          substituteRefereeId: '',
          maxSubstitutePlayer: 10,
          beginTime: '', // 默认当前时间
          minTeamAgeSum: 0,
          maxTeamAgeSum: 1000
        },
        teams: [],
        referees: []
      };
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
          this.teams = teamRes.data.data;
          this.referees = refereeRes.data.data;
        } catch (error) {
          this.$message.error('获取选项失败');
        }
      },
      async fetchMatchData() {
        try {
          const { data } = await axios.get(`/api/admin-match/match-b/${this.matchBId}`, {
            headers: { 'admin_token': localStorage.getItem('admin_token') }
          });
          // 只更新必要的字段，避免混入额外字段
          this.form = {
            matchBId: data.data.matchBId,
            eventId: data.data.eventId,
            venueNumber: data.data.venueNumber,
            sectionScore: data.data.sectionScore,
            teamAId: data.data.teamAId,
            teamBId: data.data.teamBId,
            refereeId: data.data.refereeId,
            substituteRefereeId: data.data.substituteRefereeId,
            maxSubstitutePlayer: data.data.maxSubstitutePlayer,
            beginTime: data.data.beginTime,
            minTeamAgeSum: data.data.minTeamAgeSum,
            maxTeamAgeSum: data.data.maxTeamAgeSum
          };
        } catch (error) {
          this.$message.error('获取比赛数据失败');
        }
      },
      handleCancel() {
        this.$router.go(-1);
      },
      async handleSubmit() {
        try {
          // 构造符合MatchBDTO的请求体
          const payload = {
            matchBId: this.form.matchBId,
            eventId: Number(this.form.eventId),
            venueNumber: this.form.venueNumber,
            sectionScore: this.form.sectionScore,
            teamAId: this.form.teamAId,
            teamBId: this.form.teamBId,
            refereeId: this.form.refereeId,
            substituteRefereeId: this.form.substituteRefereeId,
            maxSubstitutePlayer: this.form.maxSubstitutePlayer,
            beginTime: this.form.beginTime,
            minTeamAgeSum: this.form.minTeamAgeSum,
            maxTeamAgeSum: this.form.maxTeamAgeSum
          };
  
          // 确保接口路径正确
          const url = this.matchBId ? '/api/admin-match/update-b' : '/api/admin-match/save-b';
          await axios.post(url, payload, {
            headers: { 
              'admin_token': localStorage.getItem('admin_token'),
              'Content-Type': 'application/json'
            }
          });
          this.$message.success('保存成功');
          this.$router.go(-1);
        } catch (error) {
          console.error('保存失败:', error.response?.data);
          this.$message.error(`保存失败: ${error.response?.data?.message || '服务器错误'}`);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .dialog-container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
  }
  .form-center {
    margin: 0 auto;
  }
  .form-actions {
    text-align: center;
    margin-top: 30px;
  }
  .el-form-item {
    margin-bottom: 22px;
  }
  </style>