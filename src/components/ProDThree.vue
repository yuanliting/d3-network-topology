<template>
  <div id="content">
    <div id="topology_container">
      <svg id="svg1" ref="svg"></svg>
    </div>
    <div id="show-tips">
      <h6></h6>
      <i class='close'></i>
      <ul></ul>
    </div>
    <ul class="el-dropdown-menu el-popper" id="contextmenu-div"
      style="transform-origin: center top; z-index: 2015; position: absolute;" x-placement="top-end">
      <li tabindex="-1" class="el-dropdown-menu__item" @click="contextmenuClickEvent('create')"><i
          class="el-icon-circle-plus"></i>添加节点</li>
      <li tabindex="-1" class="el-dropdown-menu__item" @click="contextmenuClickEvent('createLink')"><i
          class="el-icon-circle-plus"></i>添加连线</li>
      <li tabindex="-1" class="el-dropdown-menu__item" @click="contextmenuClickEvent('edit')"><i
          class="el-icon-edit"></i>更改节点</li>
      <li tabindex="-1" class="el-dropdown-menu__item" @click="contextmenuClickEvent('delete')"><i
          class="el-icon-delete-solid"></i>删除节点</li>
    </ul>
  </div>
</template>

<script>
import * as $ from 'jquery'
import * as d3 from 'd3'
import svgExport from '@/utils/svgExport'
import * as utils from '@/utils/index'

