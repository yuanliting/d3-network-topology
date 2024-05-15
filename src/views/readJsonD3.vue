<template>
    <div class="index2-container">
      <D3Three
        ref="D3Three"
        :selection="{ nodes: selected, links: linksSelected }"
        :net-nodes="nodes"
        :net-links="links"
        :options="options"
        :linkCb="linkCb"
        :node-sym='nodeSym'
        :tool="tool"
        @allNodes="allNodes"
        @allLinks="allLinks"
        @nodeClick="nodeClick"
        @linkClick="linkClick"
        @screenShot='screenShotDone'
      />
      <ToolBar @toolChange="toolChange" @takeScreenShot="takeScreenShot" />
      <MySelection
        v-if="showSelection"
        @action="selectionEvent"
        :nodes.sync="selected"
        :links.sync="linksSelected"
        @removeNode="removeNode"
        />
      <!-- 导出中 -->
      <div v-if="toaster" class="toaster">
        <p>{{ toaster }}</p>
      </div>

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
    </div>
  </template>
  
<script>
  import * as utils from './utils.js'
  import D3Three from '../components/D3Three.vue'
  import ToolBar from '../components/ToolBar.vue'
  import MySelection from '../components/MySelection.vue'
  import saveImage from './saveImage.js'
  export default {
    name: 'App',
    components: {
      D3Three,
      ToolBar,
      MySelection
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
        console.log('根据nodeId进行判断删除', nodeId)
        console.log('选中的node节点', this.selected)
        if (this.selected[nodeId]) {
          this.$delete(this.selected, nodeId)   
        }
        this.$refs['D3Three'].removeNode(nodeId)
        console.log('所有的线', this.links)
        for (let i = 0; i < this.links.length; i++) {
          const link = this.links[i];
          if (link.source.id === nodeId || link.target.id === nodeId) {
            console.log('---要删除的线---', link)
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
            this.$refs['D3Three'].removeLink(id)
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
        let nodeId = this.generateRandomString(10)
        // let linkId = this.lastLinkId + 1
        let nNode = utils.newNode(nodeId)
        nNode.x = node.x + 50
        nNode.y = node.y + 50
        // this.nodes = this.nodes.concat(nNode)
        this.lastNodeId++
        // this.links = this.links.concat(utils.newLink(linkId, node.id, nodeId))
        this.lastLinkId++
         // 创建新节点的连接
         var newLink = {
          index: Object.keys(this.links).length + 1,
          source: node, // 现有节点ID
          target: nNode, // 新节点ID
          value: 1
        };
        // 去新增节点 和 线
        this.$refs['D3Three'].createNodeAndLink(nNode, newLink)
      },
      linkClick(event, link) {
        if (this.tool === 'killer') {
          this.removeLink(link)
        } else {
          if (this.linksSelected[`${link.source.id}-${link.target.id}`]) {
            this.unSelectLink(`${link.source.id}-${link.target.id}`)
          } else {
            this.selectLink(link)
          }
        }
        this.updateSelection()
      },
      allNodes(args) {
        console.log('所有的nodes', args)
        this.nodes = args
      },
      allLinks(args) {
        this.links = args
      },
      pinNode() {
      },
      removeLink(link) {
        this.unSelectLink(`${link.source.id}-${link.target.id}`)
        this.$refs['D3Three'].removeLink(`${link.source.id}-${link.target.id}`)
      },
      selectLink(link) {
        this.$set(this.linksSelected, `${link.source.id}-${link.target.id}`, link)
        // 选中线
  
      },
      selectionEvent(action, args) {
        utils.methodCall(this, action, args)
        this.updateSelection()
      },
      clearSelection() {
        this.selected = {}
        this.linksSelected = {}
        // 取消所有的节点和关系线的选中
        this.$refs['D3Three'].clearAllSelect()
      },
      unSelectNode(nodeId) {
        if (this.selected[nodeId]) {
          this.$delete(this.selected, nodeId)
          // 节点取消选中
          this.$refs['D3Three'].cancleNodeSelect(nodeId)
          for (let link of this.links) {
            // node is selected
            if (nodeId === link.source.id || nodeId === link.target.id) {
              // 去掉线的选中
              this.$refs['D3Three'].cancleLinkSelect(`${link.source.id}-${link.target.id}`)
            }
          }
        }
        this.selectNodesLinks()
      },
      unSelectLink(linkId) {
        if (this.linksSelected[linkId]) {
          this.$delete(this.linksSelected, linkId)
        }
      },
      toolChange(val) {
        this.tool = val
        let cursorClass = (val === 'pointer') ? '' : 'cross-cursor'
        this.$el.className = cursorClass
      },
      takeScreenShot() {
        console.log('保存')
        this.dialogVisible = true
      },
      screenShot () {
        this.dialogVisible = false
        let name, bgColor, toSVG, svgAllCss
        let exportFunc
        let args = []
        toSVG = this.toSvg
        exportFunc = this.$refs['D3Three'].svgScreenShot
        args = [toSVG, bgColor, svgAllCss]
        if (toSVG) name = name || 'export.svg'
        
        exportFunc((err, url) => {
          if (!err) {
            if (!toSVG) saveImage.save(url, 'img')
            else saveImage.download(url, name)
          }
          this.screenShotDone(err)
        }, ...args)
      }
    }
  }
</script>
<style src="../assets/css/icons.css"></style>
<style>
.index2-container {
  position: relative;
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
     
</style>