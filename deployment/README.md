# Deployment of application in AWS EC2

Follow below video to create single domain vhost setup & ssl configuration `https://www.youtube.com/watch?v=yOWTp2kGbcw`

Resolving EPEL step follow below guide
https://repost.aws/knowledge-center/ec2-enable-epel

Next step backend deployment:

# Installing NVM

1. Connect to your Amazon Linux 2 EC2 instance using SSH.

2. Download the NVM installation script using curl:
    ```bash
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    ```
3. Close and reopen the terminal or run the following command to load NVM into your current session:
    ```bash
        source ~/.nvm/nvm.sh
    ```
4. Verify the installation by running the following command:

    ```bash
        nvm --version
    ```
5. Install a specific version of Node.js using NVM: 
    List the available Node.js versions by running:

    ```bash
        nvm ls-remote
    ```
6. Choose a specific version from the list. For example, to install Node.js version 16.x, run:
    ```bash
        nvm install 16
    ```
7. Verify that the Node.js installation was successful by running:
    ```bash
        node --version
    ```
    
# Installation of GIT
1.Run the following command to update the package manager cache:
```bash
sudo yum update -y
```
2. Install Git using the yum package manager:
```bash
sudo yum install git -y
```
3. Verify the installation by checking the Git version:
```bash
git --version
```

# Installing SAIL.JS & PM2 Globally

1. Sails.js installation globally
```bash
npm install -g sails
```
2.  Verify the installation by checking the Sails.js version:
```bash
sails --version
```
3. PM2 - PM2 is a process manager for Node.js applications. It allows you to manage and run your Node.js applications in a production environment, providing features to monitor, scale, and manage the application processes.
```bash
npm install -g pm2
```
4.  Verify the installation by checking the PM2 version:
```bash
pm2 --version
```

# Cloning Repo

1. Cloning repo

```bash
git clone https://github.com/indstack-products/affliate-backend-sailsjs-service.git uat-affiliate-backend-sailsjs
```

2. Navigating to project folder

```bash
cd uat-affiliate-backend-sailsjs
```

3. Checkout to `release/uat` branch

```bash
git fetch && git checkout release/uat
```

4. Install project dependencies

```bash
npm install
```

5. run below npm script to start the application

```bash
npm run run-forever:dev
```

6. To check the application running state

```bash
pm2 list
```

```
pm2 logs {id}
```

# Setting up SSL configuration

1. Navigate to project folder

```bash
cd uat-affiliate-backend-sailsjs
```

2. Create local.js file inside config folder

```bash
nano config/local.js
```

3. Copy below configuration & replace actual ssl paths

```bash
module.exports = {
  ssl: {
    cert: require('fs').readFileSync('/etc/letsencrypt/live/example.com/fullchain.pem'),
    key: require('fs').readFileSync('/etc/letsencrypt/live/example.com/privkey.pem')
  }
};
```

4. Restart pm2 service(s)

```bash
pm2 restart {id}
```