export default {
  name: 'ProDThree',
  components: {},
  props: {
    netNodes: {
      type: Array
    },
    netLinks: {
      type: Array
    },
    options: {
      type: Object
    },
    nodeSym: {
      type: String
    },
    nodeCb: {
      type: Function
    },
    linkCb: {
      type: Function
    },
    simCb: {
      type: Function
    },
    customForces: {
      type: Object
    },
    selection: {
      type: Object,
      default: () => {
        return {
          nodes: {},
          links: {}
        }
      }
    },
    svgMap: {
      type: Object
    }
  },
  computed: {
    selected() {
      return this.selection.nodes
    },
    linksSelected() {
      return this.selection.links
    }
  },
  data() {
    return {
      graph: {
        nodes: [
          {
            id: "Myriel",
            name: 'Myriel',
            imgType: 1,
            icon_border: 'circle',
            icon: 'svg'
          },
          {
            id: "Napoleon",
            name: "Napoleon",
            imgType: 1,
            icon_border: 'circle',
            icon: 'svg'
          },
          {
            id: "Labarre",
            name: "Labarre",
            imgType: 2,
            icon_border: 'circle',
            icon: 'svg'
          },
          {
            id: "Valjean",
            name: "Valjean",
            imgType: 2,
            icon_border: 'circle',
            icon: 'svg'
          },
          {
            id: "Baptistines",
            name: "Baptistines",
            imgType: 1,
            icon_border: 'circle',
            icon: 'svg'
          },
          {
            id: "MmeMagloire",
            name: "MmeMagloire",
            imgType: 1,
            icon_border: 'circle',
            icon: 'svg'
          },
          {
            id: "网络",
            name: "网络",
            imgType: 7,
            icon_border: 'circle',
            icon: 'svg'
          },
          {
            id: 'docker',
            name: "docker",
            imgType: 8,
            icon_border: 'circle',
            icon: 'svg'
          },
          {
            id: '云',
            name: "云",
            imgType: 5,
            icon_border: 'circle',
            icon: 'svg'
          },
          {
            id: '数据库',
            name: "数据库",
            imgType: 6,
            icon_border: 'circle',
            icon: 'svg'
          }
        ],
        links: [
          {
            source: "Napoleon",
            target: "Myriel",
            linkStyle: 'solidLine',
            linkType: 'polyLine',
            pathName: '线的名字',
            value: 1
          },
          {
            source: "Valjean",
            target: "Labarre",
            linkStyle: 'solidLine',
            linkType: 'straightLine',
            pathName: '',
            value: 1
          },
          {
            source: "Baptistines",
            target: "Myriel",
            linkStyle: 'solidLine',
            linkType: 'straightLine',
            pathName: '',
            value: 8
          },
          {
            source: "MmeMagloire",
            target: "Myriel",
            linkStyle: 'solidLine',
            linkType: 'straightLine',
            pathName: '',
            value: 10
          },
          {
            source: "docker",
            target: "网络",
            linkStyle: 'solidLine',
            linkType: 'straightLine',
            pathName: '',
            value: 1
          },
          {
            source: "数据库",
            target: "云",
            linkStyle: 'solidLine',
            linkType: 'straightLine',
            pathName: '',
            value: 1
          },
          {
            source: "云",
            target: "docker",
            linkStyle: 'solidLine',
            linkType: 'straightLine',
            pathName: '',
            value: 1
          },
          {
            source: "数据库",
            target: "网络",
            linkStyle: 'solidLine',
            linkType: 'straightLine',
            pathName: '',
            value: 1
          }
        ]
      },
      imgMap: {
        0: require('../assets/img/交换机.jpeg'),
        1: require('../assets/img/手机.jpeg'),
        2: require('../assets/img/服务器.jpeg'),
        3: require('../assets/img/网络.jpg'),
        4: require('../assets/img/计算机.jpg')
      },
      node: null,
      link: null,
      simulation: null,
      nodeClassName: 'node-item',
      container: null,
      symbolSize: 40,
      padding: 4,
      node_icon_border: null,
      svg_rect: null,
      svg_text: null,
      svg_defs: null,
      svg: null,
      tool: 'pointer',
      currentNode: null,
      svgImgBlob: [],
      moveLine: null,
      boxSelectClickTime: null,
      boxSelectStartLoc: [],
      boxSelectEndLoc: [],
      boxSelectFlag: "",
      zoom: null,
      zoomMin: 0.3,
      zoomMax: 5,
      boxSelectNodeList: [],
      currentBoxSelectMoveElement: [],
      moveX1: 0,
      moveY1: 0,
      moveDiffX: 0,
      moveDiffY: 0,
      groupsOne: [
        {id: 'group-cms', name: 'cms', group: 1, imgType: 11, icon_border: 'circle', nodes: [{id: 'jiaohuanji', name: '交换机', group: 1, imgType: 10, icon_border: 'circle'}, {id: 'app', name: 'App', group: 1, imgType: 1, icon_border: 'circle'}]},
        {id: 'group-sop', name: 'sop', group: 2, imgType: 9, icon_border: 'circle', nodes: [{id: 'fuwiqi', name: '服务器', group: 2, imgType: 2, icon_border: 'circle'}, {id: 'wawonglong', name: '网络2', group: 2, imgType: 3, icon_border: 'circle'}]}
      ],
      mainCirceRadius: 0,
      lineTextGroup: null,
      lineTexts: null
    }
  },
  watch: {
    'selection.links': {
      immediate: true,
      deep: true,
      handler() {
      }
    },
    netNodes() {
      // this.buildNodes(newValue)
      // this.reset()
    },
    netLinks() {
      // this.links = this.buildLinks(newValue)
      // this.reset()
    },
    nodeSym() {
    },
    options() {
    }
  },
  mounted() {
    const vm = this
    const promise = []
    // 将每个组转换为一个节点
    vm.graph.nodes = vm.graph.nodes.concat(this.groupsOne.map(function(group) {
      return {
        id: group.id,
        name: group.name,
        group: group.id,
        groupRadius: 20,
        members: group.nodes,
        imgType: group.imgType,
        icon_border: group.icon_border,
        type: 'group'
      };
    }));
    for (const key in this.imgMap) {
      const element = this.imgMap[key];
      promise.push(this.getBase64Image(element))
    }
    Promise.all(promise).then((res) => {
      for (const key in this.imgMap) {
        this.imgMap[key] = res[key]
      }
       // 将组内节点合并到nodes数组中
       // 组节点和组内节点的链接线
       this.groupsOne.forEach(function(group) {
        vm.graph.nodes = vm.graph.nodes.concat(group.nodes.map(function(node) {
          return {
            id: node.id,
            name: node.name,
            group: group.id,
            imgType: node.imgType,
            icon_border: group.icon_border,
            type: 'member'
          };
        }));
        vm.graph.links = vm.graph.links.concat(group.nodes.map(function(node) {
          return {
            source: group.id,
            target: node.id,
            linkStyle: 'solidLine',
            linkType: 'straightLine',
            pathName: '',
            value: 1
          };
        }));
      });
      // this.readJson()
      this.mainCirceRadius = vm.graph.nodes.length / 2
      this.initRender()
      this.$emit('allNodes', this.simulation.nodes())
      console.log('一共有多少条线', this.simulation.force('link').links())
      this.$emit('allLinks', this.simulation.force('link').links())
      console.log(d3.select('#group-cms'))
    })
  },
  methods: {
    // 读取json文件，并重新渲染画布
    readJson() {
      // 定义数据加载的URL
      const url = './4.json';
      // 使用d3.json加载数据
      d3.json(url)
        .then(data => {
          console.log('数据加载成功:', JSON.parse(data));
          // 在这里处理你的数据
          this.graph = JSON.parse(data)
          this.initRender()
          this.$emit('allNodes', this.simulation.nodes())
          this.$emit('allLinks', this.simulation.force('link').links())
        })
        .catch(error => {
          console.error('数据加载出错:', error);
        });
    },
    themeChange(theme) {
      this.$store.dispatch('changeTheme', theme);
      // 更改表格线颜色
      this.changeDiagramPatternColor()
      // 更换node颜色
      this.changeNodeColor()
      // 更改箭头颜色
      this.changeDefsColor()
      // 修改线上的文字颜色
      this.changeLinkTextColor()
    },
    /**
     * 更改表格线颜色
     */
    changeDiagramPatternColor() {
      const diagramPattern =  d3.select("#diagramPattern");
      if(diagramPattern && diagramPattern._groups && diagramPattern._groups.length > 0 && diagramPattern._groups[0][0]) {
        if(diagramPattern._groups[0][0].children && diagramPattern._groups[0][0].children.length > 0) {
          for (let i = 0; i < diagramPattern._groups[0][0].children.length; i++) {
            const element = diagramPattern._groups[0][0].children[i];
            element.attributes.stroke.value = this.$store.state.theme === 'dark' ? "#222" : "#fafafa"
          }
        }
      }
    },
    /**
     * 更改所有节点的背景色
     */
    changeNodeColor() {
      const allNode = d3.selectAll(".node-item");
      if(allNode && allNode._groups && allNode._groups[0].length > 0) {
        for (let index = 0; index < allNode._groups[0].length; index++) {
          const element = allNode._groups[0][index];
          const circle = d3.select(`g#${element.id} circle.node-circle-bg`);
          const text = d3.select(`g#${element.id} text.node`)
          if(circle && circle._groups && circle._groups[0].length > 0) {
            const circleItem = circle._groups[0][0]
            circleItem.attributes.fill.value = this.$store.state.theme === 'dark' ? '#000' : '#fff'
          }
          if(text && text._groups && text._groups[0].length > 0) {
            const textItem = text._groups[0][0]
            textItem.attributes.fill.value = this.$store.state.theme === 'dark' ? '#fff' : '#000'
          }
        }
      }
    },
    /**
     * 修改箭头颜色
     */
    changeDefsColor() {
      const defs = d3.select('defs');
      if(defs && defs._groups && defs._groups.length > 0 && defs._groups[0][0]) {
        if(defs._groups[0][0].children && defs._groups[0][0].children.length > 0) {
          for (let i = 0; i < defs._groups[0][0].children.length; i++) {
            const element = defs._groups[0][0].children[i];
            element.children[0].attributes.fill.value = this.$store.state.theme === 'dark' ? '#000' : '#fff'
          }
        }
      }
    },
    changeLinkTextColor() {
      const linkTexts =  d3.select(".link_text_container");
      console.log(linkTexts)
      if(linkTexts && linkTexts._groups && linkTexts._groups.length > 0 && linkTexts._groups[0][0]) {
        if(linkTexts._groups[0][0].children && linkTexts._groups[0][0].children.length > 0) {
          for (let i = 0; i < linkTexts._groups[0][0].children.length; i++) {
            const element = linkTexts._groups[0][0].children[i];
            element.children[0].attributes.fill.value = this.$store.state.theme === 'dark' ? '#8e8c8c' : '#000'
          }
        }
      }
    },
    handlerChangeTool(val) {
      console.log('你改变了tool', val)
      this.tool = val
      if(val !== 'boxSelect') {
        this.stopBrush()
        this.clearAllSelect('boxSelect')
        this.boxSelectNodeList = []
      }
    },
    reset(nodeId) {
      var index = this.graph.nodes.findIndex((e) => { return e.id === nodeId });
      if (index > -1) {
        this.graph.nodes.splice(index, 1);
      }
      // 删除与该节点相关的链接
      this.graph.links = this.graph.links.filter(function (link) {
        return link.source.id !== nodeId && link.target.id !== nodeId;
      });
      console.log('删除后的节点', this.graph.nodes)
      console.log('删除后的链接线', this.graph.links)
      // 更新力导向图的节点和链接集合
      this.simulation.nodes(this.graph.nodes);
      this.simulation.force("link").links(this.graph.links);

      // 重新启动模拟
      this.simulation.alphaTarget(0).restart();
      this.$emit('allNodes', this.simulation.nodes())
      this.$emit('allLinks', this.simulation.force('link').links())
      this.nodes = this.simulation.nodes()
      this.links = this.simulation.force('link').links()
    },
    /**
     * 改变画布宽度
     */
    changeCollapsed(bool) {
        this.svg = d3.select("#svg1")
        .attr("width", '100%')
    },
    /**
     * 点击鼠标右键某一项调用的方法（节点鼠标右键自定义的组件）
     * @param {*} type 
     */
    contextmenuClickEvent(type) {
      if (type === 'create') {
        this.createChildrenNode(this.currentNode)
        this.cancleNodeSelect('select',this.currentNode.id)
      }
      if (type === 'createLink') {
        this.createLink(this.currentNode)
      }
      if (type === 'edit') {
        console.log('更改节点')
        this.$emit('showNodeDrawer', this.currentNode)
      }
      if (type === 'delete') {
        this.cancleNodeSelect('select',this.currentNode.id)
        this.removeNodeAndLink(this.currentNode)
        // 如果选中列表里有也去掉
        this.$emit("selectionEvent", "unSelectNode", [this.currentNode.id])
      }
      this.hideCustomMenu()
    },
    // 取消更改节点信息，对应的抽屉组件关闭
    cancelEditNode() {
      this.drawerVisible = false
      this.cancleNodeSelect('select',this.currentNode.id)
    },
    /**
     * 修改节点信息的抽屉组件 点击【确定】后出发的函数
     * @param {*} data 节点信息
     */
    okEditNode(data) {
      this.drawerVisible = false
      console.log('确定更改', data)
      this.editNode(data)
    },
    /**
     * 编辑节点
     * @param {*} node 节点对象
     */
    editNode(node) {
      // 找到数据，更新
      const index = this.graph.nodes.findIndex((e) => { return e.id === node.id })
      if (index > -1) {
        this.graph.nodes[index].name = node.name
        this.graph.nodes[index].imgType = Number(node.imgType[0])
        d3.select(`#${node.id} text`).text(node.name)
        if(node.icon_border !== this.graph.nodes[index].icon_border) {
          // 修改icon_border
          d3.select(`#${node.id} .node-${this.graph.nodes[index].icon_border}-bg`).remove()
          if(node.icon_border === 'rect') {
            d3.select(`#${node.id}`)
              .append('rect')
              .attr("x", () => -(this.symbolSize / 2 + this.padding + 2.6))
              .attr("y", -(this.symbolSize / 2 + this.padding + 2.6))
              .attr("width", (this.symbolSize / 2 + this.padding + 2.6)*2)
              .attr("height", (this.symbolSize / 2 + this.padding + 2.6)*2)
              .attr('fill', '#fff')
              .attr('class', 'node-rect-bg');
          }
          if(node.icon_border === 'diamond') {
            d3.select(`#${node.id}`)
              .append('rect')
              .attr("x", () => -(this.symbolSize / 2 + this.padding + 2.6))
              .attr("y", -(this.symbolSize / 2 + this.padding + 2.6))
              .attr("width", (this.symbolSize / 2 + this.padding + 2.6)*2)
              .attr("height", (this.symbolSize / 2 + this.padding + 2.6)*2)
              .attr('fill', '#fff')
              .attr('transform', 'rotate(45)')
              .attr('class', 'node-diamond-bg');
          }
          if(node.icon_border === 'circle') {
            d3.select(`#${node.id}`)
              .append('circle')
              .attr("r", this.symbolSize / 2 + this.padding + 2.6)
              .attr('class', 'node-circle-bg')
              .attr('fill',() => this.$store.state.theme === 'dark' ? '#000' : '#fff')
          }
        }
        this.graph.nodes[index].icon_border = node.icon_border
        // 修改icon
        if (d3.select(`#${node.id} image`)) {
          d3.select(`#${node.id} image`).remove()
        } else {
          d3.select(`#${node.id} .node-svg-g svg`).remove()
        }
        if (d3.select(`#${node.id} .node-svg-g`)) {
          d3.select(`#${node.id} .node-svg-g`).remove()
        }
        // 节点如果是选中状态那就还是选中，如果不是就取消
        if(this.isNodeSelected(this.currentNode.id)) {
          this.cancleNodeSelect('select',this.currentNode.id)
        }
        // 修改icon
        if (this.svgImgBlob && this.svgImgBlob.length > 0) {
          for (let i = 0; i < this.svgImgBlob.length; i++) {
            const element = this.svgImgBlob[i];
            if (i === Number(node.imgType) && element) {
              // 为每个节点添加一个克隆的SVG
              const clone = document.importNode(element, true);
              if (d3.select(`#${node.id} image`)) {
                d3.select(`#${node.id}`).append("g")
                  .attr('transform', 'translate(-16, -16)')
                  .attr('fill', '#111')
                  .attr('class', `node-svg-g`)
                  .attr('id', `g-${node.id}`)
                  .append(() => clone).attr('width', 32).attr('height', 32);
              } else {
                d3.select(`#${node.id} .node-svg-g`).append(() => clone).attr('width', 32).attr('height', 32);
              }
            }
          }
        }
      } else {
        console.log('没找到', node)
      }
    },
    /**
     * 编辑连接线
     * @param {*} link 线对象
     */
    editLink(link) {
      // 找到数据，更新
      const scourceId = link.source.id
      const targetId = link.target.id
      console.log(link)
      const index = this.graph.links.findIndex((e) => { return e.source.id === scourceId && e.target.id === targetId })
      console.log(this.graph.links, index)
      if(index > -1) {
        if(link.isDelete) {
          return this.removeLink(`${scourceId}-${targetId}`)
        }
        this.graph.links[index].name = link.name
        this.graph.links[index].linkStyle = link.linkStyle
        d3.select(`#${scourceId}-${targetId}`).attr('stroke-dasharray', link.linkStyle === 'solidLine' ? 0 : 3)
        if(this.graph.links[index].linkType !== link.linkType) {
          this.graph.links[index].linkType = link.linkType;
          if(link.linkType === 'polyLine') {
            d3.select(`#${scourceId}-${targetId}`).attr("d", this.getLinkPos(link))
          }
          if(link.linkType === 'straightLine') {
            d3.select(`#${scourceId}-${targetId}`).attr("d",  this.getLinkPath(link))
          }
        }
      }
    },
    getLinkPos(link) {
      let plus = this.getPlusByIndex(link)
      let x1Plus = link.source.x + plus.x1Plus
      let y1Plus = link.source.y + plus.y1Plus
      let x2Plus = link.target.x + plus.x2Plus
      let y2Plus = link.target.y + plus.y2Plus
      let angle = this.getAngle(link.source.x, link.source.y, link.target.x, link.target.y)
      return this.getPolyPos(x1Plus, y1Plus, x2Plus, y2Plus, angle)
    },
    getPlusByIndex(link) {
      return {
        x1Plus: Math.cos(Math.PI / 180 * link.source.index * 90) * this.mainCirceRadius,
        y1Plus: Math.sin(Math.PI / 180 * link.source.index * 90) * this.mainCirceRadius,
        x2Plus: Math.cos(Math.PI / 180 * link.target.index * 90) * this.mainCirceRadius,
        y2Plus: Math.sin(Math.PI / 180 * link.target.index * 90) * this.mainCirceRadius
      }
    },
    getAngle(e, t, a, n) {
      return (180 * Math.atan2(n - t, a - e) / Math.PI + 360) % 360
    },
    getPolyPos(e, t, a, n, i) {
      return i > 225 && i < 315 || i > 45 && i < 135 ? "M".concat(e, ",").concat(t, " ").concat(e, ",").concat(t + (n - t) / 2, " ").concat(a, ",").concat(n - (n - t) / 2, " ").concat(a, ",").concat(n) : "M".concat(e, ",").concat(t, " ").concat(e + (a - e) / 2, ",").concat(t, " ").concat(a - (a - e) / 2, ",").concat(n, " ").concat(a, ",").concat(n)
    },
    /**
     * 删除节点以及节点的连线
     * @param {*} node 节点对象
     */
    removeNodeAndLink(node) {
      const nodeId = node.id
      this.removeNode(nodeId)
      const allLinks = this.simulation.force('link').links()
      if (allLinks && Array.isArray(allLinks) && allLinks.length > 0) {
        for (let i = 0; i < allLinks.length; i++) {
          const element = allLinks[i];
          if (element.source.id === nodeId || element.target.id === nodeId) {
            this.removeLink(`${element.source.id}-${element.target.id}`)
          }
        }
      }
      if (allLinks._groups && allLinks._groups.length > 0 && allLinks._groups[0].length > 0) {
        for (let i = 0; i < allLinks._groups[0].length; i++) {
          const element = allLinks._groups[0][i];
          if (element.__data__.source.id === nodeId || element.__data__.target.id === nodeId) {
            this.removeLink(`${element.__data__.source.id}-${element.__data__.target.id}`)
          }
        }
      }
    },
    /**
     * 添加子节点以及节点之间的连线
     * @param {*} node 节点对象
     */
    createChildrenNode(node) {
      const totalLink = this.simulation.force('link').links()
      let nodeId = this.generateRandomString(10)
      let nNode = utils.newNode(nodeId)
      nNode.x = node.x + 50
      nNode.y = node.y + 50
      // 创建新节点的连接
      const newLink = {
        index: Object.keys(totalLink).length + 1,
        source: node, // 现有节点ID
        target: nNode, // 新节点ID
        value: 1
      };
      // 去新增节点 和 线
      this.createNodeAndLink(nNode, newLink)
    },
    /**
     * 根据鼠标移动，添加连线
     * @param {*} node 节点对象
     */
    createLink(node) {
      const that = this
      // 清除之前的连线
      this.svg.selectAll('#move-line-path').remove();
      const newLine = this.container.append("line")
        .attr("x1", node.x)
        .attr("y1", node.y)
        .style("stroke", "#6f7071")
        .style("stroke-width", "2px")
        .style("opacity", "0").
        attr('id', 'move-line-path');
      d3.select(`#${node.id}`).selectAll(`.node-${node.icon_border}-bg`).style("cursor", "pointer")
      d3.select("#svg1").on("mousemove.add-link", function (event) {
        newLine.attr("x2", event.x - 74).attr("y2", event.y - 65);
        newLine.style("opacity", 1)
      });

      d3.select("#svg1").on("click.add-link", function (t) {
        newLine.remove();
        d3.select("#svg1").on("mousemove.add-link", null);
        d3.select(`#${node.id}`).selectAll(`.node-${node.icon_border}-bg`).style("cursor", "move").on("click.add-link", null);
        if (t.target.parentNode && t.target.parentNode.__data__) {
          that.isNodeToCreateLine(node, t.target.parentNode.__data__)
        }
      })
    },
    /**
     * 判断节点是否存在，存在就添加连线
     * @param {*} e source节点
     * @param {*} n target节点
     */
    isNodeToCreateLine(e, n) {
      var M = e, r = n;
      const that = this
      if (e && e.id) {
        this.graph.nodes.forEach(function (t) {
          if (t.id == e.id) { M = t }
        })
      }
      if (n && n.id) {
        this.graph.nodes.forEach(function (t) { if (t.id == n.id) { r = t } })
      }
      const totalLink = this.simulation.force('link').links();
      const suorceNode = d3.select(`#${M.id}`)._groups[0][0].__data__;
      const targetNode = d3.select(`#${r.id}`)._groups[0][0].__data__;
      const newLink = {
        index: Object.keys(totalLink).length + 1,
        source: suorceNode,
        target: targetNode,
        value: 1
      };

      d3.timeout(function () {
        that.graph.links.push(newLink);
        that.update({ nNode: null, nLink: newLink });
      }, 50);
    },
    buildNodes() {
    },
    buildLinks() {
    },
    itemCb(cb, item) {
      if (cb && typeof (cb) === 'function') item = cb(item)
      return item
    },
    /**
     * 给节点选中的类名
     * @param {*} node 节点对象
     * @param {*} classes 
     */
    nodeClass(node, classes = []) {
      let cssClass = []
      if (node) {
        cssClass = (node._cssClass) ? node._cssClass : []
        if (!Array.isArray(cssClass)) cssClass = [cssClass]
        cssClass.push('node-item')
        classes.forEach(c => cssClass.push(c))
        if (this.selected[node.id]) cssClass.push('selected')
        if (node.fx || node.fy) cssClass.push('pinned')
      }
      return cssClass
    },
    /**
     * 选中节点
     * @param {*} d 节点对象
     */
    selectNode(d) {
      d3.select(`#${d.id}`)._groups[0][0].classList.add('selected')
    },
    /**
     * 选中连接线
     * @param {*} id 连接线id
     */
    selectLink(type, id) {
      let className = '' 
      if(type === 'select') {
        className = 'selected'
      }
      if(type === 'boxSelect') {
        className = 'boxSelected'
      }
      if ((type === 'select' && this.tool === 'pointer') || (type === 'boxSelect' && this.tool === 'boxSelect')) {
        const lin = d3.select(`#${id}`);
        if (lin) {
          lin.classed(className, true)
        }
        this.svg.select('defs').selectAll('marker')
          .each(function (m) {
            if (`${m.source.id}-${m.target.id}` === id) {
              d3.select(this).classed(className, true)
            }
          })
      }
    },
    /**
     * 判断节点被选中
     * @param nodeId 
     */
    isNodeSelected(nodeId) {
      const node = d3.select(`#${nodeId}`)
      let have = false
      if(node && node._groups && node._groups.length > 0) {
        const classList = d3.select(`#${nodeId}`)._groups[0][0].classList[0]
        have = classList.includes('selected')
      }
      return have
    },
    /**
     * 删除节点
     * @param {*} nodeId 节点id
     */
    removeNode(nodeId) {
      console.log('删除的node', nodeId)
      console.log('先获取此节点', d3.select(`#${nodeId}`))
      d3.select(`#${nodeId}`).remove()
    },
    /**
     * 删除的连接线
     * @param {*} LinkId 连接线id
     */
    removeLink(LinkId) {
      console.log('删除的线', LinkId)
      d3.select(`#${LinkId}`).remove()
      d3.select(`#marker-${LinkId}`).remove()
    },
    // 清除画布中所有的选中
    clearAllSelect(type) {
      // 清除所有的选中
      const allNode = this.simulation.nodes()
      const allLinks = this.simulation.force('link').links()
      if (allNode && allNode.length > 0) {
        for (let i = 0; i < allNode.length; i++) {
          const element = allNode[i];
          this.cancleNodeSelect(type,element.id)
        }
      }
      if (allLinks && Array.isArray(allLinks) && allLinks.length > 0) {
        for (let i = 0; i < allLinks.length; i++) {
          const element = allLinks[i];
          this.cancleLinkSelect(type, `${element.source.id}-${element.target.id}`)
        }
      }
      if (allLinks._groups && allLinks._groups.length > 0 && allLinks._groups[0].length > 0) {
        for (let i = 0; i < allLinks._groups[0].length; i++) {
          const element = allLinks._groups[0][i];
          this.cancleLinkSelect(type, `${element.__data__.source.id}-${element.__data__.target.id}`)
        }
      }
    },
    /**
     * 取消节点的选中
     * @param {*} nodeId 节点id
     */
    cancleNodeSelect(type, nodeId) {
      // 找到节点，并取消选中
      const node = document.getElementById(`${nodeId}`)
      const nodeClassName = this.nodeClass(node, []).join(' ')
      if(type === 'select') {
        if (nodeClassName) {
          node.classList.remove('selected')
        }
      }
      if(type === 'boxSelect') {
        node.classList.remove('boxSelected')
      }
    },
    /**
     * 取消连接线的选中
     * @param {*} type select点击选中 boxSelect框选的选中
     * @param {*} linkId 连接线id
     */
    cancleLinkSelect(type, linkId) {
      const link = document.getElementById(`${linkId}`)
      if (type === 'select' && link) {
        link.classList.remove('selected')
        d3.select(`#marker-${linkId}`).classed('selected', false)
      }
      if (type === 'boxSelect' && link) {
        link.classList.remove('boxSelected')
        d3.select(`#marker-${linkId}`).classed('boxSelected', false)
      }
    },
    /**
     * 生成一串随机字符串
     * @param {*} length 长度
     */
    generateRandomString(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    },
    // 注册一个事件（鼠标拖动画一个框）
    registerClickBoxselect() {
      const that = this
      this.svg.on('click.add-node-ev', function (ev) {
        if (ev.pointerType === 'mouse') {
          const x = ev.x
          const y = ev.y
          let nodeId = that.generateRandomString(10)
          let nNode = utils.newNode(nodeId)
          nNode.x = x
          nNode.y = y
          d3.timeout(function () {
            that.graph.nodes.push(nNode);
            that.update({ nNode: nNode });
          }, 500);
        }
      });
    },
    // 注册一个鼠标事件add-node-ev（鼠标点击画布添加一个新节点）
    registerClickAddNode() {
      const that = this
      this.svg.on('click.add-node-ev', function (ev) {
        if (ev.pointerType === 'mouse') {
          const x = ev.x
          const y = ev.y
          let nodeId = that.generateRandomString(10)
          let nNode = utils.newNode(nodeId)
          nNode.x = x
          nNode.y = y
          d3.timeout(function () {
            that.graph.nodes.push(nNode);
            that.update({ nNode: nNode });
          }, 500);
        }
      });
    },
    // 取消一个鼠标事件add-node-ev
    deleteClickAddNode() {
      this.svg.on('click.add-node-ev', null)
    },
    addNode(nNode) {
      const that = this
      d3.timeout(function () {
        that.graph.nodes.push(nNode);
        that.update({ nNode, nLink: null });
      }, 500);
    },
    /**
     * 添加一个节点和链接线
     * @param {*} nNode 节点对象
     * @param {*} nLink 连接线对象
     */
    createNodeAndLink(nNode, nLink) {
      const that = this
      d3.timeout(function () {
        that.graph.nodes.push(nNode);
        that.graph.links.push(nLink);
        that.update({ nNode, nLink });
      }, 500);
    },
    // 关闭框选
    stopBrush() { 
      this.svg.on('mouseup.boxSelect', null); // 统一解除绑定
      this.svg.on('mousemove.boxSelect', null);
      this.svg.on('mousedown.boxSelect', null);
      // 后期手动添加的框选，不包括原本视图加载出来的组（rect框）
      const rect = this.svg.select("rect#squareSelect")
      if(rect) {
        rect.remove()
      }
      this.bindZoom(); // 重新绑定zoom;
    },
    // 框选方法
    drawBrush() {
      const that = this
      this.stopZoom(); //先停止zoom
      let rect = this.svg.append("rect")
        .attr("width", 0)
        .attr("height", 0)
        .attr("fill", "rgba(33,20,50,0.3)")
        .attr("stroke", "#ccc")
        .attr("stroke-width", "2px")
        .attr("transform", "translate(0,0)")
        .attr("id", "squareSelect");
        let x1 = 0
        let y1 = 0

      this.svg.on("mousedown.boxSelect", function (event) {
        console.log('动了', event)
        x1 = event.offsetX; // 开始的x
        y1 = event.offsetY; // 开始的y
        that.boxSelectClickTime = (new Date()).getTime();//mark start time
        that.boxSelectFlag = true;//以flag作为可执行圈选的标记
        rect.attr("transform", "translate(" + x1 + "," + y1 + ")");
        that.boxSelectStartLoc = [x1, y1];
      });

      this.svg.on("mousemove.boxSelect", function (event) {
        //判断事件target
        if (event.target.localName == "svg" && that.boxSelectFlag == true || event.target.localName == "rect" && that.boxSelectFlag == true) {
          const x2 = event.offsetX;
          const y2 = event.offsetY;
          var width = x2 - that.boxSelectStartLoc[0];
          var height = y2 - that.boxSelectStartLoc[1];
          if (width < 0) {
            rect.attr("transform", "translate(" + event.offsetX + "," + that.boxSelectStartLoc[1] + ")");
          }
          if (height < 0) {
            rect.attr("transform", "translate(" + that.boxSelectStartLoc[0] + "," + event.offsetY + ")");
          }
          if (height < 0 && width < 0) {
            rect.attr("transform", "translate(" + event.offsetX + "," + event.offsetY + ")");
          }
          rect.attr("width", Math.abs(width)).attr("height", Math.abs(height))
        }

      })

      this.svg.on("mouseup.boxSelect", function (event) {
        if (that.boxSelectFlag == true) {
          that.boxSelectFlag = false;
          that.boxSelectEndLoc = [event.offsetX, event.offsetY];
          var leftTop = [];
          var rightBottom = []
          if (that.boxSelectEndLoc[0] >= that.boxSelectStartLoc[0]) {
            leftTop[0] = that.boxSelectStartLoc[0];
            rightBottom[0] = that.boxSelectEndLoc[0];
          } else {
            leftTop[0] = that.boxSelectEndLoc[0];
            rightBottom[0] = that.boxSelectStartLoc[0];
          }

          if (that.boxSelectEndLoc[1] >= that.boxSelectStartLoc[1]) {
            leftTop[1] = that.boxSelectStartLoc[1];
            rightBottom[1] = that.boxSelectEndLoc[1];
          } else {
            leftTop[1] = that.boxSelectEndLoc[1];
            rightBottom[1] = that.boxSelectStartLoc[1];
          }

          //最后通过和node的坐标比较，确定哪些点在圈选范围
          console.log('lua--', d3.selectAll(".node-item"))
          d3.selectAll(".node-item").attr("temp", function (d) {
            if (d.x < rightBottom[0] && d.x > leftTop[0] && d.y > leftTop[1] && d.y < rightBottom[1]) {
              const node = d3.select(this)
              node.attr("class", "node-item boxSelected");
              // 对应的链接线也选中
              if(node._groups && Array.isArray(node._groups) && node._groups[0] && Array.isArray(node._groups[0]) && node._groups[0][0] && node._groups[0][0].__data__) {
                console.log('框内的节点的连线也选中', node._groups[0][0].__data__.id)
                that.nodeLinkSelect(node._groups[0][0].__data__.id)
                const index = that.boxSelectNodeList.findIndex((e) => { return e.id === node._groups[0][0].__data__.id});
                if (index === -1) {
                  that.boxSelectNodeList.push(node._groups[0][0].__data__);
                }
              }
            }
          })
          rect.attr("width", 0).attr("height", 0)
        }
        var times = (new Date()).getTime() - that.boxSelectClickTime;
        if (times < 100 && event.target.id !== "squareSelect") {
          console.log('0----进行不选中')
          d3.selectAll(".node-item").attr("class", "node-item")
        }

      })

    },
    /**
     * 框选之后，节点的连接线选中
     * @param {*} nodeId 节点id
     */
    nodeLinkSelect(nodeId) {
      // 获取所有的节点
      const allLinks = this.simulation.force('link').links()
      if (allLinks && Array.isArray(allLinks) && allLinks.length > 0) {
        for (let i = 0; i < allLinks.length; i++) {
          const element = allLinks[i];
          if (element.source.id === nodeId || element.target.id === nodeId) {
            this.selectLink('boxSelect', `${element.source.id}-${element.target.id}`)
          }
        }
      }
      if (allLinks._groups && allLinks._groups.length > 0 && allLinks._groups[0].length > 0) {
        for (let i = 0; i < allLinks._groups[0].length; i++) {
          const element = allLinks._groups[0][i];
          if (element.__data__.source.id === nodeId || element.__data__.target.id === nodeId) {
            this.selectLink('boxSelect',`${element.__data__.source.id}-${element.__data__.target.id}`)
          }
        }
      }
    },
    // 生成一个Promise.all（将img转化为base64）
    async imgTobase64() {
      const promise = []
      for (const key in this.imgMap) {
        const element = this.imgMap[key];
        promise.push(this.getBase64Image(element))
      }
      Promise.all(promise).then((res) => {
        console.log(res)
        for (const key in this.imgMap) {
          console.log(res[key])
          this.imgMap[key] = res[key]
        }
      })
    },
    /**
     * 真正的将img转化为base64方法
     * @param {*} imagePath 图片地址
     */
    getBase64Image(imagePath) {
      return new Promise((resolve, reject) => {
        var img = new Image();
        img.src = imagePath;
        img.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          canvas.style.width = `${canvas.width / window.devicePixelRatio}px`
          canvas.style.height = `${canvas.height / window.devicePixelRatio}px`
          var ctx = canvas.getContext("2d");
          if (!ctx) {
            return null
          }
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL("image/png");
          return resolve(dataURL)
        }
        img.onerror = (err) => {
          return reject(err)
        }
      })
    },
    /**
     * 使用d3.xml加载外部的SVG文件
     * @param {*} path svg文件地址
     */
    d3ReadSvg(path) {
      return new Promise((resolve, reject) => {
        // 使用d3.xml加载外部的SVG文件
        d3.xml(path).then(function (xml) {
          return resolve(xml.documentElement)
        }).catch((err) => {
          return reject(err)
        })
      })
    },
    bindZoom() {
      const that = this
      this.zoom = d3.zoom()
        .scaleExtent([this.zoomMin, this.zoomMax])
        .on('zoom', function () {
          const transform = d3.zoomTransform(this);
          that.container.attr('transform', transform);
      })

      this.svg.call(this.zoom).on('dblclick.zoom', null);
    },
    stopZoom() {
      this.svg.on('mousedown.zoom', null);
      this.svg.on('mousemove.zoom', null);
      this.svg.on('dblclick.zoom', null);
      this.svg.on('touchstart.zoom', null);
    },
    // 清空画布
    clearChange() {
      d3.select("#svg1 g").selectAll('*').remove();
    },
    // 初始化画布
    async initRender() {
      const width = $("#topology_container").width();
      const height = $("#topology_container").height();

      // 每个对象必须包含source target属性，表示边的起点和终点，属性的值是节点的id，默认是节点在数组中的索引，同时也可以自定义id getter：
      // d3.forceLink().id(d => d.id)
      const scale = 1;
      let vm = this;

      this.simulation = d3.forceSimulation(this.graph.nodes) //创建一个力导向图模拟对象
        .force("link", d3.forceLink(this.graph.links).id(d => d.id)) // 连接力，拉动节点相互连接，好像节点之间有一个弹簧
        .force("charge", d3.forceManyBody()) // 排斥力，类似带电电子的排斥方式，推动所有节点彼此远离
        .force("center", d3.forceCenter(width / 2, height / 2)) // 中心力，将所有的节点都推向图表的中心（给定的一个点），默认坐标是[0,0]，施加力时，所有节点的相对位置保持不变
        .alphaDecay(0.05) // 衰减系数，值越大，图表稳定越快
        .on("tick", this.ticked);

      // 添加碰撞力，使用节点的groupRadius作为碰撞半径
      this.simulation.force("collide", d3.forceCollide(d => d.groupRadius + 1).radius(60).iterations(2));
 
      this.simulation.force('charge')
        .strength(-50) // 排斥力强度，正值相互吸引，负值相互排斥
      this.simulation.force('link')
        .id(d => d.id) // set id getter
        .distance(0) // 设置节点的连接距离
        .strength(1) // 连接力强度 0 ~ 1
        .iterations(1) // 迭代次数

      this.svg = d3.select("#svg1")
        .attr("width", width)
        .attr("height", height)
        .on('click', function () {
          vm.hideCustomMenu()
          if (vm.currentNode && !vm.selected[vm.currentNode.id]) {
            vm.cancleNodeSelect('select', vm.currentNode.id)
          }
        })

      // 添加一个rect填充的是方格线
      this.svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "url(#diagramPattern)");

      this.container = this.svg.append('g')
        .attr('transform', 'scale(' + scale + ')');

      // 连接线
      this.drawLinkLine();
      
      // 线的名字
      this.drawLinkText();

      //节点容器
      this.node = this.container.selectAll(".node")
        .data(this.graph.nodes)
        .enter()
        .append("g")
        .attr('id', (node) => `${node.id}`)
        .attr("class", this.nodeClassName)
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        }).on('click', function ($event, d) {
          vm.$emit("nodeClick", $event, d)
          vm.hideCustomMenu()
        })
        .on('contextmenu', function (ev, d) {
          // 阻止默认的右键点击弹出菜单行为
          ev.preventDefault();
          vm.currentNode = d
          vm.selectNode(vm.currentNode)
          vm.showCustomMenu(ev)
          // 阻止冒泡，防止点击事件触发
          ev.stopPropagation();
        })
        .on('mouseover', function () {
          d3.select(this).classed('focus focusing', true)
        })
        .on('mouseout', function () {
          d3.select(this).classed('focus focusing', false)
        }).call(this.drag(this.simulation)); // 使节点可以拖动

    this.node.filter(item => item.icon_border ==='circle')
      .append('circle')
      .attr("r", vm.symbolSize / 2 + vm.padding + 2.6)
      .attr('class', 'node-circle-bg')
      .attr('fill',() => this.$store.state.theme === 'dark' ? '#000' : '#fff')

    this.node.filter(item => item.icon_border ==='rect')
      .append('rect')
      .attr("x", () => -(vm.symbolSize / 2 + vm.padding + 2.6))
      .attr("y", -(vm.symbolSize / 2 + vm.padding + 2.6))
      .attr("width", (vm.symbolSize / 2 + vm.padding + 2.6)*2)
      .attr("height", (vm.symbolSize / 2 + vm.padding + 2.6)*2)
      .attr('fill', '#fff')
      .attr('class', 'node-rect-bg');

      this.node.filter(item => item.icon_border ==='diamond')
        .append('rect')
        .attr("x", () => -(this.symbolSize / 2 + this.padding + 2.6))
        .attr("y", -(this.symbolSize / 2 + this.padding + 2.6))
        .attr("width", (this.symbolSize / 2 + this.padding + 2.6)*2)
        .attr("height", (this.symbolSize / 2 + this.padding + 2.6)*2)
        .attr('fill', '#fff')
        .attr('transform', 'rotate(45)')
        .attr('class', 'node-diamond-bg');

      // 节点文字
      this.svg_text = this.node.data(this.graph.nodes)
        .append("text")
        .attr("class", "node")
        .attr('fill',() => this.$store.state.theme === 'dark' ? '#fff' : '#000')
        .text(function (d) {
          return d.name;
        })
        .attr("dx", function() {
            return '0.2em';
        })
        .attr("dy", "3em")

    this.svg_rect = this.node.filter(item => item.type ==='group')
      .append('rect')
      .attr("x", () => -(vm.symbolSize / 2 + vm.padding + 2.6)*5)
      .attr("y", -(vm.symbolSize / 2 + vm.padding + 2.6)*5)
      .attr("width", (vm.symbolSize / 2 + vm.padding + 2.6)*12)
      .attr("height", (vm.symbolSize / 2 + vm.padding + 2.6)*12)
      .attr('fill', 'transparent')
      .attr('class', 'group-bg')

      // 节点图片
      // const that = this
      // this.node.filter(item => item.id !== '云' && item.id !== '数据库').data(this.graph.nodes)
      //   .append("image")
      //   .attr("width", function (d) {
      //     var width = 35;
      //     switch (d.imgType) {
      //       case '0':
      //         width = 2 * width;
      //         break;
      //       case '1':
      //         width = 2 * width;
      //         break;
      //       default:
      //         break;
      //     }
      //     return width;
      //   })
      //   .attr("height", function (d) {
      //     var height = 38;
      //     switch (d.imgType) {
      //       case '0':
      //         height = 2 * height;
      //         break;
      //       case '1':
      //         height = 2 * height;
      //         break;
      //       default:
      //         break;
      //     }
      //     return height;
      //   })
      //   .attr("xlink:href", function (d) {
      //     return that.imgMap[d.imgType];
      //   }).attr("x", -17)
      //   .attr("y", -19);

      // 添加svg
      const svgImgPromise = []
      this.svgImgBlob = []
      for (const key in this.svgMap) {
        const element = this.svgMap[key];
        svgImgPromise.push(this.d3ReadSvg(element))
      }
      Promise.all(svgImgPromise).then((res) => {
        if (res && res.length > 0) {
          this.svgImgBlob = res
          vm.node.data(vm.graph.nodes)
            .append("g")
            .attr('transform', 'translate(-16, -16)')
            .attr('fill', '#111')
            .attr('class', `node-svg-g`)
            .attr('id', (n) => `g-${n.id}`)
          for (let i = 0; i < vm.graph.nodes.length; i++) {
            const element = vm.graph.nodes[i];
            if (element.id && element.imgType) {
              // 为每个节点添加一个克隆的SVG
              var clone = document.importNode(res[element.imgType], true);
              d3.select(`#g-${element.id}`).append(() => clone).attr('width', 32).attr('height', 32);
            }
          }
        }
      })

      // 连接线箭头
      this.defs = this.container.append('svg:defs');
      const marker = this.defs
        .selectAll('marker')
        .data(this.graph.links)
        .enter()
        .append('svg:marker')
        .attr('id', (link) => 'marker-' + `${link.source.id}-${link.target.id}`)
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', this.symbolSize / 2 + this.padding + 8)
        .attr('refY', 5)
        .attr('markerWidth', 16)
        .attr('markerHeight', 12)
        .attr('orient', 'auto')
        .attr('stroke-width', 2)

      marker.append('svg:path')
        .attr('d', 'M 0 0 L 50 10 L 0 15 z')
        .attr('fill',() => this.$store.state.theme === 'dark' ? '#000' : '#fff')

      marker.append('svg:path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('class', 'arrow')

      // 方格线
      let s = Array(20);
      this.svg.append("pattern")
      .attr("id", "diagramPattern")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 100)
      .attr("height", 100)
      .attr("patternUnits", "userSpaceOnUse")
      .selectAll("path")
      .data(s)
      .enter()
      .append("path")
      .attr("stroke", () => {
        console.log(this.$store.state.theme, this.$store.state.theme === 'dark')
        return this.$store.state.theme === 'dark' ? "#222" : "#fafafa"
      })
      .attr("stroke-width", "0.25")
      .attr("dashArray", "")
      .attr("d", (e,t)=>0 === t ? "M0,0.5 L100,0.5 Z" : t < 10 && t > 0 ? 
        "M0,".concat(10 * t, ".125 L100,")
        .concat(10 * t, ".125 Z") : 10 === t ? "M0.5,0 L0.5,100 Z" : t > 10 ? 
        "M".concat((t - 10) * 10, ".125,0 L").concat((t - 10) * 10, ".125,100 Z") : void 0
      )
            

      this.bindZoom(); //绑定zoom

    },
    changeDiagramPattern(color) {

    },
    // 画节点链接线
    drawLinkLine () {
      const vm = this
      this.link = this.container.append('g')
        .classed('link_container', true)
        .selectAll('.link')
        .data(this.graph.links)
        .enter()
        .append('path')
        .attr('class', 'link')
        .classed('link_item', true)
        .attr(
          'marker-end', (link) => 'url(#' + 'marker-' + `${link.source.id}-${link.target.id}` + ')'
        ).attr('d', link => {
          return link.linkType === 'straightLine' ? this.getLinkPath(link) : this.getLinkPos(link)
        }).attr(
          'id', (link) => `${link.source.id}-${link.target.id}`
        )
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', (link) => {return link.linkStyle === 'solidLine' ? 0 : 3 })
        .on('click', function ($event, d) {
          vm.$emit("linkClick", $event, d)
        })
        .on('mouseover', function () {
          const id = d3.select(this).attr('marker-end').split('url(#marker-')[1].split(')')[0]
          d3.select(this).classed('focus focusing', true)
          vm.svg.select('defs').selectAll('marker')
            .each(function (m) {
              if (`${m.source.id}-${m.target.id}` === id) {
                d3.select(this).classed('focus focusing', true)
              }
            })
        }).on('mouseout', function () {
          const id = d3.select(this).attr('marker-end').split('url(#marker-')[1].split(')')[0]
          d3.select(this).classed('focus focusing', false);
          vm.svg.select('defs').selectAll('marker')
            .each(function (m) {
              if (`${m.source.id}-${m.target.id}` === id) {
                d3.select(this).classed('focus focusing', false)
              }
            })
        });
    },
    // 连接线上的文字
    drawLinkText () {
      if (this.lineTextGroup) {
        this.lineTexts
          .attr('transform', this.getTransform)
      } else {
        this.lineTextGroup = this.container.append('g').attr('class', 'link_text_container')
        this.lineTexts = this.lineTextGroup
          .selectAll('.linetext')
          .data(this.graph.links)
          .enter()
          .append('text')
          .attr('dy', -2)
          .attr('transform', this.getTransform)
          .on('click', (l) => { 
            console.log('节点上的文字', l)
          })

        this.lineTexts
          .append('tspan')
          .attr('class', 'link-text')
          .attr('id', (l) => `link_text_${l.source.id}_${l.target.id}`)
          .text((l) => l.pathName)
          .attr('fill', this.$store.state.theme === 'dark' ? '#8e8c8c' : '#000')
      }
    },
    calculateTextLength(fontSize) {
      // 假设字体大小和容器宽度都是以像素为单位
      const charactersPerPixel = 0.6; // 这是一个经验值，根据不同字体可能需要调整
      return Math.floor(fontSize * charactersPerPixel);
    },
    getTransform (link) {
      let s = this.graph.nodes[link.source.index];
      let t = this.graph.nodes[link.target.index];
      let p = this.getNodeCenter(s.x, s.y, t.x, t.y);
      let angle = this.getNodeAngle(s.x, s.y, t.x, t.y);
      let textWidth = 0
      const text = d3.select(`#link_text_${link.source.id}_${link.target.id}`);
      if(text._groups[0].length > 0 && text._groups[0][0]) {
        textWidth = text.node().getBBox().width
      }
      // console.log('文字宽度', textWidth/2)
      if (s.x > t.x && s.y < t.y || s.x < t.x && s.y > t.y) {
        angle = -angle
      }
      return 'translate(' + p[0] + ',' + (p[1] + textWidth/2) + ') rotate(' + angle + ')'
    },
    // 计算两点的中心点(用于确认摆放在连接线上的文字的位置)
    getNodeCenter (x1, y1, x2, y2) {
      return [(x1 + x2) / 2, (y1 + y2) / 2]
    },
    // 计算两点角度
    getNodeAngle (x1, y1, x2, y2) {
      var x = Math.abs(x1 - x2);
      var y = Math.abs(y1 - y2);
      var z = Math.sqrt(x * x + y * y);
      return Math.round((Math.asin(y / z) / Math.PI * 180));
    },
    // 拖拽
    drag() {
      return d3.drag()
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended)
    },
    // drag nodes
    dragstarted(event, d) {
      if (!event.active) this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
      // 用于框选拖动
      this.moveX1 = event.x
      this.moveY1 = event.y 
    },
    dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
      this.fix_nodes(d);
      // 用于框选拖动
      this.moveDiffX = event.x - this.moveX1;
      this.moveDiffY = event.y - this.moveY1;
      // 如果是框选那就更改框选内的节点坐标
      if (this.boxSelectNodeList && this.boxSelectNodeList.length > 0) {
        // 统一更改坐标
        const exitItem = this.boxSelectNodeList.find((e) => { return e.id === d.id})
        for (let i = 0; i < this.boxSelectNodeList.length; i++) {
          if(this.boxSelectNodeList[i].id !== d.id && exitItem) {
            const item = d3.select(`#${this.boxSelectNodeList[i].id}`);
            // 一直修改其位置
            item.attr('x', item.x + this.moveDiff) 
            .attr('y', item.y + this.moveDiffY);
          }
        }
      }
    },
    dragended(event, d) {
      if (!event.active) this.simulation.alphaTarget(0);
      d.fx = d.x;
      d.fy = d.y;

      // 更新组内的其他节点
      if(d && d.type && d.type === 'member') {
        // 获取组内的其他成员
        const arr = []
        if(this.graph.nodes && this.graph.nodes.length > 0) {
          for (let i = 0; i < this.graph.nodes.length; i++) {
            const element = this.graph.nodes[i];
            if(element.id !== d.id && element.group && element.group === d.group) {
              arr.push(element)
            }
          }
          this.changeNewPosition(arr, d)
        }
      }
      // 统一更改组内成员的位置
      if(d && d.type && d.type === 'group') {
        if(d.members && d.members.length > 0) {
          this.changeNewPosition(d.members, d)
        }
      }
      // 框选拖动某个节点，则将框选的其他节点一起也拖动（改变位置）
      if(this.boxSelectNodeList && this.boxSelectNodeList.length > 0) {
        const exitItem = this.boxSelectNodeList.find((e) => { return e.id === d.id})
        const arr = []
        for (let i = 0; i < this.boxSelectNodeList.length; i++) { 
          if(this.boxSelectNodeList[i].id !== d.id && exitItem) {
            arr.push(this.boxSelectNodeList[i])
          }
        }
        // 统一更改绑定数据的值
        this.changeNewPosition(arr, d)
      }
    },
    changeNewPosition(arr, d) {
      // 统一更改组内成员的位置
      const dragIdMap = new Map;
      for (let i = 0; i < arr.length; i++) {
        const node = d3.select(`#${arr[i].id}`);
        dragIdMap.set(arr[i].id, true);
        // 重新绑定拖拽后的新坐标
        node.fx = node.x + this.moveDiff
        node.fy = node.y + this.moveDiffY
      }
      //对应的graph.nodes原始数据也要更新，假如你有个保存的场景 那你获取到的坐标就不是最新的了
      this.graph.nodes.forEach((item) => {
        if (dragIdMap.has(item.id) && item.id !== d.id) {
          item.fx = item.x + this.moveDiffX;
          item.fy = item.y + this.moveDiffY;
          item.x = item.x + this.moveDiffX;
          item.y = item.y + this.moveDiffY;
        }
      })
    },
    fix_nodes(this_node) {
      this.node.each(function (d) {
        if (this_node != d) {
          d.fx = d.x;
          d.fy = d.y;
        }
      });
    },
    ticked() {
      this.link.attr('d', d => {
        return d.linkType === 'straightLine' ? this.getLinkPath(d) : this.getLinkPos(d)
      });
      this.drawLinkText()
      this.node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
    },
    getLinkPath(d) {
      let sx = this.graph.nodes[d.source.index].x;
      let tx = this.graph.nodes[d.target.index].x;
      let sy = this.graph.nodes[d.source.index].y;
      let ty = this.graph.nodes[d.target.index].y;
      return 'M' + sx + ',' + sy + ' L' + tx + ',' + ty;
    },
    /**
     * 更新画布，
     * nNode新增的节点对象
     * nLink新增的节点对象
     * @param {*} param0 
     */
    update({ nNode, nLink }) {
      console.log(99, nLink)
      const that = this
      if (nNode) {
        // 添加节点
        this.node = this.node
          .data(this.graph.nodes, (d) => d.id)
          .enter()
          .append("g")
          .attr('id', (node) => `${node.id}`)
          .attr("class", this.nodeClassName)
          .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
          })
          .merge(this.node)
          .on('contextmenu', function (ev, d) {
            // 阻止默认的右键点击弹出菜单行为
            ev.preventDefault();
            that.currentNode = d
            that.selectNode(that.currentNode)
            that.showCustomMenu(ev)
            // 阻止冒泡，防止点击事件触发
            ev.stopPropagation();
          }).on('click', function ($event, d) {
            that.$emit("nodeClick", $event, d)
            that.hideCustomMenu()
          }).on('mouseover', function () {
            d3.select(this).classed('focus focusing', true)
          })
          .on('mouseout', function () {
            d3.select(this).classed('focus focusing', false)
          }).call(this.drag(this.simulation));

        this.node_icon_border = this.node.filter(item => item.id === nNode.id).append('circle')
          .attr('r', this.symbolSize / 2 + this.padding + 2.6)
          .attr('class', 'node-circle-bg')
          .attr('fill',() => this.$store.state.theme === 'dark' ? '#000' : '#fff')

        // 节点文字
        this.svg_text = this.node.filter(item => item.id === nNode.id)
          .append("text")
          .attr("class", "node")
          .text(function (d) {
            return d.name;
          })
          .attr("dx", "0.2em")
          .attr("dy", "3em")
          .merge(this.svg_text)
        
      // 添加svg
      if(nNode.icon === 'svg') {
        this.node.filter(item => item.id === nNode.id)
          .append("g")
          .attr('transform', 'translate(-16, -16)')
          .attr('fill', '#111')
          .attr('class', `node-svg-g`)
          .attr('id', (n) => `g-${n.id}`)
          // 为每个节点添加一个克隆的SVG
          var clone = document.importNode(this.svgImgBlob[nNode.imgType], true);
          d3.select(`#g-${nNode.id}`).append(() => clone).attr('width', 32).attr('height', 32);
      }

        // 节点图片
        if(nNode.icon === 'img') {
          this.node.filter(item => item.id === nNode.id)
            .append("image")
            .attr("width", function (d) {
              var width = 35;
              switch (d.imgType) {
                case '0':
                  width = 2 * width;
                  break;
                case '1':
                  width = 2 * width;
                  break;
                default:
                  break;
              }
              return width;
            })
            .attr("height", function (d) {
              var height = 38;
              switch (d.imgType) {
                case '0':
                  height = 2 * height;
                  break;
                case '1':
                  height = 2 * height;
                  break;
                default:
                  break;
              }
              return height;
            })
            .attr("xlink:href", function (d) {
              return that.imgMap[d.imgType];
            }).attr("x", -17)
            .attr("y", -19);
        }

      }

      // 添加线
      if (nLink) {
        this.link = this.link.data(this.graph.links)
          .enter()
          .append("path")
          .attr('class', 'link')
          .classed('link_item', true)
          .attr(
            'marker-end', (link) => 'url(#' + 'marker-' + `${link.source.id}-${link.target.id}` + ')'
          ).attr(
            'id', (link) => `${link.source.id}-${link.target.id}`
          )
          .style("stroke-width", 3)
          .merge(this.link)
          .on('click', function ($event, d) {
            that.$emit("linkClick", $event, d)
          })
          .on('mouseover', function () {
            const id = d3.select(this).attr('marker-end').split('url(#marker-')[1].split(')')[0]
            // const source = d.target.__data__.source
            // const target = d.target.__data__.target
            // console.log('source节点', source)
            // console.log('target节点', target)
            d3.select(this).classed('focus focusing', true)
            that.svg.select('defs').selectAll('marker')
              .each(function (m) {
                if (`${m.source.id}-${m.target.id}` === id) {
                  d3.select(this).classed('focus focusing', true)
                }
              })
            // that.svg.selectAll('g.node-item').each(function (item) {
            //   if (source.id === item.id) {
            //     d3.select(this).classed('focus focusing', true)
            //   }
            //   if (target.id === item.id) {
            //     d3.select(this).classed('focus focusing', true)
            //   }
            // })
          }).on('mouseout', function () {
            const id = d3.select(this).attr('marker-end').split('url(#marker-')[1].split(')')[0]
            // const source = d.target.__data__.source
            // const target = d.target.__data__.target
            // console.log('source节点', source)
            // console.log('target节点', target)
            d3.select(this).classed('focus focusing', false);
            that.svg.select('defs').selectAll('marker')
              .each(function (m) {
                if (`${m.source.id}-${m.target.id}` === id) {
                  d3.select(this).classed('focus focusing', false)
                }
              })
            // that.svg.selectAll('g.node-item').each(function (item) {
            //   if (source.id === item.id) {
            //     d3.select(this).classed('focus focusing', false)
            //   }
            //   if (target.id === item.id) {
            //     d3.select(this).classed('focus focusing', false)
            //   }
            // })
          });

        // 连接线箭头
        const marker = this.defs
          .selectAll('marker')
          .data(this.graph.links, (d) => { return d.source.id + "-" + d.target.id; })
          .enter()
          .append('svg:marker')
          .attr("id", (link) => `marker-${link.source.id}-${link.target.id}`)
          .attr("markerUnits", "userSpaceOnUse")
          .attr("viewBox", "0 0 10 10")//坐标系的区域
          .attr("refX", 32)//箭头坐标
          .attr("refY", 5)
          .attr("markerWidth", 16)//标识的大小
          .attr("markerHeight", 12)
          .attr("orient", "auto")//绘制方向，可设定为：auto(自动确认方向)和 角度值
          .attr("stroke-width", 2)//箭头宽度

        marker.append('svg:path')
          .attr('d', 'M 0 0 L 50 10 L 0 15 z')
          .attr('fill', '#fff')

        marker.append('svg:path')
          .attr('d', 'M 0 0 L 10 5 L 0 10 z')
          .attr('class', 'arrow')

      }

      this.simulation.nodes(this.graph.nodes);
      this.simulation.force("link").links(this.link);

      // 重新启动模拟
      this.simulation.restart();
    },
    /**
     * 将画布导出为svg文件
     * @param {*} cb 执行函数
     * @param {*} toSvg svg文件名称
     * @param {*} background 背景色
     * @param {*} allCss 
     */
    svgScreenShot(cb, toSvg, background, allCss) {
      let svg = svgExport.exportSVG(this.$refs.svg, allCss)
      let width = 1000
      let height = 500
      const svgDom = $('#svg1')
      if (!toSvg) {
        if (!background) background = this.searchBackground()
        // 获取svg的宽高
        if(svgDom) {
          width = $('#svg1').width()
          height = $('#svg1').height()
        }
        let canvas = svgExport.makeCanvas(width, height, background)
        svgExport.svgToImg(svg, canvas, (err, img) => {
          if (err) cb(err)
          else cb(null, img)
        })
      } else {
        cb(null, svgExport.save(svg))
      }
    },
    searchBackground() {
      let vm = this
      while (vm.$parent) {
        let style = window.getComputedStyle(vm.$el)
        let background = style.getPropertyValue('background-color')
        let rgb = background.replace(/[^\d,]/g, '').split(',')
        let sum = rgb.reduce((a, b) => parseInt(a) + parseInt(b), 0)
        if (sum > 0) return background
        vm = vm.$parent
      }
      return 'white'
    },
    // 放大画布
    bigChange() {
      this.svg.transition().call(this.zoom.scaleBy, 1.3);
    },
    // 缩小画布
    smallChange() {
      this.svg.transition().call(this.zoom.scaleBy, 0.7);
    },
    // 画布中的节点居中
    centerChange() {
      const containerX = this.graph.nodes.map((item) => item.x);
      const containerY = this.graph.nodes.map((item) => item.y);

      const minX = Math.min.apply(null, containerX);
      const maxX = Math.max.apply(null, containerX);
      const minY = Math.min.apply(null, containerY);
      const maxY = Math.max.apply(null, containerY);

      const containerGroupBBox = { // 用数据获取到当前group得w、h、x、y
        width: maxX - minX,
        height: maxY - minY,
        x: minX,
        y: minY,
      };

      const width = $("#svg1").width();
      const height = $("#svg1").height();

      const scaleX = width / containerGroupBBox.width;
      const scaleY = height / containerGroupBBox.height;

      let k = Math.min(scaleX, scaleY) * 0.5;
      k = Math.max(k, this.zoomMin);
      k = Math.min(k, this.zoomMax); // 用画布大小 / 当前svg得大小 获取到比例值

      // 算出居中得x、y坐标（往俩盒子 一个大盒子（画布）和另外一个盒子（图形撑起来得））怎么让图形撑起来得居中呢！！！
      // 用画布自身得一半 减去 gropu得一半 * 缩放 K, 再减去gropu得translate 
      const translateByX = width / 2 - (containerGroupBBox.width / 2) * k - (containerGroupBBox.x * k);
      const translateByY = height / 2 - (containerGroupBBox.height / 2) * k - (containerGroupBBox.y * k);


    const transform = d3.zoomIdentity
      .translate(translateByX, translateByY)
      .scale(k); // 获取到目标 transform

    this.svg.transition() // 过渡效果
      .duration(100) // 100ms
      .call(this.zoom.transform, transform);
    },
    // 保存更改为json文件
    saveChange() {
      this.saveJson()
    },
    saveJson() {
      const allNodes = this.simulation.nodes()
      let allLinks = this.simulation.force('link').links()
      const newAllLinks = []
      if (allLinks._groups && allLinks._groups.length > 0 && allLinks._groups[0].length > 0) {
        for (let i = 0; i < allLinks._groups[0].length; i++) {
          const element = allLinks._groups[0][i].__data__;
          newAllLinks.push(element)
        }
        allLinks = newAllLinks
      }
      // 将更新后的节点和链接转换为JSON字符串
      var graphJSON = {
        nodes: allNodes,
        links: allLinks
      };
      var jsonString = JSON.stringify(graphJSON);

      // 使用jsonString进行你需要的操作，比如发送到服务器或下载为文件
      console.log(jsonString); // 在控制台输出JSON字符串
      this.exportStringAsJson('1.json', jsonString);
    },
    exportStringAsJson(filename, data) {
      // 将字符串转换为JSON对象
      const jsonData = JSON.stringify(data);

      // 创建Blob实例，类型为JSON文件
      const blob = new Blob([jsonData], { type: 'application/json' });

      // 创建一个指向Blob的URL
      const url = URL.createObjectURL(blob);

      // 创建一个a标签，模拟点击进行下载
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link); // 这行是为了防止临时元素被移除
      link.click();

      // 清理并释放内存
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;
      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value); if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    },
    _slicedToArray(arr1, index) {
      return function (arr, i) {
        if (Array.isArray(arr)) {
          return arr;
        } else if (Symbol.iterator in Object(arr)) {
          return this.sliceIterator(arr, i);
        } else {
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
      }(arr1, index);
    },
    /**
     * 显示节点鼠标右键的自定义菜单
     * @param {*} ev 鼠标右键的event
     */
    showCustomMenu(ev) {
      const menu = document.getElementById('contextmenu-div')
      if (menu) {
        menu.style.cssText = `top: ${ev.pageY}px;left: ${ev.pageX}px; display: block;`;
      }
    },
    // 隐藏节点鼠标右键的自定义菜单
    hideCustomMenu() {
      const menu = document.getElementById('contextmenu-div')
      if (menu) {
        menu.style.cssText = `display: none;`;
      }
    }
  }
}
</script>
<style>
@import url('./showtips.css');

