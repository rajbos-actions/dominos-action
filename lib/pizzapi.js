"use strict";
// import api from 'dominos';
// import { PriceResponse } from '../types/PriceResponse';
// import { SuccessfulValidationResponse } from '../types/SuccessfulValidationResponse';
// import { OrderResponse } from '../types/OrderResponse';
// const { Address, Item, Customer, Order, Coupon } = api;
Object.defineProperty(exports, "__esModule", { value: true });
exports.place = exports.price = exports.validate = exports.standardOrder = void 0;
const standardOrder = (addressStr, email, phone, firstName, lastName) => {
    const store72ndMilitary = 6111;
    const store72ndJones = 6112;
    const address = new Address(addressStr);
    address.Type = 'Business';
    const customer = new Customer({
        address,
        firstName,
        lastName,
        email,
        phone
    });
    const order = new Order({
        customer: customer,
        storeID: store72ndJones,
        deliveryMethod: 'Delivery'
    });
    // const largeHawaiian = new Item({
    //   code: '14SCREEN',
    //   options: ['N', 'H'],
    //   quantity: 1
    // });
    // Large ham
    order.addItem(new Item({
        code: '14SCREEN',
        options: ['H'],
        quantity: 1
    }));
    return order;
};
exports.standardOrder = standardOrder;
const discount = (code) => {
    return new Coupon({ code });
};
const validate = order => {
    return new Promise(res => {
        order.validate(response => {
            res(response);
        });
    });
};
exports.validate = validate;
const price = order => {
    return new Promise(res => {
        order.price(response => {
            res(response);
        });
    });
};
exports.price = price;
const place = (order, ccNumber, expiration, cvvCode, zip, active = false) => {
    const payment = new order.PaymentObject();
    const cardNumber = ccNumber;
    payment.Amount = order.Amounts.Customer;
    payment.Number = cardNumber;
    payment.CardType = order.validateCC(cardNumber);
    payment.Expiration = expiration;
    payment.SecurityCode = cvvCode;
    payment.PostalCode = zip;
    order.Payments.push(payment);
    if (!active) {
        console.log('not active');
        return Promise.resolve(order);
    }
    return new Promise(res => {
        order.place((response) => {
            res(response);
        });
    });
};
exports.place = place;
