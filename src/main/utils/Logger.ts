class Logger {
    protected generateMes(mes: string) {
        return `[${new Date()}] ${mes}`;
    }

    log(mes: string) {
        console.log(this.generateMes(mes));
    }

    logError(mes: string) {
        console.log(this.generateMes("错误:" + mes));
    }

    error(mes: string) {
        throw new Error(this.generateMes(mes));
    }
}

export default new Logger();
