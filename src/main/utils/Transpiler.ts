import Story from "@/model/Story";
import { expose } from "threads";
import FileStorage from "./FileStorage";
import Page, { Component } from "@/model/Page";
import xmlbuilder from "xmlbuilder";

const entryFile = "index";

const transpiler = {
    async transpile(story: Story, isPreview: boolean = false) {
        story.src = FileStorage.createSrcFile(
            story.id + story.title + ".json",
            JSON.stringify(story.pages)
        );
        let folder = FileStorage.createHtmlFolder(
            story.id + story.title,
            isPreview
        );
        transpiler.generateHtml(story, folder);
        story.viewURL = folder + "/" + entryFile;
        return story;
    },

    generateHtml(story: Story, path: string) {
        for (const page of story.pages) {
            transpiler.generateOnePage(page, path);
        }
    },

    generateOnePage(page: Page, path: string) {
        var root = xmlbuilder.create("html").ele("body", {
            style: this.computeBackgroundStyle(page) + "margin:0px;padding:0px",
        });
        for (const component of page.components) {
            root.ele("img", this.computeStyle(component));
        }
        FileStorage.createHtmlFile(
            path,
            page.isFirst ? entryFile : page.title,
            root.end()
        );
    },

    computeStyle(component: Component) {
        let attr: { style: string; src?: string } = { style: "" };
        for (const key in component) {
            switch (key as keyof Component) {
                case "background":
                    attr.src = component.background;
                    break;
                case "position":
                    attr.style += `position:absolute;top:${component.position.y}px;left:${component.position.x}px;`;
                    break;
                default:
                    break;
            }
        }
        return attr;
    },

    computeBackgroundStyle(node: { background?: string }) {
        return node.background
            ? `background:url(${node.background});background-size:cover;`
            : undefined;
    },
};

export type Transpiler = typeof transpiler;

expose(transpiler);
