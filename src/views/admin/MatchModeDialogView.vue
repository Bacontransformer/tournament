<template>
    <div class="dialog-container">
      <el-form 
        :model="form" 
        label-width="120px" 
        :rules="rules" 
        ref="formRef" 
        class="optimized-form"
        label-position="right"
        label-suffix="："
      >
        <!-- 比赛模式 -->
        <el-form-item label="比赛模式" prop="mode">
          <el-input 
            v-model="form.mode" 
            placeholder="请输入比赛模式名称"
            class="form-input"
          />
        </el-form-item>
  
        <!-- 场地编号 -->
        <el-form-item label="场地编号" prop="venueNumber">
          <el-input-number 
            v-model="form.venueNumber" 
            :min="1" 
            controls-position="right"
            class="form-input"
          />
        </el-form-item>
  
        <!-- 裁判选择 -->
        <el-form-item label="主裁判" prop="refereeId">
          <el-select 
            v-model="form.refereeId" 
            placeholder="请选择主裁判" 
            filterable
            clearable
            class="form-input"
          >
            <el-option 
              v-for="referee in referees" 
              :key="referee.refereeId"
              :value="referee.refereeId"
              :label="`${referee.name} (${referee.phone || '无号码'})`"
            />
          </el-select>
        </el-form-item>
  
        <el-form-item label="替补裁判">
          <el-select 
            v-model="form.substituteRefereeId" 
            placeholder="请选择替补裁判" 
            filterable
            clearable
            class="form-input"
          >
            <el-option 
              v-for="referee in referees" 
              :key="referee.refereeId"
              :value="referee.refereeId"
              :label="`${referee.name} (${referee.phone || '无号码'})`"
            />
          </el-select>
        </el-form-item>
  
        <!-- 时间选择 -->
        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker
            v-model="form.beginTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择比赛时间"
            :picker-options="pickerOptions"
            class="form-input"
          />
        </el-form-item>
  
        <!-- 操作按钮 -->
        <el-form-item class="form-actions">
          <el-button @click="handleCancel" size="medium">取消</el-button>
          <el-button 
            type="primary" 
            @click="submitForm" 
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
    props: ['matchAId', 'matchModeId'],
    data() {
      return {
        referees: [],
        submitting: false,
        form: {
          matchAId: this.matchAId,
          mode: '',
          refereeId: null,
          substituteRefereeId: null,
          beginTime: '',
          venueNumber: null
        },
        rules: {
          mode: [{ required: true, message: '请输入比赛模式名称', trigger: 'blur' }],
          refereeId: [{ required: true, message: '请选择主裁判', trigger: 'change' }],
          beginTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
          venueNumber: [{ 
            required: true, 
            message: '请输入有效的场地编号',
            trigger: 'blur',
            type: 'number',
            min: 1
          }]
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      }
    },
    async created() {
      await this.loadReferees();
      if (this.matchModeId) {
        await this.loadData();
      }
    },
    methods: {
      async loadReferees() {
        try {
          const res = await axios.get('/api/admin-match/referee-info', {
            headers: { 'admin_token': localStorage.getItem('admin_token') }
          });
          this.referees = res.data.data || [];
        } catch (error) {
          this.$message.error('裁判列表加载失败');
          console.error(error);
        }
      },
  
      async loadData() {
        try {
          const res = await axios.get(`/api/admin-match/match-a-mode/${this.matchModeId}`, {
            headers: { 'admin_token': localStorage.getItem('admin_token') }
          });
          const data = res.data.data;
          this.form = {
            ...data,
            beginTime: data.beginTime?.replace('T', ' ') || '',
            matchAId: this.matchAId
          };
        } catch (error) {
          this.$message.error('数据加载失败');
          console.error(error);
        }
      },
  
      async submitForm() {
        try {
          this.submitting = true;
          await this.$refs.formRef.validate();
  
          const url = this.matchModeId 
            ? '/api/admin-match/update-a-mode' 
            : '/api/admin-match/save-a-mode';
  
          await axios.post(url, this.form, {
            headers: { 'admin_token': localStorage.getItem('admin_token') }
          });
  
          this.$message.success('配置保存成功');
          this.$router.back();
        } catch (error) {
          if (error.name !== 'ValidationError') {
            const msg = error.response?.data?.message || '服务器错误';
            this.$message.error(`保存失败: ${msg}`);
          }
        } finally {
          this.submitting = false;
        }
      },
  
      handleCancel() {
        this.$confirm('确认放弃修改？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.back();
        }).catch(() => {});
      }
    }
  }
  </script>
  
  <style scoped>
  .dialog-container {
    padding: 30px 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    max-width: 560px;
    margin: 20px auto;
  }
  
  .optimized-form {
    margin: 0 auto;
  }
  
  .form-input {
    width: 100%;
    max-width: 400px;
  }
  
  .el-form-item {
    margin-bottom: 22px;
  }
  
  .form-actions {
    text-align: center;
    margin-top: 40px;
  }
  
  .form-actions .el-button {
    min-width: 100px;
    margin: 0 12px;
  }
  
  @media (max-width: 768px) {
    .dialog-container {
      padding: 20px;
      margin: 10px;
    }
  
    .form-input {
      max-width: 100%;
    }
  
    .el-form-item {
      margin-bottom: 18px;
    }
  
    .form-actions {
      margin-top: 30px;
    }
  
    .form-actions .el-button {
      width: 48%;
      margin: 0 1%;
    }
  }
  </style>