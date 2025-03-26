<template>
  <div class="leader-register-container">
    <el-card class="box-card">
      <div class="title">新增领队</div>
      <el-form 
        :model="leaderForm" 
        :rules="rules" 
        ref="leaderForm" 
        label-width="120px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="leaderForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="passwordFirst">
          <el-input v-model="leaderForm.passwordFirst" show-password></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="passwordSecond">
          <el-input v-model="leaderForm.passwordSecond" show-password></el-input>
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input v-model="leaderForm.name"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-select v-model="leaderForm.gender" placeholder="请选择性别">
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="年龄" prop="age">
          <el-input-number 
            v-model="leaderForm.age" 
            :min="1" 
            :max="120" 
            controls-position="right"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="队伍名称" prop="teamName">
          <el-input v-model="leaderForm.teamName"></el-input>
        </el-form-item>

        <el-form-item label="简介" prop="introduction">
          <el-input 
            v-model="leaderForm.introduction" 
            type="textarea" 
            :rows="3"
          ></el-input>
        </el-form-item>

        <el-form-item label="部门" prop="department">
          <el-input v-model="leaderForm.department"></el-input>
        </el-form-item>

        <el-form-item label="电话" prop="phone">
          <el-input v-model="leaderForm.phone"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('leaderForm')">保存</el-button>
          <el-button type="primary" plain @click="resetForm('leaderForm')" style="margin-left: 10px;">取消</el-button>
          <el-button type="primary" plain @click="goToLogin" style="margin-left: 10px;">去登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      leaderForm: {
        passwordFirst: '',
        passwordSecond: '',
        username: '',
        name: '',
        gender: '',
        age: null,
        teamName: '',
        introduction: '',
        department: '',
        phone: ''
      },
      rules: {
        passwordFirst: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
        ],
        passwordSecond: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: this.validatePassword, trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        teamName: [
          { required: true, message: '请输入队伍名称', trigger: 'blur' }
        ],
        introduction: [
          { required: false, message: '请输入简介', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入部门', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 使用 axios 发送 POST 请求
          axios.post('/api/leader/register', this.leaderForm)
            .then(response => {
              if (response.data.code === 1) {
                console.log('注册成功:', response.data.data);
                this.$message.success('保存成功');
                this.resetForm(formName);
              } else if (response.data.code === 0) {
                console.log('注册失败:', response.data.msg);
                this.$message.error(response.data.msg);
              } else {
                console.log('未知响应:', response.data);
                this.$message.error('未知错误');
              }
            })
            .catch(error => {
              console.error('注册失败:', error);
              if (error.response && error.response.data && error.response.data.msg) {
                this.$message.error(error.response.data.msg);
              } else {
                this.$message.error('请求失败，请稍后再试');
              }
            });
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    validatePassword(rule, value, callback) {
      if (value !== this.leaderForm.passwordFirst) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    },
    goToLogin() {
      this.$router.push('/login'); // 跳转到登录页面
    }
  }
};
</script>

<style scoped>
.leader-register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.box-card {
  width: 500px;
  padding: 20px;
}

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}
</style>