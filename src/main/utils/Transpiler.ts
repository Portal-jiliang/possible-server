import Page, { Component } from "@/model/Page";
import Story from "@/model/Story";
import { expose } from "threads";
import { v4 } from "uuid";
import xmlbuilder from "xmlbuilder";
import FileStorage from "./FileStorage";

const entryFile = "index";

const transpiler = {
    async transpile(story: Story, isPreview: boolean = false) {
        story.src = FileStorage.createSrcFile(
            story.id + story.title + ".json",
            JSON.stringify(story.pages)
        );
        let path = isPreview ? v4() : story.id + story.title;
        let folder = FileStorage.createHtmlFolder(path, isPreview);
        transpiler.generateHtml(story, folder);
        story.viewURL = folder + "/" + entryFile + ".html";
        return story;
    },

    async generateHtml(story: Story, path: string) {
        for (const page of story.pages) {
            FileStorage.createHtmlFile(
                path,
                page.isFirst ? entryFile : page.title,
                await transpiler.generateOnePage(page)
            );
        }
    },

    async generateOnePage(page: Page) {
        let html = xmlbuilder.create("html");
        let style = html.ele("style");
        let root = html.ele("body", {
            style:
                transpiler.computeStyle(
                    "background",
                    page.background.startsWith("http")
                        ? `url(${page.background})`
                        : page.background
                ) + "margin:0px;padding:0px;background-size:cover;",
        });
        let i = 0;
        for (const component of page.components) {
            let classId = "c-" + i;
            let temp: typeof component.click = {};
            if (component.click) {
                for (const key in component.click) {
                    (temp as any)[key] = (component as any)[key];
                    (component as any)[key] = undefined;
                }
                style.text(
                    `.${classId} { transition:300ms;${transpiler.computeClickStyle(
                        temp
                    )} }`
                );
                style.text(
                    `.${classId}:active { ${transpiler.computeClickStyle(
                        component.click
                    )} }`
                );
            }
            root.ele(
                "div",
                {
                    class: classId,
                    style: `position:absolute;user-select:none;box-sizing:border-box;top:${
                        transpiler.numberToPx(component.position?.y) ?? 0
                    };left:${
                        transpiler.numberToPx(component.position?.x) ?? 0
                    };width:${
                        transpiler.numberToPx(component.size?.x) ??
                        "fit-content"
                    };height:${
                        transpiler.numberToPx(component.size?.y) ??
                        "fit-content"
                    };padding:${
                        transpiler.numberToPx(component.padding) ?? "0px"
                    };${transpiler.computeStyle(
                        "text-align",
                        component.textAlign
                    )}${transpiler.computeStyle(
                        "background",
                        component.background
                            ? component.background?.startsWith("http")
                                ? `url(${component.background})`
                                : component.background
                            : undefined
                    )}background-size:cover;${
                        transpiler.computeStyle("font-family", component.font) +
                        transpiler.computeStyle("color", component.color) +
                        transpiler.computeStyle(
                            "border",
                            component.border
                                ? component.border + " solid"
                                : undefined
                        )
                    }`,
                    onclick: component.jump
                        ? `window.location.href="${component.jump}.html"`
                        : undefined,
                },
                component.content
            );
            i++;
        }
        return root.end();
    },

    computeStyle(prop: string, value?: string) {
        return value ? `${prop}:${value};` : "";
    },

    computeClickStyle(click: Component["click"]) {
        return `${
            transpiler.computeStyle(
                "background",
                click?.background
                    ? click.background?.startsWith("http")
                        ? `url(${click.background})`
                        : click.background
                    : undefined
            ) + transpiler.computeStyle("color", click?.color)
        }`;
    },

    numberToPx(number?: number | string): string | undefined {
        if (typeof number == "number") return `${number}px`;
        return number;
    },
};

export type Transpiler = typeof transpiler;

expose(transpiler);
