export default interface Page {
    title: string;
    background: string;
    components: Component[];
    isFirst: boolean;
}

enum ComponentType {
    text,
    list,
}

enum Animation {}

export interface Component {
    type: ComponentType;
    position: {
        x: number;
        y: number;
    };
    background: string;
    content?: string;
    children?: Component[];
    animation?: Animation;
    jump: string | undefined;
}