export default class Time {

    static async wait(ms: number) {

        return new Promise<void>(resolve => {
            setTimeout(resolve, ms)
        });

    }

}