
export default interface ILifetimedElement {

    lifespan: number;
    lifespanTimeout: NodeJS.Timeout;

    destroy(): void;

}
