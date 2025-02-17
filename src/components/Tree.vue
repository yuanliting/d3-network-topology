<template>
  <div style="display: flex; align-items: center;width: 100%;height:calc(100vh - 70px);" id="tree-container">
    <svg id="treeSvg" class="dagre">
      <g class="container"></g>
    </svg>
    <svg id="gridSvg">

    </svg>
    <div ref="tooltip" class="tooltip">
        <div>节点ID：{{currentNode.id}}</div>
        <div>节点名称：{{currentNode.nodeName}}</div>
    </div>
    <div ref="coordinateTip" class="coordinate-tooltip">
      <div>
        rectStartX: {{ this.rectStartX }}
        rectStartY: {{  rectStartY }}
      </div>
      X: {{ currentCoordinate.x }}
      Y: {{ currentCoordinate.y }}
    </div>
  </div>
</template>

<script>
import dagreD3 from "dagre-d3";
import * as d3 from "d3";
import * as $ from 'jquery'
export default {
  components: {
  },
  data() {
    return {
      nodeInfo: null,
      // 节点数组
      nodes: [
        {
          id: 0,
          name: "xxx模型",
          nodeName: "REP_SAJ_SALJAS_SAL",
          type: "DWO",
          release: "已发布",
          time: "2023-12-12 19:12:12",
        },
        {
          id: 1,
          name: "xxx模型",
          nodeName: "REP_SAJ_SALJAS_SAL",
          type: "DWS",
          release: "未发布",
          time: "2023-12-12 19:12:12",
        },
        {
          id: 2,
          name: "xxx模型",
          nodeName: "REP_SAJ_SALJAS_SAL",
          type: "DIM",
          release: "已发布",
          time: "2023-12-12 19:12:12",
        },
        {
          id: 3,
          name: "xxx模型",
          nodeName: "REP_SAJ_SALJAS_SAL",
          type: "DWO",
          release: "已发布",
          time: "2023-12-12 19:12:12",
        },
        {
          id: 4,
          name: "xxx模型",
          nodeName: "REP_SAJ_SALJAS_SAL",
          type: "DIM",
          release: "已发布",
          time: "2023-12-12 19:12:12",
        },
        {
          id: 5,
          name: "xxx模型",
          nodeName: "REP_SAJ_SALJAS_SAL",
          type: "DWD",
          release: "已发布",
          time: "2023-12-12 19:12:12",
        },
        {
          id: 6,
          name: "xxx模型",
          nodeName: "REP_SAJ_SALJAS_SAL",
          type: "DWS",
          release: "已发布",
          time: "2023-12-12 19:12:12",
        },
        {
          id: 7,
          name: "xxx模型",
          nodeName: "REP_SAJ_SALJAS_SAL",
          type: "DWO",
          release: "已发布",
          time: "2023-12-12 19:12:12",
        },
        {
          id: 8,
          name: "xxx模型",
          nodeName: "REP_SAJ_SALJAS_SAL",
          type: "DWO",
          release: "已发布",
          time: "2023-12-12 19:12:12",
        },
        {
          id: 9,
          name: "xxx模型",
          nodeName: "REP_SAJ_SALJAS_SAL",
          type: "DWS",
          release: "未发布",
          time: "2023-12-12 19:12:12",
        },
        {
          id: 10,
          name: "xxx模型",
          nodeName: "REP_SAJ_SALJAS_SAL",
          type: "DWD",
          release: "已发布",
          time: "2023-12-12 19:12:12",
        },
        {
          id: 11,
          name: "xxx模型",
          nodeName: "REP_SAJ_SALJAS_SAL",
          type: "DWS",
          release: "未发布",
          time: "2023-12-12 19:12:12",
        },
        {
          id: 12,
          name: "xxx模型",
          nodeName: "REP_SAJ_SALJAS_SAL",
          type: "ADS",
          release: "未发布",
          time: "2023-12-12 19:12:12",
        },
      ],
      // 连线数组
      edges: [
        {
          start: 1,
          end: 0,
        },
        {
          start: 2,
          end: 1,
        },
        {
          start: 3,
          end: 2,
        },
        {
          start: 4,
          end: 3,
        },
        {
          start: 5,
          end: 3,
        },
        {
          start: 6,
          end: 5,
        },
        {
          start: 7,
          end: 2,
        },
        {
          start: 8,
          end: 7,
        },
        {
          start: 9,
          end: 1,
        },
        {
          start: 9,
          end: 10,
        },
        {
          start: 11,
          end: 10,
        },
        {
          start: 12,
          end: 11,
        },
      ],
      nodes2: [
        {
          id: 'A',
          name: "A模型",
          nodeName: "A",
          type: "DWO",
          release: "已发布",
          time: "2023-12-12 19:12:12",
          collapsed: '收起'
        },
        {
          id: 'B',
          name: "B模型",
          nodeName: "B",
          type: "DWO",
          release: "未发布",
          time: "2023-12-12 19:12:13",
          collapsed: '收起'
        },
        {
          id: 'C',
          name: "C模型",
          nodeName: "C",
          type: "DWO",
          release: "未发布",
          time: "2023-12-12 19:12:14",
          collapsed: '收起'
        },
        {
          id: 'D',
          name: "D模型",
          nodeName: "D",
          type: "DWO",
          release: "未发布",
          time: "2023-12-12 19:12:15",
          collapsed: '收起'
        },
        {
          id: 'E',
          name: "E模型",
          nodeName: "E",
          type: "DWO",
          release: "未发布",
          time: "2023-12-12 19:12:16",
          collapsed: '收起'
        },
        {
          id: 'F',
          name: "F模型",
          nodeName: "F",
          type: "DWO",
          release: "未发布",
          time: "2023-12-12 19:12:17",
          collapsed: '收起'
        },
        {
          id: 'G',
          name: "G模型",
          nodeName: "G",
          type: "DWO",
          release: "未发布",
          time: "2023-12-12 19:12:18",
          collapsed: ''
        },
        {
          id: 'H',
          name: "H模型",
          nodeName: "H",
          type: "DWO",
          release: "未发布",
          time: "2023-12-12 19:12:19",
          collapsed: ''
        },
        {
          id: 'I',
          name: "I模型",
          nodeName: "I",
          type: "DWO",
          release: "未发布",
          time: "2023-12-12 19:12:20",
          collapsed: ''
        }
      ],
      zoomMin: 0.3,
      zoomMax: 5,
      zoom: null,
      container: null,
      svg: null,
      g: null,
      render: null,
      currentNode: {
        id: '',
        nodeName: ''
      },
      direction: "LR",
      rectStartX: 0,
      rectStartY: 0,
      currentCoordinate: { x: 0, y: 0 },
      start_rect_x: 0,
      start_rect_y: 0,
      clickRectId: ''
    }
  },
  mounted() {
    this.initRender()
  },
  methods: {
    releaseClass(node) {
      return node == "已发布" ? "ADS" : "DWD";
    },
    // 获取上游节点函数
    getUpNode(id) {
      let arr = [];
      for (let i = 0; i < this.edges.length; i++) {
        if (this.edges[i].end == Number(id)) {
          arr.push(this.edges[i].start);
          arr.push(...this.getUpNode(this.edges[i].start));
        }
      }
      return arr;
    },
    // 获取下游节点函数
    getDownNode(id) {
      let arr = [];
      for (let i = 0; i < this.edges.length; i++) {
        if (this.edges[i].start == Number(id)) {
          arr.push(this.edges[i].end);
          arr.push(...this.getDownNode(this.edges[i].end));
        }
      }
      return arr;
    },
    // 获取所有的子节点
    getNodeChildren(id) {
      // 从根节点开始进行深度优先遍历
      let childAllNode = []
      const that = this
      // 遍历并打印所有边
      this.g.edges().forEach(function (edge) {
        if (edge.v === id) {
          childAllNode.push(edge.w);
          childAllNode.push(...that.getNodeChildren(edge.w));
        }
      })
      return childAllNode
    },
    // 初始化画布
    async initRender() {
      const width = $("#tree-container").width();
      const height = $("#tree-container").height();
      console.log('宽高', width, height);
      d3.select('#gridSvg').attr("width", width);
      d3.select('#gridSvg').attr("height", height);
      this.g = new dagreD3.graphlib.Graph().setGraph({});
      this.g.setDefaultEdgeLabel(function () {
        return {};
      });
      //方向
      this.g.graph().rankdir = this.direction;
      // 绘制节点
      this.nodes2.forEach((node) => {
        this.createNode(node)
      })
      //绘制连接线
      this.g.setEdge("A", "B", {
        id: 'edge-A-B',
        arrowhead: "vee",
        arrowheadStyle: "fill: #f66",
        style: "stroke: #f66;stroke-width: 1.5px;stroke-dasharray: 5, 5;",
        label: "open" 
      });
      this.g.setEdge("A", "C", {
        id: 'edge-A-C',
        arrowhead: "undirected",
        curve: d3.curveBasis,
      });
      this.g.setEdge("B","D", {
        //边标签
        label: 'test',
        // 边样式
        style: "fill:#fff;stroke:#afa;stroke-width:2px",
        labelStyle: "fill:#1890ff",
        // 箭头形状
        arrowhead:"vee",
        // 箭头样式
        arrowheadStyle:"fill:#f66",
        id: 'edge-B-D'
      })
      // this.g.setEdge("B", "D", { id: 'edge-B-D' });
      this.g.setEdge("C", "E", { id: 'edge-C-E' });
      this.g.setEdge("D", "F", { id: 'edge-D-F' });
      this.g.setEdge("F", "G", { id: 'edge-F-G' });
      this.g.setEdge("E", "H", { id: 'edge-E-H' });
      this.g.setEdge("E", "I", { id: 'edge-E-I' });

      this.svg = d3.select("#treeSvg");
      // 方格线
      this.addPattern();
      // 创建渲染器
      this.render = new dagreD3.render();
      this.render(d3.select("svg g"), this.g);
      this.bindZoom()
      this.svg.attr("width", width);
      this.svg.attr("height", height);
      this.centerChange();
      this.bindClickEventListeners();
      // 阻止双击视图放大
      this.svg.on("dblclick.zoom", function (event) {
        event.stopPropagation();
      })
    },
    draw() {
      const width = $("#tree-container").width();
      const height = $("#tree-container").height();
      // 创建 Graph 对象
      this.g = new dagreD3.graphlib.Graph()
        .setGraph({
          zoom: 1,
          rankdir: "LR", // 流程图从下向上显示，默认'TB'，可取值'TB'、'BT'、'LR'、'RL'
          //ranker: "network-simplex",//连线算法
          // nodesep: 70, // 节点之间间距
          // ranksep: 100, // 层与层之间的间距
        })
        .setDefaultEdgeLabel(function () {
          return {};
        });
      this.nodes.forEach((node) => {
        this.g.setNode(node.id, {
          id: node.id,
          class: 'treeNode',
          label: `<foreignObject id='${node.id}' width='340' height='106'>
            <div id='${node.id
            }'  xmlns='http://www.w3.org/1999/xhtml' style='width:340px; height: 106px;padding: 10px;box-sizing: border-box;'>
              <div id='${node.id}' class='nodeBox'>
                <span id='${node.id}' class='nodeA'>${node.name}</span>
                <div id='${node.id}' class='${node.type}'>${node.type}</div>
              </div>
              <div id='${node.id}' class='nodeBox' style='margin-top:5px'>
                <span id='${node.id}' class='nodeA'>${node.nodeName}</span>
                <span id='${node.id}' class='${this.releaseClass(node.release)}'>${node.release
            }</span>
              </div>
              <div id='${node.id}' style='margin-top:5px'>
                <span id='${node.id}' class='nodeA'>最后执行时间：${node.time
            }</span>
              </div>
            </div>
            </foreignObject>`, //node.nodeName,
          labelType: "html",
          width: 340,
          height: 106,
          // shape: "rect", //节点形状，可以设置rect(长方形),circle,ellipse(椭圆),diamond(菱形) 四种形状，还可以使用render.shapes()自定义形状
          style: "fill:#fff;stroke:#a0cfff;stroke-width: 2px;cursor: pointer", //节点样式,可设置节点的颜色填充、节点边框
          labelStyle: "fill: #fff;font-weight:bold;cursor: pointer", //节点标签样式, 可设置节点标签的文本样式（颜色、粗细、大小）
          rx: 5, // 设置圆角
          ry: 5, // 设置圆角
        });
      });

      // Graph添加节点之间的连线
      if (this.nodes.length > 1) {
        this.edges.forEach((edge) => {
          this.g.setEdge(edge.start, edge.end, {
            //curve: d3.curveStepBefore , //d3.curveBasis, // 设置为贝塞尔曲线
            style: "stroke: #0fb2cc; fill: none; stroke-width: 2px", // 连线样式
            arrowheadStyle: "fill: #0fb2cc;stroke: #0fb2cc;", //箭头样式，可以设置箭头颜色
            arrowhead: "vee", //箭头形状，可以设置 normal,vee,undirected 三种样式，默认为 normal
          });
        });
      }

      // 获取要绘制流程图的绘图容器
      this.container = d3.select("svg.dagre").select("g.container");
      // const svgGroup = svg.append("g");

      const svg = d3.select("#treeSvg");
      const render = new dagreD3.render();
      // Center the graph
      const svgGroup = svg.append("g");
      render(d3.select("svg g"), this.g);
      this.bindZoom()
      svg.attr("width", width);
      svg.attr("height", width);
      svgGroup.attr("transform", "translate(20, 20)");

      // // 创建渲染器
      // this.render = new dagreD3.render();
      // // 在绘图容器上运行渲染器绘制流程图
      // this.render(d3.select("svg g"), this.g);

      // this.bindZoom()

      //  节点点击事件
      let nowNode; // 标记当前高亮节点
      let that = this
      // const svg = d3.select("#treeSvg");
      // svg.attr("width", width);
      // svg.attr("height", width);
      // svgGroup.attr("transform", "translate(20, 20)");
      // 为节点添加点击事件监听器
      d3.selectAll("g.node").on("click", function (e) {
        // 在这里处理节点点击事件
        console.log("Node clicked:", e.target.id);
        // 这里可以添加更新其他节点的逻辑
        // 例如更新相关节点的边，然后重新渲染
        console.log(that.nodes)
        that.nodes.forEach((item) => {
          if (item.id == Number(e.target.id)) {
            nowNode = item.id;
            that.nodeInfo = item;
            let edgeList = [
              ...that.getUpNode(item.id),
              nowNode,
              ...that.getDownNode(item.id),
            ];
            if (that.nodes.length > 1) {
              that.edges.forEach((edge) => {
                if (edgeList.indexOf(edge.start) != -1 && edgeList.indexOf(edge.end) != -1) {
                  that.g.setEdge(edge.start, edge.end, {
                    //curve: d3.curveStepBefore , //d3.curveBasis, // 设置为贝塞尔曲线
                    style: "stroke: red; fill: none; stroke-width: 2px", // 连线样式
                    arrowheadStyle: "fill: red;stroke: red;", //箭头样式，可以设置箭头颜色
                    arrowhead: "vee", //箭头形状，可以设置 normal,vee,undirected 三种样式，默认为 normal
                  });
                } else {
                  that.g.setEdge(edge.start, edge.end, {
                    //curve: d3.curveStepBefore , //d3.curveBasis, // 设置为贝塞尔曲线
                    style: "stroke: #0fb2cc; fill: none; stroke-width: 2px", // 连线样式
                    arrowheadStyle: "fill: #0fb2cc;stroke: #0fb2cc;", //箭头样式，可以设置箭头颜色
                    arrowhead: "vee", //箭头形状，可以设置 normal,vee,undirected 三种样式，默认为 normal
                  });
                }
              });
            }
            for (let a in that.g._nodes) {
              that.g._nodes[a].style = "fill:#fff;stroke:#a0cfff;stroke-width: 2px;cursor: pointer";
              // that.g._nodes[a].classed('my-custom-label-class', true)
              d3.select('g.nodes g.node g.label g').attr('transform', 'translate(-170,-53)');
              d3.select('g.nodes g.node g.label g foreignObject').attr('width', 340)
              d3.select('g.nodes g.node g.label g foreignObject').attr('height', 106)
              console.log(d3.select('g.nodes g.node g.label g foreignObject'))
            }
            that.g._nodes[that.nodeInfo.id].style = "fill: #85c5e259;stroke:#30a8ff;stroke-width: 2px;cursor: pointer";
            that.getUpNode(item.id).forEach((item) => {
              that.g._nodes[item].style = "fill: #a0cfff;stroke:#a0cfff;stroke-width: 2px;cursor: pointer";
            });
            that.getDownNode(item.id).forEach((item) => {
              that.g._nodes[item].style = "fill: #a3da87;stroke:#a0cfff;stroke-width: 2px;cursor: pointer";
            });
          }
        })
        // 重新渲染整个图
        // that.render(that.container, that.g);
        // that.container.call(that.render, that.g);
        // Zoom and scale to fit
        that.render(that.container, that.g);
        // that.updateForeignObjectSize2()
      });
      // this.container.on(
      //   "click",
      //   (e) => {
      //     if (
      //       Number(e.target.__data__) == nowNode ||
      //       nowNode == Number(e.target.id)
      //     ) {
      //       for (let a in this.g._nodes) {
      //         this.g._nodes[a].style =
      //           "fill:#fff;stroke:#a0cfff;stroke-width: 2px;cursor: pointer";
      //       }
      //       this.edges.forEach((edge) => {
      //         this.g.setEdge(edge.start, edge.end, {
      //           //curve: d3.curveStepBefore , //d3.curveBasis, // 设置为贝塞尔曲线
      //           style: "stroke: #0fb2cc; fill: none; stroke-width: 2px", // 连线样式
      //           arrowheadStyle: "fill: #0fb2cc;stroke: #0fb2cc;", //箭头样式，可以设置箭头颜色
      //           arrowhead: "vee", //箭头形状，可以设置 normal,vee,undirected 三种样式，默认为 normal
      //         });
      //       });
      //       nowNode = "";
      //       render(this.container, this.g);
      //       return;
      //     }
      //     this.nodes.forEach((item) => {
      //       if (
      //         item.id == Number(e.target.__data__) ||
      //         item.id == Number(e.target.id)
      //       ) {
      //         nowNode = item.id;
      //         this.nodeInfo = item;
      //         let edgeList = [
      //           ...this.getUpNode(item.id),
      //           nowNode,
      //           ...this.getDownNode(item.id),
      //         ];
      //         if (this.nodes.length > 1) {
      //           this.edges.forEach((edge) => {
      //             if (
      //               edgeList.indexOf(edge.start) != -1 &&
      //               edgeList.indexOf(edge.end) != -1
      //             ) {
      //               this.g.setEdge(edge.start, edge.end, {
      //                 //curve: d3.curveStepBefore , //d3.curveBasis, // 设置为贝塞尔曲线
      //                 style: "stroke: red; fill: none; stroke-width: 2px", // 连线样式
      //                 arrowheadStyle: "fill: red;stroke: red;", //箭头样式，可以设置箭头颜色
      //                 arrowhead: "vee", //箭头形状，可以设置 normal,vee,undirected 三种样式，默认为 normal
      //               });
      //             } else {
      //               this.g.setEdge(edge.start, edge.end, {
      //                 //curve: d3.curveStepBefore , //d3.curveBasis, // 设置为贝塞尔曲线
      //                 style: "stroke: #0fb2cc; fill: none; stroke-width: 2px", // 连线样式
      //                 arrowheadStyle: "fill: #0fb2cc;stroke: #0fb2cc;", //箭头样式，可以设置箭头颜色
      //                 arrowhead: "vee", //箭头形状，可以设置 normal,vee,undirected 三种样式，默认为 normal
      //               });
      //             }
      //           });
      //         }
      //         for (let a in this.g._nodes) {
      //           this.g._nodes[a].style =
      //             "fill:#fff;stroke:#a0cfff;stroke-width: 2px;cursor: pointer";
      //         }
      //         this.g._nodes[this.nodeInfo.id].style =
      //           "fill: #fff;stroke:#30a8ff;stroke-width: 2px;cursor: pointer";
      //         this.getUpNode(item.id).forEach((item) => {
      //           this.g._nodes[item].style =
      //             "fill: #a0cfff;stroke:#a0cfff;stroke-width: 2px;cursor: pointer";
      //         });
      //         this.getDownNode(item.id).forEach((item) => {
      //           this.g._nodes[item].style =
      //             "fill: #a3da87;stroke:#a0cfff;stroke-width: 2px;cursor: pointer";
      //         });
      //         console.log(this.nodeInfo, this.g, 6666);
      //       }
      //     });
      //     render(this.container, this.g);
      //   },
      //   true
      // );
    },
    changeDirection(val) {
      console.log('更改方向2', val)
      this.g.graph().rankdir = val;
      // 重新渲染整个图
      // Zoom and scale to fit
      this.render(d3.select("svg g"), this.g);
      this.updateForeignObjectSize();
    },
    createNode(node) {
      this.g.setNode(node.id,
        {
          id: node.id,
          class: 'treeNode',
          label: `<foreignObject id='${node.id}' width='340' height='106'>
              <div id='${node.id}'  xmlns='http://www.w3.org/1999/xhtml' style='width:340px; height: 106px;padding: 10px;box-sizing: border-box;'>
                <div id='${node.id}' class='nodeBox'>
                  <span id='${node.id}' class='nodeA'>${node.id}</span>
                </div>
                <div id='${node.id}' class='nodeBox' style='margin-top:5px'>
                  <span id='${node.id}' class='nodeA'>节点名称${node.id}</span>
                  <span id='${node.id}'>外网</span>
                </div>
                <div id='${node.id}' style='margin-top:5px;text-align: left;'>
                  <span id='${node.id}' class='nodeA'>最后执行时间：${node.time}</span>
                </div>
                <span id="${node.id}" class="collapsed-btn" style="position: absolute;top: -3px;right: 0px;background: #2196F3;padding: 2px 6px;color: #fff;display: ${node.collapsed !== '' ? 'block' : 'none'} ;">${node.collapsed === '收起' ? '-' : node.collapsed === '展开' ? '+' : ''}</span>
              </div>
              </foreignObject>`, //node.nodeName,
          labelType: "html",
          width: 340,
          height: 106,
          // shape: "diamond", //节点形状，可以设置rect(长方形),circle,ellipse(椭圆),diamond(菱形) 四种形状，还可以使用render.shapes()自定义形状
          style: "fill:#fff;stroke:#a0cfff;stroke-width: 2px;cursor: pointer", //节点样式,可设置节点的颜色填充、节点边框
          labelStyle: "fill: #fff;font-weight:bold;cursor: pointer", //节点标签样式, 可设置节点标签的文本样式（颜色、粗细、大小）
          rx: 5, // 设置圆角
          ry: 5, // 设置圆角
        }
      );
    },
    addTreeNodes() {
      const node = this.g.node('H');
      const nodeId = 'H'
      const nodeData = this.nodes2.find((ev) => { return ev.id === nodeId });
      console.log(nodeData)
      if(nodeData.collapsed === '') {
        nodeData.collapsed = '收起'
        // 更新节点
        this.updateNodeContent(nodeData)
      }
      for (var i = 1; i <= 5; i++) {
        var subNodeId = nodeId + '-' + i;
        if (!this.g.hasNode(subNodeId)) {
          const item = {
            id: subNodeId,
            name:  `${subNodeId}模型`,
            nodeName: subNodeId,
            type: "DWO",
            release: "未发布",
            time: "2023-12-12 19:12:17",
            collapsed: ''
          }
          this.nodes2.push(item);
          this.createNode(item);
          this.g.setEdge("H", subNodeId, { id: `edge-H-${subNodeId}` });
        }
      }
      // 重新渲染整个图
      this.render(d3.select("svg g"), this.g);
      this.updateForeignObjectSize();
      this.bindClickEventListeners()
    },
    // 更新节点函数
    updateNodeContent(node) {
      // 获取节点selection
      const svg = d3.select("svg.dagre");
      const that = this;
      // var nodeSelection = svg.select(`g#${node.id} .label`)
      var nodeSelection = this.g.node(node.id)
      // var nodeSelection = svg.selectAll('.node').filter(function(d) { return d.id === node.id; });
      // 选择或创建foreignObject并设置HTML内容
      
      // if(nodeSelection._groups[0].length === 0) {
      //   return
      // }
      nodeSelection.label = `
        <foreignObject id='${node.id}' width='340' height='106'>
              <div id='${node.id}'  xmlns='http://www.w3.org/1999/xhtml' style='width:340px; height: 106px;padding: 10px;box-sizing: border-box;'>
                <div id='${node.id}' class='nodeBox'>
                  <span id='${node.id}' class='nodeA'>${node.id}</span>
                </div>
                <div id='${node.id}' class='nodeBox' style='margin-top:5px'>
                  <span id='${node.id}' class='nodeA'>节点名称${node.id}</span>
                  <span id='${node.id}'>外网</span>
                </div>
                <div id='${node.id}' style='margin-top:5px;text-align: left;'>
                  <span id='${node.id}' class='nodeA'>最后执行时间：${node.time}</span>
                </div>
                <span id="${node.id}" class="collapsed-btn" style="position: absolute;top: -3px;right: 0px;background: #2196F3;padding: 2px 6px;color: #fff;display: ${node.collapsed !== '' ? 'block' : 'none'} ;">${node.collapsed === '收起' ? '-' : node.collapsed === '展开' ? '+' : ''}</span>
              </div>
        </foreignObject>
      `;
    },
    nodeClicked(e) {
      // 在这里处理节点点击事件
      const that = this
      const svg = d3.select("svg.dagre");
      if (e.target.id && ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].includes(e.target.id)) {
        const id = e.target.id
        // 获取当前节点的子节点
        // var children = that.g.successors(e.target.id);
        // var parent = that.g.node(e.target.id);
        const btn = svg.select(`g#${e.target.id} span.collapsed-btn`);
        console.log(btn._groups[0][0].innerText)
        for (let a in that.g._nodes) {
          that.g._nodes[a].style = "fill:#fff;stroke:#a0cfff;stroke-width: 2px;cursor: pointer";
        }
        that.g._nodes[e.target.id].style = "fill: #85c5e259;stroke:#30a8ff;stroke-width: 2px;cursor: pointer";
        const allChildNodes = that.getNodeChildren(e.target.id)
        // 如果有子节点，且未展开，则展开；否则收缩
        if (allChildNodes && allChildNodes.length > 0) {
          const node = that.nodes2.find((ev) => { return ev.id === e.target.id });
          if(node.collapsed === '收起') {
            node.collapsed = '展开'
          } else if(node.collapsed === '展开') {
            node.collapsed = '收起'
          }
          // 更新节点
          that.updateNodeContent(node)
          var transition = svg.transition().duration(500);
          for (let i = 0; i < allChildNodes.length; i++) {
            const element = allChildNodes[i];
            // 子节点是否是显示状态
            if(node.collapsed === '展开') {
              d3.select(`g#${element}`)
                    .transition(transition)
                    .style('display', 'none')
            }
            if(node.collapsed === '收起') {
              d3.select(`g#${element}`)
                    .transition(transition)
                    .style('display', 'block')
              // 子节点如果还有子节点，也需要更改收缩/展开按钮
              const childNode = that.nodes2.find((ev) => { return ev.id === element });
              if(childNode.collapsed === '展开') {
                childNode.collapsed = '收起'
                // 更新节点
                that.updateNodeContent(childNode)
              }
            }
            // 1. 从图形中移除节点
            // that.g.removeNode(element);
            // 2. 从布局中删除节点 触发过渡动画
            // svg.select(`g#${element}`)
            //   .transition(transition)
            //   .attr("transform", function (d) { return "translate(" + that.g._nodes[e.target.id].x + "," + that.g._nodes[e.target.id].y + ")"; })
            //   .remove();
            // 3. css方式隐藏
            // svg.select(`g#${element}`)
            //    .transition(transition)
            //    .style('display', 'none')
            var edges = that.g.edges();
            // 遍历并打印所有边
            edges.forEach(function (edge) {
              // console.log('From:', edge.v, 'To:', edge.w); // edge.v 是起点，edge.w 是终点
              if (edge.v === e.target.id || edge.v === element) {
                // that.g.removeEdge(edge.v, edge.w)
                if(node.collapsed === '展开') {
                  that.g.setEdge(edge.v, edge.w, {
                    style: "opacity: 0", // 连线样式
                  })
                }
                if(node.collapsed === '收起') {
                  if(edge.v === 'A' && edge.w === 'B') {
                    that.g.setEdge(edge.v, edge.w, {
                      id: 'edge-A-B',
                      arrowhead: "vee",
                      arrowheadStyle: "fill: #f66",
                      style: "opacity: 1;stroke: #f66;stroke-width: 1.5px;stroke-dasharray: 5, 5;",
                      label: "open" 
                    })
                  } else {
                    that.g.setEdge(edge.v, edge.w, {
                      style: "opacity: 1", // 连线样式
                    })
                  }
                }
              }
            });
          }
          // 重新渲染整个图
          // Zoom and scale to fit
          that.render(d3.select("svg g"), that.g);
          that.updateForeignObjectSize();
        }
      }
    },
    // 绑定事件监听器
    bindClickEventListeners() {
      // 使用事件委托
      const that = this
      const tooltipBox = that.$refs.tooltip;
      d3.select('svg#treeSvg')
      .on('click', function (event) {
        console.log('点击了svg', event)
        const shape_controller = d3.selectAll('g#controls_bounding rect.shape_controller')
        for (let i = 0; i < shape_controller._groups[0].length; i++) {
          if(i === 0) {
            d3.select('g#controls_bounding rect.shape_controller.n.w').attr('display', `none`)
          }
          if(i === 1) {
            d3.select('g#controls_bounding rect.shape_controller.n.e').attr('display', `none`)
          }
          if(i === 2) {
            d3.select('g#controls_bounding rect.shape_controller.s.w').attr('display', `none`)
          }
          if(i === 3) {
            d3.select('g#controls_bounding rect.shape_controller.s.e').attr('display', `none`)
          }
        }
        if(d3.select(`g#textarea_g`)._groups[0][0]) {
          // 文本输入框的处理
          document.getElementById('textarea-parent-wrap').style.cursor = `move`
          document.getElementById('auto-input-textarea').style.cursor = `move`
          document.getElementById('auto-input-textarea').style.display = `none`
          document.getElementById('auto-input-textarea').style.width = `100%`
          document.getElementById('auto-input-textarea').style.height = `100%`
          document.getElementById('auto-input-textarea').disabled = true;
          
          document.getElementById('textarea-value-wrap').style.display = `block`
          document.getElementById('textarea-value-wrap').innerHTML = document.getElementById('auto-input-textarea').value
          // 隐藏rect
          d3.select(`g#textarea_g rect#textarea_rect`).attr('display', 'none')
          const shape_controller2 = d3.selectAll('g#textarea_g rect.shape_controller')
          for (let i = 0; i < shape_controller2._groups[0].length; i++) {
            if(i === 0) {
              d3.select('g#textarea_g rect.shape_controller.n.w').attr('display', `none`)
            }
            if(i === 1) {
              d3.select('g#textarea_g rect.shape_controller.n.e').attr('display', `none`)
            }
            if(i === 2) {
              d3.select('g#textarea_g rect.shape_controller.s.w').attr('display', `none`)
            }
            if(i === 3) {
              d3.select('g#textarea_g rect.shape_controller.s.e').attr('display', `none`)
            }
          }
        }
      })

      // rect框
      d3.selectAll("rect#controls_bounding_rect").on("mouseover", function (e) {
        // console.log('鼠标移入', e)
      }).on('mouseenter', function (e) {
        // console.log('mouseenter', e)
      }).on("mouseout", function (v) {
        // console.log('mouseout', v)
      }).on('mouseleave', function(e) {
        // console.log('mouseleave', e);
      }).on('click', function (event) {
        event.stopPropagation();
        console.log('点击了rect', event)
        const shape_controller = d3.selectAll('g#controls_bounding rect.shape_controller')
        console.log(d3.select("g#controls_bounding rect#controls_bounding_rect"))
        for (let i = 0; i < shape_controller._groups[0].length; i++) {
          if(i === 0) {
            d3.select('g#controls_bounding rect.shape_controller.n.w').attr('display', `block`)
          }
          if(i === 1) {
            d3.select('g#controls_bounding rect.shape_controller.n.e').attr('display', `block`)
          }
          if(i === 2) {
            d3.select('g#controls_bounding rect.shape_controller.s.w').attr('display', `block`)
          }
          if(i === 3) {
            d3.select('g#controls_bounding rect.shape_controller.s.e').attr('display', `block`)
          }
        }
      })

      // 节点事件
      d3.selectAll("g.node")
      .on("mouseover", function (e) {
        // console.log('mouseover', e)
        if(e.target.id) {
          for (let a in that.g._nodes) {
            if(a !== e.target.id) {
              d3.select(`g#${a} rect.label-container`)
              .style('fill', '#fff')
              .style('stroke', '#a0cfff')
              .style('stroke-width', '2px')
              .style('cursor', 'pointer')
            }
          }
          if(that.g._nodes[e.target.id]) {
            d3.select(`g#${e.target.id} rect.label-container`)
            .style('fill', '#85c5e259')
            .style('stroke', '#30a8ff')
            .style('stroke-width', '2px')
            .style('cursor', 'pointer')
          }
          that.currentNode = {
            id: e.target.id,
            nodeName: e.target.id
          }
          tooltipBox.style.display = 'block';
          tooltipBox.style.top = (e.clientY - 30) + 'px';
          tooltipBox.style.left = (e.clientX - 30) + 'px';
        }
      }).on('mouseenter', function (e) {
        // console.log('mouseenter', e)
      }).on("mouseout", function (v) {
        // console.log('mouseout', v)
        tooltipBox.style.display = 'none';
        for (let a in that.g._nodes) {
          d3.select(`g#${a} rect.label-container`)
              .style('fill', '#fff')
              .style('stroke', '#a0cfff')
              .style('stroke-width', '2px')
              .style('cursor', 'pointer')
        }
      }).on('mouseleave', function(e) {
        // console.log('mouseleave', e);
      }).on('click', function (event) {
        if (event.type === "click" && event.target.id) { // 假设节点都是g元素
          that.nodeClicked(event);
        }
      })
    },
    // 清空画布
    clearChange() {
      d3.select("svg.dagre g").selectAll('*').remove();
    },
    bindZoom() {
      const container = d3.select("svg.dagre").select("g.container");
      const svg = d3.select("svg.dagre");
      let that = this
      this.zoom = d3.zoom().on('zoom', function (current) {
        container.attr('transform', current.transform);
        that.updateForeignObjectSize();
      });
      svg.call(this.zoom);


      // const container = d3.select("svg.dagre").select("g.container");
      // const svg = d3.select("svg.dagre");
      // this.zoom = d3
      //   .zoom() // 缩放支持
      //   .scaleExtent([0.5, 2]) // 缩放范围
      //   .on("zoom", function (current) {
      //     container.attr("transform", current.transform);
      //   });
      // svg.call(this.zoom); // 缩放生效
      // let { clientWidth, clientHeight } = svg._groups[0][0];
      // let { width, height } = this.g.graph();

      // let initScale = 1;
      // svg
      //   .transition()
      //   .duration(1000) // 1s完成过渡
      //   .call(
      //     this.zoom.transform,
      //     d3.zoomIdentity // 居中显示
      //       .translate(
      //         (clientWidth - width * initScale) / 2,
      //         (clientHeight - height * initScale) / 2
      //       )
      //       .scale(initScale) // 默认缩放比例
      //   );
    },
    // 放大画布
    bigChange() {
      const svg = d3.select("svg.dagre")
      svg.transition().duration(1000).call(this.zoom.scaleBy, 1.3);
    },
    // 缩小画布
    smallChange() {
      const svg = d3.select("svg.dagre")
      svg.transition().duration(1000).call(this.zoom.scaleBy, 0.7);
    },
    // 更新foreignObject尺寸的函数
    updateForeignObjectSize() {
      const svg = d3.select("svg.dagre")
      // console.log(this.g._nodes)
      for (let key in this.g._nodes) {
        // console.log(svg.select(`g.nodes g#${this.g._nodes[key].id} g.label g`))
        const rect = svg.select(`g.nodes g#${this.g._nodes[key].id} rect.label-container`)._groups[0][0]
        if (rect) {
          const wid = rect.width.animVal.value
          const hei = rect.height.animVal.value
          const x = rect.x.animVal.value
          const y = rect.y.animVal.value
          svg.select(`g.nodes g#${this.g._nodes[key].id} g.label g`).attr('transform', `translate(${x + 10},${y + 10})`)
          svg.select(`g.nodes g#${this.g._nodes[key].id} g.label g foreignObject`).attr("width", wid - 20).attr("height", hei - 20)
        }
      }
    },
    // 更新foreignObject尺寸的函数
    updateForeignObjectSize2() {
      const svg = d3.select("svg.dagre")
      console.log(this.g._nodes)
      for (let key in this.g._nodes) {
        // console.log(this.g._nodes[key].elem.children[0])
        const id = this.g._nodes[key].id
        const rect = this.g._nodes[key].elem.children[0]
        const wid = rect.width.animVal.value
        const x = rect.x.animVal.value
        const y = rect.y.animVal.value
        console.log(wid)
        console.log(svg.select(`g.nodes g#${this.g._nodes[key].id}`))
      }
    },
    // 画布中的节点居中
    centerChange() {
      const svg = d3.select("svg.dagre")
      const containerX = []
      const containerY = []
      for (let key in this.g._nodes) {
        containerX.push(this.g._nodes[key].x)
        containerY.push(this.g._nodes[key].y)
      }

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

      const width = $("svg.dagre").width();
      const height = $("svg.dagre").height();

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

      svg.transition() // 过渡效果
        .duration(100) // 100ms
        .call(this.zoom.transform, transform);
    },
    // 删除节点
    removeNode(node) {
      this.g.removeNode(node)
    },
    // 删除边
    removeEdge(v,s) {
      this.g.removeEdge(v,s)
    },
    // 添加一个rect
    addRect() {
      var data = [{'text': '初始文字', 'width': 100, 'height': 50}];
      d3.select('#treeSvg .container').append('g')
      .attr('id', 'controls_bounding')
      .append('rect')
      .attr('id', 'controls_bounding_rect')
      .attr('width', '100')
      .attr('height', '100')
      .attr('fill', 'transparent')
      .attr('stroke', '#067bef')
      .attr('stroke-width', '1')
      .attr('stroke-dasharray', '4')
      .attr('transform', `translate(${0},${0})`)
      .style('cursor', 'move')
      .data(data)

      d3.select("g#controls_bounding")
        .append("rect")
        .attr('class', 'shape_controller n w')
        .attr('index', 0)
        .attr('width', '6')
        .attr('height', '6')
        .attr('stroke', 'rgb(6, 123, 239)')
        .attr('stroke-width', '1')
        .attr('fill', '#fff')
        .attr('display', `none`)
        .attr('cursor', 'nwse-resize')
        .attr('transform', `translate(${-3},${ -3})`)
        .on('mouseover', function(v) {
          d3.select(this).attr('fill', '#067bef')
        }).on("mouseout", function (v) {
          d3.select(this).attr('fill', '#fff')
        }).call(
          this.drag('controls_bounding', 'rect.shape_controller.n.w')
        )

        d3.select("g#controls_bounding")
        .append("rect")
        .attr('class', 'shape_controller n e')
        .attr('index', 0)
        .attr('width', '6')
        .attr('height', '6')
        .attr('stroke', 'rgb(6, 123, 239)')
        .attr('stroke-width', '1')
        .attr('fill', '#fff')
        .attr('display', `none`)
        .attr('cursor', 'nesw-resize')
        .attr('transform', `translate(${100-3},${ -3})`)
        .on('mouseover', function(v) {
          d3.select(this).attr('fill', '#067bef')
        }).on("mouseout", function (v) {
          d3.select(this).attr('fill', '#fff')
        }).call(
          this.drag('controls_bounding','rect.shape_controller.n.e')
        )

        d3.select("g#controls_bounding")
        .append("rect")
        .attr('class', 'shape_controller s w')
        .attr('index', 0)
        .attr('width', '6')
        .attr('height', '6')
        .attr('stroke', 'rgb(6, 123, 239)')
        .attr('stroke-width', '1')
        .attr('fill', '#fff')
        .attr('display', `none`)
        .attr('cursor', 'nesw-resize')
        .attr('transform', `translate(${-3},${100 - 3})`)
        .on('mouseover', function(v) {
          d3.select(this).attr('fill', '#067bef')
        }).on("mouseout", function (v) {
          d3.select(this).attr('fill', '#fff')
        }).call(
          this.drag('controls_bounding','rect.shape_controller.s.w')
        )

        d3.select("g#controls_bounding")
        .append("rect")
        .attr('class', 'shape_controller s e')
        .attr('index', 0)
        .attr('width', '6')
        .attr('height', '6')
        .attr('stroke', 'rgb(6, 123, 239)')
        .attr('stroke-width', '1')
        .attr('fill', '#fff')
        .attr('display', `none`)
        .attr('cursor', 'nwse-resize')
        .attr('transform', `translate(${100-3},${ 100-3})`)
        .on('mouseover', function(v) {
          d3.select(this).attr('fill', '#067bef')
        }).on("mouseout", function (v) {
          d3.select(this).attr('fill', '#fff')
        }).call(
          this.drag('controls_bounding','rect.shape_controller.s.e')
        )
        this.bindRectEventListener()
    },
    // 绑定事件监听器
    bindRectEventListener() {
      const that = this
      // rect框
      d3.selectAll("rect#controls_bounding_rect").on("mouseover", function (e) {
        // console.log('鼠标移入', e)
      }).on('mouseenter', function (e) {
        // console.log('mouseenter', e)
      }).on("mouseout", function (v) {
        // console.log('mouseout', v)
      }).on('mouseleave', function(e) {
        // console.log('mouseleave', e);
      }).on('mousedown', function(e) {
        console.log('mousedown', e)
      }).on('click', function (event) {
        event.stopPropagation();
        console.log('点击了rect', event.target.id)
        this.clickRectId = event.target.id
        // 给rect四周添加四个控制点
        // this.drawControls(this.clickRectId)
        const shape_controller = d3.selectAll('g#controls_bounding rect.shape_controller')
        console.log(d3.select("g#controls_bounding rect#controls_bounding_rect"))
        for (let i = 0; i < shape_controller._groups[0].length; i++) {
          if(i === 0) {
            d3.select('g#controls_bounding rect.shape_controller.n.w').attr('display', `block`)
          }
          if(i === 1) {
            d3.select('g#controls_bounding rect.shape_controller.n.e').attr('display', `block`)
          }
          if(i === 2) {
            d3.select('g#controls_bounding rect.shape_controller.s.w').attr('display', `block`)
          }
          if(i === 3) {
            d3.select('g#controls_bounding rect.shape_controller.s.e').attr('display', `block`)
          }
        }
      }).call(
          this.drag('controls_bounding', 'rect#controls_bounding_rect')
      )
      // .on('dblclick', function(e) {
      //     console.log('双击了')
      //     that.addTextArea()
      // })
    },
    // 拖拽
    drag(parentGId, className) {
      return d3.drag()
        .on('start', (event) => { this.dragStarted(event, parentGId, className)})
        .on('drag', (event) => { this.dragged(event, parentGId, className)})
        .on('end', (event) => { this.dragEnded(event, parentGId, className)})
    },
    // drag nodes
    dragStarted(event, parentGId, className) {
      console.log('开始拖动', event)
      const x = event.x;
      const y = event.y;
      if(className === 'rect#textarea_rect') {
        this.rectStartX = x
        this.rectStartY = y
        const rect_x = d3.select(`g#${parentGId} rect#textarea_rect`)._groups[0][0].x ? d3.select(`g#${parentGId} rect#textarea_rect`)._groups[0][0].x.animVal.value : 0
        const rect_y = d3.select(`g#${parentGId} rect#textarea_rect`)._groups[0][0].y ? d3.select(`g#${parentGId} rect#textarea_rect`)._groups[0][0].y.animVal.value : 0
        this.start_rect_x = rect_x
        this.start_rect_y = rect_y
      }
      if(className === 'rect#controls_bounding_rect') {
        this.rectStartX = x
        this.rectStartY = y
        const rect_x = d3.select('rect#controls_bounding_rect')._groups[0][0].x ? d3.select('rect#controls_bounding_rect')._groups[0][0].x.animVal.value : 0
        const rect_y = d3.select('rect#controls_bounding_rect')._groups[0][0].y ? d3.select('rect#controls_bounding_rect')._groups[0][0].y.animVal.value : 0
        this.start_rect_x = rect_x
        this.start_rect_y = rect_y
      }
    },
    dragged(event, parentGId, className) {
      console.log('dragged拖动', className)
      const x = event.x;
      const y = event.y;
      console.log('x、y', x, y)
      let parentNodeId = parentGId
      let rectId = ''
      // if(d3.select(`${className}`).node().parentNode) {
      //   parentNodeId = d3.select(d3.select(`${className}`).node().parentNode)._groups[0][0].id
      //   console.log('父元素id：', parentNodeId)
      // }
      if(parentNodeId === 'controls_bounding') {
        rectId = 'controls_bounding_rect'
      } else {
        rectId = 'textarea_rect'
      }
     
      if(event.type === 'drag' && className !== 'rect#controls_bounding_rect') {
        console.log(d3.select(d3.select(`${className}`).node().parentNode))
        // 拖动时的操作
        const ne_x = d3.select(`g#${parentNodeId} rect.shape_controller.n.e`)._groups[0][0].transform.animVal[0].matrix.e
        const ne_y = d3.select(`g#${parentNodeId} rect.shape_controller.n.e`)._groups[0][0].transform.animVal[0].matrix.f
        const se_x = d3.select(`g#${parentNodeId} rect.shape_controller.s.e`)._groups[0][0].transform.animVal[0].matrix.e
        const se_y = d3.select(`g#${parentNodeId} rect.shape_controller.s.e`)._groups[0][0].transform.animVal[0].matrix.f
        const nw_x = d3.select(`g#${parentNodeId} rect.shape_controller.n.w`)._groups[0][0].transform.animVal[0].matrix.e
        const nw_y = d3.select(`g#${parentNodeId} rect.shape_controller.n.w`)._groups[0][0].transform.animVal[0].matrix.f
        const sw_x = d3.select(`g#${parentNodeId} rect.shape_controller.s.w`)._groups[0][0].transform.animVal[0].matrix.e
        const sw_y = d3.select(`g#${parentNodeId} rect.shape_controller.s.w`)._groups[0][0].transform.animVal[0].matrix.f
        
        if(className === 'rect.shape_controller.n.w' && Math.abs(nw_x - ne_x) - 3 > 10 && Math.abs(sw_y - nw_y) - 3 > 10) {
          d3.select(`g#${parentNodeId} rect.shape_controller.n.w`).attr('transform', `translate(${event.x - 3},${event.y - 3})`)
          d3.select(`g#${parentNodeId} rect.shape_controller.n.e`).attr('transform', `translate(${ne_x},${event.y - 3})`)
          d3.select(`g#${parentNodeId} rect.shape_controller.s.w`).attr('transform', `translate(${event.x - 3},${sw_y})`)
          
          // rect
          d3.select(`rect#${rectId}`)
          .attr('width', Math.abs(nw_x - ne_x))
          .attr('height', Math.abs(sw_y - nw_y))
          .attr('x', event.x)
          .attr('y', event.y)

          // 文本输入框wrap
          if(d3.select(`g#${parentNodeId} foreignObject#textareaWrap`)._groups[0][0]) {
            d3.select(`g#${parentNodeId} foreignObject#textareaWrap`)
            .attr('width', Math.abs(nw_x - ne_x))
            .attr('height', Math.abs(sw_y - nw_y))
            .attr('x', event.x)
            .attr('y', event.y)
            document.getElementById('textarea-parent-wrap').style.width = `100%`
            document.getElementById('textarea-parent-wrap').style.height = `100%`
            document.getElementById('textarea-wrap').style.width = `100%`
            document.getElementById('textarea-wrap').style.height = `100%`
            document.getElementById('auto-input-textarea').style.width = `100%`
            document.getElementById('auto-input-textarea').style.height = `100%`
          }
        }

        if(className === 'rect.shape_controller.n.e' && Math.abs(ne_x-nw_x) > 10 && Math.abs(se_y - y) > 10) {
          console.log(2222, d3.select('rect.shape_controller.s.w'))
          d3.select(`g#${parentNodeId} rect.shape_controller.n.e`).attr('transform', `translate(${event.x - 3},${event.y - 3})`)
          d3.select(`g#${parentNodeId} rect.shape_controller.n.w`).attr('transform', `translate(${sw_x},${event.y - 3})`)
          d3.select(`g#${parentNodeId} rect.shape_controller.s.e`).attr('transform', `translate(${event.x - 3},${sw_y})`)
          // rect
          d3.select(`rect#${rectId}`)
          .attr('width', Math.abs(ne_x - nw_x))
          .attr('height', Math.abs(sw_y + 3 - event.y))
          .attr('x', sw_x + 3)
          .attr('y', event.y)

          if(d3.select(`g#${parentNodeId} foreignObject#textareaWrap`)._groups[0][0]) {
            d3.select(`g#${parentNodeId} foreignObject#textareaWrap`)
            .attr('width', Math.abs(ne_x - nw_x))
            .attr('height', Math.abs(sw_y + 3 - event.y))
            .attr('x', sw_x + 3)
            .attr('y', event.y)
            document.getElementById('textarea-parent-wrap').style.width = `100%`
            document.getElementById('textarea-parent-wrap').style.height = `100%`
            document.getElementById('textarea-wrap').style.width = `100%`
            document.getElementById('textarea-wrap').style.height = `100%`
            document.getElementById('auto-input-textarea').style.width = `100%`
            document.getElementById('auto-input-textarea').style.height = `100%`
          }
        }

        if(className === 'rect.shape_controller.s.e') {
          d3.select(`g#${parentNodeId} rect.shape_controller.s.e`).attr('transform', `translate(${event.x - 3},${event.y - 3})`)
          d3.select(`g#${parentNodeId} rect.shape_controller.n.e`).attr('transform', `translate(${event.x - 3},${ne_y})`)
          d3.select(`g#${parentNodeId} rect.shape_controller.s.w`).attr('transform', `translate(${sw_x},${event.y - 3})`)
          // rect
          d3.select(`rect#${rectId}`)
          .attr('width', Math.abs(se_x - sw_x))
          .attr('height', Math.abs(se_y - ne_y))
          .attr('x', nw_x + 3)
          .attr('y', event.y - Math.abs(se_y - ne_y))

          if(d3.select(`g#${parentNodeId} foreignObject#textareaWrap`)._groups[0][0]) {
            d3.select(`g#${parentNodeId} foreignObject#textareaWrap`)
            .attr('width', Math.abs(se_x - sw_x))
            .attr('height', Math.abs(se_y - ne_y))
            .attr('x', nw_x + 3)
            .attr('y', event.y - Math.abs(se_y - ne_y))
            document.getElementById('textarea-parent-wrap').style.width = `100%`
            document.getElementById('textarea-parent-wrap').style.height = `100%`
            document.getElementById('textarea-wrap').style.width = `100%`
            document.getElementById('textarea-wrap').style.height = `100%`
            document.getElementById('auto-input-textarea').style.width = `100%`
            document.getElementById('auto-input-textarea').style.height = `100%`
          }
        }
        if(className === 'rect.shape_controller.s.w') {
          d3.select(`g#${parentNodeId} rect.shape_controller.s.w`).attr('transform', `translate(${event.x - 3},${event.y - 3})`)
          d3.select(`g#${parentNodeId} rect.shape_controller.s.e`).attr('transform', `translate(${se_x},${event.y - 3})`)
          d3.select(`g#${parentNodeId} rect.shape_controller.n.w`).attr('transform', `translate(${event.x - 3},${nw_y})`)
          // rect
          d3.select(`rect#${rectId}`)
          .attr('width', Math.abs(sw_x - se_x))
          .attr('height', Math.abs(sw_y - nw_y))
          .attr('x', event.x)
          .attr('y', nw_y + 3)

          if(d3.select(`g#${parentNodeId} foreignObject#textareaWrap`)._groups[0][0]) {
            d3.select(`g#${parentNodeId} foreignObject#textareaWrap`)
            .attr('width', Math.abs(sw_x - se_x))
            .attr('height', Math.abs(sw_y - nw_y))
            .attr('x', event.x)
            .attr('y', nw_y + 3)
            
            document.getElementById('textarea-parent-wrap').style.width = `100%`
            document.getElementById('textarea-parent-wrap').style.height = `100%`
            document.getElementById('textarea-wrap').style.width = `100%`
            document.getElementById('textarea-wrap').style.height = `100%`
            document.getElementById('auto-input-textarea').style.width = `100%`
            document.getElementById('auto-input-textarea').style.height = `100%`
          }
        }

        if(event.type === 'drag' && className === 'rect#textarea_rect') {
          console.log('移动输入框')
          const new_nw_x = this.start_rect_x + (x - this.rectStartX)
          const new_nw_y = this.start_rect_y + (y - this.rectStartY)
          const rect_width =  d3.select('rect#textarea_rect')._groups[0][0].width.animVal.value
          const rect_height =  d3.select('rect#textarea_rect')._groups[0][0].height.animVal.value
          d3.select(`g#${parentNodeId} rect.shape_controller.n.w`)
          .attr('transform', `translate(${new_nw_x - 3},${new_nw_y - 3})`)
          d3.select(`g#${parentNodeId} rect.shape_controller.n.e`)
          .attr('transform', `translate(${new_nw_x + rect_width - 3},${new_nw_y - 3})`)
          d3.select(`g#${parentNodeId} rect.shape_controller.s.w`)
          .attr('transform', `translate(${new_nw_x - 3},${new_nw_y + rect_height - 3})`)
          d3.select(`g#${parentNodeId} rect.shape_controller.s.e`)
          .attr('transform', `translate(${new_nw_x + rect_width - 3},${new_nw_y + rect_height - 3})`)
            
          d3.select(`g#${parentNodeId} rect#textarea_rect`)
          .attr('x', this.start_rect_x + (x - this.rectStartX))
          .attr('y', this.start_rect_y + (y - this.rectStartY));
          d3.select(`g#${parentNodeId} foreignObject#textareaWrap`)
          .attr('x', this.start_rect_x + (x - this.rectStartX))
          .attr('y', this.start_rect_y + (y - this.rectStartY));
        }
        
      }
      if(event.type === 'drag' && className === 'rect#controls_bounding_rect') {
        const coordinateTipBox = this.$refs.coordinateTip;
        coordinateTipBox.style.display = 'block';
        coordinateTipBox.style.top = 0 + 'px';
        coordinateTipBox.style.left = 0 + 'px';
        console.log('rect', d3.select("rect#controls_bounding_rect"))
        console.log('rectStartX_Y', this.rectStartX, this.rectStartY)
        console.log('rect_x_y', this.start_rect_x, this.start_rect_y)
        const new_nw_x = this.start_rect_x + (x - this.rectStartX)
        const new_nw_y = this.start_rect_y + (y - this.rectStartY)
        const rect_width =  d3.select('rect#controls_bounding_rect')._groups[0][0].width.animVal.value
        const rect_height =  d3.select('rect#controls_bounding_rect')._groups[0][0].height.animVal.value
        d3.select(`g#${parentNodeId} rect.shape_controller.n.w`)
        .attr('transform', `translate(${new_nw_x - 3},${new_nw_y - 3})`)
        d3.select(`g#${parentNodeId} rect.shape_controller.n.e`)
        .attr('transform', `translate(${new_nw_x + rect_width - 3},${new_nw_y - 3})`)
        d3.select(`g#${parentNodeId} rect.shape_controller.s.w`)
        .attr('transform', `translate(${new_nw_x - 3},${new_nw_y + rect_height - 3})`)
        d3.select(`g#${parentNodeId} rect.shape_controller.s.e`)
        .attr('transform', `translate(${new_nw_x + rect_width - 3},${new_nw_y + rect_height - 3})`)
          
        d3.select('rect#controls_bounding_rect')
        .attr('x', this.start_rect_x + (x - this.rectStartX))
        .attr('y', this.start_rect_y + (y - this.rectStartY));
      }
      if(d3.select(`rect#${rectId}`)) {
        const new_rect_x =  d3.select(`rect#${rectId}`)._groups[0][0].x.animVal.value
        const new_rect_y =  d3.select(`rect#${rectId}`)._groups[0][0].y.animVal.value
        this.currentCoordinate = {
          x: new_rect_x,
          y: new_rect_y
        }
      }
    },
    dragEnded(event, parentGId, className) {
      console.log('拖动结束', event.x, event.y)
    },
    // 添加网格
    addPattern() {
     const pattern = d3.select("#gridSvg").append("pattern")
      .attr("id", "flow_canvas_grid_item")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 61)
      .attr("height", 61)
      .attr("patternUnits", "userSpaceOnUse")
      .append("path")
      .attr("id", "flow_canvas_grid_path1")
      .attr("stroke-width", "1")
      .attr("stroke", "#fafafa")
      .attr("fill", "none")
      .attr("d", "M0 15L60 15M15 0L15 60M0 30L60 30M30 0L30 60M0 45L60 45M45 0L45 60")

      d3.select("pattern")
      .append("path")
      .attr("id", "flow_canvas_grid_path2")
      .attr("stroke-width", "1")
      .attr("fill", "none")
      .attr("d", "M0 60L60 60M60 0L60 60")
      .attr("stroke", "rgb(242,242,242)")

      // 添加一个rect填充的是方格线
      d3.select("#gridSvg").append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "url(#flow_canvas_grid_item)");

    },
    // 添加可拉动控制
    drawControls(id) {
      // 根据传输的id，给其添加四个控制点
      console.log('接收到的id', id)
      console.log(d3.select(`g#${id} rect#textarea_rect`))
      const rect = d3.select(`g#${id} rect#textarea_rect`)._groups[0][0]
      let width = 0
      let height = 0
      if (rect) {
        width = rect.width.animVal.value
        height = rect.height.animVal.value
      }
      console.log('有没有', d3.select(`g#${id} rect.shape_controller.n.w`))
      if(d3.select(`g#${id} rect.shape_controller.n.w`)._groups[0][0]) {
        // 矫正位置
        return
      }
      d3.select(`g#${id}`)
        .append("rect")
        .attr('class', 'shape_controller n w')
        .attr('index', 0)
        .attr('width', '6')
        .attr('height', '6')
        .attr('stroke', 'rgb(6, 123, 239)')
        .attr('stroke-width', '1')
        .attr('fill', '#fff')
        .attr('display', `block`)
        .attr('cursor', 'nwse-resize')
        .attr('transform', `translate(${-3},${ -3})`)
        .on('mouseover', function(v) {
          d3.select(this).attr('fill', '#067bef')
        }).on("mouseout", function (v) {
          d3.select(this).attr('fill', '#fff')
        }).call(
          this.drag(id, 'rect.shape_controller.n.w')
        )

        d3.select(`g#${id}`)
        .append("rect")
        .attr('class', 'shape_controller n e')
        .attr('index', 0)
        .attr('width', '6')
        .attr('height', '6')
        .attr('stroke', 'rgb(6, 123, 239)')
        .attr('stroke-width', '1')
        .attr('fill', '#fff')
        .attr('display', `block`)
        .attr('cursor', 'nesw-resize')
        .attr('transform', `translate(${width-3},${ -3})`)
        .on('mouseover', function(v) {
          d3.select(this).attr('fill', '#067bef')
        }).on("mouseout", function (v) {
          d3.select(this).attr('fill', '#fff')
        }).call(
          this.drag(id, 'rect.shape_controller.n.e')
        )

        d3.select(`g#${id}`)
        .append("rect")
        .attr('class', 'shape_controller s w')
        .attr('index', 0)
        .attr('width', '6')
        .attr('height', '6')
        .attr('stroke', 'rgb(6, 123, 239)')
        .attr('stroke-width', '1')
        .attr('fill', '#fff')
        .attr('display', `block`)
        .attr('cursor', 'nesw-resize')
        .attr('transform', `translate(${-3},${height - 3})`)
        .on('mouseover', function(v) {
          d3.select(this).attr('fill', '#067bef')
        }).on("mouseout", function (v) {
          d3.select(this).attr('fill', '#fff')
        }).call(
          this.drag(id, 'rect.shape_controller.s.w')
        )

        d3.select(`g#${id}`)
        .append("rect")
        .attr('class', 'shape_controller s e')
        .attr('index', 0)
        .attr('width', '6')
        .attr('height', '6')
        .attr('stroke', 'rgb(6, 123, 239)')
        .attr('stroke-width', '1')
        .attr('fill', '#fff')
        .attr('display', `block`)
        .attr('cursor', 'nwse-resize')
        .attr('transform', `translate(${width-3},${ height-3})`)
        .on('mouseover', function(v) {
          d3.select(this).attr('fill', '#067bef')
        }).on("mouseout", function (v) {
          d3.select(this).attr('fill', '#fff')
        }).call(
          this.drag(id, 'rect.shape_controller.s.e')
        )
    },
    // 添加一个rect输入框
    addTextArea() {
      // 创建一个输入框容器rect，并数据绑定
      const data = [{id: 'textarea_rect_1', 'text': '文本', 'width': 100, 'height': 50}];
      const g = d3.select('svg#treeSvg g.container').append('g')
      .attr('id', 'textarea_g')
      .attr('transform', `translate(${80},${30})`)
      const wrap = g.append('rect')
        .attr('id', 'textarea_rect')
        .attr('width', '100')
        .attr('height', '100')
        .attr('fill', 'transparent')
        .attr('stroke', '#067bef')
        .attr('stroke-width', '1')
        .attr('stroke-dasharray', '4')
        .attr('transform', `translate(${0},${0})`)
        .data(data)

        g.append('foreignObject')
        .attr('id', 'textareaWrap')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 100)
        .attr('height', 100)
        .html(`<div xmlns="http://www.w3.org/1999/xhtml" id="textarea-parent-wrap" style="fill: rgb(255, 255, 255); font-weight: bold;cursor: move; display: inline-block; white-space: nowrap;">
          <foreignobject id="B" width="100" height="100">
              <div id="textarea-wrap" xmlns="http://www.w3.org/1999/xhtml" style="width:100px;height:100px;box-sizing: border-box;">
                <textarea value="文本" id="auto-input-textarea" disabled="true" style="min-height: 43px;cursor: move;display:none;">文本</textarea>
                <div id="textarea-value-wrap">文本</div>
              </div>
          </foreignobject>
        </div>`)
        this.clickRectId = 'textarea_g'
        this.drawControls(this.clickRectId)
      // 创建一个输入框
      // var input = d3.select('svg#treeSvg g.container').append('g')
      //   .attr('id', 'textarea_g')
      //   .append('rect')
      //   .attr('id', 'textarea_rect')
      //   .attr('width', '100')
      //   .attr('height', '100')
      //   .attr('fill', 'transparent')
      //   .attr('stroke', '#067bef')
      //   .attr('stroke-width', '1')
      //   .attr('stroke-dasharray', '4')
      //   .attr('transform', `translate(${0},${0})`)
      //   .append('foreignObject')
      //   .attr('id', 'textareaWrap')
      //   .attr('x', 10)
      //   .attr('y', 10)
      //   .attr('width', 80)
      //   .attr('height', 80)
      //   .append('xhtml:body')
      //   .append('textarea')
      //   .attr('placeholder', '请输入')
      //   .attr('id', 'autoResizing')
      
      // // 你还可以为输入框添加一些样式
      // input.style('border', '1px solid #ccc')
      //   .style('padding', '3px')
      //   .style('font-size', '14px')
      //   .style('overflow-wrap', 'break-word')
      //   .style('white-space', 'pre-wrap')
      //   .style('width', '87%')
      //   .style('overflow', 'auto')
      //   .style('resize', 'none')
      //   .style('border', 'none')
      //   .style('background', 'transparent')
      //   .style('outline', 'none');

        setTimeout(() => {
          this.bindRectTextEventListener()
          const textarea = document.getElementById('auto-input-textarea');
          console.log('输入框', textarea)
          let that = this
          textarea.addEventListener('input', autoResize, false);
          textarea.addEventListener('click', function (event2) {
            console.log('你点击了输入框', event2)
            event2.stopPropagation();
             // 如果textarea有选中的文本，则清除选择范围
            //  console.log(textarea.selectionStart)
            //  if (textarea.createTextRange) {
            //   // 对于旧版本的IE浏览器，使用createTextRange方法
            //   const range = textarea.createTextRange();
            //   range.collapse(true);
            // }
            // textarea.blur()
            // const length = textarea.value.length;
            // textarea.selectionStart = length;
            // textarea.selectionEnd = length;
          });
          function autoResize() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight-4) + 'px';
            console.log('输入框的高度', this.scrollHeight)
            if(this.scrollHeight > 100) {
              d3.select('foreignObject#textareaWrap').attr('height', this.scrollHeight)
              document.getElementById('textarea-wrap').style.height = `${this.scrollHeight}px`
              d3.select('rect#textarea_rect').attr('height', this.scrollHeight)
              // 控制点-矫正位置
              that.controlsCorrectedPosition('textarea_g', this.scrollHeight)
            }
          }
        },1000)
      // 创建文本框并将其放置在rect中心
      // var text = d3.select('rect#text_rect').append('text')
      //   .text('hello word')
      //   .attr('x',  pos.width.animVal.value / 2)
      //   .attr('y', pos.height.animVal.value / 2)
      //   .attr('font-size', '16px')
      //   .attr('text-anchor', 'middle')
      //   .attr('fill', 'black')
 
      // // 隐藏文本框并允许输入
      // text.style('display', 'none');
 
      // // 当双击或失去焦点时提交
      // text.on('blur', function() {
      //   text.remove();
      // });
 
      // // 双击时显示文本框
      // d3.select(this)
      // .on('click', function(e) {
      //   e.stopPropagation();
      // });
      // this.svg.on('click', function() {
      //   text.style('display', 'none');
      // });
      // text.style('display', null);
    },
    bindRectTextEventListener() {
      const that = this
      console.log('zheshi', d3.select('rect#textarea_rect'))
      d3.select('g#textarea_g')
      .on('click', function (event) {
        event.stopPropagation();
        event.preventDefault();
        
        console.log('点击了rect', event.target.id)
        that.clickRectId = 'textarea_g'
        console.log(111, d3.select(`g#${that.clickRectId} rect#textarea_rect`))
        d3.select(`g#textarea_g rect#textarea_rect`).attr('display', 'block')

        const shape_controller2 = d3.selectAll('g#textarea_g rect.shape_controller')
        for (let i = 0; i < shape_controller2._groups[0].length; i++) {
            if(i === 0) {
              d3.select('g#textarea_g rect.shape_controller.n.w').attr('display', `block`)
            }
            if(i === 1) {
              d3.select('g#textarea_g rect.shape_controller.n.e').attr('display', `block`)
            }
            if(i === 2) {
              d3.select('g#textarea_g rect.shape_controller.s.w').attr('display', `block`)
            }
            if(i === 3) {
              d3.select('g#textarea_g rect.shape_controller.s.e').attr('display', `block`)
            }
        }
        // 给rect四周添加四个控制点
        that.drawControls(that.clickRectId)
      }).on('dblclick',function(event) {
        console.log('你双击了输入框1', event)
        // 双击后可输入
        document.getElementById('textarea-parent-wrap').style.cursor = `default`
        document.getElementById('auto-input-textarea').style.cursor = `default`
        document.getElementById('auto-input-textarea').style.display = `block`
        document.getElementById('auto-input-textarea').style.width = `100%`
        document.getElementById('auto-input-textarea').style.height = `100%`
        document.getElementById('auto-input-textarea').disabled = false;
        document.getElementById('textarea-value-wrap').style.display = `none`
        const textarea = document.getElementById('auto-input-textarea')
        console.log(textarea.value)
        // 设置文本选中
        textarea.select();
        textarea.selectionStart = textarea.value.length
        document.getElementById('auto-input-textarea').focus()
      }).call(
          this.drag('textarea_g', 'rect#textarea_rect')
      )
    },
    // 控制点-矫正位置
    controlsCorrectedPosition(parentNodeId, height) {
      console.log(111, parentNodeId)
      const se_x = d3.select(`g#${parentNodeId} rect.shape_controller.s.e`)._groups[0][0].transform.animVal[0].matrix.e
      const sw_x = d3.select(`g#${parentNodeId} rect.shape_controller.s.w`)._groups[0][0].transform.animVal[0].matrix.e
      console.log('---height---', height)
      // 左下角和右下角两个控制点的位置矫正
      d3.select(`g#${parentNodeId} rect.shape_controller.s.w`).attr('transform', `translate(${sw_x},${height - 3})`)
      d3.select(`g#${parentNodeId} rect.shape_controller.s.e`).attr('transform', `translate(${se_x},${height - 3})`)
    }
  }
}
</script>

