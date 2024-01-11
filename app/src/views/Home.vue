<template>
    <div class="main" @drop.prevent v-loading="loading" element-loading-text="正在输出...">
        <div class="header">
            <b> <img src="@/assets/logo.png" style="width: 20px" />字体压缩</b>
            <div style="margin-right: 10px">
                <el-button icon="SemiSelect" size="small" style="width: 20px; -webkit-app-region: no-drag" type="primary" plain @click="$ipc.send('MinWindow')"></el-button>
                <el-button icon="FullScreen" size="small" style="width: 20px; -webkit-app-region: no-drag" type="primary" plain @click="$ipc.send('MaxWindow')"></el-button>
                <el-button icon="CloseBold" size="small" style="width: 20px; -webkit-app-region: no-drag" type="primary" plain @click="$ipc.send('Exit')"></el-button>
            </div>
        </div>
        <div class="body">
            <div class="project">
                <Project @change="ProjectChangeHandle" ref="project"></Project>
            </div>
            <div class="wrap">
                <template v-if="project">
                    <div class="input-body"><Content :project="project.id" @change="ContentChangeHandle"></Content></div>
                    <SetFont :project="project.id" :font="project.fontfamily" :fontFile="project.fontfile"></SetFont>
                    <div class="output">
                        <el-checkbox-group v-model="types">
                            <el-checkbox label="eot" />
                            <el-checkbox label="svg" />
                            <el-checkbox label="ttf" />
                            <el-checkbox label="woff" />
                            <el-checkbox label="woff2" />
                        </el-checkbox-group>

                        <el-button :disabled="!project || !project.fontfamily || contentLen <= 0" @click="GenerateHandle" size="large" type="success" style="width: 40%" icon="Position">输出</el-button>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
/*eslint-disable */
import ipc from "../utils/ipc.js";
import SetFont from "../components/SetFont.vue";
import Project from "../components/project.vue";
import Content from "../components/content.vue";
import { useGlobalStore } from "@/stores/globalStore";
export default {
    name: "home",
    components: {
        SetFont,
        Project,
        Content,
    },
    data() {
        return {
            loading: false,
            project: null,
            family: "",
            contentLen: 0,
            destPath: "./",
            types: [],
        };
    },
    watch: {
        types: {
            deep: true,
            handler: function () {
                this.TypesChangedHandler();
            },
        },
    },
    setup() {
        var store = useGlobalStore();
        return { store };
    },
    mounted() {
        this.$ipc.on(ipc.SetFont, this.SetFont);
        this.$ipc.on(ipc.GenerateFont, this.GenerateFontCallback);
        this.$ipc.on(ipc.EditTypes, this.EditTypes);
        this.$ipc.on(ipc.GetBaseDir, this.GetBaseDir);
        this.$ipc.send(ipc.GetBaseDir);
    },
    methods: {
        GetBaseDir(e, dir) {
            this.store.SetBaseDir(dir);
        },
        TypesChangedHandler() {
            this.$ipc.send(ipc.EditTypes, this.project.id, JSON.stringify(this.types));
        },
        EditTypes(e, res) {
            this.project.types = res.EditTypes;
        },
        SetFont(e, data) {
            // console.log(e, data);
            this.$ipc.send(ipc.GetContent, data.id);
            this.$ipc.send(ipc.ListProject);
        },
        ProjectChangeHandle(project) {
            this.project = project;
            if (project) this.types = JSON.parse(project.types);
        },

        ContentChangeHandle(v) {
            this.contentLen = v.length;
        },
        async GenerateHandle() {
            this.loading = true;
            this.$ipc.send(ipc.GenerateFont, this.project.id);
        },
        GenerateFontCallback() {
            this.loading = false;
            this.$message.success(`成功输出到：${this.project.output}`);
        },
    },
};
</script>
<style scoped>
.main {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
}
.header {
    height: 50px;
    background: #0a0a0a;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    -webkit-app-region: drag;
}
.header b {
    margin: 0 15px;
    display: flex;
    align-items: center;
}
.header b img {
    margin-right: 5px;
}
.body {
    flex: 1;
    overflow: hidden;
    display: flex;
}
.project {
    width: 400px;
    height: 100%;
    flex-shrink: 0;
}
.wrap {
    flex: 1;
    margin: 10px;
    display: flex;
    flex-direction: column;
}
.input-body {
    flex: 1;
    overflow: hidden;
    /* margin: 10px 0; */
    background: #0a0a0a;
}
.output {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
