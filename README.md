# captive network signal

This utility web page should be served as captive portal by a network service to show up network level from the modem.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Config

Edit .env file to customize page behaviour. Create react app environment variables always have REACT_APP prefix.

| NAME                  | DEFAULT                       | DESCRIPTION                               |
| --------------------- | ----------------------------- | ----------------------------------------- |
| REACT_APP_LOGO        | uspace_logo                   | The branding logo for the web view        |
| REACT_APP_COLOR       | #0e2f56                       | The branding color for the web view       |
| REACT_APP_BACKGROUND  | #fff                          | The branding color for the web view       |
| REACT_APP_TEXT        | #fff                          | Web view text color                       |
| REACT_APP_NETWORK     | "http://network/v1/modem"     | Network service endpoint                  |
| REACT_APP_DEVICE_NAME | "http://network/v1/name"      | Network service device name endpoint      |
| REACT_APP_INSTALLED   | "http://network/v1/installed" | Network service device installed endpoint |
| REACT_APP_REFRESH     | 30                            | Network level refresh time                |

## Release

When this project is updated, a new version has to be released and the version tag has to be bumped on using projects in order to update the portal.

### Packaging

First build the project locally using `npm run build`. Build will generate the optimize bundle in `build` folder. In order to serve the portal on a device the built code needs to be compressed using `.tag.gz` format. The compressed file has to contain the content of `build` folder in the root. In order to generate the compressed file open your terminal, navigate `INSIDE` build folder and run:

> tar -czvf captive-network-signal.tar.gz *

Now keep the `captive-network-signal.tar.gz` file you find in build folder for the next step.

### Publishing

Navigate to [project releases page](https://github.com/uspaceit/captive-network-signal/releases) and start the new release creation clicking on [Draft a new release](https://github.com/uspaceit/captive-network-signal/releases/new). Insert target version following semver format and including `v`. Insert release name following `Agrorobotica Network Captive Signal <version>` format. Describe release upgrades and attach the previous packaed code to thee release. Finally publish the release.

### Bump version

In order to update the served portal version on provider devices you have to update the target version in the service `Dockerfile.template`. For instance, in SpyFly case navigate to [marionette-network service](https://github.com/uspaceit/marionette-network/tree/65796a221d05660f09e838967c29e46153e183f7) and update [wifi-connect setup line](https://github.com/uspaceit/marionette-network/blob/65796a221d05660f09e838967c29e46153e183f7/Dockerfile.template#L48) replacing `https://github.com/uspaceit/captive-network-signal/releases/download/v<version>/captive-network-signal.tar.gz` version with the new release.

The device firmware needs to be built again in order to start serving the new portal version.
