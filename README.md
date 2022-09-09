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


#### Run Tests
```
$ npm run test
or
$ yarn test
```