<style>
#treeSvg {
  border: solid 1px #e5dfdf;
  z-index: 10;
}

.label-container {
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}

.treeNode foreignObject {
  width: 340 !important;
  height: 106 !important;
}

.nodeA {
  color: #01579b;
  font-family: HarmonyOS Sans SC;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
}

.nodeBox {
  display: flex;
  justify-content: space-between;
}

.DWO {
  padding: 0 7px;
  color: #67c23a;
  border-radius: 4px;
  border: 1px solid #e1f3d8;
  background: #f0f9eb;
}

.DIM {
  padding: 0 7px;
  color: #909399;
  border-radius: 4px;
  border: 1px solid #e9e9eb;
  background: #f4f4f5;
}

.DWD {
  padding: 0 7px;
  color: #e6a23c;
  border-radius: 4px;
  border: 1px solid #faecd8;
  background: #fcf6ec;
}

.DWS {
  padding: 0 7px;
  color: #f56c6c;
  border-radius: 4px;
  border: 1px solid #fde2e2;
  background: #fef0f0;
}

.ADS {
  padding: 0 7px;
  color: #409eff;
  border-radius: 4px;
  border: 1px solid #d9ecff;
  background: #ecf5ff;
}

.node rect {
  stroke: #999;
  fill: #fff;
  stroke-width: 1.5px;
}

