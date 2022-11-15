### Introduction

1. Welcome to DLN DAO

    Welcome to the official DLN DAO docs. This live document aims to familiarize the new and current users with DLN DAO, products, and services it governs.

2. What is DLNDAO?

    - DLNDAO is a decentralized autonomous organization created by the community for the community with a    mission to launch an open financial network that enables free 0% interest microloans backed by your social reputation.
    - Along with the efficiencies of Decentralized Finance, DLN adds a patent-pending, community-driven innovation: Social Staking.
    - In any conventional lending market, there is a borrower and a lender. What makes DLN so revolutionary is that there is also a third party: The Investor.
    - Investors are members of the borrower’s community. With DLN, the borrower asks community members for help collateralizing the loan. In supporting the borrower, that investor earns rewards.

3. Mission Statement

    Facilitate the wide adoption of open finance by coordinating and cultivating projects that promote safety, reliability, liquidity, and open access while avoiding centralized appropriation of critical financial infrastructure through decentralized governance.


### Important Links

1. Sign up:  https://start.dlndao.org/#/
2. Login: https://start.dlndao.org/#/
3. Login: User can open https://start.dlndao.org/#/ and then select an MFI form Header or can continue using ROI.

4. MFI admin page https://start.dlndao.org/#/App/MFIProposals 
(An admin account must be used to access this page).
5. Dev Note: Our public repo on git: ​​
        https://github.com/dlndao/start

### Important Definitions:
1. MFIs: Microfinance institutions (MFIs) are financial companies that provide small loans to people who do not have any access to banking facilities. The definition of “small loans” varies between countries.
2. DLN: The Decentralized Lending Network does not compete with existing Microfinance Institutions. DLN is not an MFI. It’s a technology, a new set of rails that will allow existing MFIs to scale. As such, our market is any and all of the 3,000+ MFIs around the world. Our goal with DLN is simple: Provide Microfinance Institutions with the freedom to scale, and meet the needs of the billions in need.
3. Borrower:
A borrower applies for a loan from DLN and asks social networks for help collateralizing the loan, then pays it back late under specific terms and conditions.
4. Backer/Investor: Friends, neighbors, and family chip in, offering up assets to collateralize the borrower’s loan.
5. Investors will get their money back in addition to 3% ROI when the borrower pays back and closes his loan.
6. Lender: With a borrower loan fully collateralized, the Lender’s funds are released risk-free to a borrower.
7. ROI: Return on investment.

### Who are the main users?
  We have 3 user roles:

1. Borrower 
    - The borrower requests a loan for a specific cause. 
    - The borrower can draft a proposal before publishing it for everyone to view. 
    - To obtain a loan, a number of people must back the borrower up.
    - Invitations can be sent to the borrower’s friends and family to support the published proposal.
    -  Communication between them all can be achieved through messaging. 
    - By backing up the borrower, DLN will accept the loan requested as a risk-free loan. 
    - Every month, the borrower will pay back the loan, with a 0% interest. 
    - Investors will earn a 3% interest.
    - The borrower can check the proposals at any stage. 
    - The borrower can check the loans (active / paid off). 
2. Investor
    - An investor backs up the borrower. 
    - The investor can choose any proposal to back up with any amount of money. 
    - The investor gains a 3% interest as a reward for backing a borrower up. 
    - Investors can view active proposals (proposals that still need backers), and proposals they have already backed up.
    - Investors can “ignore” any proposal they have no interest in. 
    - In a public chat room, the investor can message the borrower asking for more details concerning the loan. 
    - The investor can view all the messages in the public chat room. 
    - The investor can send an invitation to another investor so that more people can support the borrower. 

3. MFI
    - MFI will be responsible for Borrowers loans.
    - To be able to moderate their proposals, MFIs will have an admin account. 
    - The MFI can send its link to its users. 
    - Proposals created by users who accessed the MFI link will be uploaded on the MFI page and found under the “invest” tab. 
    - MFI can “approve” or “ignore” any proposal.
    - Proposals created on the default URL (ROI) will be visible to the MFI under the “invest” tab only. 
    - On the MFI’s start page, users will be able to view the MFI logo, slogan, and contact information. 


