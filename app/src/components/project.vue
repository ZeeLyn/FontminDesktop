<template>
    <div class="wrap">
        <div class="projects">
            <el-scrollbar always view-style="padding-bottom:10px;">
                <el-card class="item-card" :class="current && current.id == item.id ? 'active' : ''" v-for="item in projects" :key="item.id" @click="SelectHandle(item)" shadow="hover">
                    <div class="item">
                        <p>字体名字：{{ !item.fontfamily ? "未设置字体" : item.fontfamily }} <el-button :is="item.fontfamily" type="primary" icon="Edit" text size="small" style="margin-left: 15px" @click="EditFontFamilyHandler(item)">编辑</el-button></p>
                        <p>字体文件：{{ getFileName(item.fontfile) }}</p>
                        <p>输出目录：{{ item.output }}<el-button :is="item.fontfamily" type="primary" icon="Folder" text size="small" style="margin-left: 15px" @click="OpenPathHandler(item)">打开</el-button></p>
                        <p>
                            输出格式：
                            <el-space
                                ><el-tag v-for="item in JSON.parse(item.types)" :key="item" size="small" type="success">{{ item }}</el-tag></el-space
                            >
                        </p>
                    </div>
                    <template #header>
                        <div class="card-header">
                            <b>{{ item.title }}</b>
                            <el-dropdown split-button type="primary" @click="EditHandle(item)" size="small" @command="handleCommand">
                                编辑
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item icon="Delete" :command="{ command: 'delete', target: item }">删除项目</el-dropdown-item>
                                        <!-- <el-dropdown-item icon="Folder">输出文件夹</el-dropdown-item> -->
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </template>
                    <div class="footer">
                        <div></div>

                        <svg @click="ShowCssCodeHandler(item)" style="cursor: pointer" t="1704594448567" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13755" width="20" height="20">
                            <path d="M438.4 849.1l222.7-646.7c0.2-0.5 0.3-1.1 0.4-1.6L438.4 849.1z" opacity=".224" p-id="13756" fill="#bfbfbf"></path>
                            <path d="M661.2 168.7h-67.5c-3.4 0-6.5 2.2-7.6 5.4L354.7 846c-0.3 0.8-0.4 1.7-0.4 2.6 0 4.4 3.6 8 8 8h67.8c3.4 0 6.5-2.2 7.6-5.4l0.7-2.1 223.1-648.3 7.4-21.4c0.3-0.8 0.4-1.7 0.4-2.6-0.1-4.5-3.6-8.1-8.1-8.1zM954.6 502.1c-0.8-1-1.7-1.9-2.7-2.7l-219-171.3c-3.5-2.7-8.5-2.1-11.2 1.4-1.1 1.4-1.7 3.1-1.7 4.9v81.3c0 2.5 1.1 4.8 3.1 6.3l115 90-115 90c-1.9 1.5-3.1 3.8-3.1 6.3v81.3c0 4.4 3.6 8 8 8 1.8 0 3.5-0.6 4.9-1.7l219-171.3c6.9-5.4 8.2-15.5 2.7-22.5zM291.1 328.1l-219 171.3c-1 0.8-1.9 1.7-2.7 2.7-5.4 7-4.2 17 2.7 22.5l219 171.3c1.4 1.1 3.1 1.7 4.9 1.7 4.4 0 8-3.6 8-8v-81.3c0-2.5-1.1-4.8-3.1-6.3l-115-90 115-90c1.9-1.5 3.1-3.8 3.1-6.3v-81.3c0-1.8-0.6-3.5-1.7-4.9-2.7-3.5-7.7-4.1-11.2-1.4z" p-id="13757" fill="#bfbfbf"></path>
                        </svg>
                    </div>
                </el-card>
            </el-scrollbar>
        </div>
        <div class="bottom" v-if="projects && projects.length > 0">
            <!-- <el-icon
                color="#333"
                size="30"
                class="add"
                @click="
                    form = {};
                    createDialogVisible = true;
                "
                ><CirclePlus
            /></el-icon> -->
            <el-button
                icon="Plus"
                size="large"
                @click="
                    form = {};
                    createDialogVisible = true;
                "
                style="width: 100%"
                plain
                type="primary"
                >新建项目</el-button
            >
        </div>
    </div>
    <div class="no-data" v-if="!projects || projects.length == 0">
        <el-empty description="还没有项目">
            <el-button
                type="primary"
                icon="Plus"
                @click="
                    form = {};
                    createDialogVisible = true;
                "
                >现在创建</el-button
            >
        </el-empty>
    </div>
    <el-dialog v-model="createDialogVisible" :title="form.id > 0 ? '编辑项目' : '新建项目'" center destroy-on-close width="500px" :close-on-click-modal="false">
        <el-form :model="form" :rules="CreateRules" ref="form" label-width="auto" scroll-to-error style="width: 100%" :hide-required-asterisk="true">
            <el-form-item prop="title" label="项目名称">
                <el-input v-model="form.title" placeholder="请输入项目名称" maxlength="20" show-word-limit clearable> </el-input>
            </el-form-item>
            <el-form-item prop="output" label="输出目录">
                <el-input v-model="form.output" placeholder="请设置输出目录" class="input-with-select" readonly>
                    <template #append>
                        <el-button icon="Folder" @click="SelectFolderHandle" />
                    </template>
                </el-input>
            </el-form-item>
        </el-form>
        <template #footer> <el-button @click="SubmitHandle" type="primary" :loading="submiting"> 保存 </el-button></template>
    </el-dialog>
    <el-dialog v-model="codeDialogVisible" title="CSS代码" center destroy-on-close width="80%" :close-on-click-modal="true">
        <div style="display: flex; align-items: center"><el-switch v-model="base64" style="margin-right: 5px"></el-switch> Base64 encode</div>
        <highlightjs autodetect :code="replaceTemplate()" />
        <template #footer> <el-button @click="CopyCodeHandle" type="primary" :loading="submiting" icon="CopyDocument"> 复制代码 </el-button></template>
    </el-dialog>
    <pre>
    <template ref="template"> 
