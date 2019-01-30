import "aurelia-event-aggregator";

type Newable<T> = new(...args: any[]) => T;

declare module "aurelia-event-aggregator" {
    interface EventAggregator {
        subscribe<T>(type: Newable<T>, callback: (event: T) => void | Promise<void>): any;
    }
}