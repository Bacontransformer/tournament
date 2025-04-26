<template>
  <div class="event-dialog-container">
    <!-- 表单容器 -->
    <el-form :model="form" label-width="120px" class="custom-form">
      <!-- 活动名称 -->
      <el-form-item label="活动名称" prop="name" required>
        <el-input 
          v-model="form.name" 
          placeholder="请输入活动名称" 
          clearable
          style="width: 300px;"
        ></el-input>
      </el-form-item>

      <!-- 活动介绍 -->
      <el-form-item label="活动介绍">
        <el-input 
          type="textarea" 
          v-model="form.introduction" 
          placeholder="请输入活动介绍（可选）" 
          :rows="4"
          style="width: 400px;"
        ></el-input>
      </el-form-item>

      <!-- 体育馆 -->
      <el-form-item label="体育馆" prop="stadium" required>
        <el-input 
          v-model="form.stadium" 
          placeholder="请输入体育馆名称" 
          clearable
          style="width: 300px;"
        ></el-input>
      </el-form-item>

      <!-- 最少场地数 -->
      <el-form-item label="最少场地数" prop="requiredAreaCount" required>
        <el-input-number 
          v-model="form.requiredAreaCount" 
          :min="1" 
          :step="1" 
          controls-position="right"
          style="width: 150px;"
        ></el-input-number>
      </el-form-item>

      <!-- 最少裁判数 -->
      <el-form-item label="最少裁判数" prop="requiredRefereeCount" required>
        <el-input-number 
          v-model="form.requiredRefereeCount" 
          :min="1" 
          :step="1" 
          controls-position="right"
          style="width: 150px;"
        ></el-input-number>
      </el-form-item>

      <!-- 开始日期 -->
      <el-form-item label="开始日期" prop="beginTime" required>
        <el-date-picker 
          v-model="form.beginTime" 
          type="date" 
          value-format="yyyy-MM-dd" 
          placeholder="请选择开始日期"
          style="width: 200px;"
        ></el-date-picker>
      </el-form-item>

      <!-- 结束日期 -->
      <el-form-item label="结束日期" prop="endTime" required>
        <el-date-picker 
          v-model="form.endTime" 
          type="date" 
          value-format="yyyy-MM-dd" 
          placeholder="请选择结束日期"
          style="width: 200px;"
        ></el-date-picker>
      </el-form-item>

      <!-- 赛事类型 -->
      <el-form-item label="赛事类型" prop="matchType" required>
        <el-radio-group v-model="form.matchType">
          <el-radio label="传统比赛">传统比赛</el-radio>
          <el-radio label="趣味赛">趣味赛</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" @click="save" class="save-btn">保存</el-button>
      <el-button @click="$router.go(-1)" class="cancel-btn">取消</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        eventId: null,
        name: '',
        introduction: '',
        stadium: '',
        requiredAreaCount: 1, // 默认值
        requiredRefereeCount: 1, // 默认值
        beginTime: '',
        endTime: '',
        matchType: '传统比赛' // 默认选项
      }
    };
  },
  async created() {
    if (this.$route.params.eventId) {
      const res = await axios.get(`/api/event/${this.$route.params.eventId}`, {
        headers: { 'admin_token': localStorage.getItem('admin_token') }
      });
      this.form = res.data.data;
    }
  },
  methods: {
    async save() {
      try {
        const isEdit = !!this.form.eventId;
        const url = isEdit ? '/api/event/update' : '/api/event/save';

        const res = await axios.post(url, this.form, {
          headers: { 'admin_token': localStorage.getItem('admin_token') }
        });

        if (res.data.code === 1) {
          this.$message.success(isEdit ? '修改成功' : '保存成功');
          this.$router.push('/admin/event');
        }
      } catch (error) {
        this.$message.error('操作失败，请重试');
        console.error(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.event-dialog-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .custom-form {
    max-width: 600px; /* 限制表单宽度 */
    margin: 0 auto;

    ::v-deep(.el-form-item__label) {
      font-weight: bold;
      color: #333;
    }

    ::v-deep(.el-input__inner) {
      border-radius: 4px;
      transition: border-color 0.3s;

      &:focus {
        border-color: #409eff;
      }
    }

    ::v-deep(.el-textarea__inner) {
      border-radius: 4px;
      transition: border-color 0.3s;

      &:focus {
        border-color: #409eff;
      }
    }

    ::v-deep(.el-radio) {
      margin-right: 16px;
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    margin-top: 24px;

    .save-btn {
      padding: 12px 24px;
      border-radius: 24px;
      font-size: 14px;
    }

    .cancel-btn {
      padding: 12px 24px;
      border-radius: 24px;
      font-size: 14px;
      margin-left: 16px;
    }
  }
}
</style>