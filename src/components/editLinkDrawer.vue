<template>
    <el-drawer
      title="连接线信息"
      :visible.sync="drawerVisible"
      :before-close="handleClose"
      ref="drawer"
      direction="rtl"
      custom-class="edit-link-drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="form" class="edit-link-drawer-form">
            <el-form-item label="线id" :label-width="formLabelWidth">
                <el-input v-model="form.id" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="线名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="线样式" :label-width="formLabelWidth">
              <el-radio-group v-model="form.linkStyle" class="select-link-form-radio-group">
                <el-radio label="solidLine"></el-radio>
                <el-radio label="dottedLine"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="线类型" :label-width="formLabelWidth">
              <el-radio-group v-model="form.linkType" class="select-link-form-radio-group">
                <el-radio label="straightLine"></el-radio>
                <el-radio label="polyLine"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否删除" :label-width="formLabelWidth">
              <el-radio-group v-model="form.isDelete" class="select-link-form-radio-group">
                <el-radio :label="false">否</el-radio>
                <el-radio :label="true">是</el-radio>
              </el-radio-group>
            </el-form-item>
        </el-form>
      </div>
      <div class="edit-link-drawer__footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="okForm" :loading="loading">{{ loading ? '更改中 ...' : '确 定' }}</el-button>
      </div>
    </el-drawer>
</template>
<script>
export default {
  name: 'EditNodeDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    link: {
      type: Object,
      default: () => {return null}
    }
  },
  data() {
    return {
      drawerVisible: false,
      formLabelWidth: '80px',
      form: {
        id: '',
        name: '',
        linkStyle: '',
        linkType: 'straightLine',
        isDelete: false
      },
      loading: false
    }
  },
  watch: {
    visible: {
      immediate: true,
      deep: true,
      handler(val) {
        this.drawerVisible = val
        if(val && this.link) {
            this.form.id = `${this.link.source.id}-${this.link.target.id}`
            this.form.name = this.link.name
            this.form.linkStyle = this.link.linkStyle
            this.form.linkType = this.link.linkType
        }
      }  
    }
  },
  methods: {
    handleClose(done) {
      this.$emit('cancel')
      done()
    },
    cancelForm() {
      this.$emit('cancel')
    },
    okForm() {
      this.$emit('ok', this.form)
    }
  }
}
</script>
<style>
.edit-link-drawer .el-drawer__header{
    margin-bottom: 20px;
    padding: 12px 12px;
    border-bottom: 1px solid #DCDFE6;
}
.edit-link-drawer .el-drawer__body {
    height: calc(100vh - 59px);
}
.edit-link-drawer .edit-link-drawer__footer {
    position: absolute;
    width: 100%;
    bottom: 0px;
    display: flex;
    padding: 15px 15px;
    background: #fff;
    border-top: 1px solid #DCDFE6;
    z-index: 2;
}
.edit-link-drawer .edit-link-drawer__footer .el-button {
    flex: 1;
}
.edit-link-drawer-form  {
  margin-bottom: 101px;
}
.edit-link-drawer-form .el-form-item__content {
    width: 75% !important;
}
.select-node-img-checkbox-group {
    width: 100%;
    overflow: hidden;
}
.select-node-img-checkbox-group .el-checkbox {
    margin-right: 10px;
    width: 30%;
    float: left;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
::v-deep .select-link-form-radio-group{
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start;
    height: 40px;
}
</style>