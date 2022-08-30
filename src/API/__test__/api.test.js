import React from "react";
import { getMFIData, getLoanInfo, getProposalsByUserAddress } from "API/api";
import config from "./../../aws-exports";
import Amplify from "aws-amplify";
Amplify.configure({
    ...config,
    Analytics: {
        disabled: false,
    },
});
beforeAll(() => jest.setTimeout(90 * 1000))


describe('get mfi data using Promises', () => {
    jest.setTimeout(40000);
    test('the data is the mfi information', async () => {
        const data = await getMFIData('');
        expect(data).toBeDefined();
        expect(data).toEqual({
            id: 3,
            name: "ROI",
            website: "https://dlndao.org/#/",
            phone: "",
            email: "contact@dln.org",
            logo: "https://dln-publicbucket.s3.amazonaws.com/roi_logo.png",
            welcomeMessage: "COMMUNITY LENDING",
            slogan: "Get a 0% Interest Loan Today"
        });
    });
    test('fetch the loan information', async () => {
        const data = await getLoanInfo(3);
        expect(data).toBeDefined();
        expect(data).toEqual({
            success: true,
            data: {
                funded: {
                    count: 0,
                    amount: 0,
                    balance: 0
                },
                repaid: {
                    count: 0,
                    amount: 0,
                    balance: 0
                },
                paid: 0
            }
        })
    })
    test('fetch proposals by user address and id ', async () => {
        const data = await getProposalsByUserAddress("", 3);
        expect(data).toBeDefined();
        expect(data).toEqual({
            success: true,
            data: []
        })
    })
})

afterAll(() => jest.setTimeout(5 * 1000))