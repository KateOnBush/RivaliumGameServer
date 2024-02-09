export enum LoggerColor {
    yellow = "\x1b[33m",
    red = "\x1b[31m",
    bright_red = "\x1b[91m",
    bright_white = "\x1b[97m",
    blue = "\x1b[34m",
    green = "\x1b[32m",
    magenta = "\x1b[35m",
    reset = "\x1b[0m",
    gray = "\x1b[90m"
}

enum LOG {

    NONE = 0b0000,

    REDUNDANT = 0b00001,
    ERRORS = 0b00010,
    INFO = 0b00100,
    SUCCESS = 0b01000,
    IMPORTANT = 0b10000,


    NORMAL = IMPORTANT | ERRORS | INFO | SUCCESS,
    INFORMATIVE = IMPORTANT | ERRORS | SUCCESS,
    MINIMAL = IMPORTANT | ERRORS,
    ALL = 0b11111,

}

export default class Logger {

    static LOG = LOG;
    static state: LOG = LOG.ALL;

    static setDebugMode(mode: LOG) {
        this.state = mode;
    }

    private static test(test: number) {
        return (this.state & test) == test;
    }

    static time(){
        return LoggerColor.gray + "["+new Date().toUTCString()+"] ";
    }

    static log(message: string, ...args: any[]){
        if (!this.test(LOG.REDUNDANT)) return;
        this.call(message, LoggerColor.reset, ...args);
    }

    static info(message: string, ...args: any[]){
        if (!this.test(LOG.INFO)) return;
        this.call(message, LoggerColor.blue, ...args);
    }

    static success(message: string, ...args: any[]){
        if (!this.test(LOG.SUCCESS)) return;
        this.call(message, LoggerColor.green, ...args);
    }

    static error(message: string, ...args: any[]){
        if (!this.test(LOG.ERRORS)) return;
        this.call(message, LoggerColor.red, ...args);
    }

    static warn(message: string, ...args: any[]){
        if (!this.test(LOG.INFO)) return;
        this.call(message, LoggerColor.yellow, ...args);
    }

    static fatal(message: string, ...args: any[]){
        if (!this.test(LOG.IMPORTANT)) return;
        this.call(message, LoggerColor.bright_red, ...args);
    }

    static important(message: string, ...args: any[]) {
        if (!this.test(LOG.IMPORTANT)) return;
        this.call(message, LoggerColor.magenta, ...args);
    }

    static call(message: string, color: LoggerColor, ...args: any[]){
        let str = color + message + LoggerColor.reset;
        args.forEach(e=>{
            str = str.replace("{}", LoggerColor.bright_white + e + color);
        });
        args.forEach((e, i)=>{
            str = str.replace("{" + i + "}", LoggerColor.bright_white + e + color);
        });
        str = str.replace(/(\r\n|\n|\r)/gm, "\n" + this.time() + color);
        console.log(this.time() + str);
    }

    static clearLine() {
        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine(1);
    }

    static clear() {
        console.clear();
    }

}

Logger.setDebugMode(Logger.LOG.ALL);