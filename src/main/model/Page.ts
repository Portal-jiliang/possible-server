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
    position?: {
        x: number | string;
        y: number | string;
    };
    size?: {
        x: number | string;
        y: number | string;
    };
    padding?: number | string;
    textAlign: string;
    font?: string;
    border?: string;
    color?: string;
    background?: string;
    content?: string;
    children?: Component[];
    animation?: Animation;
    click?: {
        color?: string;
        background?: string;
    };
    jump?: string | undefined;
}
