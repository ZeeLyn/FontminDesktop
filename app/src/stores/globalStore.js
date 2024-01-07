import { defineStore } from "pinia";
export const globalStore = defineStore("globalStore", {
    state: () => ({
        staticHost: process.env.VUE_APP_STATIC_HOST,
        ckeditorUploadUrl: `${process.env.VUE_APP_API_BASE_URL}/api/v1/oss/ckeditor`,
        initCheck: false,
        version: "",
        user: {
            agent: 0,
            name: "",
            role: "",
            permissions: [],
        },
        NoticeCheckInterval: 0,
        notification: {
            qa: 0,
            notice: 0,
            task: 0,
            task_plan: 0,
            suggest: 0,
            maintain: 0,
            office_supplies: 0,
            assets_scrap: 0,
            rectify: 0,
        },
        setting: {
            alwaysOnTop: localStorage.getItem("AlwaysOnTop") == "" || localStorage.getItem("AlwaysOnTop") == null || localStorage.getItem("AlwaysOnTop") == undefined || localStorage.getItem("AlwaysOnTop") === "false" ? false : true,
            openAtLogin: localStorage.getItem("OpenAtLogin") === "true" ? true : false,
        },
        uploadAccept: ".jpg,.jpeg,.png,.mp4,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf",
    }),
    actions: {
        setInitCheck() {
            this.initCheck = true;
        },
        setVersion(v) {
            this.version = v;
        },
        setNoticeCheckInterval(val) {
            this.NoticeCheckInterval = val;
        },

        setUser(name, role, permissions, agent) {
            this.user.name = name;
            this.user.role = role;
            this.user.permissions = permissions;
            this.user.agent = agent;
        },
        reduceNoticeCount() {
            this.notification.notice--;
        },
        reduceQa() {
            this.notification.qa--;
        },
        reduceTask() {
            if (this.notification.task <= 0) return;
            this.notification.task--;
        },
        reduceMaintain() {
            this.notification.maintain--;
        },
        reduceOfficeSupplies() {
            this.notification.office_supplies--;
        },
        reduceAssetsScrap() {
            this.notification.assets_scrap--;
        },
        reduceSuggest() {
            this.notification.suggest--;
        },
        reduceRectify() {
            this.notification.rectify--;
        },
    },
});
