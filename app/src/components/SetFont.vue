<template>
    <div class="font-drag-wrap" :class="dragEnter ? 'draging' : ''" @dragenter.prevent="DragEnterHandle" @dragover.prevent @dragleave.prevent="DragLeaveHandle" @dragend.prevent="DragLeaveHandle" @drop.prevent="DropFontFileHandle">{{ fontFile ? getFileName(fontFile) : "请拖入 （ttf | otf | woff） 格式的字体文件" }}</div>
</template>

<script>
/*eslint-disable */
import ipc from "../utils/ipc.js";
const fs = require("fs");
var path = require("path");
export default {
    name: "set-font",
    props: {
        project: {
            type: Number,
        },
        font: {
            type: String,
        },
        fontFile: {
            type: String,
        },
    },

    data() {
        return {
            dragEnter: false,
            family: "",
        };
    },
    watch: {
        font: function (v) {
            this.family = v;
        },
    },
    mounted() {
        this.family = this.font;
    },
    methods: {
        getFileName(url) {
            return url ? path.basename(url) : "";
        },
        DropFontFileHandle(e) {
            this.dragEnter = false;
            var src = e.dataTransfer.files[0].path;
            var ext = path.extname(e.dataTransfer.files[0].name).toLowerCase();
            if (![".ttf", ".otf", ".woff"].includes(ext)) {
                this.$message({ message: "只支持ttf,otf,woff格式字体文件", type: "error" });
                return;
            }

            this.family = e.dataTransfer.files[0].name
                .replace(/\.ttf$/i, "")
                .replace(/\.otf$/i, "")
                .replace(/\.woff$/i, "");

            this.$ipc.send(ipc.SetFont, this.project, src, this.family);
        },
        DragEnterHandle(e) {
            this.dragEnter = true;
        },
        DragLeaveHandle() {
            this.dragEnter = false;
        },
    },
};
</script>
<style scoped>
.font-drag-wrap {
    border: 1px #ccc dashed;
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    /* color: #ccc; */
    margin: 10px 0;
    color: #ccc;
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
}

.draging {
    background: #409eff;
    border: 1px #409eff solid;
    color: #fff;
}
</style>