### Local setup

To run this project locally, follow these steps.

#### Clone the project locally, change into the directory, and install the dependencies:

```sh
git clone git@github.com:dlndao/start.git
cd start
```
 
 #### Install nodejs packages
```sh
$ npm install
or
$ yarn install
```

### Configuration
#### Initialize Amplify in React application
```sh
$ amplify init

* Accept defaults and provide values to those you wish to have as part of initializing amplify environment
```


#### Add Authetication capability
```
$ amplify add auth

* Choose option to configure manually and enter resouce name  and pool name
* Choose rest of the options as per authentication requirements
```

#### Start React application
```
$ npm start
or
$ yarn start
```
 Accessing `http://localhost:3000/` should show up default login screen provided by AWS Cognito
* Signup with your password, email and phone number
* Check your mobile for the verification code. If you haven't received, confirm the user manually from AWS Cognito console
* Login with the phone number and password
* should be routed to home page with logout button displayed in the header


### Creating your First Account
#### Sign up Steps For MFI Admins
- Dev Note: Start page ref: https://github.com/dlndao/start/blob/main/src/pages/start/index.tsx
- Dev Note: On the start page on the initial point we check the MFI name from the URL and get the MFI welcome message 
- This func is getting the MFI welcome message from our DB: https://github.com/dlndao/start/blob/main/src/pages/start/index.tsx#L35-L44
- Choose language func ref: https://github.com/dlndao/start/blob/main/src/pages/start/index.tsx#L46-L51
- We save the selected language on the local storage

 For any MFI users: https://start.dlndao.org/#/

1. Click on  “Get Started” Then Fill in the required data: (First name, Last name, Phone number, Email, Password, and Confirm Password).
   - Password Must be a minimum of 8 characters.
   - Phone number in international format.
   - Phone number and email mustn’t be used before with DLN.
2. Click on the checkbox beside “I have read and agree to the Terms of Service and Privacy Policy”. 
3. Click on “Create Profile”.
    - Register func reference: https://github.com/dlndao/start/blob/main/src/pages/UserManagement/register.tsx
    - Create profile button ref: https://github.com/dlndao/start/blob/main/src/pages/UserManagement/register.tsx#L42-L107
4. In the “Verify Code” space, enter the verification code received. 
    - Verify code button ref: https://github.com/dlndao/start/blob/main/src/pages/UserManagement/verifyCode.tsx#L41-L58
5. Click on “Verify”.  







6. Enter your phone number and password. 
   - Login page ref:https://github.com/dlndao/start/blob/main/src/pages/UserManagement/login.tsx
   - Login func ref: https://github.com/dlndao/start/blob/main/src/pages/UserManagement/login.tsx#L31-L92
7. Click on “Login”. 

8. Send us your credentials to assign you as an admin for your MFI account. 
You have now successfully created an account. 

#### Sign up Steps For Normal Users (Borrower & Investor)
 For any MFI’s Users (Borrower & Investor): https://start.dlndao.org/#/

1. Click on “Get Started”. 
    - Get  started page ref:  https://github.com/dlndao/start/blob/main/src/pages/start/index.tsx
2. Fill in the required data: (First name, Last name, Phone number, Email, Password, Confirm Password, and Bio).
3. Click on the checkbox beside “I have read and agree to the Terms of Service and Privacy Policy”. 
    - Password Must be a minimum of 8 characters.
    - Phone number in international format.
    - Phone number and email mustn’t be used before with DLN.

    - Register validation on user inputs func ref: https://github.com/dlndao/start/blob/main/src/pages/UserManagement/register.tsx#L127-L153
