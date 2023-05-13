"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
const pizza = __importStar(require("./pizzapi"));
const getInputs = () => {
    const address = core.getInput('address', { required: true });
    const orderType = core.getInput('order-type') || 'Delivery';
    const email = core.getInput('email', { required: true });
    const phone = core.getInput('phone', { required: true });
    const firstName = core.getInput('first-name', { required: true });
    const lastName = core.getInput('last-name', { required: true });
    const cardNumber = core.getInput('card-number', { required: true });
    const expiration = core.getInput('expiration', { required: true });
    const securityCode = core.getInput('security-code', { required: true });
    const cardPostalCode = core.getInput('card-postal-code', { required: true });
    return {
        address,
        orderType,
        email,
        phone,
        firstName,
        lastName,
        cardNumber,
        expiration,
        securityCode,
        cardPostalCode
    };
};
async function run() {
    try {
        const token = core.getInput('github-token', { required: true });
        const inputs = getInputs();
        const active = core.getInput('active', { required: true }) === 'true';
        const github = new github_1.GitHub(token);
        const order = pizza.standardOrder(inputs.address, inputs.email, inputs.phone, inputs.firstName, inputs.lastName);
        const validated = await pizza.validate(order);
        console.log('Validated');
        console.log(JSON.stringify(validated));
        const priced = await pizza.price(order);
        console.log('Priced');
        console.log(JSON.stringify(priced));
        let placedInformation = {
            EstimatedWaitMinutes: ""
        };
        if (!active) {
            const placed = await pizza.place(order, inputs.cardNumber, inputs.expiration, inputs.securityCode, inputs.cardPostalCode, active);
            console.log('Placed!', active);
            console.log(JSON.stringify(placed));
            placedInformation.EstimatedWaitMinutes = placed.result.Order.EstimatedWaitMinutes;
        }
        if (!active) {
            console.log('In sandbox mode, hope it worked well!');
            //return;
        }
        const user = 'Rob'; // todo, load from context
        const issue = await github.issues.create({
            title: '🍕 time',
            body: `
      ![pizza-drone](https://media.giphy.com/media/HW8qVWQId1aY8/200w_d.gif)

      # Hi @${user}! A 🍕 is on its way to ${inputs.firstName} ${inputs.lastName}!

      My pizza algorithm says it should arrive in ${placedInformation.EstimatedWaitMinutes} minutes.

      ** Track the pizza: https://order.dominos.com/orderstorage/GetTrackerData?Phone=${inputs.phone} **

      Email receipt sent to ${inputs.email}.

      Please tip the driver appropriately.
      `,
            ...github_1.context.repo
        });
        console.log(issue.status);
        console.log(issue.data.id);
        console.log(JSON.stringify(issue.data));
        core.setOutput('time', new Date().toTimeString());
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
