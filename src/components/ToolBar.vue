<template>
    <div class="tools">
        <ul>
            <li v-for="t, to in tools" v-bind:key="to">
                <button class="circle" :class='buttonClass(to)' @click='setTool(to)'>
                    <span :class="t.class"></span>
                </button>
            </li>
            <li>
                <button class="circle" @click='screenShot'>
                    <span class="icon-camera"></span>
                </button>
            </li>
        </ul>
        <div class="tip">{{ tools[tool].tip }}</div>
    </div>
</template>
<script>
import * as $ from 'jquery'
export default {
    name: 'ToolBar',
    data() {
        return {
          tools: {
            pointer: {
                tip: 'Select',
                class: 'icon-pointer'
            },
            killer: {
                tip: 'Click on link or node to kill',
                class: 'icon-delete_forever'
            },
            parent: {
                tip: 'click on node to create parent',
                class: 'icon-repo-forked'
            },
            pin: {
                tip: 'click on node to pin / unpin ',
                class: 'icon-pin'
            }
          },
          tool: 'pointer',
          
        }
    },
    methods: {
        buttonClass (tool) {
            if (tool === this.tool) return 'selected'
        },
        setTool (tool) {
            console.log('你点了工具', tool)
            this.tool = tool
            this.$emit('toolChange', this.tool)
            // let cursorClass = (tool === 'pointer') ? '' : 'cross-cursor'
            // this.$el.className = cursorClass
        },
        clickNode(type) {
            let className = ''
            switch (type) {
                case 'pointer':
                    className = 'icon-pointer'
                    break;
                case 'delete':
                    className = 'icon-delete_forever'
                    break;
                case 'add':
                    className = 'icon-repo-forked'
                    break;
                case 'nomove':
                    className = 'icon-pin'
                    break;
                case 'camera':
                    className = 'icon-camera'
                    break;
                default:
                    className = 'icon-pointer'
                    break;
            }
            $(`.${className}`).parent('.circle').addClass('selected').parent('li').siblings('li').children('.circle').removeClass('selected')
        },
        screenShot () {
          this.$emit('takeScreenShot') 
        }
    }
}
</script>
<style>
.tools {
    position: absolute;
    bottom: 3em;
    right: 4em;
    z-index: 101;
    text-align: center;
}
.tools ul {
    list-style: none;
    margin: 0 3em 0.5em 0;
    padding: 0;
}
.tools ul li {
    display: inline;
    margin-left: 0.5em;
}
.tools .selected {
    border-color: #caa455;
}
.tools ul button {
    width: 3em;
    height: 3em;
    padding: 0;
}
.circle {
    width: 4em;
    height: 4em;
    font-weight: bold;
    border-radius: 50%;
    border: #1aad8d solid 2px;
}
button, select, option {
    box-shadow: none;
    background-color: #fff;
    outline: 0;
}
.tools .selected span,
.tools .selected i {
    color: #caa455;
}
.tools ul button span,
.tools ul button i{
    font-size: 2.5em;
    line-height: 1em;
    color: #1aad8d;
}

.tip {
    margin-right: 1em;
    font-style: italic;
    font-size: 0.8em;
    color: #101010;
}
.icon-pin:before {
    content: "\E909";
}
.tools ul button:hover {
    border-color: #caa455;
}
.tools ul button span:hover {
    color: #caa455;
}
</style>