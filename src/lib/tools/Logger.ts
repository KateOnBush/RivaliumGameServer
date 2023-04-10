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

export default class Logger {

    static time(){
        return LoggerColor.gray + "["+new Date().toUTCString()+"] ";
    }

    static log(message: string, ...args: any[]){
        this.call(message, LoggerColor.reset, ...args);
    }

    static info(message: string, ...args: any[]){
        this.call(message, LoggerColor.blue, ...args);
    }

    static success(message: string, ...args: any[]){
        this.call(message, LoggerColor.green, ...args);
    }

    static error(message: string, ...args: any[]){
        this.call(message, LoggerColor.red, ...args);
    }

    static warn(message: string, ...args: any[]){
        this.call(message, LoggerColor.yellow, ...args);
    }

    static fatal(message: string, ...args: any[]){
        this.call(message, LoggerColor.bright_red, ...args);
    }

    static call(message: string, color: LoggerColor, ...args: any[]){
        let str = color + message + LoggerColor.reset;
        args.forEach(e=>{
            str = str.replace("{}", LoggerColor.bright_white + e + color);
        })
        console.log(this.time() + str);
    }

}