/*eslint-disable */
import ipc from "./ipc";
import { ipcMain, dialog, app } from "electron";
import { Execute, Query } from "./database";
import fs from "fs";
import path from "path";
import fontCarrier from "../font-carrier/index.js";
const tempDir = path.dirname(app.getPath("userData"));
export default (_window) => {
    var window = _window;
    ipcMain.on(ipc.GetBaseDir, (evt) => {
        window.webContents.send(ipc.GetBaseDir, tempDir);
    });
    ipcMain.on(ipc.GenerateFont, (evt, id) => {
        var contentFile = path.join(tempDir, "FontminDesktop", id.toString(), "content.txt");
        Query('select fontfamily,fontfile,output,types from "project" where id=?;', [id]).then((rows) => {
            fs.readFile(contentFile, { encoding: "utf-8" }, (err, data) => {
                if (err) {
                    console(err);
                    return;
                }
                var types = JSON.parse(rows[0].types);
                var transFont = fontCarrier.transfer(rows[0].fontfile);
                // 会自动根据当前的输入的文字过滤精简字体
                transFont.min(data.toString());
                transFont.output({
                    path: path.join(rows[0].output, rows[0].fontfamily),
                    types: types,
                });
                window.webContents.send(ipc.GenerateFont, {});
            });
        });
    });
    ipcMain.on(ipc.CreateProject, (evt, title, output) => {
        Execute('insert into "project"(title,output,types) values(?,?,?);', [title, output, '["eot","svg","ttf","woff","woff2"]'])
            .then((id) => {
                try {
                    var folder = path.join(tempDir, "FontminDesktop", id.toString());
                    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
                } catch (err) {
                    console.error(err);
                }
                window.webContents.send(ipc.CreateProject, { success: true });
            })
            .catch((err) => {
                window.webContents.send(ipc.CreateProject, { success: false, error: err });
            });
    });
    ipcMain.on(ipc.EditProject, (evt, id, title, output) => {
        Execute('update "project" set title=?,output=? where id=?;', [title, output, id])
            .then(() => {
                window.webContents.send(ipc.EditProject, { success: true });
            })
            .catch((err) => {
                window.webContents.send(ipc.EditProject, { success: false, error: err });
            });
    });
    ipcMain.on(ipc.EditFontFamily, (evt, id, fontfamily) => {
        Execute('update "project" set fontfamily=? where id=?;', [fontfamily, id])
            .then(() => {
                window.webContents.send(ipc.EditFontFamily, { success: true, fontfamily: fontfamily });
            })
            .catch((err) => {
                window.webContents.send(ipc.EditFontFamily, { success: false, error: err });
            });
    });
    ipcMain.on(ipc.EditTypes, (evt, id, EditTypes) => {
        Execute('update "project" set types=? where id=?;', [EditTypes, id])
            .then(() => {
                window.webContents.send(ipc.EditTypes, { success: true, EditTypes: EditTypes });
            })
            .catch((err) => {
                window.webContents.send(ipc.EditTypes, { success: false, error: err });
            });
    });
    ipcMain.on(ipc.DeleteProject, (evt, id) => {
        Execute('delete from "project" where id=?;', [id])
            .then(() => {
                var folder = path.join(tempDir, "FontminDesktop", id.toString());
                if (fs.existsSync(folder)) fs.rmdirSync(folder, { recursive: true, force: true });
                window.webContents.send(ipc.DeleteProject, { success: true });
            })
            .catch((err) => {
                window.webContents.send(ipc.DeleteProject, { success: false, error: err });
            });
    });
    ipcMain.on(ipc.ListProject, () => {
        Query('select id,title,fontfamily,fontfile,output,types from "project" order by id desc;')
            .then((rows) => {
                window.webContents.send(ipc.ListProject, {
                    success: true,
                    rows: rows,
                });
            })
            .catch((err) => {
                window.webContents.send(ipc.ListProject, {
                    success: false,
                    error: err,
                });
            });
    });
    ipcMain.on(ipc.SetFont, (evt, id, fontPath, name) => {
        var folder = path.join(tempDir, "FontminDesktop", id.toString(), "font");
        if (fs.existsSync(folder)) fs.rmSync(folder, { recursive: true, force: true });
        fs.mkdirSync(folder, { recursive: true });
        copyFile(fontPath, folder).then(() => {
            // writeHtmlFile(id, name);
            var copyUrl = path.join(tempDir, "FontminDesktop", id.toString(), "font", path.basename(fontPath));
            Query('update "project" set fontfamily=?,fontfile=? where id=?;', [name, copyUrl, id])
                .then((rows) => {
                    window.webContents.send(ipc.SetFont, {
                        success: true,
                        id: id,
                        rows: rows,
                        fontFile: copyUrl,
                    });
                })
                .catch((err) => {
                    window.webContents.send(ipc.SetFont, {
                        success: false,
                        id: id,
                        error: err,
                        fontFile: copyUrl,
                    });
                });
        });
    });
    ipcMain.on(ipc.GetContent, (evt, id) => {
        var contentFile = path.join(tempDir, "FontminDesktop", id.toString(), "content.txt");
        Query('select fontfamily,fontfile from "project" where id=?;', [id]).then((rows) => {
            if (!fs.existsSync(contentFile)) {
                window.webContents.send(ipc.GetContent, {
                    success: true,
                    content: "",
                    font: rows[0].fontfile,
                });
            } else {
                fs.readFile(contentFile, { encoding: "utf-8" }, (err, data) => {
                    if (err) {
                        console(err);
                        return;
                    }
                    window.webContents.send(ipc.GetContent, {
                        success: true,
                        content: data.toString(),
                        font: rows[0].fontfile,
                    });
                });
            }
        });
    });
    ipcMain.on(ipc.SetContent, (evt, id, content) => {
        var contentFile = path.join(tempDir, "FontminDesktop", id.toString(), "content.txt");
        fs.writeFileSync(contentFile, content, {
            encoding: "utf8",
        });
        Query('select fontfamily from "project" where id=?;', [id]).then((rows) => {
            // writeHtmlFile(id, rows[0].font);
        });
    });
    ipcMain.on(ipc.ChooseFolder, () => {
        dialog
            .showOpenDialog(window, {
                properties: ["openDirectory"],
            })
            .then((e) => {
                if (e.canceled) return;
                window.webContents.send(ipc.ChooseFolder, e.filePaths[0]);
            });
    });
};

