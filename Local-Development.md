# Local Development

## Running mapsed repo

Whilst the mapsed website and examples will run happily under your local machine, the Google Maps won't render reliably from the filesystem.

To run on your local machine we need to run via a webserver; We're using [browsersync](http://localhost:3001/).

### Visual Studio Code browsersync extension

- Clone the repo to your local machine
- Open the folder in Visual Studio code
- Install the [Preview on Web Server](https://marketplace.visualstudio.com/items?itemName=yuichinukiyama.vscode-preview-server) Visual Studio code extension
	- The extension installs [browsersync](http://www.browsersync.io/)
	- Open the [browsersync](http://localhost:3001/) settings (runs under [localhost:3001/](http://localhost:3001/) by default)
	- Nav to [localhost:8080](http://localhost:8080) to start
	- View externally on [192.168.1.222:8080](http://192.168.1.222:8080) - use for testing on mobile

### CLI

- Follow the [browsersync](https://browsersync.io/#install) install instructions.
- In the terminal, run **browser-sync start --server --files**

## Google Maps API keys

Google now charges for API use.  To avoid charges no [working] API keys are provided with the mapsed so you will need to:

- Sign-up for your [own API key](https://blog.hubspot.com/website/google-maps-api)
- Ensure you add _credentials_ to ensure you aren't charged from unscrupulous actors reusing your key for their own projects
- Perform a search on your mapsed repo for **[YOUR-API-KEY]** and add your own key

### Debugging

To enable debug helper class, include the **mapsed.debug.js** file on the page.


