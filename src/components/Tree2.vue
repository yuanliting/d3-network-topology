<template>
    <div>
      <button @click="turnDir('LR')">从左至右</button>
      <button @click="turnDir('RL')">从右至左</button>
      <button @click="turnDir('TB')">从上至下</button>
      <button @click="turnDir('BT')">从下至上</button>
      <br />
      <el-dialog
        center
        title="节点详情"
        :visible.sync="dialogVisible"
        width="50%"
        @closed="subDialogVisible = false"
        @open="subDialogVisible = true"
      >
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            确 定
          </el-button>
        </span>
      </el-dialog>
      <svg id="tree-svg" width="1800" height="700">
        <g />
      </svg>
    </div>
  </template>
  
  <script>
  import list from "../jsondata/treetopo"
  import dagreD3 from "dagre-d3";
  import * as d3 from "d3";
  import $ from "jquery"
  export default {
    components: {
    },
    data () {
      return {
        dialogVisible: false,
        subDialogVisible: false,
        direction: "TB",
        simulation: null,
        labelVal: ''
      };
    },
    mounted () {
      this.drawTopo()
    },
    methods: {
      turnDir (dir) {
        this.direction = dir
        this.drawTopo()
      },
      drawTopo () {
        //获取D3
        this.simulation = new dagreD3.graphlib.Graph().setGraph({
          rankdir: this.direction,
          align:'DL',  //node节点的对齐方式
          nodesep: 60,  //相同层级中节点的间距  默认 50
          edgesep: 50, //一个节点同时有多条连接线之间的间距  默认10
          ranksep: 50, //相邻层级之间的间距  默认50
          marginx:50,   //图整体与画布的左右间距。默认 0
          marginy:100  //图整体与画布的上下间距。默认 0
        }).setDefaultEdgeLabel(function () { return {}; });
      
        this.drawNode(list.nodes)
  
        this.drawLine(list.links, '#7c7c7c', 1, list.dataFlow);
  
        //绘制图形
        var svg = d3.select("#tree-svg"),
          inner = svg.select("#tree-svg g");
  
        //缩放
        var zoom = d3.zoom().on("zoom", function (event) {
          inner.attr("transform", event.transform);
        });
        svg.call(zoom);
        var render = new dagreD3.render();
        render(inner, this.simulation);
  
        var initialScale = 1;
        svg.call(
          zoom.transform,
          d3.zoomIdentity
            .translate(
              (svg.attr("width") - this.simulation.graph().width * initialScale) / 2,
              50
            )
            .scale(initialScale)
        );
        svg.attr("height", this.simulation.graph().height * initialScale + 40);
  
        //鼠标悬浮事件
        inner.selectAll("g.node").on("mouseover", e => {
          const node = e.currentTarget.__data__
          // 先获取所有的线段,并将这些线段都设置透明度为0.2
          $(`g.edgePath`).attr("style", "opacity:0.2")
          // 当前的节点名字为e,将所有与e有关的线段添加类名active,进行高亮显示
          list.links.forEach(item => {
            $(`.${node}-${item.target}`).addClass("active")
            $(`.${item.target}-${node}`).addClass("active2")
            $(`.${node}-${item.source}`).addClass("active")
            $(`.${item.source}-${node}`).addClass("active")
          })
        }).on("click ", () => {
          this.dialogVisible = true
          this.subDialogVisible = true
          return false
        }).on("mouseout", () => {
          this.drawLine(list.links, '#7c7c7c', 1, list.dataFlow);
          var render = new dagreD3.render();
          render(inner, this.simulation);
        })
      },
      drawNode (arr) {
          // 添加节点(设置节点的特性)
          arr.forEach((item) => {
            this.simulation.setNode(item.id, { 
              labelType: "html", 
              label: `<i class="${item.type} ${item.isFinished ? "finished" : "unfinished"}"><b>${item.label}</b></i>`,
              shape: 'rect',  //节点形状，可以设置rect(长方形),circle,ellipse(椭圆),diamond(菱形) 四种形状，还可以使用render.shapes()自定义形状
              style: 'fill:#fff;stroke:#515a6e',  //节点样式,可设置节点的颜色填充、节点边框
              labelStyle: 'fill: #515a6e;',  //节点标签样式, 可设置节点标签的文本样式（颜色、粗细、大小）
              rx: 5,  // 设置圆角
              ry: 5,  // 设置圆角
              paddingBottom: 0,
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: 0,
            });
          });
      },
      // 链接关系(连线的属性)
      drawLine (arr, color, opacity, textobj) {
        arr.forEach((item, index) => {
          this.simulation.setEdge(item.source, item.target, {
            label: textobj[index],
            lineInterpolate: 'basis',
            class: `${item.source}-${item.target}`,
            style: `stroke: ${color}; fill: none;opacity:${opacity}`,
            arrowheadStyle: `fill: ${color};stroke: ${color};stroke-width:0.1`,
            arrowhead: 'vee',
            id: "status" + index
          });
        });
      }
    }
  };
  </script>
  
  <style>
  svg {
    font-size: 14px;
    border: 1px solid #000;
  }
  
  foreignObject {
    width: 50px;
    height: 63px;
    background-color: transparent;
  }
  .node circle,
  .node ellipse,
  .node rect {
    fill: transparent;
    stroke-width: 0px;
    stroke: red;
  }
  .nodes .node rect {
    width: 70px;
    height: 70px;
  }
  .edgePath path {
    width: 0;
    stroke: #606266;
    fill: #333;
    stroke-width: 1.5px;
  }
  .database,
  .defend,
  .service {
    display: inline-block;
    width: 40px;
    height: 40px;
    background-size: contain;
    position: relative;
    overflow: visible;
    background-repeat: no-repeat;
    b {
      position: absolute;
      bottom: -25px;
      left: 50%;
      transform: translateX(-50%);
      font-style: normal;
    }
  }
  .active,
  .active2 {
    stroke-width: 2px;
    opacity: 1 !important;
    path {
      stroke: #f48771 !important;
    }
  }
  .active2 {
    path {
      stroke: green !important;
    }
  }
  
  .database {
    background-image: url("../assets/img/服务器.jpeg");
  }
  .defend {
    background-image: url("../assets/img/手机.jpeg");
  }
  .service {
    background-image: url("../assets/img/网络.jpg");
  }
  .finished::before {
    content: "√";
    display: inline-block;
    width: 50%;
    height: 50%;
    border-radius: 50%;
    background-color: green;
    position: absolute;
    bottom: 0;
    left: -5px;
    color: #fff;
    text-align: center;
    line-height: 160%;
    font-size: 16px;
  }
  </style>