// function writeHtmlFile(project, outputName) {
//     var chars = "";
//     var contentFile = path.join(path.dirname(app.getAppPath("exe")), "data", project.toString(), "content.txt");
//     if (fs.existsSync(contentFile)) {
//         chars = fs.readFileSync(contentFile, "utf-8");
//     }
//     const data = `<!DOCTYPE html>
//                     <html lang="en">
//                     <head>
//                         <meta charset="UTF-8">
//                         <meta http-equiv="X-UA-Compatible" content="IE=edge">
//                         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                         <title>Fontmin</title>
//                         <style>
//                         @font-face {
//                             font-family: "${outputName}";
//                             src: url('./fonts/${outputName}.ttf');
//                             font-weight: normal;
//                             font-style: normal;
//                         }

//                         /*使用指定字体*/
//                         body {
//                             font-family: '${outputName}';
//                         }
//                         </style>
//                     </head>
//                     <body>
//                     ${chars}
//                     </body>
//                     </html>`;
//     fs.writeFileSync(path.join(path.dirname(app.getAppPath("exe")), "data", project.toString(), "index.html"), data, {
//         encoding: "utf8",
//     });
// }
function copyFile(sourceFile, targetFolder) {
    return new Promise((resolve, reject) => {
        const extName = path.extname(sourceFile);
        const fileName = path.basename(sourceFile);
        // console.log(extName, fileName, targetFolder);
        fs.readFile(sourceFile, (err, data) => {
            fs.writeFile(path.join(targetFolder, fileName), data, (err) => {
                if (err) {
                    console.log(`复制文件出现错误： ${err.toString()}`);
                    reject(err);
                } else {
                    console.log("完成!");
                    resolve();
                }
            });
        });
    });
}
