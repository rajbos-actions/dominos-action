"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = void 0;
function wait(milliseconds) {
    return new Promise((resolve) => {
        if (isNaN(milliseconds)) {
            throw new Error('milleseconds not a number');
        }
        setTimeout(() => resolve("done!"), milliseconds);
    });
}
exports.wait = wait;
