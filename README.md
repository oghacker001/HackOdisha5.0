
# Benevo

Benevo is a crowdfunding platform that allows users to donate to verified campaigns, earn badges, and compete on a leaderboard. Campaign organizers can manage their campaigns efficiently, while users get a seamless experience for contributing to causes they care about.

## Table of Contents
- [Features](#features)

- [Demo](#demo)

- [Tech Stack](#tech-stack)

- [Usage](#usage)

- [API Reference](#api-reference)

- [License](#license)


## Features
- **Verified Campaigns** – Each campaign goes through a verification process before being listed.

- **Donation System** – Users can donate via UPI or Card payments.

- **Badges & Leaderboard** – Donors earn badges based on contribution; top donors appear on a leaderboard.

- **User Dashboard** – Personalized dashboard showing donation history, badges, and ranking.

- **Admin Panel** – For campaign verification, leaderboard management, and system analytics.

- **Organizer Panel** – Creates and handles the organization of campaigns, provide documents for verification and manages the donations.
## Demo
Checkout the demo of our project-benevo  
www.benevo.com


## Tech Stack

- **Front End** : HTML, CSS, JavaScript
- **Back End** : Node.js, Express.js
- **Database** : MongoDB
- **Authentication** : JWT based login
- **Payment Gateway** : UPI and Card Integration
- **Version Control** : Git and GitHub




## Usage

- **User Dashboard** – View donation history, badges, and leaderboard ranking.

- **Make a Donation** – Navigate to a verified campaign and contribute using UPI or Card.

- **Leaderboard** – See top donors and badges earned.

- **Admin Panel** – Manage campaigns, verify donations, and maintain the leaderboard.

## API Reference

### Auth Routes 

#### Register User

```http
  POST /api/auth/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Full name of the user |
| `email` | `string` | **Required**. E-mail of the user |
| `password` | `string` | **Required**. Password for the account |

#### Login User

```http
  POST /api/auth/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. E-mail of the user |
| `password` | `string` | **Required**. Password for the account |

#### Logout User

```http
  POST /api/auth/logout
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Optional**. JWT token to logout |

#### Google OAuth Login

```http
  GET /api/auth/google
```
Redirects the user to Google login for authentication.

**Scope**: profile, email

#### Google OAuth Callback

```http
  GET /api/auth/google/callback
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `code` | `string` | **Optional**. Provided by Google OAuth |

### Campaign Routes 

#### Get All Campaigns
```http
  GET /api/campaign
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Optional**. JWT token for authentication |

#### Get Campaign by ID
```http
  GET /api/campaign/${id}
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Optional**. JWT token for authentication |
| `id` | `string` | **Optional**. Campaign ID to fetch |

#### Create Campaign
```http
  POST /api/campaign
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title` | `string` | **Required**. Campaign title |
| `description` | `string` | **Required**. Campaign description |
| `goal` | `number` | **Required**. Fundraiser Goal |
| `id` | `string` | **Required**. JWT token (must be Organizer/Admin) |

#### Update Campaign
```http
  PUT /api/campaign/${id}
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title` | `string` | **Optional**. Campaign title |
| `description` | `string` | **Optional**. Campaign description |
| `goal` | `number` | **Optional**. Fundraiser Goal |
| `id` | `string` | **Required**. Campaign ID to update |
| `token` | `string` | **Required**. JWT token for authentication |

#### Delete Campaign
```http
  DELETE /api/campaign/${id}
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Campaign ID to delete |
| `token` | `string` | **Required**. JWT token for authentication |

### LeaderBoard

#### Get Top Donors
```http
  GET /api/badge/top
```
**Description** - Fetches the top donors across all campaigns.

#### Get Leaderboard
```http
  GET /api/badge/leaderboard
```
**Description** - Returns the full leaderboard of users ranked by total donations.

#### Get User Rank by ID
```http
  GET /api/badge/rank/${userId}
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `string` | **Required**. ID of user |

#### Get my Rank
```http
  GET /api/badge/my-rank
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. JWT token for authentication |

### Donations Routes

#### Create Donations
```http
  POST /api/donations
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `campaignId` | `string` | **Required**. ID of campiagn to donate |
| `amount` | `number` | **Required**. Donation amount |
| `paymentMethod` | `string` | **Required**. card or upi |
| `token` | `string` | **Required**. JWT token for authentication |

#### Get User Donations
```http
  GET /api/donations
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. JWT token for authentication |

#### Get Donation Stats
```http
  GET /api/donations/stats
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. JWT token for authentication |

#### Delete Donation
```http
  DELETE /api/donations/${id}
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Donation ID to delete |
| `token` | `string` | **Required**. JWT token for authentication |

### User Profile Routes

#### Get My Profile
```http
  GET /api/users/user
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. JWT token for authentication |

#### Update My Profile
```http
  PUT /api/users/user
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Optional**. Updated full name |
| `email` | `string` | **Optional**. Updated email |
| `token` | `string` | **Required**. JWT token for authentication |

#### Update Profile Photo
```http
  POST /api/users/user/photo
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `profileImage` | `file` | **Required**. Image file to upload |
| `token` | `string` | **Required**. JWT token for authentication |

#### Get My Donations
```http
  GET /api/users/user/donations
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. JWT token for authentication |

#### Delete My Account
```http
  DELETE /api/users/user
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. JWT token for authentication |

#### Get User Profile Photo (Public)
```http
  GET /api/users/${id}/photo
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. UserID to fetch profile photo |

### Badge Routes

#### Get Top Donors
```http
  GET /api/badge/top
```
**Description**: Fetches the top donors across all campaigns.

#### Get Leaderboard
```http
  GET /api/badge/leaderboard
```
**Description**: Returns the full leaderboard of users ranked by total donations.

#### Get User Rank by ID
```http
  GET /api/badge/rank/${userId}
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `string` | **Required**. ID of the user |

#### Get My Rank
```http
  GET /api/badge/my-rank
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. JWT token for authentication |