4. Click on “Create Profile”.
5. Create profile fun ref: https://github.com/dlndao/start/blob/main/src/pages/UserManagement/register.tsx#L42-L107
6. In the “Verify Code” space, enter the verification code received on your mobile. 
7. Click on “Verify”. 
    - Verify code func ref: https://github.com/dlndao/start/blob/main/src/pages/UserManagement/verifyCode.tsx#L41-L58

8. Enter your phone number and password. 
    - Login page ref: https://github.com/dlndao/start/blob/main/src/pages/UserManagement/login.tsx
9. Click on “Login”. 
    - Login func ref: https://github.com/dlndao/start/blob/main/src/pages/UserManagement/login.tsx#L31-L92
You have now successfully created an account. 
Users (Borrower & Investor) didn’t need to sign in every time browsers our app they will be logged in till they log out, we saved the users data on local storage.


### Create your first proposal
- Let’s start with Borrower Workflow
Welcome Aboard - Simple and easy steps towards your loan
1. Open https://start.dlndao.org/#/
2. Login with your credentials 
    - The home page is holding all proposals categories tabs (borrow, invest, repaid, ignored)
    - Home Page ref: https://github.com/dlndao/start/blob/main/src/pages/HomeTabs/home.tsx
3. Select the “Borrow” tab. 
4. Press on (+) to add a new proposal. 
5. Add button is displayed empty proposal modal with add new proposal option by changing the component state, add button func ref: https://github.com/dlndao/start/blob/main/src/pages/HomeTabs/borrow.tsx#L19-L21

6. Fill in the required data: 
    - Proposal Name: A title for the proposal.
    - Proposal Picture: Add a picture for the proposal. 
    - Loan Value: Amount of money needed. 
    - Months to repayment: Number of months required to pay back the loan.
    - Date: Assign a time to receive the loan. 
    - Proposal Description: Describe the proposal and its significance. 
7. Choose one of the three options:
    1. Save proposal as a draft (can edit proposal).
    2. Publish your proposal for everyone to see (can edit proposal). 
       - Save and publish is calling the same func with save state argument named isPublished true: false, if  it true it meaning publish and false meaning just draft the proposal, func ref: https://github.com/dlndao/start/blob/main/src/components/ManageProposal/singleProposal.tsx#L334-L399
    3. Cancel the proposal. 
        - Cancel button action is changing the component state to the display proposal mode and remove add proposal cel, func ref: https://github.com/dlndao/start/blob/main/src/components/ManageProposal/singleProposal.tsx#L512-L527


### Proposal Gallery
- Only the proposal owner can add and share an update on the proposal gallery
- The MFI admin can only see the gallery
- In a special case, if the MFI account created the proposal he can add updates to the gallery
- By clicking on the “+” sign under the proposal pic, the borrower will be able to upload multiple images for the proposal. 
    - The plus button is displays add new image log component https://github.com/dlndao/start/blob/main/src/components/ManageProposal/singleProposal.tsx#L890-L903
    - Plus button call component for images log and it has all images log actions and UI, func ref: https://github.com/dlndao/start/blob/main/src/components/ManageProposal/singleProposal.tsx#L1221-L1231

- A pop up will be opened and the owner can add an update from the (+) Button
    - At the start of the image-log component, there is an API calling to get the proposal images data  and updates by the proposal id is passed from the single proposal component, API call ref: https://github.com/dlndao/start/blob/main/src/components/ProposalUpdates/proposalImagesLog.tsx#L49-L60

- The borrower can upload images to update the investors/backers about the progress of the proposal 
- The user can share the update via Twitter by choosing (Share in Twitter)
- User can notify the investors of his loan via email about his update by choosing to send email to investors
- There are description labels for each image. 
- Anyone has access to view only the photo album.
- The user can delete any update.
    - The image log card is the child component of proposalImagesLog component you will find all the image log card action and UI on this file: https://github.com/dlndao/start/blob/main/src/components/ProposalUpdates/singleProposalImageLog.tsx



