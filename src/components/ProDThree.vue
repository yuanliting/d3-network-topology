<template>
  <div id="content">
    <el-button type="primary" class="save-btn" @click="saveChange()">保存更改</el-button>
    <div id="topology_container" style="width: 1200px;height: 600px;">
      <svg id="svg1" ref="svg"></svg>
    </div>
    <div id="show-tips">
      <h6></h6>
      <i class='close'></i>
      <ul></ul>
    </div>
  </div>
</template>

<script>
import * as $ from 'jquery'
import * as d3 from 'd3'
import svgExport from '@/utils/svgExport'

export default {
  name: 'ProDThree',
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
            group: 1
          },
          {
            id: "Napoleon",
            group: 1
          },
          {
            id: "Labarre",
            group: 2
          },
          {
            id: "Valjean",
            group: 2
          },
          {
            id: "Baptistines",
            group: 1
          },
          {
            id: "MmeMagloire",
            group: 1
          },
          {
            id: "网络",
            group: 7
          },
          {
            id: 'docker',
            group: 8
          },
          {
            id: '云',
            group: 5
          },
          {
            id: '数据库',
            group: 6
          }
        ],
        links: [
          {
            source: "Napoleon",
            target: "Myriel",
            value: 1
          },
          {
            source: "Valjean",
            target: "Labarre",
            value: 1
          },
          {
            source: "Baptistines",
            target: "Myriel",
            value: 8
          },
          {
            source: "MmeMagloire",
            target: "Myriel",
            value: 10
          },
          {
            source: "docker",
            target: "网络",
            value: 1
          },
          {
            source: "数据库",
            target: "云",
            value: 1
          },
          {
            source: "云",
            target: "docker",
            value: 1
          },
          {
            source: "数据库",
            target: "网络",
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
      svgMap: {
        0: require('../assets/svg/交换机.svg'),
        1: require('../assets/svg/APP.svg'),
        2: require('../assets/svg/服务器.svg'),
        3: require('../assets/svg/网络.svg'),
        4: require('../assets/svg/PC.svg'),
        5: require('../assets/svg/云.svg'),
        6: require('../assets/svg/数据库.svg'),
        7: require('../assets/svg/earth.svg'),
        8: require('../assets/svg/Docker.svg')
      },
      node: null,
      link: null,
      simulation: null,
      nodeClassName: 'node-item',
      container: null,
      symbolSize: 40,
      padding: 4,
      svg_circle: null,
      svg_text: null,
      svg_defs: null,
      svg: null,
      size: {
        w: 1200,
        h: 600
      },
      tool: 'pointer'
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
    const promise = []
    for (const key in this.imgMap) {
      const element = this.imgMap[key];
      promise.push(this.getBase64Image(element))
    }
    Promise.all(promise).then((res) => {
      for (const key in this.imgMap) {
        this.imgMap[key] = res[key]
      }
      this.readJson()
      this.innitRender()
      this.$emit('allNodes', this.simulation.nodes())
      console.log('一共有多少条线', this.simulation.force('link').links())
      this.$emit('allLinks', this.simulation.force('link').links())
    })
  },
  methods: {
    readJson() {
      // 定义数据加载的URL
      const url = './1.json';
      // 使用d3.json加载数据
      d3.json(url)
        .then(data => {
          console.log('数据加载成功:', data);
          // 在这里处理你的数据
        })
        .catch(error => {
          console.error('数据加载出错:', error);
        });
    },
    handlerChangeTool(val) {
      console.log('你改变了tool', val)
      this.tool = val
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
    buildNodes() {
    },
    buildLinks() {
    },
    itemCb(cb, item) {
      if (cb && typeof (cb) === 'function') item = cb(item)
      return item
    },
    nodeClass(node, classes = []) {
      let cssClass = (node._cssClass) ? node._cssClass : []
      if (!Array.isArray(cssClass)) cssClass = [cssClass]
      cssClass.push('node-item')
      classes.forEach(c => cssClass.push(c))
      if (this.selected[node.id]) cssClass.push('selected')
      if (node.fx || node.fy) cssClass.push('pinned')
      return cssClass
    },
    selectNode(d) {
      d3.select(`#${d.id}`)._groups[0][0].classList.add('selected')
    },
    selectLink(id) {
      if (this.tool === 'pointer') {
        const lin = d3.select(`#${id}`);
        if (lin) {
          lin.classed('selected', true)
        }
        this.svg.select('defs').selectAll('marker')
        .each(function (m) {
          if (`${m.source.id}-${m.target.id}` === id) {
            d3.select(this).classed('selected', true)
          }
        })
      }
    },
    removeNode(nodeId) {
      console.log('删除的node', nodeId)
      console.log('先获取此节点', d3.select(`#${nodeId}`))
      d3.select(`#${nodeId}`).remove()
      // this.reset(nodeId)
    },
    removeLink(LinkId) {
      console.log('删除的线', LinkId)
      d3.select(`#${LinkId}`).remove()
    },
    clearAllSelect() {
      // 清除所有的选中
      const allNode = this.simulation.nodes()
      const allLinks = this.simulation.force('link').links()
      if (allNode && allNode.length > 0) {
        for (let i = 0; i < allNode.length; i++) {
          const element = allNode[i];
          this.cancleNodeSelect(element.id)
        }
      }
      if (allLinks && Array.isArray(allLinks) && allLinks.length > 0) {
        for (let i = 0; i < allLinks.length; i++) {
          const element = allLinks[i];
          this.cancleLinkSelect(`${element.source.id}-${element.target.id}`)
        }
      }
      if (allLinks._groups && allLinks._groups.length > 0 && allLinks._groups[0].length > 0) {
        for (let i = 0; i < allLinks._groups[0].length; i++) {
          const element = allLinks._groups[0][i];
          this.cancleLinkSelect(`${element.__data__.source.id}-${element.__data__.target.id}`)
        }
      }
    },
    cancleNodeSelect(nodeId) {
      // 找到节点，并取消选中
      const node = document.getElementById(`${nodeId}`)
      const nodeClassName = this.nodeClass(node, []).join(' ')
      if (nodeClassName) {
        node.classList.remove('selected')
      }
    },
    cancleLinkSelect(linkId) {
      const link = document.getElementById(`${linkId}`)
      if (link) {
        link.classList.remove('selected')
        d3.select(`#marker-${linkId}`).classed('selected', false)
      }
    },
    createNodeAndLink(nNode, nLink) {
      const that = this
      d3.timeout(function () {
        that.graph.nodes.push(nNode);
        that.graph.links.push(nLink);
        that.update(nNode, nLink);
      }, 500);
    },
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
    async innitRender() {
      const width = $("#topology_container").width();
      const height = $("#topology_container").height();

      // 每个对象必须包含source target属性，表示边的起点和终点，属性的值是节点的id，默认是节点在数组中的索引，同时也可以自定义id getter：
      // d3.forceLink().id(d => d.id)
      const scale = 1;
      let vm = this

      this.simulation = d3.forceSimulation(this.graph.nodes) //创建一个力导向图模拟对象
        .force("link", d3.forceLink(this.graph.links).id(d => d.id)) // 连接力，拉动节点相互连接，好像节点之间有一个弹簧
        .force("charge", d3.forceManyBody()) // 排斥力，类似带电电子的排斥方式，推动所有节点彼此远离
        .force("center", d3.forceCenter(width / 2, height / 2)) // 中心力，将所有的节点都推向图表的中心（给定的一个点），默认坐标是[0,0]，施加力时，所有节点的相对位置保持不变
        .force("collide", d3.forceCollide().radius(60).iterations(2)) // 
        .alphaDecay(0.05) // 衰减系数，值越大，图表稳定越快
        .on("tick", this.ticked);
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

      this.container = this.svg.append('g')
        .attr('transform', 'scale(' + scale + ')');

      // 连接线
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
        ).attr(
          'd', link => this.genLinkPath(link),
        ).attr(
          'id', (link) => `${link.source.id}-${link.target.id}`
        )
        .attr('stroke-width', 3)
        .on('click', function ($event, d) {
          console.log('你点击线了', d)
          vm.$emit("linkClick", $event, d)
        })
        .on('mouseover', function () {
          const id = d3.select(this).attr('marker-end').split('url(#marker-')[1].split(')')[0]
          // const source = d.target.__data__.source
          // const target = d.target.__data__.target
          // console.log('source节点', source)
          // console.log('target节点', target)
          d3.select(this).classed('focus focusing', true)
          vm.svg.select('defs').selectAll('marker')
            .each(function (m) {
              if (`${m.source.id}-${m.target.id}` === id) {
                d3.select(this).classed('focus focusing', true)
              }
            })
          // vm.svg.selectAll('g.node-item').each(function (item) {
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
          vm.svg.select('defs').selectAll('marker')
            .each(function (m) {
              if (`${m.source.id}-${m.target.id}` === id) {
                d3.select(this).classed('focus focusing', false)
              }
            })
          // vm.svg.selectAll('g.node-item').each(function (item) {
          //   if (source.id === item.id) {
          //     d3.select(this).classed('focus focusing', false)
          //   }
          //   if (target.id === item.id) {
          //     d3.select(this).classed('focus focusing', false)
          //   }
          // })
        });

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
        }).on('mouseover', function () {
          d3.select(this).classed('focus focusing', true)
        })
        .on('mouseout', function () {
          d3.select(this).classed('focus focusing', false)
        }).call(this.drag(this.simulation));

      this.svg_circle = this.node.append('circle')
        .attr('r', this.symbolSize / 2 + this.padding + 2.6)
        .attr('class', 'node-bg')

      // 节点文字
      this.svg_text = this.node.filter(item => item.id !== '云' && item.id !== '数据库').data(this.graph.nodes)
        .append("text")
        .attr("class", "node")
        .text(function (d) {
          return d.id;
        })
        .attr("dx", "0.2em")
        .attr("dy", "3em")

      this.node.filter(item => item.id === '云')
        .append("text")
        .attr("class", "node")
        .text(function (d) {
          return d.id;
        })
        .attr("dx", "-0.1em")
        .attr("dy", "2.3em")

      this.node.filter(item => item.id === '数据库')
        .append("text")
        .attr("class", "node")
        .text(function (d) {
          return d.id;
        })
        .attr("dx", "0.1em")
        .attr("dy", "2.8em")

      // 节点图片
      // const that = this
      // this.node.filter(item => item.id !== '云' && item.id !== '数据库').data(this.graph.nodes)
      //   .append("image")
      //   .attr("width", function (d) {
      //     var width = 35;
      //     switch (d.group) {
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
      //     switch (d.group) {
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
      //     return that.imgMap[d.group];
      //   }).attr("x", -17)
      //   .attr("y", -19);

      // 添加svg
      const svgImgPromise = []
      for (const key in this.svgMap) {
        const element = this.svgMap[key];
        svgImgPromise.push(this.d3ReadSvg(element))
      }
      Promise.all(svgImgPromise).then((res) => {
        if (res && res.length > 0) {
          vm.node.filter(item => item.id !== '云' && item.id !== '数据库').data(vm.graph.nodes)
            .append("g")
            .attr('transform', 'translate(-16, -16)')
            .attr('fill', '#111')
            .attr('class', `node-svg-g`)
            .attr('id', (n) => `g-${n.id}`)
          for (let i = 0; i < vm.graph.nodes.length; i++) {
            const element = vm.graph.nodes[i];
            if (element.id !== '云' && element.id !== '数据库') {
              // 为每个节点添加一个克隆的SVG
              var clone = document.importNode(res[element.group], true);
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
        .attr('fill', '#fff')

      marker.append('svg:path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('class', 'arrow')

      //云
      this.defs.append('g')
        .attr('id', 'cloud')
        .attr('transform', 'scale(0.042)')
        .append('path')
        .attr('d', 'M709.3 285.8C668.3 202.7 583 145.4 484 145.4c-132.6 0-241 102.8-250.4 233-97.5 27.8-168.5 113-168.5 213.8 0 118.9 98.8 216.6 223.4 223.4h418.9c138.7 0 251.3-118.8 251.3-265.3 0-141.2-110.3-256.2-249.4-264.5z')
        .attr('fill', '#FF9800')
      //数据库
      let database = this.defs.append('g')
        .attr('id', 'database')
        .attr('transform', 'scale(0.042)')
        .attr('fill', '#2196F3')

      database.append('path')
        .attr('d', 'M512 800c-247.42 0-448-71.63-448-160v160c0 88.37 200.58 160 448 160s448-71.63 448-160V640c0 88.37-200.58 160-448 160z')

      database.append('path')
        .attr('d', 'M512 608c-247.42 0-448-71.63-448-160v160c0 88.37 200.58 160 448 160s448-71.63 448-160V448c0 88.37-200.58 160-448 160z');

      database.append('path')
        .attr('d', 'M512 416c-247.42 0-448-71.63-448-160v160c0 88.37 200.58 160 448 160s448-71.63 448-160V256c0 88.37-200.58 160-448 160z');

      database.append('path')
        .attr('d', 'M64 224a448 160 0 1 0 896 0 448 160 0 1 0-896 0Z');

      this.node.filter(item => item.id == '云')
        .append('use')
        .attr('xlink:href', '#cloud')
        .attr('x', function () {
          // 不会因为放大而宽高变化
          return -this.getBBox().width / 2 - 3.5
        })
        .attr('y', function () {
          return -this.getBBox().height / 2 - 7.5
        })

      this.node.filter(item => item.id == '数据库')
        .append('use')
        .attr('xlink:href', '#database')
        .attr('x', function () {
          return -this.getBBox().width / 2 - 2
        })
        .attr('y', function () {
          return -this.getBBox().height / 2 - 2
        })

    },
    drag() {
      // 拖拽
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
    },
    dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
      this.fix_nodes(d);
    },
    dragended(event, d) {
      if (!event.active) this.simulation.alphaTarget(0);
      d.fx = d.x;
      d.fy = d.y;
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
      this.link.attr('d', d => this.genLinkPath(d));
      this.node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
    },
    genLinkPath(d) {
      let sx = this.graph.nodes[d.source.index].x;
      let tx = this.graph.nodes[d.target.index].x;
      let sy = this.graph.nodes[d.source.index].y;
      let ty = this.graph.nodes[d.target.index].y;
      return 'M' + sx + ',' + sy + ' L' + tx + ',' + ty;
    },
    update(nNode, nLink) {
      console.log(99, nLink)
      const that = this
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
        .on('click', function ($event, d) {
          that.$emit("nodeClick", $event, d)
        }).on('mouseover', function () {
          d3.select(this).classed('focus focusing', true)
        })
        .on('mouseout', function () {
          d3.select(this).classed('focus focusing', false)
        }).call(this.drag(this.simulation));

      this.svg_circle = this.node.filter(item => item.id === nNode.id).append('circle')
        .attr('r', this.symbolSize / 2 + this.padding + 2.6)
        .attr('class', 'node-bg')

      // 节点文字
      this.svg_text = this.node.filter(item => item.id === nNode.id)
        .append("text")
        .attr("class", "node")
        .text(function (d) {
          return d.id;
        })
        .attr("dx", "0.2em")
        .attr("dy", "3em")
        .merge(this.svg_text)

      // 节点图片
      this.node.filter(item => item.id === nNode.id)
        .append("image")
        .attr("width", function (d) {
          var width = 35;
          switch (d.group) {
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
          switch (d.group) {
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
          return that.imgMap[d.group];
        }).attr("x", -17)
        .attr("y", -19);

      // 添加线
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

      this.simulation.nodes(this.graph.nodes);
      this.simulation.force("link").links(this.link);

      // 重新启动模拟
      this.simulation.restart();
    },
    svgScreenShot(cb, toSvg, background, allCss) {
      let svg = svgExport.export(this.$refs.svg, allCss)
      if (!toSvg) {
        if (!background) background = this.searchBackground()
        let canvas = svgExport.makeCanvas(this.size.w, this.size.h, background)
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
    }
  }
}
</script>
<style>
@import url('./showtips.css');

.save-btn {
  float: left;
}

.node {
  font: 14px sans-serif;
  fill: #000000;
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
}

.arrow {
  fill: #ccc;
}

.node-bg {
  fill: #fff;
}

.link_item.focus {
  stroke: #be385d;
}

marker.focus .arrow {
  fill: #be385d;
}

/* .node-item.focus .node-bg {
  stroke-width: 2;
  stroke: black;
} */
.node-item.focus .node-bg {
  /* cursor: move; */
  stroke-opacity: 0.8;
  stroke: #be385d;
  stroke-width: 5px;
}

.link.selected {
  stroke: rgba(202, 164, 85, 0.6);
}

.node-item.selected .node-bg {
  stroke: #caa455;
  stroke-opacity: 0.8;
  stroke-width: 4.5px;
}

marker.selected .arrow {
  fill: rgba(202, 164, 85, 0.6);
}

::v-deep .el-button--primary {
  background-color: #1aad8d !important;
  border-color: #1aad8d !important;
}
</style>../utils/svgExport