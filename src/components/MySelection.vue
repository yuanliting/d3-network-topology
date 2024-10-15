<template>
    <div id="selection" class="notification">
        <div class="close" @click="emit('clearSelection')"></div>
        <h4>Selected</h4>
        <div class="mini-list">
            <table class="mini">
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>svg</th>
                    <th>delete</th>
                    <th>unSelect</th>
                </tr>
                <tr v-for="value,key in selectNodes" v-bind:key="key">
                    <td>{{ value.id }}</td>
                    <td>{{ value.name }}</td>
                    <td style="display: flex;align-items: center;">
                        <el-avatar shape="square" :src="`${svgMap[value.imgType]}`" style="background: transparent;width: 18px;height: 18px;"></el-avatar>
                    </td>
                    <td style="text-align: center;">
                        <button title="delete" class="icon" @click='emit("removeNode",[value.id])'>
                            <span class="icon-delete"></span>
                        </button>
                    </td>
                    <td style="text-align: center;">
                        <button title="unselect" class="icon" @click='emit("unSelectNode",[value.id])'>❌</button>
                    </td>
                </tr>
            </table>
        </div>
        <ul class="list">
            <li>Nodes:<strong>{{ Object.keys(selectNodes).length }}</strong></li>
            <li>Links:<strong>{{ Object.keys(nodeLinks).length }}</strong></li>
        </ul>
    </div>
</template>
<script>

export default {
  name: 'MySelection',
  props: {
    links: {
      type: Object
    },
    nodes: {
      type: Object
    },
    svgMap: {
      type: Object
    }
  },
  computed: {
  },
  watch: {
    nodes: {
      immediate: true,
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.selectNodes = val
          this.$forceUpdate()
        })
      }
    },
    links: {
      immediate: true,
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.nodeLinks = val
          this.$forceUpdate()
        })
      }
    },
  },
  data() {
    return {
      nodeLinks: {},
      selectNodes: {}
    }
  },
  methods: {
    init() {
		// 子组件初始化
	    this.selectNodes = JSON.parse(JSON.stringify(this.nodes)); 
    },
    emit(action, args) {
      this.$emit('action', action, args)
    }
  }
}
</script>
<style>
.notification {
    position: absolute;
    bottom: 7em;
    right: 3em;
    z-index: 100;
    width: auto;
    padding: 1em 3em 1em 2em;
    border-radius: 0.5em;
    -webkit-box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
    border: #1aad8d solid 2px;
    background-color: #fff;
    -webkit-box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    margin-bottom: 20px;
}

.close:after {
    content: "\2716";
    position: absolute;
    right: 1em;
    top: 0.5em;
    font-size: 1.25em;
    color: #1aad8d;
    font-family: sans-serif;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
}

.notification .mini-list {
    max-height: 10em;
    overflow-y: scroll;
    overflow-x: hidden;
}

.mini-list,
ul.list {
    display: inline-block;
    list-style: none;
}

.mini {
    font-size: 0.75em;
}

table {
    border-collapse: collapse;
}

tr {
    border-bottom: solid 1px #d3d3d3;
}

th,
td {
    padding: 0 0.5em;
    text-align: left;
}

th {
    border-bottom: solid 2px #d3d3d3;
}

button.icon {
    background-color: #fff;
    border-style: none;
    font-size: 1em;
    height: 1.5em;
    width: 1.5em;
    line-height: 1.25em;
    border-radius: 50%;
    padding: 0;
    margin: 0;
    color: #1aad8d;
}
</style>