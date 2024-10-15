<template>
    <div id="tree-content">
      <div id="tree_container">
        <svg id="tree-svg" ref="treeSvg">
          <g class="container"></g>
        </svg>
      </div>
    </div>
  </template>
    
    <script>
  import * as $ from "jquery";
  import svgExport from "@/utils/svgExport";
  import list from "@/jsondata/treetopo"
  import dagreD3 from "dagre-d3";
  import * as d3 from "d3";
  export default {
    name: "Tree",
    components: {},
    props: {
      netNodes: {
        type: Array,
      },
      netLinks: {
        type: Array,
      },
      options: {
        type: Object,
      },
      nodeSym: {
        type: String,
      },
      nodeCb: {
        type: Function,
      },
      linkCb: {
        type: Function,
      },
      simCb: {
        type: Function,
      },
      customForces: {
        type: Object,
      },
      selection: {
        type: Object,
        default: () => {
          return {
            nodes: {},
            links: {},
          };
        },
      },
      svgMap: {
        type: Object,
      },
    },
    computed: {
      selected() {
        return this.selection.nodes;
      },
      linksSelected() {
        return this.selection.links;
      },
    },
    data() {
      return {
        graph: list,
        imgMap: {
          0: require("../assets/img/交换机.jpeg"),
          1: require("../assets/img/手机.jpeg"),
          2: require("../assets/img/服务器.jpeg"),
          3: require("../assets/img/网络.jpg"),
          4: require("../assets/img/计算机.jpg"),
        },
        node: null,
        link: null,
        simulation: null,
        nodeClassName: "node-item",
        container: null,
        symbolSize: 40,
        padding: 4,
        node_icon_border: null,
        svg_rect: null,
        svg_text: null,
        svg_defs: null,
        svg: null,
        tool: "pointer",
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
        mainCirceRadius: 0,
        direction: "LR"
      };
    },
    watch: {
      "selection.links": {
        immediate: true,
        deep: true,
        handler() {},
      },
      netNodes() {
        // this.buildNodes(newValue)
        // this.reset()
      },
      netLinks() {
        // this.links = this.buildLinks(newValue)
        // this.reset()
      },
      nodeSym() {},
      options() {},
    },
    mounted() {
      const vm = this;
      const promise = [];
      for (const key in this.imgMap) {
        const element = this.imgMap[key];
        promise.push(this.getBase64Image(element));
      }
      Promise.all(promise).then((res) => {
        for (const key in this.imgMap) {
          this.imgMap[key] = res[key];
        }
        this.mainCirceRadius = vm.graph.nodes.length / 2;
        this.initRender();
      });
    },
    methods: {
      handlerChangeTool(val) {
        console.log("你改变了tool", val);
        this.tool = val;
        if (val !== "boxSelect") {
          this.stopBrush();
          this.clearAllSelect("boxSelect");
          this.boxSelectNodeList = [];
        }
      },
      buildNodes() {},
      buildLinks() {},
      itemCb(cb, item) {
        if (cb && typeof cb === "function") item = cb(item);
        return item;
      },
      bindZoom() {
        const container = d3.select("svg#tree-svg").select("g.container");
        const svg = d3.select("svg#tree-svg");
        let that = this
        this.zoom = d3.zoom().on('zoom', function(current) {
          container.attr('transform', current.transform);
        });
        svg.call(this.zoom);
        // const that = this;
        // this.zoom = d3
        //   .zoom()
        //   .scaleExtent([this.zoomMin, this.zoomMax])
        //   .on("zoom", function () {
        //     const transform = d3.zoomTransform(this);
        //     that.container.attr("transform", transform);
        //   });
  
        // this.svg.call(this.zoom).on("dblclick.zoom", null);
      },
      stopZoom() {
        this.svg.on("mousedown.zoom", null);
        this.svg.on("mousemove.zoom", null);
        this.svg.on("dblclick.zoom", null);
        this.svg.on("touchstart.zoom", null);
      },
      // 初始化画布
      async initRender() {
        const width = $("#tree_container").width();
        const height = $("#tree_container").height();
  
        // 每个对象必须包含source target属性，表示边的起点和终点，属性的值是节点的id，默认是节点在数组中的索引，同时也可以自定义id getter：
        const scale = 1;
  
        this.svg = d3
          .select("#tree-svg")
          .attr("width", width)
          .attr("height", height);
  
        // 添加一个rect填充的是方格线
        this.svg
          .append("rect")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("fill", "url(#diagramPattern)");
  
        // 方格线
        let s = Array(20);
        this.svg.append("pattern")
          .append("pattern")
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
          .attr("stroke", "#f0f0f0")
          .attr("stroke-width", "0.25")
          .attr("dashArray", "")
          .attr("d", (e, t) =>
            0 === t
              ? "M0,0.5 L100,0.5 Z"
              : t < 10 && t > 0
              ? "M0,".concat(10 * t, ".125 L100,").concat(10 * t, ".125 Z")
              : 10 === t
              ? "M0.5,0 L0.5,100 Z"
              : t > 10
              ? "M"
                  .concat((t - 10) * 10, ".125,0 L")
                  .concat((t - 10) * 10, ".125,100 Z")
              : void 0
          );
  
          // this.container = this.svg
          // .append("g")
          // .attr("transform", "scale(" + scale + ")");
  
        this.container = new dagreD3.graphlib.Graph().setGraph({
          rankdir: this.direction,
          edgesep: 50,
          ranksep: 50
        }).setDefaultEdgeLabel(function () { return {}; });

        this.drawNode(list.nodes)
        this.drawLine(list.links, '#7c7c7c', 1, list.dataFlow);
        var render = new dagreD3.render();
        render(d3.select("svg g"), this.container);
        this.bindZoom()
      },
      drawNode (arr) {
          // 添加节点(设置节点的特性)
          arr.forEach((item) => {
            // this.container.setNode(item.id, { 
            //   labelType: "html",
            //   label: `<i class="${item.type} ${item.isFinished ? "finished" : "unfinished"}"><b>${item.label}</b></i>`
            // });
            this.container.setNode(item.id, 
              {
                id: item.id,
                class: 'treeNode',
                label: `<foreignObject id='${item.id}' width='180' height='86'>
                  <div id='${item.id}'  xmlns='http://www.w3.org/1999/xhtml' style='width:180px; height: 86px;padding: 10px;box-sizing: border-box;'>
                    <div id='${item.id}' class='nodeBox'>
                      <span id='${item.id}' class='nodeA'>${item.id}</span>
                    </div>
                    <div id='${item.id}' class='nodeBox' style='margin-top:5px'>
                      <span id='${item.id}' class='nodeA'>节点名称：${item.label}</span>
                      <span id='${item.id}'>${item.isFinished ? "finished" : "unfinished"}</span>
                    </div>
                    <div id='${item.id}' style='margin-top:5px'>
                      <span id='${item.id}' class='nodeA'>${item.type}</span>
                    </div>
                  </div>
                  </foreignObject>`, //node.nodeName,
                labelType: "html",
                width: 180,
                height: 86,
                // shape: "rect", //节点形状，可以设置rect(长方形),circle,ellipse(椭圆),diamond(菱形) 四种形状，还可以使用render.shapes()自定义形状
                style: "fill:#fff;stroke:#a0cfff;stroke-width: 2px;cursor: pointer;background:#fff;", //节点样式,可设置节点的颜色填充、节点边框
                labelStyle: "fill: #fff;font-weight:bold;cursor: pointer", //节点标签样式, 可设置节点标签的文本样式（颜色、粗细、大小）
                rx: 5, // 设置圆角
                ry: 5, // 设置圆角
              }
            );
          });
      },
      // 链接关系(连线的属性)
      drawLine (arr, color, opacity, textobj) {
          arr.forEach((item, index) => {
            this.container.setEdge(item.source, item.target, {
              label: textobj[index],
              lineInterpolate: 'basis',
              class: `${item.source}-${item.target}`,
              style: `stroke: ${color}; fill: none;opacity:${opacity}`,
              arrowheadStyle: `fill: ${color};stroke: ${color};stroke-width:0.1`,
              arrowhead: 'vee',
              id: "status" + index
            });
          });
      },
      toTreeData() {},
      /**
       * 将画布导出为svg文件
       * @param {*} cb 执行函数
       * @param {*} toSvg svg文件名称
       * @param {*} background 背景色
       * @param {*} allCss
       */
      svgScreenShot(cb, toSvg, background, allCss) {
        let svg = svgExport.exportSVG(this.$refs.svg, allCss);
        let width = 1000;
        let height = 500;
        const svgDom = $("#tree-svg");
        if (!toSvg) {
          if (!background) background = this.searchBackground();
          // 获取svg的宽高
          if (svgDom) {
            width = $("#tree-svg").width();
            height = $("#tree-svg").height();
          }
          let canvas = svgExport.makeCanvas(width, height, background);
          svgExport.svgToImg(svg, canvas, (err, img) => {
            if (err) cb(err);
            else cb(null, img);
          });
        } else {
          cb(null, svgExport.save(svg));
        }
      },
      searchBackground() {
        let vm = this;
        while (vm.$parent) {
          let style = window.getComputedStyle(vm.$el);
          let background = style.getPropertyValue("background-color");
          let rgb = background.replace(/[^\d,]/g, "").split(",");
          let sum = rgb.reduce((a, b) => parseInt(a) + parseInt(b), 0);
          if (sum > 0) return background;
          vm = vm.$parent;
        }
        return "white";
      },
      // 放大画布
      bigChange() {
        const svg = d3.select("svg#tree-svg");
        svg.transition().call(this.zoom.scaleBy, 1.3);
      },
      // 缩小画布
      smallChange() {
        const svg = d3.select("svg#tree-svg");
        svg.transition().call(this.zoom.scaleBy, 0.7);
      },
      // 画布中的节点居中
      centerChange() {
        const svg = d3.select("svg#tree-svg");
        const containerX = []
        const containerY = []
        for(let key in this.container._nodes) {
          containerX.push(this.container._nodes[key].x)
          containerY.push(this.container._nodes[key].y)
        }
  
        const minX = Math.min.apply(null, containerX);
        const maxX = Math.max.apply(null, containerX);
        const minY = Math.min.apply(null, containerY);
        const maxY = Math.max.apply(null, containerY);
  
        const containerGroupBBox = {
          // 用数据获取到当前group得w、h、x、y
          width: maxX - minX,
          height: maxY - minY,
          x: minX,
          y: minY,
        };
  
        const width = $("svg#tree-svg").width();
        const height = $("svg#tree-svg").height();
  
        const scaleX = width / containerGroupBBox.width;
        const scaleY = height / containerGroupBBox.height;
  
        let k = Math.min(scaleX, scaleY) * 0.5;
        k = Math.max(k, this.zoomMin);
        k = Math.min(k, this.zoomMax); // 用画布大小 / 当前svg得大小 获取到比例值
  
        // 算出居中得x、y坐标（往俩盒子 一个大盒子（画布）和另外一个盒子（图形撑起来得））怎么让图形撑起来得居中呢！！！
        // 用画布自身得一半 减去 gropu得一半 * 缩放 K, 再减去gropu得translate
        const translateByX =
          width / 2 -
          (containerGroupBBox.width / 2) * k -
          containerGroupBBox.x * k;
        const translateByY =
          height / 2 -
          (containerGroupBBox.height / 2) * k -
          containerGroupBBox.y * k;
  
        const transform = d3.zoomIdentity
          .translate(translateByX, translateByY)
          .scale(k); // 获取到目标 transform
  
        svg
          .transition() // 过渡效果
          .duration(100) // 100ms
          .call(this.zoom.transform, transform);
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
            var canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.style.width = `${canvas.width / window.devicePixelRatio}px`;
            canvas.style.height = `${canvas.height / window.devicePixelRatio}px`;
            var ctx = canvas.getContext("2d");
            if (!ctx) {
              return null;
            }
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            return resolve(dataURL);
          };
          img.onerror = (err) => {
            return reject(err);
          };
        });
      },
      // 保存更改为json文件
      saveChange() {
        this.saveJson();
      },
      saveJson() {},
      exportStringAsJson(filename, data) {
        // 将字符串转换为JSON对象
        const jsonData = JSON.stringify(data);
  
        // 创建Blob实例，类型为JSON文件
        const blob = new Blob([jsonData], { type: "application/json" });
  
        // 创建一个指向Blob的URL
        const url = URL.createObjectURL(blob);
  
        // 创建一个a标签，模拟点击进行下载
        const link = document.createElement("a");
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
          for (
            var _i = arr[Symbol.iterator](), _s;
            !(_n = (_s = _i.next()).done);
            _n = true
          ) {
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
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
        return (function (arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return this.sliceIterator(arr, i);
          } else {
            throw new TypeError(
              "Invalid attempt to destructure non-iterable instance"
            );
          }
        })(arr1, index);
      },
    },
  };
  </script>
  <style>
  #tree-svg {
    border: solid 1px #e5dfdf;
    /* cursor: grab; */
  }
  #tree-content {
    width: 100%;
    height: inherit;
  }
  #tree_container {
    width: 100%;
    height: inherit;
  }
  </style>