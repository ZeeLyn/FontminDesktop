module.exports = {
    parallel: false,
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                appId: "com.cilent.app.fontmin.desktop",
                productName: "FontminDesktop",
                asar: true,
                directories: {
                    output: "./dist_electron",
                },
                win: {
                    icon: "./public/logo.png",
                },
                mac: {
                    icon: "./public/logo.png",
                },
                linux: {
                    icon: "./public/logo.png",
                },
                nsis: {
                    oneClick: false,
                    guid: "78350E37-7019-4BEA-9938-7155D3B382A1",
                    perMachine: true,
                    allowElevation: true,
                    allowToChangeInstallationDirectory: true,
                    installerIcon: "./public/logo.ico",
                    uninstallerIcon: "./public/logo.ico",
                    installerHeaderIcon: "./public/logo.ico",
                    createDesktopShortcut: true,
                    createStartMenuShortcut: true,
                    shortcutName: "Fontmin Desktop",
                },
            },
        },
    },
    configureWebpack: {
        // plugins: [],
        // exclude: ["*.wasm"],
    },
};
