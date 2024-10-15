<template>
    <div class="toolbox-list-wrap">
        <div class="q-sidebar_tags left">
            <div class="q-sidebar_tag q-sidebar_active" @click="isCollapseChange()">Toolbox</div>
        </div>
        <div class="collapse-wrap" :class="{'collapsed': !$store.state.isCollapse, 'notCollapsed': $store.state.isCollapse}">
            <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="网络图片" name="1">
                <IMgList @addNode="addNode" />
            </el-collapse-item>
            <el-collapse-item title="几何图形" name="2">
                <div>暂时没有，圆形、方形、菱形等</div>
            </el-collapse-item>
            <el-collapse-item title="svg" name="3">
                <SVGList @addSvgNode="addSvgNode" />
            </el-collapse-item>
        </el-collapse>
        </div>
    </div>
</template>
<script>
import IMgList from '@/components/list/imgList.vue';
import SVGList from '@/components/list/svgList.vue';
export default {
    components: {
        IMgList,
        SVGList
    },
    data() {
      return {
        activeNames: ['1']
      };
    },
    methods: {
        isCollapseChange() {
            const isCollapse = !this.$store.state.isCollapse
            this.$store.dispatch('changeIsCollapse', isCollapse)
            this.$emit('changeCollapsed', isCollapse)
        },
        handleChange(val) {
            console.log(val);
        },
        addNode(node) {
            this.$emit('addNode', node);
        },
        addSvgNode(node) {
            this.$emit('addSvgNode', node);
        }
    }
}
</script>
<style lang="scss" scoped>
.toolbox-list-wrap {
    display: flex;
    justify-content: flex-start;
    height: 100%;
}
.collapse-wrap {
    box-shadow: 3px 0 5px -3px #888;
    height: 100%;
    width: 180px;
    transition: width 0.5s ease; /* 宽度变化的过渡动画 */
}
.collapse-wrap.collapsed {
  width: 0; /* 左侧区域收缩后的宽度 */
  display: none;
}
.collapse-wrap.notCollapsed {
  width: 180px; /* 左侧区域展开后的宽度 */
  display: block;
}
.q-sidebar {
    display: flex;
    box-sizing: border-box;
}
.q-sidebar_tags {
    background: rgba(128, 128, 128, 0.1);
    width: 20px;
    height: 100%;
}
.q-sidebar_tags.left>.q-sidebar_tag {
    transform: rotate(180deg);
}
.q-sidebar_tags>.q-sidebar_tag {
    padding: 8px 4px;
    writing-mode: vertical-lr;
    user-select: none;
    -webkit-user-select: none;
    cursor: default;
    font-family: sans-serif;
    text-transform: capitalize;
    line-height: 1;
    width: 20px;
    box-sizing: border-box;
}
.q-sidebar_active {
    font-weight: bold;
    background-color: rgba(128, 128, 128, 0.3);
}
:deep(.collapse-wrap .el-collapse-item__header) {
    padding-left: 15px;
}
</style>