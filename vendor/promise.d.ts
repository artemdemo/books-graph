interface __promise {
    then(
            callback: (error?:any, text?: any, xhr?: any) => void,
            context?: Object
        ): __promise;

    done(): void;
}

declare module promise {

    export function Promise();

    export function join( promises: __promise[] ): __promise;
    export function chain( funcPromises: ( error?:any, data?: any )=>__promise[] ): __promise;

    export function get(url: string, data?: Object, headers?: Object): __promise;
    export function get(url: string, data?: string, headers?: Object): __promise;
    export function post(url: string, data?: Object, headers?: Object): __promise;
    export function post(url: string, data?: string, headers?: Object): __promise;
    export function put(url: string, data?: Object, headers?: Object): __promise;
    export function put(url: string, data?: string, headers?: Object): __promise;
    export function del(url: string, data?: Object, headers?: Object): __promise;
    export function del(url: string, data?: string, headers?: Object): __promise;
}