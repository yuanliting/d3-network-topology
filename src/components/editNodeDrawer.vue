<template>
    <el-drawer
      title="节点信息"
      :visible.sync="drawerVisible"
      :before-close="handleClose"
      ref="drawer"
      direction="rtl"
      custom-class="edit-node-drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="form" class="edit-node-drawer-form">
            <el-form-item label="节点id" :label-width="formLabelWidth">
                <el-input v-model="form.id" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="节点名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="节点图片" :label-width="formLabelWidth">
                <el-checkbox-group v-model="form.group" size="small" class="select-node-img-checkbox-group" @change="changeImg">
                    <el-checkbox v-for="(value, key, index) in svgMap" :label="key" :key="index">
                        <el-avatar shape="square" :src="`${value}`" style="background: transparent;"></el-avatar>
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
      </div>
      <div class="edit-node-drawer__footer">
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
    node: {
      type: Object,
      default: () => {return null}
    },
    svgMap: {
      type: Object
    }
  },
  data() {
    return {
      drawerVisible: false,
      formLabelWidth: '80px',
      form: {
        id: '',
        name: '',
        group: []
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
        if(val && this.node) {
            this.form.id = this.node.id
            this.form.name = this.node.name
            this.form.group = [this.node.group.toString()]
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
    },
    changeImg(val) {
        console.log('改变之', val)
        if(val && val.length > 0) {
            this.form.group = [val[val.length - 1]]
        }
    }
  }
}
</script>
<style>
.edit-node-drawer .el-drawer__header{
    margin-bottom: 20px;
    padding: 12px 12px;
    border-bottom: 1px solid #DCDFE6;
}
.edit-node-drawer .el-drawer__body {
    height: calc(100vh - 59px);
}
.edit-node-drawer .edit-node-drawer__footer {
    position: absolute;
    width: 100%;
    bottom: 0px;
    display: flex;
    padding: 15px 15px;
    background: #fff;
    border-top: 1px solid #DCDFE6;
    z-index: 2;
}
.edit-node-drawer .edit-node-drawer__footer .el-button {
    flex: 1;
}
.edit-node-drawer-form .el-form-item__content {
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
</style>