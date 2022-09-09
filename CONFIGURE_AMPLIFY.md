## Install the Amplify CLI
    npm install -g @aws-amplify/cli


## Configure the Amplify CLI
    amplify configure

> amplify configure will ask you to sign into the AWS Console.
Once you're signed in, Amplify CLI will ask you to create an IAM user.

> Specify the AWS Region
? region:  # Your preferred region

>Specify the username of the new IAM user:
? user name:  # User name for Amplify IAM user


## Complete the user creation using the AWS console

Create a user with AdministratorAccess-Amplify to your account to provision AWS resources for you like AppSync, Cognito etc.
Once the user is created, Amplify CLI will ask you to provide the accessKeyId and the secretAccessKey to connect Amplify CLI with your newly created IAM user.

> Enter the access key of the newly created user:
? accessKeyId:  # YOUR_ACCESS_KEY_ID
? secretAccessKey:  # YOUR_SECRET_ACCESS_KEY
This would update/create the AWS Profile in your local machine
? Profile Name:  # (default)

##### Successfully set up the new user.
___
___

---

***


# Work within your frontend project

After you install the CLI, navigate to a JavaScript, iOS, or Android project root, initialize AWS Amplify in the new directory by running 

    amplify init

#### Create authentication service:
    amplify add auth

> ? Do you want to use the default authentication and security configuration? Default configuration
? How do you want users to be able to sign in? Username
? Do you want to configure advanced settings?  No, I am done.


#### To deploy the service, run the push command:

    amplify push
