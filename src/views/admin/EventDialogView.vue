<template>
  <div>
    <el-form :model="form">
      <!-- 已有字段 -->
      <el-form-item label="活动名称" prop="name" required>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      
      <el-form-item label="活动介绍">
        <el-input type="textarea" v-model="form.introduction"></el-input>
      </el-form-item>

      <el-form-item label="体育馆" prop="stadium" required>
        <el-input v-model="form.stadium"></el-input>
      </el-form-item>

      <el-form-item label="最少场地数" prop="requiredAreaCount" required>
        <el-input-number 
          v-model="form.requiredAreaCount" 
          :min="1" 
          :step="1"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="最少裁判数" prop="requiredRefereeCount" required>
        <el-input-number
          v-model="form.requiredRefereeCount"
          :min="1"
          :step="1"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="开始日期" prop="beginTime" required>
        <el-date-picker
          v-model="form.beginTime"
          type="date"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="结束日期" prop="endTime" required>
        <el-date-picker
          v-model="form.endTime"
          type="date"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="赛事类型" prop="matchType" required>
        <el-radio-group v-model="form.matchType">
          <el-radio label="传统比赛"></el-radio>
          <el-radio label="趣味赛"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="save">保存</el-button>
    <el-button @click="$router.go(-1)">取消</el-button>
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