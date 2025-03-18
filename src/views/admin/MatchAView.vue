<template>
    <div>
        <el-button @click="$router.go(-1)" style="margin-bottom:20px">返回活动列表</el-button>

        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="teamADepartment" label="队伍A部门"></el-table-column>
            <el-table-column prop="teamBDepartment" label="队伍B部门"></el-table-column>
            <el-table-column prop="gameCount" label="赛制局数"></el-table-column>
            <el-table-column prop="winScore" label="获胜比分"></el-table-column>
            <el-table-column label="创建时间">
                <template slot-scope="scope">
                    {{ formatDateTime(scope.row.createTime) }}
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @current-change="handlePageChange" @size-change="handleSizeChange" :current-page="currentPage"
            :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next"
            style="margin-top:20px"></el-pagination>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['eventId'],
    data() {
        return {
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        async loadData() {
            try {
                const res = await axios.post('/api/admin-match/page-a', {
                    eventId: this.eventId,
                    page: this.currentPage,
                    pageSize: this.pageSize
                }, {
                    headers: { 'admin_token': localStorage.getItem('admin_token') }
                });

                this.tableData = res.data.data.records;
                this.total = res.data.data.total;
            } catch (error) {
                console.error('加载比赛数据失败:', error);
            }
        },
        handlePageChange(page) {
            this.currentPage = page;
            this.loadData();
        },
        handleSizeChange(size) {
            this.pageSize = size;
            this.loadData();
        },
        formatDateTime(datetimeStr) {
            if (!datetimeStr) return '-';
            const date = new Date(datetimeStr);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        }
    }
}
</script>

<style scoped>
.el-table {
    margin-top: 20px;
}
</style>