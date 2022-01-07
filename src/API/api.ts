
import { API } from "aws-amplify";
const header = { "Content-Type": "application/json" }

export async function getMFIData(mfi) {
    // get the MFI info and welcome message then save the MFI data on the local storage
    return new Promise(function (responseValue, error) {
        API.get("auth", "/api/mfi", {
            headers: header,
            queryStringParameters: { name: mfi ? mfi : "roi" },
        }).then((response) => {
            localStorage.removeItem("mfiData");
            if (response) {
                localStorage.setItem("mfiData", JSON.stringify(response));
                responseValue(response)
            } else {
                error(false)
            }
        });
    })
}

//get loan stats
export async function getLoanInfo(userId) {
    return new Promise(function (responseValue, error) {
        API.get("auth", `/api/borrow/stats/?userId=${userId}`, {
            headers: header,
        }).then((response) => {
            if (response) {
                responseValue(response)
            } else {
                error(false)
            }
        });
    })
}

//get current user proposals
export async function getProposalsByUserAddress(address ,userId) {
    return new Promise(function (responseValue, error) {
        API.get("auth", "/api/borrow/proposalsByUserAddress",{
            headers: header,
            queryStringParameters: { address: address, userId: userId },
        }).then((response) => {
            if (response) {
                responseValue(response)
            } else {
                error(false)
            }
        });
    })
}


