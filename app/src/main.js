import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
const { ipcRenderer } = require("electron");
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import zh_Cn from "element-plus/es/locale/lang/zh-cn";
import "highlight.js/styles/github-dark.min.css";
import "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";
import { createPinia } from "pinia";
const app = createApp(App);
app.config.globalProperties.$ipc = ipcRenderer;
app.use(ElementPlus, {
    locale: zh_Cn,
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(hljsVuePlugin);
app.use(createPinia());
app.use(router).mount("#app");