### The Proposal Lifecycle
1. **A need:** Why is the money needed?
During the first phase, the borrower creates a proposal for a certain cause. 
2. **Drafting a proposal:**
The user(Borrower) can draft a new proposal to be able to edit it before it becomes published.
3. **Publishing a proposal:**
Publishing a proposal enables potential investors to view it. The user can edit the proposal unless the backers have started investing their money in it. Borrowers can invite investors to back up the proposal, and communication between them occurs through the messaging center. 
4. **Locked proposal:**
If the proposal becomes locked, it means that money is being invested in the proposal published. Instantly, the user(Borrower) won’t have access to edit the proposal, however, the list of backers and the money they have invested can still be viewed. The user(Borrower) can invite more investors/backers and message the existing ones.  
5. **Backed proposal:**
If the proposal reaches this stage, that means that the required amount for the liquidity provider to accept the proposal has been collected. 
6. **Funded proposal:**
After the liquidity provider accepts the backed proposal, the loan will be funded. Now, the user(Borrower) can withdraw the money and start to pay his loan. 
7. **Repaid proposal:**
At that stage, the borrower will have to start progressing with the monthly repayment for the 0% interest loan, and the investors will regain their money. 

### Assign The Proposal on Casper:
- To make sure that the proposal will not be modified after the backers funded it, the proposal will be assigned at Casper labs network using Casper signer
- The assignment process will happen automatically when the proposal reaches Locked status (3rd stage of the proposal).

### Proposal Status from Borrower’s point of view
*Dev note: The proposal status is handled from var named status returned with proposal object with int value on 6 status*
*1=drafted, 2=published, 3=locked, 4=backed, 5=funded, 6=repaid*
1. Drafted Proposal
    - A drafted proposal is the first stage when creating a new proposal.
    - The Borrower will draft a proposal to start applying for his loan. 
    - Drafted proposals are only visible to the Borrower.
    - Investors and MFIs can’t see drafted proposals
    - The Borrower can publish a drafted proposal when adjusted. 
    - The Borrower can edit and delete a drafted proposal. 
2. Published Proposal
    - The published proposal is the second stage when creating a new proposal.
    - A borrower can publish his proposal when he is sure about the proposal’s info.
    - If no backers have placed their money in the proposal, the borrower can still edit and unpublish his proposal. 
    - The Borrower can invite investors to back him via Email or Twitter and see the names in the backers’ list. 
    - MFIs, Borrowers, and Investors can communicate with each other in the messaging center. 
3. Locked Proposal
    - The locked proposal is the third stage when creating a new proposal. 
    - Once an Investor (Backer) backs up a proposal, it becomes a locked proposal. 
    - Locked Proposal means that the borrower collected some of the money he needs from his backers but still didn’t collect the total amount of money.
    - A Locked proposal goes on the blockchain and becomes visible to everyone. 
    - The Borrower can no longer edit or delete a locked proposal.
    - Here the proposal didn’t collect the required amount of money so that DLN can give the borrower his loan.
        - In a locked proposal, the Borrower can view the list of backers. 
        - In a locked proposal, the Borrower can view the proposal balance. 
4. Backed Proposal 
    - The backed proposal is the fourth stage when creating a new proposal. 
    - When the required amount of money for the proposal is collected, the proposal becomes backed. 
    - Until the liquidity provider(Lender) accepts the proposal, it will stay as a backed proposal. 
    - In a backed proposal, the Borrower can view the list of backers.
    - The Borrower can communicate with the proposal backers through messaging. 
5. Funded Proposal
    - The funded proposal is the fifth stage when creating a new proposal. 
    - A proposal becomes funded when the liquidity provider lends the loan to the borrower. 
    - The Borrower can withdraw the money. 
    - The Borrower can start repaying his loan.
6. Repaid Proposal
    - The repaid proposal is the final stage. (borrower Paid the loan)
    - Investors/Backers will get their money back in addition to the ROI.
    - The Lender will get their money back in addition to the ROI. 

### MFI Proposals Page (Admin page)

