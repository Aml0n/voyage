export class ContinueControllerManager {
    constructor() {
        this.currentController = null;
    }

    getController() {
        if (!this.currentController || this.currentController.signal.aborted) {
            this.currentController = new AbortController();
        }
        return this.currentController;
    }
    
    getSignal() {
        return this.getController().signal;
    }
    
    abort() {
        if (this.currentController) {
            this.currentController.abort();
        }
    }
    
    reset() {
        this.currentController = new AbortController();
        return this.currentController;
    }
};
