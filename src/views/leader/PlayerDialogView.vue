<template>
    <div class="dialog-container">
      <el-form ref="form" :model="formData" label-width="120px" style="max-width:500px;margin:0 auto">
        <el-form-item label="姓名" prop="name" required>
          <el-input v-model="formData.name" clearable class="input-item"></el-input>
        </el-form-item>
        
        <el-form-item label="性别" prop="gender" required>
          <el-select v-model="formData.gender" placeholder="请选择" class="input-item">
            <el-option label="男" value="男"/>
            <el-option label="女" value="女"/>
          </el-select>
        </el-form-item>
  
        <el-form-item label="年龄" prop="age" required>
          <el-input-number 
            v-model="formData.age" 
            :min="1" 
            controls-position="right"
            class="input-item"/>
        </el-form-item>
  
        <el-form-item label="部门" prop="department">
          <el-input v-model="formData.department" class="input-item"/>
        </el-form-item>
  
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formData.phone" class="input-item"/>
        </el-form-item>
  
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择角色" class="input-item">
            <el-option label="队长" value="队长"/>
            <el-option label="副队长" value="副隊長"/>
            <el-option label="队员" value="队员"/>
          </el-select>
        </el-form-item>
  
        <el-form-item label="是否活跃" prop="isActive" required>
          <el-switch v-model="formData.isActive"/>
        </el-form-item>
  
        <div style="text-align:center;margin-top:30px">
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="$router.push('/leader/player')">取消</el-button>
        </div>
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
          name: '',
          gender: '',
          age: null,
          department: '',
          phone: '',
          role: '',
          isActive: true
        }
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
        }
      },
      async handleSubmit() {
        try {
          const api = this.playerId ? '/api/player/update' : '/api/player/save'
          await axios.post(api, this.formData, {
            headers: { 'leader_token': localStorage.getItem('leader_token') }
          })
          this.$router.push('/leader/player')
        } catch (error) {
          console.error('保存失败:', error)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .dialog-container {
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0,0,0,.1);
  }
  
  .input-item {
    width: 300px;  /* 固定宽度 */
  }
  
  .el-form-item {
    margin-bottom: 18px;
  }
  </style>