- Page ref: https://github.com/dlndao/start/blob/main/src/pages/MfiProposals/index.tsx
- This page will include all proposals created under MFI
- This is determined by API call on the start page with the MFI id to get his proposals func ref: https://github.com/dlndao/start/blob/main/src/pages/MfiProposals/index.tsx#L57-L90
- MFI admin account only will have access to this page
URL: https://start.dlndao.org/#/App/MFIProposals 
- MFI admin can invest in any proposal
- MFI admin can ignore any proposal
- MFI admin can Approve any proposal
- MFI admin can do the usual actions like (Share via email, Share via Twitter, Messages, See collected amount, See backers list)
- MFI can assign any proposal to a specific campaign

### Page Components
1. Sum Up for all proposals
    - The proposals analytics data is got by API call, API call ref: https://github.com/dlndao/start/blob/main/src/pages/MfiProposals/index.tsx#L115-L134

2. All (MFI’s proposals)

3. Manage Campaigns section

#### Campaign
- Parent page ref: https://github.com/dlndao/start/blob/main/src/pages/Campaigns/campaigns.tsx
- This feature is only for the MFI admin account
- Campaign feature means grouping the proposals with the same purpose or goal.
- When the MFI admin login, a “Manage Campaigns” button will appear at the top of the screen.
    - At the start of the campaign page, there is an API call to get MFI’s campaigns by mfi id, API call ref: https://github.com/dlndao/start/blob/main/src/pages/Campaigns/campaigns.tsx#L45-L58

- Inside this page, the MFI admin can add a new campaign by clicking on the (+) Button then a new empty campaign card will appear.
    - You will find the campaign card action on this component https://github.com/dlndao/start/blob/main/src/components/ManageCampaigns/campaignCard.tsx

- Each campaign will have a name, a description, an image, a start date, an end date, and a Campaign URL (Open the campaign details on the MFI website).
- The MFI admin will see the old campaigns he created before. The MFI admin can view or delete the old campaigns.
- The MFI admin will find a back button, which will return him to the MFI dashboard page.

#### Assign a proposal to Campaign
1. Only the MFI admin can assign a proposal to a specific campaign
2. MFI admin can assign any proposal that belongs to MFI only to the campaigns created by the MFI
3. To assign a proposal click on the right checkmark under the proposal image
    - Assign proposal to campaign func ref: https://github.com/dlndao/start/blob/main/src/components/ManageCampaigns/assignProposalToCampaign.tsx#L45-L65

4. A window will be opened to choose the campaign you want to assign the proposal to
    - Assign proposal to campaign component ref: https://github.com/dlndao/start/blob/main/src/components/ManageCampaigns/assignProposalToCampaign.tsx

5. Choose the Campaign you want and then click on assign
6. You will see a successful message.
*Note if the proposal isn’t approved the assigned action will approve the proposal then assign it to the campaign* 
7. After then the Right checkmark will be a double right checkmark


8. To Un-Assign a proposal click on the double right checkmark and confirm your request
    - The unassign proposal from campaigns API call ref: https://github.com/dlndao/start/blob/main/src/components/ManageProposal/singleProposal.tsx#L915-L929



### Full Explanation for Web Application Features

#### User Registration (First-time user): 
- Open the website
- To sign up, the user opens the app, and then clicks on "Get Started”.
- Using email & phone number to sign up. 
    - The user creates an account by providing
    - **Mandatory data:**
        - First Name              &         Last Name 
        - Email Address           &        Password (A minimum of 8 characters)
        - Confirm Password        &        Phone Number (International format)
        - Accept the terms and conditions

#### Connect Wallet (Optional) (Next Phase):
- The Users can connect their wallets to the app
- Wallets: Casper Signer.
- The user can choose: “No wallet?”  and sign up using email and phone number

#### User Login
The user can log in using:
1. Phone number  
2. password
The users can log in using an MFI URL or the Default URL.
On the website, the users can choose their language preference. 


#### Lost Password


1. By clicking on “lost password” on the login page, the user will be able to reset the password.
2. Steps:
    - Click on “lost password”. 
    - Enter your phone number.
    - Check for the verification code on your phone.
    - Enter the verification code.
    - Set a new password. 
