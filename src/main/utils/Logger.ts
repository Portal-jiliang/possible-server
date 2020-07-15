class Logger {
    protected generateMes(mes: string) {
        return `[${new Date()}] ${mes}`;
    }

    log(mes: string) {
        console.log(this.generateMes(mes));
    }

    logError(mes: string) {
        console.log(this.generateMes("error:" + mes));
    }

    error(mes: string) {
        throw this.generateMes(mes);
    }
}

export default new Logger();