.node circle {
  stroke: #999;
  /* fill: #fff; */
  stroke-width: 1.5px;
}

.edgePath path.path {
  stroke: #333;
  fill: none;
  stroke-width: 1.5px;
}
#auto-input-textarea {
  font-size: 14px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  word-break: break-all;
  width: 87%;
  overflow: auto;
  resize: none;
  border: none;
  background: transparent;
  outline: none;
}
#textarea-value-wrap{
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: break-word;
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-weight: normal;
  font-family: monospace;
  text-rendering: auto;
  color: fieldtext;
  letter-spacing: normal;
  word-spacing: normal;
  line-height: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  text-align: start;
  appearance: auto;
  -webkit-rtl-ordering: logical;
  column-count: initial !important;
  margin: 0em;
  padding: 2px;
}
</style>
<style scoped>
#tree-container {
  position: relative;
}
.tooltip {
     position: absolute;
     font-size: 12px;
     background-color: white;
     border-radius: 3px;
     box-shadow: rgb(174, 174, 174) 0px 0px 10px;
     cursor: pointer;
     display: none;
     padding:10px;
     z-index: 100;
 }
 
.tooltip>div {
     padding: 10px;
 }
 
 #gridSvg {
  position: absolute;
  top: 0;
  left: 0;
 }
 .shape_controller:hover {
  fill: #067bef;
 }
 .shape_controller {
  cursor: nesw-resize;
 }
 .coordinate-tooltip{
  position: absolute;
  top: 0px;
  left: 0px;
 }
</style>