Now the account is accessible. 



#### Home

The home page includes all the main features. 
- Two main tabs will be visible: 
    1. Borrow tab 
    2. Invest tab.
- The Main app features
    1. Borrow Tab: To borrow money through creating proposals. 
    2. Repaid Tab: user will see his paid loans
    3. Invest Tab: To invest money in and back up the borrower’s proposal. 
    4. Ignored: The user will see the proposals he ignored before

- The Header 
    1. Message center.              
    2. Profile icon. 
    3. Demo mode. 
- The Footer
    1. DLN Logo. 
    2. “Help” button (documentation).
    3. MFI’s email and phone number. 



- The users can navigate between the Borrow and Invest tabs. 

#### General Features for all Users

- Proposal card fields 
    1. Proposal picture.
    2. Proposal Name.
    3. Loan Value (Amount of money needed).
    4. Date Required (Date to receive the loan).
    5. Months to Repayment (Number of months to pay back the loan).
    6. Proposal Description.
    7. Proposal gallery

- Backers List
    1. Borrowers have access to view the list of backers unless the proposal is drafted or published. 
    2. The list of backers consists of: 
        - An invited contributor that backed up the proposal.
        - An invited user that didn't respond to the invitation. 
        - An investor that contributed without an invitation.
    3. The borrower can send a "Thank you" email to the contributors.
    4. The borrower can resend an invitation to the nonrespondent user. 
- Any Investor can send a “Thank you” email or resend invitations to other investors. 
- The Borrower can view the following:
    1. Investor's name. 
    2. Investor's profile picture. 
    3. Investor's email.
    4. Invitation date. 
    5. Backing date. 
    6. The invested amount. 

#### Message Center
- Messages for all the proposals can be found in the messaging center.
- Filters located in the messaging center enable the user to access chats for specific proposals. 
- The user will be notified about unread messages for all the proposals. 

##### Proposal Chat

1. A proposal’s public chat room. 
2. The Borrower, Investors, and MFIs can communicate with each other concerning the proposal. 
3. The user will be notified about unread messages for a specific proposal. 


#### Demo Mode


1. The demo mode icon is located next to the message center. 


2. Clicking on the icon will activate/deactivate this feature.


3. After activation, a description tag pops up when clicking on any feature. 


#### Proposal Gallery
1. The borrower can upload multiple images to the proposal gallery. 
2. Each photo has a description. 
3. The borrower has access to edit any photo and the photo’s description. 
4. The borrower can delete any image. 
5. Investors can view the proposal gallery.


#### First: Borrower Path

- On the Borrow Tab
1. The borrower can: 
    1. Add a new proposal. 
    2. Filter proposals according to their stages. 
    3. View proposal cards. 
    4. Edit the proposal. 
    5. Make applications on the proposal. 
    6. View the proposal’s status. 
    7. View the two types of proposals. 
    8. View loan information (total money funded - total money paid back). 
    9. View all the proposals under the “borrow” tab. 
    10. Sign in under a specific MFI.


2. By clicking on the (+) sign, the borrower can create a new proposal. 
The borrower has to fill in the required proposal data.
3. Borrowers can filter the proposals by choosing one of the icons: (Drafted - Published - Locked - Backed - Funded)
4. On the page, the borrower will be able to view all the proposal cards. 
5. The editing icon enables the borrower to edit the drafted and published proposals only. 
6. Depending on the proposal’s status, the action bar will contain options that enable the borrower to adjust the proposal.
    - Options:  (Edit - Delete - Send invitation - Message an investor -Publish - Unpublish - Twitter - Proposal gallery). 
7. Users can see the proposal status over the proposal pic.
8. A proposal in progress: Drafted proposal - Published proposal.
9. An active proposal: Locked proposal - Backed proposal - Funded proposal.


10. Loan Information:
    - Total money funded: Amount of money collected by the borrower.  
    - Total money paid back: Amount of money paid back by the borrower. 



