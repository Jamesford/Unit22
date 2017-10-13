# Unit22

#### Install & Run

 - You will need build tools installed on your machine in order to compile the dependencies
	 - macOS `xcode-select --install`
	 - Ubuntu `sudo apt-get install build-essential`
	 - CentOS `yum install gcc gcc-c++ make openssl-devel`

 - `npm install`

 - create `config.js` file, based on `sample.config.js`

 - `npm start`

#### Log the bot into your server
```
// Client ID is from your Discord app
// https://discordapp.com/developers/applications/me

'https://discordapp.com/oauth2/authorize?client_id=<CLIENT ID>&scope=bot'
```
