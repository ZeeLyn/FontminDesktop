import { defineStore } from "pinia";
export const useGlobalStore = defineStore("globalStore", {
    state: () => ({
        baseDir: "",
    }),
    actions: {
        SetBaseDir(dir) {
            this.baseDir = dir;
        },
    },
});
