const express = require("express");
const { ThirdwebSDK } = require("@thirdweb-dev/sdk");
const axios = require("axios");
require("dotenv").config();

const {BaseGoerli}=require("@thirdweb-dev/chains");

const cors = require("cors");

const app = express();

app.use(cors());


async function getUsernameFromID(userID) {
    try {
        const response = await axios.get(`https://api.github.com/user/${userID}`, {
            headers: {
                Accept: "application/vnd.github.v3+json",
            },
        });

        return response.data.login;
    } catch (error) {
        console.error("Error fetching username:", error);
        return null;
    }
}

const createIssue = async (githubUsername,token) => {
    const issueTitle = `Got some ${token} for you!`;
    const issueBody = `Hello @${githubUsername}. Someone Gifted you some ${token} claim at https://gitgift.vercel.app/claim `;

    try {
        const response = await axios.post(
            `https://api.github.com/repos/AvinashNayak27/gitGift/issues`,
            {
                title: issueTitle,
                body: issueBody,
            },
            {
                headers: {
                    Authorization: `token ${process.env.GITHUB_PAT}`,
                },
            }
        );

        console.log("Issue created:", response.data.html_url);
    } catch (error) {
        console.error(error);
    }
};


const fn = async () => {

    const sdk = new ThirdwebSDK(BaseGoerli,{
        secretKey: process.env.YOUR_SECRET_KEY,
    });

    const contract = await sdk.getContract("0x9fE69604504f6089c64cB774D015890541F808de");

    contract.events.listenToAllEvents(async (event) => {
        console.log(event.eventName); // the name of the emitted event
        if (event.eventName === "DonatedETH") {
            console.log(event.data);
            const githubUserIdString = event.data.githubUserId.toString();
            console.log(githubUserIdString);
            const githubUsername = await getUsernameFromID(githubUserIdString);
            console.log(githubUsername);
            await createIssue(githubUsername,"ETH");
        }
        if (event.eventName === "DonatedERC20") {
            console.log(event.data);
            const githubUserIdString = event.data.githubUserId.toString();
            console.log(githubUserIdString);
            const githubUsername = await getUsernameFromID(githubUserIdString);
            console.log(githubUsername);
            await createIssue(githubUsername,"APE Coin");
        }

    });
};

app.get("/search/users/:prefix", async (req, res) => {
    const prefix = req.params.prefix;
    const perPage = 5; // Limit results to top 5

    try {
        const response = await axios.get(`https://api.github.com/search/users?q=${prefix}+in:login&type=Users`, {
            headers: {
                Authorization: `token ${process.env.GITHUB_PAT}`,
                Accept: "application/vnd.github.v3+json",
            },
            params: {
                per_page: perPage,
            },
        });

        // Send back only the items array from the response data
        res.json(response.data.items);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).send("Error fetching user data");
    }
});

app.get("/users/:userid", async (req, res) => {
    const userID = req.params.userid;

    try {
        const response = await axios.get(`https://api.github.com/user/${userID}`, {
            headers: {
                Authorization: `token ${process.env.GITHUB_PAT}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).send("Error fetching user data");
    }
}

);

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
    fn();
});
