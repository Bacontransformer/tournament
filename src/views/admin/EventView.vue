<template>
  <div class="event-container">
    <!-- 操作按钮 -->
    <el-button type="primary" class="create-btn" @click="goToCreate">
      <i class="el-icon-plus"></i> 新建活动
    </el-button>

    <!-- 数据表格 -->
    <el-table 
      :data="tableData" 
      style="width: 100%; margin-top: 20px;" 
      @row-click="handleRowClick" 
      :row-class-name="tableRowClassName"
      border
      stripe
    >
      <el-table-column prop="name" label="活动名称" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stadium" label="体育馆" show-overflow-tooltip></el-table-column>
      <el-table-column label="赛事类型" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.matchType === '传统比赛' ? 'success' : 'info'">
            {{ scope.row.matchType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="日期范围" width="220">
        <template slot-scope="scope">
          {{ formatDate(scope.row.beginTime) }} 至 {{ formatDate(scope.row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="requiredAreaCount" label="场地需求" width="100"></el-table-column>
      <el-table-column prop="requiredRefereeCount" label="裁判需求" width="100"></el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          {{ formatDateTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click.stop="editEvent(scope.row.eventId)">
            <i class="el-icon-edit"></i> 修改
          </el-button>
          <el-button size="mini" type="danger" plain @click.stop="deleteEvent(scope.row.eventId)">
            <i class="el-icon-delete"></i> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="pagination-wrapper">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { MessageBox } from "element-ui";

export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    handleRowClick(row) {
      const pathType = row.matchType === "传统比赛" ? "match-a" : "match-b";
      this.$router.push(`/admin/event/${pathType}/${row.eventId}`);
    },
    tableRowClassName() {
      return "clickable-row";
    },
    formatDate(dateStr) {
      return dateStr ? new Date(dateStr).toISOString().split("T")[0] : "-";
    },
    formatDateTime(datetimeStr) {
      if (!datetimeStr) return "-";
      const date = new Date(datetimeStr);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },
    async loadData() {
      try {
        const res = await axios.post(
          "/api/event/page-event",
          {
            page: this.currentPage,
            pageSize: this.pageSize,
          },
          {
            headers: { admin_token: localStorage.getItem("admin_token") },
          }
        );
        this.tableData = res.data.data.records;
        this.total = res.data.data.total;
      } catch (error) {
        console.error("加载数据失败:", error);
      }
    },
    goToCreate() {
      this.$router.push("/admin/event/edit");
    },
    editEvent(id) {
      this.$router.push(`/admin/event/edit/${id}`);
    },
    async deleteEvent(id) {
      try {
        await MessageBox.confirm('确定删除该活动?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        const params = new URLSearchParams();
        params.append("id", id);
        await axios.post("/api/event/delete", params, {
          headers: { admin_token: localStorage.getItem("admin_token") },
        });
        this.$message.success("删除成功");
        this.loadData();
      } catch (error) {
        if (error === 'cancel') {
          this.$message.info('已取消删除');
        } else {
          this.$message.error("删除失败");
          console.error(error);
        }
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.loadData();
    },
  },
};
</script>

<style scoped lang="scss">
.event-container {
  padding: 20px;

  .create-btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    i {
      margin-right: 8px;
      font-size: 16px;
    }
  }

  .el-table {
    margin-top: 20px;
    border-radius: 8px;
    overflow: hidden;

    ::v-deep(.el-table__header th) {
      background-color: #f5f7fa;
      color: #333;
      font-weight: bold;
      text-align: center;
    }

    ::v-deep(.el-table__row) {
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #f0f9eb;
      }
    }

    .el-tag {
      font-size: 14px;
      padding: 6px 10px;
      border-radius: 4px;
    }
  }

  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: center; /* 居中对齐 */
  }
}
</style>