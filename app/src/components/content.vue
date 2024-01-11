<template>
    <el-input type="textarea" class="content" v-model="content" @input="InputContentHandler" resize="none" :input-style="`height:100%; font-size:16px; font-family:'local-font-family';`" show-word-limit maxlength="10000" />
</template>
<script>
import ipc from "../utils/ipc.js";
import fs from "fs";
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
    },
    mounted() {
        this.$ipc.on(ipc.GetContent, this.GetContent);
        this.$ipc.send(ipc.GetContent, this.project);
    },
    methods: {
        InputContentHandler() {
            this.$ipc.send(ipc.SetContent, this.project, this.content);
            this.$emit("change", this.content);
        },
        filePathToBlob(filePath) {
            return new Promise((resolve, reject) => {
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(new Blob([data]));
                    }
                });
            });
        },
        GetContent(evt, e) {
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