@font-face { 
    font-family: "$$$FONTFAMILY$$$"; 
    <template v-if="current&&JSON.parse( current.types).includes('eot')">src: url("$$$FONTFAMILY$$$.eot");</template>
    src: <template v-if="current&&JSON.parse( current.types).includes('eot')">url("$$$FONTFAMILY$$$.eot?#iefix") format("embedded-opentype"),</template>
         <template v-if="current&&JSON.parse( current.types).includes('woff')">url("$$$FONTFAMILY$$$.woff") format("woff"),</template>
         <template v-if="current&&JSON.parse( current.types).includes('woff2')">url("$$$FONTFAMILY$$$.woff2") format("woff2"),</template>
         <template v-if="current&&JSON.parse( current.types).includes('ttf')">url("$$$FONTFAMILY$$$.ttf") format("truetype"),</template>
         <template v-if="current&&JSON.parse( current.types).includes('svg')">url("$$$FONTFAMILY$$$.svg#$$$FONTFAMILY$$$") format("svg");</template>
    font-style: normal;
    font-weight: normal;
} 
        </template>
    <template ref="templateBase64"> 
@font-face { 
    font-family: "$$$FONTFAMILY$$$"; 
    src: <template v-if="current&&JSON.parse( current.types).includes('woff')">url("data:font/woff;charset=utf-8;base64,$$$FONTFAMILY_WOFF$$$") format("woff"),</template>
         <template v-if="current&&JSON.parse( current.types).includes('woff2')">url("data:font/woff2;charset=utf-8;base64,$$$FONTFAMILY_WOFF2$$$") format("woff2"),</template>
         <template v-if="current&&JSON.parse( current.types).includes('ttf')">url("data:font/ttf;charset=utf-8;base64,$$$FONTFAMILY_TTF$$$") format("truetype"),</template>
         <template v-if="current&&JSON.parse( current.types).includes('svg')">url("$$$FONTFAMILY$$$.svg#$$$FONTFAMILY$$$") format("svg");</template>
    font-style: normal;
    font-weight: normal;
} 
        </template>
    </pre>
