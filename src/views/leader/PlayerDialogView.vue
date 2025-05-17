<template>
  <div class="dialog-container">
    <el-form 
      ref="form" 
      :model="formData" 
      label-width="120px" 
      class="optimized-form"
      label-position="right"
      label-suffix="："
    >
      <el-form-item label="姓名" prop="name" required>
        <el-input 
          v-model="formData.name" 
          placeholder="请输入队员姓名"
          clearable 
          class="form-input"
        ></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="gender" required>
        <el-select 
          v-model="formData.gender" 
          placeholder="请选择性别" 
          class="form-input"
        >
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>

      <el-form-item label="年龄" prop="age" required>
        <el-input-number 
          v-model="formData.age" 
          :min="1" 
          :max="60"
          controls-position="right" 
          class="form-input"
        />
      </el-form-item>

      <el-form-item label="电话" prop="phone">
        <el-input 
          v-model="formData.phone" 
          placeholder="请输入联系电话"
          class="form-input"
        />
      </el-form-item>

      <el-form-item label="角色" prop="role">
        <el-select 
          v-model="formData.role" 
          placeholder="请选择角色" 
          class="form-input"
        >
          <el-option label="队长" value="队长" />
          <el-option label="副队长" value="副队长" />
          <el-option label="队员" value="队员" />
        </el-select>
      </el-form-item>

      <el-form-item label="是否活跃" prop="isActive" required>
        <el-switch
          v-model="formData.isActive"
          active-text="启用"
          inactive-text="停用"
        />
      </el-form-item>

      <el-form-item class="form-actions">
        <el-button 
          type="primary" 
          @click="handleSubmit"
          :loading="submitting"
        >
          保存信息
        </el-button>
        <el-button 
          @click="$router.push('/leader/player')"
          :disabled="submitting"
        >
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: ['playerId'],
  data() {
    return {
      formData: {
        playerId: this.playerId || null,
        name: '',
        gender: '',
        age: null,
        phone: '',
        role: '',
        isActive: true
      },
      submitting: false
    }
  },
  async created() {
    if (this.playerId) await this.loadPlayerDetail()
  },
  methods: {
    async loadPlayerDetail() {
      try {
        const { data } = await axios.get(`/api/player/${this.playerId}`, {
          headers: { 'leader_token': localStorage.getItem('leader_token') }
        })
        this.formData = data.data
      } catch (error) {
        console.error('加载详情失败:', error)
        this.$message.error('数据加载失败')
      }
    },
    async handleSubmit() {
      try {
        this.submitting = true
        const api = this.playerId ? '/api/player/update' : '/api/player/save'
        await axios.post(api, this.formData, {
          headers: { 'leader_token': localStorage.getItem('leader_token') }
        })
        this.$message.success('保存成功')
        this.$router.push('/leader/player')
      } catch (error) {
        console.error('保存失败:', error)
        this.$message.error(error.response?.data?.message || '保存失败')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.dialog-container {
  padding: 30px 40px;
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
  max-width: 260px;
}

.form-actions {
  text-align: center;
  margin-top: 40px;
}

.form-actions .el-button {
  min-width: 100px;
  margin: 0 12px;
}

.el-form-item {
  margin-bottom: 22px;
}

@media (max-width: 768px) {
  .dialog-container {
    padding: 20px;
    margin: 10px;
  }

  .form-input {
    max-width: 100%;
  }

  .form-actions .el-button {
    width: 48%;
    margin: 0 1%;
  }

  .el-form-item {
    margin-bottom: 18px;
  }
}
</style>