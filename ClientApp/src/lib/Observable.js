/**
 * Observable class with data and subscribe method
 * @author Sanna Jammeh
 */

export class Observable {
    constructor(data) {
        this.data = data;
        this.subscribers = [];
    }

    subscribe(subscriber) {
        subscriber(this.data);
        this.subscribers.push(subscriber);
        return () => {
            this.subscribers = this.subscribers.filter((s) => s !== subscriber);
        };
    }

    notify() {
        this.subscribers.forEach((subscriber) => subscriber(this.data));
    }

    /**
     * "when" function to subscribe to the value, execute the callback when predicate is true;
     */
    on(callbackPredicate, callback) {
        return this.subscribe((data) => {
            if (callbackPredicate(data)) {
                callback?.(data);
            }
        });
    }

    /**
     * Promise that resolves when the predicate is true
     */
    once(callbackPredicate, callback) {
        return new Promise((resolve) => {
            const unsubscribe = this.on(callbackPredicate, (data) => {
                callback?.(data);
                unsubscribe();
                resolve(data);
            });
        });
    }

    set(dataOrFunction) {
        if (typeof dataOrFunction === "function") {
            this.data = dataOrFunction(this.data);
        } else {
            this.data = dataOrFunction;
        }
        this.notify();
    }

    get value() {
        return this.data;
    }

    get() {
        return this.data;
    }
}
