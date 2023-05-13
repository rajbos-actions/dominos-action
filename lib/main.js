"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const octokit_1 = require("octokit");
//const pizza = require('./pizzapi');
const getInputs = () => {
    const address = core_1.default.getInput('address', { required: true });
    const orderType = core_1.default.getInput('order-type') || 'Delivery';
    const email = core_1.default.getInput('email', { required: true });
    const phone = core_1.default.getInput('phone', { required: true });
    const firstName = core_1.default.getInput('first-name', { required: true });
    const lastName = core_1.default.getInput('last-name', { required: true });
    const cardNumber = core_1.default.getInput('card-number', { required: true });
    const expiration = core_1.default.getInput('expiration', { required: true });
    const securityCode = core_1.default.getInput('security-code', { required: true });
    const cardPostalCode = core_1.default.getInput('card-postal-code', { required: true });
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
        const token = core_1.default.getInput('github-token', { required: true });
        const inputs = getInputs();
        const active = core_1.default.getInput('active', { required: true }) === 'true';
        //const github = new GitHub(token);
        // const order = pizza.standardOrder(
        //   inputs.address,
        //   inputs.email,
        //   inputs.phone,
        //   inputs.firstName,
        //   inputs.lastName
        // );
        // const validated = await pizza.validate(order);
        // console.log('Validated');
        // console.log(JSON.stringify(validated));
        // const priced = await pizza.price(order);
        // console.log('Priced');
        // console.log(JSON.stringify(priced));
        let placedInformation = {
            EstimatedWaitMinutes: "10"
        };
        if (!active) {
            // const placed = await pizza.place(
            //   order,
            //   inputs.cardNumber,
            //   inputs.expiration,
            //   inputs.securityCode,
            //   inputs.cardPostalCode,
            //   active
            // );
            // console.log('Placed!', active);
            // console.log(JSON.stringify(placed));
            //placedInformation.EstimatedWaitMinutes = placed.result.Order.EstimatedWaitMinutes;
        }
        else {
            placedInformation.EstimatedWaitMinutes = "999";
        }
        if (!active) {
            console.log('In sandbox mode, hope it worked well!');
            //return;
        }
        //const user = 'Rob'; // todo, load from context    
        const octokit = new octokit_1.Octokit({ auth: token });
        const user = "rajbos";
        const repo = process.env.GITHUB_REPOSITORY.split('/')[1];
        const owner = process.env.GITHUB_REPOSITORY.split('/')[0];
        const issue = await octokit.rest.issues.create({
            //const issue = await github.issues.create({
            title: '🍕 time',
            body: `
      ![pizza-drone](https://media.giphy.com/media/HW8qVWQId1aY8/200w_d.gif)

      # Hi @${user}! A 🍕 is on its way to ${inputs.firstName} ${inputs.lastName}!

      My pizza algorithm says it should arrive in ${placedInformation.EstimatedWaitMinutes} minutes.

      ** Track the pizza: https://order.dominos.com/orderstorage/GetTrackerData?Phone=${inputs.phone} **

      Email receipt sent to ${inputs.email}.

      Please tip the driver appropriately.
      `,
            owner: owner,
            repo: repo
        });
        console.log(issue.status);
        console.log(issue.data.id);
        console.log(JSON.stringify(issue.data));
        core_1.default.setOutput('time', new Date().toTimeString());
    }
    catch (error) {
        core_1.default.setFailed(error.message);
    }
}
run();
