import { expose } from "threads";
import Story from "@/model/Story";

const transpiler = {
    transpile(story: Story) {
        // TODO return "Hello World " + story;
    },
};

export type Transpiler = typeof transpiler;

expose(transpiler);
