import fs from "fs";
import { LocalPath } from "./constants";

class FileStorage {
    private baseDir = "public";

    init() {
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

    readSrcFile(name: string) {
        let path = LocalPath.novelSrc + "/" + name;
        return this.readFile(path);
    }

    createHtmlFolder(name: string, isPreview: boolean) {
        let folder =
            (isPreview ? LocalPath.novelPreview : LocalPath.novelHtml) +
            "/" +
            name;
        return this.createFolder(folder);
    }

    createHtmlFile(path: string, name: string, content: string) {
        return this.createFile(path + "/" + name + ".html", content);
    }

    createFile(path: string, content: string) {
        fs.writeFileSync(this.baseDir + path, content);
        return path;
    }

    readFile(path: string) {
        let realPath = this.baseDir + path;
        if (fs.existsSync(realPath)) return fs.readFileSync(realPath, "utf-8");
        else return undefined;
    }

    createFolder(path: string) {
        let realPath = this.baseDir + path;
        if (!fs.existsSync(realPath)) fs.mkdirSync(realPath);
        return path;
    }

    cleanPreviewFolder() {
        this.deleteFolder(LocalPath.novelPreview);
        this.createFolder(LocalPath.novelPreview);
    }

    deleteFolder(path: string) {
        fs.rmdirSync(this.baseDir + path, { recursive: true });
    }
}

export default new FileStorage();
