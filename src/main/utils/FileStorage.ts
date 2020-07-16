import fs from "fs";
import { LocalPath } from "./constants";

class FileStorage {
    private baseDir = "public";

    constructor() {
        if (!fs.existsSync(this.baseDir)) {
            fs.mkdirSync(this.baseDir);
            for (const key in LocalPath) {
                fs.mkdirSync(this.baseDir + (LocalPath as any)[key]);
            }
        }
    }

    createSrcFile(name: string, content: string) {
        let path = LocalPath.novelSrc + "/" + name;
        return this.createFile(path, content);
    }

    createHtmlFolder(name: string, isPreview: boolean) {
        let folder = isPreview
            ? LocalPath.novelPreview
            : LocalPath.novelHtml + "/" + name;
        return this.createFolder(this.baseDir + folder);
    }

    createHtmlFile(path: string, name: string, content: string) {
        return this.createFile(path + "/" + name + ".html", content);
    }

    createFile(path: string, content: string) {
        fs.writeFileSync(this.baseDir + path, content);
        return path;
    }

    createFolder(path: string) {
        if (!fs.existsSync(path)) fs.mkdirSync(path);
        return path;
    }
}

export default new FileStorage();
