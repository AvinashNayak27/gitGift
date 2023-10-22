# GitGift 🎁

Welcome to GitGift, where we celebrate and support the hard work of open-source contributors on GitHub!

## What is GitGift? 🤔

GitGift is a unique platform that allows you to donate to your favorite open-source developers on GitHub. With just a few clicks, you can send a token of appreciation using Polygon Matic or Mock Ape coin. The best part? The recipient gets notified instantly on GitHub and can claim their gift without any fees!

## Why GitGift? 🌟

- **Celebrate Open Source**: Show your appreciation for the developers who make your favorite tools and projects possible.
- **Instant Gratification**: As soon as you make a donation, the recipient gets a notification on GitHub.
- **No Hidden Fees**: Thanks to our innovative technology, recipients can claim their gifts without any deductions.
- **Trustworthy**: We ensure that only the rightful owner of the GitHub account can claim the donation.

## How It Works 🛠️

1. **Choose a GitHub User**: As of now the UI supports choosing your followers
2. **Select Amount & Coin**: Decide how much you want to donate and whether you want to use Polygon Matic or Mock Ape coin.
3. **Send Your Gift**: With a click, your donation is on its way! The recipient will get a notification on GitHub and an Email from github notifications.
4. **Recipient Claims**: The recipient can easily claim their donation after verifying their GitHub account using Sismo Connect.

## UX Optimization Strategies 🚀

At GitGift, we prioritize user experience. Here's a breakdown of the strategies we've employed to ensure a seamless interaction with our platform:

### 1. Gasless Transactions 🌬️

One of the major pain points in the crypto world is the gas fees. We've eliminated this barrier by implementing ERC-4337 smart contract wallets using thirdweb, ensuring that the full value of the donation reaches the recipient.

**Implementation**: Check out our [account abstraction code here](https://github.com/AvinashNayak27/gitGift/commit/a9faffe7406186cd4155f4c45e3e70e200486a51) for a deep dive into how we've achieved gasless transactions.

### 2. Integrated Notifications 📬

By creating GitHub issues for donations, we tap into the existing notification system of GitHub. This ensures that recipients are promptly informed without the need for additional infrastructure.

**Implementation**: Our [integrated notification system can be found here](https://github.com/AvinashNayak27/gitGift/commit/6e1f2540189094f9e8f554c256ffda776f68404a).

### 3. Sismo Connect Integration 🔐

To ensure only legitimate recipients can claim donations, we've integrated Sismo Connect. This tool allows recipients to prove their GitHub account ownership in a privacy-preserving manner, adding an additional layer of security to the donation process.

**Implementation**: Our [sismo connect verify and claim code can be found here ](https://github.com/AvinashNayak27/gitGift/commit/c32d578fdedfbf9badd7291e0583c0d745fe503e)


## FAQs ❓

**Q**: Are there any fees involved?  
**A**: No, GitGift ensures that recipients can claim their donations without any fees.

**Q**: How does the recipient know they've received a donation?  
**A**: As soon as a donation is made, a GitHub issue is created notifying the recipient.and githun also notifies the recipient through the mail