11. The borrower will be able to view all the proposals. 


12. 
    - Users can open the website with the MFI invitation link (Ex: ROI/DCBS/FATEN). 
    -  Every Published proposal will show up on the MFI page (EX: ROI). 
    - Other MFIs will not have access to view the published proposal.
    - The proposal will be visible under the “Invest” tab for other users of the same MFI. 

##### Draft Proposal
1. By clicking on the (+) sign, the borrower creates a new proposal to request a loan.
Under the “Borrow” tab, an empty proposal card will appear.


2. The borrower has to fill in the requested data to successfully publish a proposal.
    - Proposal picture.                   
    - Proposal Name. 
    - Loan Value.                              
    - Date Required. 
    - Months to Repayment.            
    -  Proposal Description. 


3. While creating a new draft:
    - The borrower can save the draft.
    - The borrower can cancel the draft.
    - The borrower can publish the draft. 


4. For existing drafts:
    - The borrower can edit the draft.
    - The borrower can publish the draft.
    - The borrower can delete the draft.

- The draft will be visible to the borrower only. 
- The draft will not be visible to the Investors or MFIs. 


##### Publish Proposal


1. The borrower can publish a proposal in 2 methods:
    - First: (Includes only 1 step) Immediately publish the proposal after creating a new draft. 
    - Second:(Includes 2 steps) Firstly, the borrower can save the draft, then click on the “publish” button to publish the proposal.


2. The borrower can: 
    - Edit the published proposal. 
    - Unpublish the proposal. 
    - Start a chat in a proposal. 
    - Send invitations via Email or Twitter.
    - Delete the proposal.
    - Upload photos with descriptive text to the proposal gallery. 


3. The published proposals will be visible:
    - Under the “Borrow” tab (The borrower can view all proposals).
    - Under the “Invest” tab (Only the other investors will have access to view them).
    - To an investor that logged in using an MFI link or invitation. 

##### Locked Proposal


1. After an investor/backer invests money in the proposal, it becomes a locked proposal.
Locked proposal will be published on the blockchain
The borrower will not be able to make changes to the proposal. 


2. In a locked proposal, the borrower can:
    - View backers list. 
    - View the amount of money collected. 
    - Start a chat with the investors. 
    - Send invitations via Email or Twitter.
    - Upload photos with descriptive text to the proposal gallery. 

##### Backed Proposal
1. If the amount needed has been collected, the proposal becomes a backed proposal. 
    - The borrower won’t be able to withdraw the money. 
    - The borrower can’t edit the proposal. 

2. In a backed proposal, the borrower can:
    - View backers list. 
    - View the total amount of money collected. 
    - Start a chat with the investors. 
    - Upload photos with descriptive text to the proposal gallery.

##### Funded Proposal


1. After the liquidity provider/lender approves the loan, the proposal becomes a funded proposal. 


2. Now, the borrower can withdraw the money. 


3. In a funded proposal, the borrower can:
    - View backers list. 
    - Withdraw the money collected. 
    - Message the investors. 
    - Start paying back the loan.

##### Repaid Proposal


1. The borrower will have to pay back the loan. 
2. The borrower can:
    - View backers list.
    - Share via Twitter
3. The borrower has access to view the paid-off proposals. 

##### Proposal gallery


1. Users can upload multiple photos to the proposal gallery. 


2. Users can add a description for each photo.


3. Users can edit any photo or the photo’s description. 


4. Users can delete any photo. 


5. Investors can view the borrower’s photo gallery. 


6. The borrower can share the gallery update via
Email & Twitter

##### Invite
1. The borrower can invite family and friends to back up the proposal after publishing it via:
Email & Twitter.
2. Invited investors will receive an email that includes information concerning the proposal. 
3. The borrower can invite multiple investors. 
4. The borrower can view the invited investors inside the backers list. 


#### Second: Investor/Backer Path



- “Invest” tab from the home page. 


1. The investor can only view the proposals of other users. 


2. Investors can’t view other users’ drafted proposals. 


