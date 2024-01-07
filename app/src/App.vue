<template>
    <!-- <transition name="el-zoom-in-top"> -->
    <router-view v-slot="{ Component }">
        <component :is="Component" :key="$route.fullPath" />
    </router-view>
    <!-- </transition> -->
    <!-- 
    <el-drawer v-model="showNotification" title="消息中心" direction="rtl" append-to-body :size="350" destroy-on-close>
        <span>Hi, there!</span>
    </el-drawer> -->
</template>
<script>
export default {
    data() {
        return {};
    },
};
</script>
<style>
* {
    padding: 0;
    margin: 0;
}
.el-card {
    --el-card-padding: 10px !important;
}

html,
body {
    min-height: 100vh;
    width: 100%;
    font-size: 14px;
}

body {
    box-shadow: var(--el-box-shadow-light);
}

a {
    color: var(--el-color-primary);
}

#app {
    font-family: "Microsoft YaHei", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "微软雅黑", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #333;
    min-height: 100vh;
}
</style>
