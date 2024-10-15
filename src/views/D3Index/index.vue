<template>
    <div class="containers index1-container">
      <div class="top-btn-div">
        <div class="theme-switch-wrapper"> 
          <label class="theme-switch" for="checkbox">
              <input type="checkbox" id="checkbox"  @click="switchTheme($event)" />
              <div class="slider round"></div>
          </label>
        </div> 
        <el-button class="sacle-big-btn" @click="bigChange()">放大</el-button>
        <el-button class="sacle-small-btn" @click="smallChange()">缩小</el-button>
        <el-button class="sacle-small-btn" @click="centerChange()">居中</el-button>
        <el-button :type="layout === 'tree' ? 'primary' : ''" class="sacle-small-btn" plain @click="treeLayout()">tree layout</el-button>
        <el-button :type="layout === 'reset' ? 'primary' : ''" class="sacle-small-btn" plain @click="resetLayout()">reset layout</el-button>
        <el-button class="clear-svg-btn" @click="clearChange()">清空画布</el-button>
        <el-button class="save-btn" @click="saveChange()">保存更改</el-button>
        <el-button v-if="layout === 'tree'" class="save-btn" @click="addTreeNodes()">添加五个节点</el-button>
      </div>
     <div class="content-flex-wrap">
      <div v-if="layout === 'reset'" class="left-list" :class="{'collapsed': !$store.state.isCollapse, 'notCollapsed': $store.state.isCollapse}">
        <List @changeCollapsed="changeCollapsed" @addNode="addNode" @addSvgNode="addSvgNode" />
      </div>
      <div class="right-svg-wrap" :class="{'collapsed': !$store.state.isCollapse, 'notCollapsed': $store.state.isCollapse}">
        <Pro
          v-if="layout === 'reset'"
          ref="proDThree"
          :selection="{ nodes: selected, links: linksSelected }"
          :net-nodes="nodes"
          :net-links="links"
          :options="options"
          :linkCb="linkCb"
          :node-sym='nodeSym'
          :tool.sync="tool"
          :svgMap="svgMap"
          @allNodes="allNodes"
          @allLinks="allLinks"
          @nodeClick="nodeClick"
          @linkClick="linkClick"
          @screenShot='screenShotDone'
          @showNodeDrawer="showNodeDrawer"
          @selectionEvent="selectionEvent"
          @changeCollapsed="changeCollapsed"
        />
        <Tree v-if="layout === 'tree'" ref="tree" />
      </div>
     </div>
      <ToolBar v-if="layout === 'reset'" @toolChange="toolChange" @takeScreenShot="takeScreenShot" />
      <MySelection
        ref="mySelection"
        v-if="showSelection && layout === 'reset'"
        @action="selectionEvent"
        :nodes.sync="selected"
        :links.sync="linksSelected"
        :svgMap="svgMap"
        @removeNode="removeNode"
      />
      <!-- 导出中的提示 -->
      <div v-if="toaster" class="toaster">
        <p>{{ toaster }}</p>
      </div>
      <!-- 导出弹窗 -->
      <el-dialog
        title="Export as:"
        :visible.sync="dialogVisible"
        width="30%"
        center>
        <div style="text-align: center">
          <el-radio v-model="toSvg" :label="true">svg</el-radio>
          <el-radio v-model="toSvg" :label="false">png</el-radio>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" style="padding: 0.5em 2em;">取 消</el-button>
          <el-button type="primary" @click="screenShot()" style="padding: 0.5em 2em;">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑节点抽屉组件 -->
      <EditNodeDrawer
        :visible="nodeDrawerVisible"
        :node="currentNode"
        :svgMap="svgMap"
        @cancel="cancelEditNode()"
        @ok="okEditNode"
      />
       <!-- 编辑连接线抽屉组件 -->
       <EditLinkDrawer
        :visible="linkDrawerVisible"
        :link="currentLink"
        @cancel="cancelEditLink()"
        @ok="okEditLink"
      />
    </div>
  </template>
  
  <script>
  import * as utils from '@/utils/index'
  import Pro from '@/components/ProDThree.vue'
  import ToolBar from '@/components/ToolBar.vue'
  import MySelection from '@/components/MySelection.vue'
  import saveImage from '@/utils/saveImage'
  import EditNodeDrawer from '@/components/editNodeDrawer'
  import EditLinkDrawer from '@/components/editLinkDrawer'
  import Tree from '@/components/Tree.vue'
  import List from '@/components/list/index.vue'
  export default {
    name: 'App',
    components: {
      Pro,
      ToolBar,
      MySelection,
      EditNodeDrawer,
      EditLinkDrawer,
      Tree,
      List
    },
    data() {
      return {
        nodes: [],
        links: [],
        showMenu: false,
        selected: {},
        showSelection: false,
        linksSelected: {},
        options: {
          icon: false,
          canvas: false,
          size: {
            w: 500,
            h: 500
          },
          force: 350,
          offset: {
            x: 0,
            y: 0
          },
          nodeSize: 20,
          linkWidth: 1,
          nodeLabels: false,
          linkLabels: false,
          strLinks: true,
        },
        lastNodeId: 0,
        lastLinkId: 0,
        settings: {
          maxLinks: 3,
          maxNodes: 150
        },
        showHint: true,
        toaster: null,
        svgChoice: false,
        toSvg: false,
        nodeSym: null,
        tool: 'pointer',
        dialogVisible: false,
        canvas: false,
        nodeDrawerVisible: false,
        currentNode: null,
        svgMap: {
          0: require('@/assets/svg/交换机.svg'),
          1: require('@/assets/svg/APP.svg'),
          2: require('@/assets/svg/服务器.svg'),
          3: require('@/assets/svg/网络.svg'),
          4: require('@/assets/svg/PC.svg'),
          5: require('@/assets/svg/云.svg'),
          6: require('@/assets/svg/数据库.svg'),
          7: require('@/assets/svg/earth.svg'),
          8: require('@/assets/svg/Docker.svg'),
          9: require('@/assets/svg/router.svg'),
          10: require('@/assets/svg/switch.svg'),
          11: require('@/assets/svg/building.svg')
        },
        linkDrawerVisible: false,
        currentLink: null,
        layout: 'reset'
      }
    },
    computed: {
      showSel () {
        return true
      }
    },
    mounted () {
      this.options.size.w = this.$el.clientWidth
      this.options.size.h = this.$el.clientHeight
      this.initTheme()
    },
    created () {
      this.reset()
    },
    methods: {
      linkCb (link) {
        link.name = 'Link ' + `${link.source.id}-${link.target.id}`
        return link
      },
      screenShotDone (err) {
        this.toaster = err || 'Saving Screenshot...'
        let vm = this
        window.setTimeout(() => {
          vm.toaster = null
        }, 3000)
      },
      resetOptions () {
        this.$set(
          this.$data,
          'options',
          {
            canvas: false,
            size: {
              w: 500,
              h: 500
            },
            force: 350,
            offset: {
              x: 0,
              y: 0
            },
            nodeSize: 20,
            linkWidth: 1,
            nodeLabels: false,
            linkLabels: false,
            strLinks: true
        })
        this.options.offset.x = 0
        this.options.offset.y = 0
      },
      selection() {
        return {
          nodes: this.selected,
          links: this.linksSelected
        }
      },
      updateSelection() {
        this.showSelection = (Object.keys(this.selected).length | Object.keys(this.linksSelected).length)
      },
      reset() {
        this.selected = {}
        this.linksSelected = {}
      },
      selectNode(node) {
        this.selected[node.id] = node
        this.$refs['proDThree'].selectNode(node)
        this.$refs['mySelection'] ? this.$refs['mySelection'].init() : false
      },
      selectNodesLinks() {
        for (let link of this.links) {
          // node is selected
          if (this.selected[link.source.id] || this.selected[link.target.id]) {
            this.selectLink(link)
            // node is not selected
          } else {
            this.unSelectLink(`${link.source.id}-${link.target.id}`)
          }
        }
      },
      nodeClick(event, node) {
        console.log('什么情况下点击的节点', this.tool)
        switch (this.tool) {
          case 'killer':
            this.removeNode(node.id)
            break
          case 'parent':
            this.createParent(node)
            break
          case 'children':
            // this.createSingleNode()
            break
          case 'boxSelect':
            this.startBoxSelect()
            break
          case 'pin':
            this.pinNode(node)
            break
          default: // selection tool
            // is selected
            console.log('你点击了', node.id)
            if (this.selected[node.id]) {
              this.unSelectNode(node.id)
              // is not selected
            } else {
              this.selectNode(node)
            }
            this.selectNodesLinks()
            break
        }
        this.updateSelection()
      },
      removeNode (nodeId) {
        if (this.selected[nodeId]) {
          this.$delete(this.selected, nodeId)   
        }
        this.$refs['proDThree'].removeNode(nodeId)
        for (let i = 0; i < this.links.length; i++) {
          const link = this.links[i];
          if (link.source.id === nodeId || link.target.id === nodeId) {
            this.removeLink(link)
          }
        }
      },
      rebuildLinks (nodes) {
        if (!nodes) nodes = this.nodes
        let links = utils.rebuildLinks(nodes, this.links)
        for (let i = 0; i < links.removed.length; i++) {
          const link = links.removed[i];
          const id = `${link.source.id}-${link.target.id}`
          if (this.linksSelected[id]) {
            this.$delete(this.linksSelected, id)
            this.$refs['proDThree'].removeLink(id)
          }
        }
        return links.newLinks
      },
      generateRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      },
      createParent(node) {
        // 去新增节点 和 线
        this.$refs['proDThree'].createChildrenNode(node)
      },
      linkClick(event, link) {
        if (this.tool === 'killer') {
          this.removeLink(link)
        } else {
          if (this.linksSelected[`${link.source.id}-${link.target.id}`]) {
            this.unSelectLink(`${link.source.id}-${link.target.id}`)
          } else {
            this.selectLink(link)
            this.showLinkDrawer(link)
          }
        }
        this.updateSelection()
      },
      allNodes(args) {
        this.nodes = args
      },
      allLinks(args) {
        this.links = args
      },
      pinNode() {
      },
      removeLink(link) {
        this.unSelectLink(`${link.source.id}-${link.target.id}`)
        this.$refs['proDThree'].removeLink(`${link.source.id}-${link.target.id}`)
      },
      selectLink(link) {
        this.$set(this.linksSelected, `${link.source.id}-${link.target.id}`, link)
        // 选中线
        this.$refs['proDThree'].selectLink('select',`${link.source.id}-${link.target.id}`)
      },
      selectionEvent(action, args) {
        console.log('----取消选中---')
        utils.methodCall(this, action, args)
        this.updateSelection()
      },
      clearSelection() {
        this.selected = {}
        this.linksSelected = {}
        // 取消所有的节点和关系线的选中
        this.$refs['proDThree'].clearAllSelect('select')
      },
      unSelectNode(nodeId) {
        if (this.selected[nodeId]) {
          this.$delete(this.selected, nodeId)
          // 节点取消选中
          this.$refs['proDThree'].cancleNodeSelect('select',nodeId)
          for (let link of this.links) {
            // node is selected
            if (nodeId === link.source.id || nodeId === link.target.id) {
              // 去掉线的选中
              this.$refs['proDThree'].cancleLinkSelect('select', `${link.source.id}-${link.target.id}`)
              this.unSelectLink(`${link.source.id}-${link.target.id}`)
            }
          }
        }
        // this.selectNodesLinks()
      },
      unSelectLink(linkId) {
        if (this.linksSelected[linkId]) {
          this.$delete(this.linksSelected, linkId)
          this.$refs['proDThree'].cancleLinkSelect('select', `${linkId}`)
        }
      },
      toolChange(val) {
        this.tool = val
        let cursorClass = (val === 'pointer') ? 'pointer' : !val ? 'grab' : 'cross-cursor'
        this.$el.className = cursorClass
        this.$refs['proDThree'].handlerChangeTool(val)
        this.$refs['proDThree'].deleteClickAddNode()
        if(val === 'children') {
          this.$refs['proDThree'].registerClickAddNode()
        }
        if(val === 'boxSelect') {
          this.startBoxSelect()
        }
      },
      startBoxSelect() {
        console.log('进行框选')
        this.$refs['proDThree'].drawBrush()
      },
      takeScreenShot() {
        this.dialogVisible = true
      },
      screenShot () {
        this.dialogVisible = false
        let name, bgColor, toSVG, svgAllCss
        let exportFunc
        let args = []
        toSVG = this.toSvg
        exportFunc = this.$refs['proDThree'].svgScreenShot
        args = [toSVG, bgColor, svgAllCss]
        if (toSVG) name = name || 'export.svg'
        
        exportFunc((err, url) => {
          if (!err) {
            if (!toSVG) saveImage.save(url, 'img')
            else saveImage.download(url, name)
          }
          this.screenShotDone(err)
        }, ...args)
      },
      showNodeDrawer(node) {
        this.nodeDrawerVisible = true
        this.currentNode = node
      },
      cancelEditNode() {
        this.nodeDrawerVisible = false
        if (!this.selected[this.currentNode.id]) {
          this.$refs['proDThree'].cancleNodeSelect('select', this.currentNode.id)
        }
      },
      okEditNode(data) {
        this.nodeDrawerVisible = false
        console.log('确定更改', data)
        this.$refs['proDThree'].editNode(data)
      },
      showLinkDrawer(link) {
        this.linkDrawerVisible = true
        this.currentLink = link
      },
      cancelEditLink() {
        this.linkDrawerVisible = false
        if (!this.selected[this.currentLink.id]) {
          this.$refs['proDThree'].cancleLinkSelect('select', this.currentLink.id)
        }
      },
      okEditLink(data) {
        this.linkDrawerVisible = false
        console.log('确定更改', data)
        this.$refs['proDThree'].editLink({...this.currentLink, ...data})
      },
      addTreeNodes() {
        this.$refs['tree'] ? this.$refs['tree'].addTreeNodes() : false;
      },
      // 放大画布
      bigChange() {
        if(this.layout === 'reset') {
          this.$refs['proDThree'] ? this.$refs['proDThree'].bigChange() : false;
        } else {
          this.$refs['tree'] ? this.$refs['tree'].bigChange() : false;
        }
      },
      // 缩小画布
      smallChange() {
        if(this.layout === 'reset') {
          this.$refs['proDThree'] ? this.$refs['proDThree'].smallChange() : false;
        } else {
          this.$refs['tree'] ? this.$refs['tree'].smallChange() : false;
        }
      },
      // 画布中的节点居中
      centerChange(){
        if(this.layout === 'reset') {
          this.$refs['proDThree'] ? this.$refs['proDThree'].centerChange() : false;
        } else {
          this.$refs['tree'] ? this.$refs['tree'].centerChange() : false;
        }
      },
      // 保存更改为json文件
      saveChange() {
        this.$refs['proDThree'] ? this.$refs['proDThree'].saveChange() : false;
      },
      // reset layout布局
      resetLayout() {
        this.layout = 'reset'
        this.$store.dispatch('changeIsCollapse', true)
        this.$refs['proDThree'] ? this.$refs['proDThree'].changeCollapsed(true) : false;
      },
      treeLayout() {
        this.layout = 'tree'
        this.$store.dispatch('changeIsCollapse', false)
        this.$refs['proDThree'] ? this.$refs['proDThree'].changeCollapsed(false) : false;
      },
      initTheme() {
        const theme = this.$store.state.theme
        this.changeTheme(theme)
        // 同步更改切换主题的按钮的样式
        document.getElementById('checkbox').checked = theme === 'dark';
      },
      // 更换主题
      switchTheme(e) {
        if (e.target.checked) { 
          this.changeTheme('dark');
        } else { 
          this.changeTheme('light');
        }
      },
      changeTheme(theme) {
        if(theme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark')
          localStorage.setItem('theme', 'dark'); 
          // 同步更新视图中的网格图
          this.$refs['proDThree'].themeChange('dark');
        }
        if(theme == 'light') {
          document.documentElement.setAttribute('data-theme', 'light')
          localStorage.setItem('theme', 'light'); 
          // 同步更新视图中的网格图
          this.$refs['proDThree'].themeChange('light');
        }
      },
      clearChange() {
        if(this.layout === 'reset') {
          this.$refs['proDThree'].clearChange();
        } else {
          this.$refs['tree'].clearChange();
        }
      },
      changeCollapsed(bool) {
        this.$refs['proDThree'] ? this.$refs['proDThree'].changeCollapsed(bool) : false;
      },
      addNode(node) {
        this.$refs['proDThree'] ? this.$refs['proDThree'].addNode(node) : false;
      },
      addSvgNode(node) {
        this.$refs['proDThree'] ? this.$refs['proDThree'].addNode(node) : false;
      }
    }
  }
  </script>
  <style src="@/assets/css/icons.css"></style>
  <style>
  .index1-container {
    position: relative;
    width: 100vw;
    height: 100vh;
  }
   .cross-cursor{
    cursor: crosshair;
   }
   .toaster {
    position: absolute;
      bottom: 0.5em;
      right: 2em;
      z-index: 500;
      background-color: #fff;
      border: #1aad8d solid 2px;
      border-radius: 0.25em;
      min-width: 20em;
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
      animation-name: toaster-anim;
      animation-duration: 0.25s;
   }
   @keyframes toaster-anim {
    0%{
      opacity: 0;
      transform: scaleY(0) translateY(5em)
    }
    100%{
      opacity: 1;
      transform: scaleY(1) translateY(0)
    }
   }
.top-btn-div {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}
.content-flex-wrap {
  display: flex;
  /* justify-content: flex-start; */
  justify-content: center;
  /* min-height: 700px; */
  height: calc(100vh - 70px);
}
.left-list {
  width: 200px;
  height: calc(100vh - 200px);
}
.left-list.collapsed {
  width: 20px;
}
.left-list.notCollapsed {
  width: 200px;
}
.right-svg-wrap {
  width: calc(100% - 220px);
  height: 100%;
}
.right-svg-wrap.collapsed {
  width: calc(100% - 20px);
}
.right-svg-wrap.notCollapsed {
  width: calc(100% - 220px);
}
  </style>