3. The filter includes: Published proposal - Locked proposal - Backed proposal - Funded proposal - Repaid proposal. 

##### Filter


1. Investors can view all the published and locked proposals.


2. Investors can only view the backed, funded, and repaid proposals they have invested in.

##### Invest

1. Investors/backers can invest in any published or locked proposal.
2. To add an amount of money as an investment in a proposal, select the “invest” icon.

##### Published Proposals


1. Investors can view all the users’ published proposals.
2. Investors can place their money in a published proposal.
3. Investors can “ignore” the proposals they have no interest in. 
*(Those will be hidden from the “invest” tab)*. 
4. Investors can communicate with the borrower via messaging. 
5. Investors can invite other investors to support the borrower’s proposal.

##### Locked Proposal


1. Investors can view all the users’ locked proposals. 
2. Investors/backers can invest in any Locked proposal. 
3. Investors can communicate with the borrower via messaging. 
4. Investors can “ignore” the proposals they have no interest in. 
*(Those will be hidden from the “invest” tab)*. 
5. Investors can invite other investors via Email or Twitter to support the borrower’s proposal. 
6. Investors can view the backers list.
7. Investors can send a “Thank you” email to the other invited investors. 
8.  Investors can resend the invitation email to the other investors.
9. Investors have access to view the money collected in a proposal. 

##### Backed Proposal
1. Investors/backers can only view the backed proposals they have invested money in.
2. Investors can communicate with the borrower via messaging. 
3. Investors can view the backers list. 

##### Funded Proposal

1. Investors/backers can only view the funded proposals they have invested money in. 
2. Investors can communicate with the borrower via messaging. 
3. Investors can view the backers list. 

##### Repaid Proposal
1. Investors/backers can only view the repaid proposals they have invested money in. 
2. Investors can communicate with the borrower via messaging.  
3. Investors can view the backers list. 
4. Investors can view the progress of the repayment. 

##### Invite
1. Investors can invite other investors via Email. 
2. Investors can share any borrower’s proposal via Twitter. 


#### Third: MFI Path

- MFI Page
1. Only the MFI admin can view the proposals on the MFI page. 
2. The MFI page contains all the proposals which are related to the MFI. 
3. The MFI can view the users’ proposals. 
4. The user accessed the MFI URL or the invitation received from the MFI to publish the proposals. 
5. The MFI can “Approve” or “Ignore” a published proposal.
6. Approved proposals will be marked with the label: “Approved”. 
7. Ignored proposals will be hidden on the “Ignored” page. 
8. MFI can ignore (Published and Locked) Proposals Only
9. The MFI can invest in any published or locked proposal. 
10. The MFI can communicate with the borrower via messaging.
11. The MFI can invite other investors to support the borrower’s proposal. 
12. MFI must approve the payments from its side
13. MFI can add payment and approve it if the User paid in MFI’s office

##### Filters
1. The filter contains: Published - Locked - Backed - Funded - Prepaid. 

#### Summary
 
- Proposals In Progress: Published proposals. 
- Amount: Sum of Published  proposals amount
- Balance: Sum of collected money for Published proposals
*(Will always be zero why? because money will be on locked proposals).*



- Active Proposals: Locked proposal - Backed proposal - Funded proposal. 
Includes:
    - The number of proposals, the sum of the proposals’ amount, the sum of the collected money. 
    - The amount will always be greater than or equal to the balance value. 

- Repaid Proposals will include the number of repaid proposals, the balance of the proposals, amount of proposals. 

##### Campaign
1. This feature is to Group a set of proposals under a campaign.
Those proposals have the same goal or purpose
2. This feature is only available for the MFI admin account
3. The MFI admin can create as many campaigns as he wants
4. The MFI admin can delete any campaign
5. The MFI admin Can assign and unassign any proposal to a specific campaign
6. The MFI admin can share a public link for any campaign like this https://start.dlndao.org/#/App/proposalsByCampaign?mfi=DCBS&id=1 


