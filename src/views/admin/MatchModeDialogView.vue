<template>
    <div class="dialog-container">
        <el-form :model="form" label-width="120px" :rules="rules" ref="formRef" class="centered-form">
            <!-- 比赛模式 -->
            <el-form-item label="比赛模式" prop="mode">
                <el-input v-model="form.mode" style="width: 360px" />
            </el-form-item>

            <!-- 场地编号 -->
            <el-form-item label="场地编号" prop="venueNumber">
                <el-input-number v-model="form.venueNumber" :min="1" style="width: 360px" />
            </el-form-item>

            <!-- 主裁判 -->
            <el-form-item label="主裁判" prop="refereeId">
                <el-select v-model="form.refereeId" style="width: 360px" placeholder="请选择主裁判" filterable>
                    <el-option v-for="referee in referees" :key="referee.refereeId"
                        :label="`${referee.name} (${referee.phone || '无号码'})`" :value="referee.refereeId" />
                </el-select>
            </el-form-item>

            <!-- 替补裁判 -->
            <el-form-item label="替补裁判">
                <el-select v-model="form.substituteRefereeId" style="width: 360px" placeholder="请选择替补裁判" clearable
                    filterable>
                    <el-option v-for="referee in referees" :key="referee.refereeId"
                        :label="`${referee.name} (${referee.phone || '无号码'})`" :value="referee.refereeId" />
                </el-select>
            </el-form-item>

            <!-- 开始时间 -->
            <el-form-item label="开始时间" prop="beginTime">
                <el-date-picker v-model="form.beginTime" type="datetime" value-format="yyyy-MM-ddTHH:mm:ss.SSS"
                    style="width: 360px" />
            </el-form-item>

            <!-- 操作按钮 -->
            <el-form-item>
                <div style="text-align: center; margin-top: 30px;">
                    <el-button @click="handleCancel" size="medium">取消</el-button>
                    <el-button type="primary" @click="submitForm" size="medium"
                        style="margin-left: 40px;">保存</el-button>
                </div>
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
            referees: [], // 存储裁判列表
            form: {
                matchAId: this.matchAId,
                mode: '',
                refereeId: null,
                substituteRefereeId: null,
                beginTime: '',
                venueNumber: null
            },
            rules: {
                mode: [{ required: true, message: '必填项' }],
                refereeId: [{ required: true, message: '请选择主裁判' }],
                beginTime: [{ required: true, message: '请选择开始时间' }],
                venueNumber: [{ required: true, message: '请输入场地编号' }]
            }
        }
    },
    async created() {
        // 加载裁判列表（GET请求）
        try {
            const res = await axios.get('/api/admin-match/referee-info', {
                headers: {
                    'admin_token': localStorage.getItem('admin_token'),
                    'Content-Type': 'application/json'
                }
            });
            this.referees = res.data.data;
        } catch (error) {
            console.error('加载裁判列表失败:', error);
            this.$message.error('裁判列表加载失败');
        }

        // 加载原有数据（GET请求）
        if (this.matchModeId) {
            try {
                const res = await axios.get(`/api/admin-match/match-a-mode/${this.matchModeId}`, {
                    headers: {
                        'admin_token': localStorage.getItem('admin_token'),
                        'Content-Type': 'application/json'
                    }
                });
                this.form = { ...res.data.data, matchAId: this.matchAId };
            } catch (error) {
                console.error('加载数据失败:', error);
                this.$message.error('数据加载失败');
            }
        }
    },
    methods: {
        async submitForm() {
            try {
                await this.$refs.formRef.validate();

                // 根据模式选择接口（POST请求）
                const url = this.matchModeId
                    ? '/api/admin-match/update-a-mode'
                    : '/api/admin-match/save-a-mode';

                await axios.post(url, this.form, {
                    headers: {
                        'admin_token': localStorage.getItem('admin_token'),
                        'Content-Type': 'application/json'
                    }
                });

                this.$message.success('保存成功');
                this.$router.back();
            } catch (error) {
                if (error.response) {
                    console.error('保存失败:', error.response.data);
                    this.$message.error(`保存失败: ${error.response.data.message}`);
                } else if (error !== 'cancel') {
                    console.error('保存失败:', error);
                    this.$message.error('保存失败');
                }
            }
        },
        handleCancel() {
            this.$router.back();
        }
    }
}
</script>

<style scoped>
.dialog-container {
    display: flex;
    justify-content: center;
    padding: 40px 20px;
}

.centered-form {
    width: 600px;
}

.el-form-item {
    margin-bottom: 24px;
}

.el-select,
.el-date-editor {
    width: 100%;
}
</style>