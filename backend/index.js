const express = require("express");
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const session = require("express-session");
const { ThirdwebSDK } = require("@thirdweb-dev/sdk");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Use session to keep track of login state
app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/github/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            profile.accessToken = accessToken;
            return done(null, profile);
        }
    )
);
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

const createIssue = async (githubUsername) => {
    const issueTitle = "Got some ETH for you!";
    const issueBody = `Hello @${githubUsername}. Someone Gifted you some ETH claim at http://localhost:5173/claim `;

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

    const sdk = new ThirdwebSDK("goerli", {
        secretKey: process.env.YOUR_SECRET_KEY,
    });

    const contract = await sdk.getContract("0x08D20b6672D7C6B35A912B27B898F939530bBDE2");

    contract.events.listenToAllEvents(async (event) => {
        console.log(event.eventName); // the name of the emitted event
        if (event.eventName === "DonatedETH") {
            console.log(event.data);
            const githubUserIdString = event.data.githubUserId.toString();
            console.log(githubUserIdString);
            const githubUsername = await getUsernameFromID(githubUserIdString);
            console.log(githubUsername);
            await createIssue(githubUsername);
        }
    });
};

app.get("/auth/github", passport.authenticate("github"));

app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/" }),
    (req, res) => {
        // Redirect to the frontend with the access token as a query parameter
        res.redirect(`http://localhost:5173/success?token=${req.user.accessToken}`);
    }
);

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
    fn();
});
