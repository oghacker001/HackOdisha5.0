
# Benevo

Benevo is a crowdfunding platform that allows users to donate to verified campaigns, earn badges, and compete on a leaderboard. Campaign organizers can manage their campaigns efficiently, while users get a seamless experience for contributing to causes they care about.

<img src="image.png" width="100%">

## Table of Contents
- [Features](#features)

- [Tech Stack](#tech-stack)

- [Usage](#usage)

- [Donation Flow](#donation-flow)


## Features
- **Verified Campaigns** – Each campaign goes through a verification process before being listed.

- **Donation System** – Users can donate via UPI or Card payments.

- **Badges & Leaderboard** – Donors earn badges based on contribution; top donors appear on a leaderboard.

- **User Dashboard** – Personalized dashboard showing donation history, badges, and ranking.

- **Admin Panel** – For campaign verification, leaderboard management, and system analytics.

- **Organizer Panel** – Creates and handles the organization of campaigns, provide documents for verification and manages the donations.
## Tech Stack

| Category | Technology|
| :-------- | :------- |
| `Front End` | React.js(Web) and Tailwind CSS |
| `Back End ` | Node.js + Express.js|
| `Database` | MongoDB|
| `Version Control` | Git and GitHub|
| `Notifications` | Nodemailer|


## Usage

- **User Dashboard** 
    - View your donation history with details of each contribution (amount, campaign, date).
    - Track badges and points earned through donations.
    - Monitor your leaderboard ranking among all donors.
    - Access your profile settings to manage personal information, payment methods, and notifications.

- **Make a Donation** 
    - Browse and search for verified campaigns by category or popularity.
    - View detailed campaign information: goal, current progress, organizer details, and description.
    - Contribute securely via UPI, credit/debit card, or other integrated payment gateways.
    - Receive confirmation notifications via email, SMS, or in-app alerts.

- **Organizer Panel**
    - Create and submit campaigns for verification.
    - Upload necessary documents for approval.
    - Track donations received for each campaign.
    - Receive notifications about campaign status and donor contributions.


- **Admin Panel** 
    - Approve or reject new campaigns after verifying authenticity.
    - Manage and verify donations to ensure transparency.
    - Maintain and update the leaderboard, badges, and donor statistics.
    - Access analytics and reports to monitor platform activity and growth.

## Donation Flow


``` 
DONOR CLIENT → KONG → AUTH → USER 
                ↓ 
        Select campaign & donate 
                ↓ 
        DONATION SERVICE (create donation record) 
                │ 
                ├── REST → PAYMENT SERVICE (process payment) 
                │ 
                └── REST → CAMPAIGN SERVICE (update funds raised for organizer) 
                ↓ 
        NOTIFICATION SERVICE → Donor & Organizer (confirmation) 
                ↓ 
        RESPONSE → DONOR CLIENT (donation success) 
        RESPONSE → ORGANIZER CLIENT (campaign updated)
```