#content {
  width: 100%;
  height: 100vh;
}
#topology_container{
  width: 100%;
  height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.node {
  font: 14px sans-serif;
  /* fill: #000000; */
  text-anchor: middle;
}

.node-item g {
  margin: 20px;
}

.node-item image {
  pointer-events: none;
}

.link {
  stroke: #c8c8c8;
  fill: transparent;
}

.arrow {
  fill: #ccc;
}

.node-circle-bg {
  /* fill: #fff; */
}
.node-rect-bg {
  fill: #fff;
}
.node-diamond-bg {
  fill: #fff;
}
.group-bg {
  stroke-opacity: 0.8;
  stroke: #8e8c8c;
  stroke-width: 2px;
}

.link_item.focus {
  stroke: #be385d;
}

marker.focus .arrow {
  fill: #be385d;
}

/* .node-item.focus .node-circle-bg {
  stroke-width: 2;
  stroke: black;
} */
.node-item.focus .node-circle-bg {
  /* cursor: move; */
  stroke-opacity: 0.8;
  stroke: #be385d;
  stroke-width: 5px;
}
.node-item.focus .node-rect-bg,
.node-item.focus .node-diamond-bg{
  stroke-opacity: 0.5;
  stroke: #be385d;
  stroke-width: 1px;
}
.link.selected {
  stroke: rgba(202, 164, 85, 0.6);
}
.link.boxSelected{
  stroke: #1aad8d;
}

.node-item.selected .node-circle-bg {
  stroke: #caa455;
  stroke-opacity: 0.8;
  stroke-width: 4.5px;
}
.node-item.selected .node-rect-bg,
.node-item.selected .node-diamond-bg {
  stroke-opacity: 0.5;
  stroke: #caa455;
  stroke-width: 1px;
}
.node-item.boxSelected .node-circle-bg {
  stroke: #1aad8d;
  stroke-opacity: 0.8;
  stroke-width: 4.5px;
}
.node-item.boxSelected .node-rect-bg,
.node-item.boxSelected .node-diamond-bg {
  stroke-opacity: 0.5;
  stroke: #1aad8d;
  stroke-width: 1px;
}

marker.selected .arrow {
  fill: rgba(202, 164, 85, 0.6);
}
marker.boxSelected .arrow{
  fill: #1aad8d;
}

::v-deep .el-button--primary {
  background-color: #1aad8d !important;
  border-color: #1aad8d !important;
}

#contextmenu-div {
  display: none;
  padding: 0px 0;
}

#svg1 {
  border: solid 1px #e5dfdf;
  /* cursor: grab; */
}

.link-text {
  font-size: 12px;
}
</style>