</template>
<script>
import ipc from "../utils/ipc.js";
import path from "path";
import { ElMessage, ElMessageBox } from "element-plus";
import { shell } from "electron";
import fs from "fs";

export default {
    name: "project-view",
    emits: ["change"],
    data() {
        return {
            current: null,
            projects: [],
            form: {},
            submiting: false,
            createDialogVisible: false,
            codeDialogVisible: false,
            base64: false,
            CreateRules: {
                title: [
                    {
                        required: true,
                        message: "请输入项目名称",
                        trigger: "blur",
                    },
                ],
                output: [
                    {
                        required: true,
                        message: "请设置输出目录",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    mounted() {
        this.$ipc.on(ipc.ListProject, this.ListProject);
        this.$ipc.on(ipc.CreateProject, this.CreateProject);
        this.$ipc.on(ipc.EditProject, this.EditProject);
        this.$ipc.on(ipc.DeleteProject, this.DeleteProject);
        this.$ipc.on(ipc.ChooseFolder, this.ChooseFolder);
        this.$ipc.on(ipc.EditFontFamily, this.EditFontFamily);
        this.$ipc.send(ipc.ListProject);
    },
    methods: {
        fileToBase64(filePath) {
            // 读取文件内容
            const fileData = fs.readFileSync(filePath);
            // 将文件内容转换为Base64编码
            const base64Data = fileData.toString("base64");
            return base64Data;
        },
        OpenPathHandler(item) {
            shell.openPath(item.output);
        },
        CopyCodeHandle() {
            var self = this;
            navigator.clipboard.writeText(this.replaceTemplate()).then(function () {
                self.$message.success("复制成功");
            });
        },
        replaceTemplate() {
            if (this.base64) {
                var temp = this.$refs["templateBase64"].innerText;
                temp = temp.replace(/\$\$\$FONTFAMILY\$\$\$/g, this.current.fontfamily);
                var types = JSON.parse(this.current.types);

                if (types.includes("woff")) {
                    if (!fs.existsSync(path.join(this.current.output, `${this.current.fontfamily}.woff`))) {
                        return "woff文件不存在,请先点击下方的输出按钮";
                    }
                    temp = temp.replace(/\$\$\$FONTFAMILY_WOFF\$\$\$/g, this.fileToBase64(path.join(this.current.output, `${this.current.fontfamily}.woff`)));
                }
                if (types.includes("woff2")) {
                    if (!fs.existsSync(path.join(this.current.output, `${this.current.fontfamily}.woff2`))) {
                        return "woff2文件不存在,请先点击下方的输出按钮";
                    }
                    temp = temp.replace(/\$\$\$FONTFAMILY_WOFF2\$\$\$/g, this.fileToBase64(path.join(this.current.output, `${this.current.fontfamily}.woff2`)));
                }
                if (types.includes("ttf")) {
                    if (!fs.existsSync(path.join(this.current.output, `${this.current.fontfamily}.ttf`))) {
                        return "ttf文件不存在,请先点击下方的输出按钮";
                    }
                    temp = temp.replace(/\$\$\$FONTFAMILY_TTF\$\$\$/g, this.fileToBase64(path.join(this.current.output, `${this.current.fontfamily}.ttf`)));
                }
                return temp;
            } else return this.$refs["template"].innerText.replace(/\$\$\$FONTFAMILY\$\$\$/g, this.current.fontfamily);
        },
        ShowCssCodeHandler() {
            this.codeDialogVisible = true;
        },
        EditFontFamilyHandler(item) {
            ElMessageBox.prompt("", "修改输出字体名字", {
                confirmButtonText: "保存",
                cancelButtonText: "取消",
                inputValue: item.fontfamily,
                inputValidator: function (v) {
                    if (!v || v.length == 0) return false;
                },
                inputErrorMessage: "请输入字体名字",
            })
                .then(({ value }) => {
                    console.log(value);
                    this.$ipc.send(ipc.EditFontFamily, item.id, value);
                })
                .catch(() => {});
        },
        EditFontFamily(e, res) {
            if (res.success) {
                this.current.fontfamily = res.fontfamily;
                ElMessage({
                    type: "success",
                    message: `修改成功`,
                });
            }
        },
        getFileName(url) {
            return url ? path.basename(url) : "";
        },
        handleCommand(command) {
            switch (command.command) {
                case "delete":
                    this.$confirm("确认删除吗？", "提示").then(() => {
                        this.$ipc.send(ipc.DeleteProject, command.target.id);
                    });
                    break;
            }
        },
        SubmitHandle() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$confirm("确认保存吗？", "提示").then(() => {
                        this.submiting = true;
                        if (this.form.id > 0) {
                            this.$ipc.send(ipc.EditProject, this.form.id, this.form.title, this.form.output);
                        } else this.$ipc.send(ipc.CreateProject, this.form.title, this.form.output);
                    });
                }
            });
        },
        EditProject(e, res) {
            this.submiting = false;
            if (res.success) {
                this.$message.success("编辑成功。");
                this.$ipc.send(ipc.ListProject);
                this.createDialogVisible = false;
            } else this.$message.error(res.error);
        },
        CreateProject(e, res) {
            this.submiting = false;
            if (res.success) {
                this.current = null;
                this.$message.success("创建成功。");
                this.$ipc.send(ipc.ListProject);
                this.createDialogVisible = false;
            } else this.$message.error(res.error);
        },
        ListProject(e, res) {
            if (!res.success) {
                console.error(res);
                this.$message.error(res.error);
                return;
            }
            this.projects = res.rows;
            if (res.rows && res.rows.length > 0) {
                if (!this.current) this.current = res.rows[0];
                else {
                    var current = res.rows.find((x) => x.id == this.current.id);
                    this.current = current ? current : res.rows[0];
                }
                this.$emit("change", this.current);
            }
        },
        DeleteHandle(row) {
            this.$confirm("确认删除吗？", "提示").then(() => {
                this.$ipc.send(ipc.DeleteProject, row.id);
            });
        },
        DeleteProject() {
            this.current = null;
            this.$emit("change", this.current);
            this.$ipc.send(ipc.ListProject);
        },
        SelectHandle(row) {
            this.current = row;
            this.$emit("change", this.current);
        },
        ChooseFolder(e, path) {
            this.form.output = path;
        },
        SelectFolderHandle() {
            this.$ipc.send(ipc.ChooseFolder);
        },
        EditHandle(row) {
            this.form = Object.assign({}, row);
            this.createDialogVisible = true;
        },
    },
};
</script>
<style scoped>
.wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #191919;
    /* border-right: 1px #737476 solid; */
    /* color: #333; */
    /* background: var(--el-bg-color-overlay); */
}
.bottom {
    height: 40px;
    display: flex;
    /* align-items: center; */
    /* justify-content: space-between; */
    margin: 10px 10px;
}
.body .projects {
    flex: 1;
    overflow: hidden;
}
.item-card {
    margin: 10px 10px 0 10px;
}
.item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 10px 0;
    border: var(--el-box-shadow-lighter);
    font-size: 14px;
    cursor: pointer;
    text-overflow: unset;
    text-align: left;
}
.item b {
    margin-bottom: 15px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.active {
    background: #1d3043;
}
.item p {
    font-size: 12px;
    word-break: break-all;
    margin: 4px 0;
}

.buttons {
    margin: 5px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.buttons * {
    font-size: 13px !important;
}
.item-card .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.no-data {
    position: fixed;
    left: 0;
    top: 50px;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #0a0a0a;
}
</style>
