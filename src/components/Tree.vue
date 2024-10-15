<template>
  <div style="display: flex; align-items: center;width: 100%;height:calc(100vh - 70px);" id="tree-container">
    <svg id="treeSvg" class="dagre">
      <g class="container"></g>
    </svg>
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
      render: null
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
      console.log('kuangao', width, height);
      this.g = new dagreD3.graphlib.Graph().setGraph({});
      this.g.setDefaultEdgeLabel(function () {
        return {};
      });
      //方向
      this.g.graph().rankdir = "LR";
      this.createTooltip();
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
      this.g.setEdge("B", "D", { id: 'edge-B-D' });
      this.g.setEdge("C", "E", { id: 'edge-C-E' });
      this.g.setEdge("D", "F", { id: 'edge-D-F' });
      this.g.setEdge("F", "G", { id: 'edge-F-G' });
      this.g.setEdge("E", "H", { id: 'edge-E-H' });
      this.g.setEdge("E", "I", { id: 'edge-E-I' });
      const svg = d3.select("#treeSvg");
      this.render = new dagreD3.render();
      // Center the graph
      const svgGroup = svg.append("g");
      this.render(d3.select("svg g"), this.g);
      this.bindZoom()
      svg.attr("width", width);
      svg.attr("height", height);
      svgGroup.attr("transform", "translate(20, 20)");
      this.centerChange();
      this.bindMouseover();
      this.bindClickEventListeners();

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
    createTooltip() {
      var tooltip = d3.select("body").append("div")
      .attr("class","tooltip") //用于css设置类样式
      .attr("opacity",0.0); //设置为不可见
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
          // shape: "rect", //节点形状，可以设置rect(长方形),circle,ellipse(椭圆),diamond(菱形) 四种形状，还可以使用render.shapes()自定义形状
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
      d3.select("svg.dagre").on('click', function (event) {
        if (event.type === "click" && event.target.id) { // 假设节点都是g元素
          that.nodeClicked(event);
        }
      });
    },
    // 绑定鼠标悬浮事件
    bindMouseover() {
      d3.selectAll("g.node").on("mouseover", function (e) {
        console.log("Node mouseover:", e.target.id);

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
  }
}
</script>

<style>
#treeSvg {
  border: solid 1px #e5dfdf;
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
</style>