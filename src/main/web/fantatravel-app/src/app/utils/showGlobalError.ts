// utils/showGlobalError.ts

let handler: ((msg: string) => void) | null = null;

/**
 * Da chiamare nel contesto React per registrare il gestore globale.
 */
export function registerGlobalErrorHandler(fn: (msg: string) => void) {
    handler = fn;
}

/**
 * Da usare fuori da React (es. Axios) per mostrare un errore.
 */
export function showGlobalError(msg: string) {
    if (handler) {
        handler(msg);
    } else {
        console.warn('No global error handler registered');
    }
}
