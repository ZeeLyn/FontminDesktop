<template>
    <el-input type="textarea" class="content" v-model="content" resize="none" :input-style="`height:100%; font-size:16px; font-family:'local-font-family';`" show-word-limit maxlength="10000" />
    {{ font }}
</template>
<script>
import ipc from "../utils/ipc.js";
export default {
    name: "content-view",
    props: {
        project: {
            type: Number,
        },
    },
    emits: ["change"],
    data() {
        return { content: "", font: "" };
    },
    watch: {
        project: function (v) {
            this.$ipc.send(ipc.GetContent, v);
        },
        content: function (v) {
            this.$ipc.send(ipc.SetContent, this.project, v);
            this.$emit("change", v);
        },
    },
    mounted() {
        this.$ipc.on(ipc.GetContent, this.GetContent);
        this.$ipc.send(ipc.GetContent, this.project);
    },
    methods: {
        filePathToBlob(filePath) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                // 设置跨域请求头（如果需要）
                if (typeof window !== "undefined" && typeof document !== "undefined") {
                    xhr.open("GET", filePath);

                    // 添加额外的请求头信息（如果有必要）
                    xhr.setRequestHeader("Content-Type", "application/octet-stream");
                    xhr.responseType = "arraybuffer";

                    xhr.onload = function () {
                        if (xhr.status === 200 || xhr.status === 304) {
                            resolve(new Blob([xhr.response], { type: "application/octet-stream" }));
                        } else {
                            reject(`Error ${xhr.status}: ${xhr.statusText}`);
                        }
                    };

                    xhr.send();
                } else {
                    reject("File path conversion to blob is not supported in this environment");
                }
            });
        },
        GetContent(evt, e) {
            // console.log(e);
            this.content = e.content;
            this.font = e.font;
            if (e.font) {
                this.filePathToBlob(this.font)
                    .then((blob) => {
                        const fileReader = new FileReader();
                        fileReader.onload = function () {
                            const result = fileReader.result;
                            // console.log(result);
                            const font = new FontFace("local-font-family", result);
                            document.fonts.add(font);
                            font.load();
                            font.loaded
                                .then(() => {})
                                .catch((err) => {
                                    console.log(err);
                                });
                        };
                        fileReader.readAsArrayBuffer(blob);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
            this.$emit("change", e.content);
        },
    },
};
</script>
<style scoped></style>
