'use strict';

class CommonError extends Error {
    constructor(message, error) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor.name);
        if (error instanceof Error) {
            this.parent = error;
        }

        this.expandParent();
    }

    expandParent() {
        const parentStack = [];

        if (this.parent instanceof Error) {
            parentStack.push({
                name: this.parent.name,
                message: this.parent.message,
                stack: this.parent.stack
            });

            if (Array.isArray(this.parent.details)) {
                this.parent.details.forEach(detail => {
                    this.message += ` ${detail.message}`;
                });
            }
        }

        if (this.parent instanceof CommonError) {
            parentStack.concat(this.parent.expandParent());
        }

        this.parents = parentStack;

        return parentStack;
    }
}

module.exports = {
    CommonError
};
