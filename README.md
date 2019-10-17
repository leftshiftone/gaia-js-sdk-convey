# GAIA Convey

[![CircleCI branch](https://img.shields.io/circleci/project/github/leftshiftone/gaia-js-sdk-convey/master.svg?style=flat-square)](https://circleci.com/gh/leftshiftone/gaia-js-sdk-convey)
[![GitHub tag (latest SemVer)](https://img.shields.io/github/tag/leftshiftone/gaia-js-sdk-convey.svg?style=flat-square)](https://github.com/leftshiftone/gaia-js-sdk-convey/tags)

Convey is a Javascript Framework for connecting to processes created with [G.A.I.A.](https://www.leftshift.one/produkt/gaia-services/).

The framework ist compatible with all major Browsers and can be used standalone as well as in conjunction with React, Angular or Vue.

## Integration
[//]: <> (TODO: Create sample project to demonstrate integration)
In order to add Convey to your project, follow these steps:

### Prerequisites
In order to integrate with GAIA two things are required:
1. MQTT endpoint: e.g. wss://gaia.local/mqtt
2. Identifier of the so called *Identity* to connect to.

### Add convey
`npm i gaia-js-sdk-convey`

### Create HTML page
```html
<html>
    <head>
        <meta charset="UTF-8"/>
        <link rel="stylesheet" href="gaia-js-sdk-convey-std.css"/>
        <script src="gaia-js-sdk-convey-std.js"></script>
    </head>
    <body>
        <div class="lto-gaia">
            <div class="lto-content"></div>
                <div class="lto-suggest"></div>
                <input class="lto-textbox"/>
                <button class="lto-invoker"/>
            </div>
        </div>
    </body>
</html>
```

### Integrate Convey
Add the following before the `</head>` tag in the HTML file.
```html
<script type="javascript">
    new GaiaConvey.Gaia(
        new GaiaConvey.ContentCentricRenderer(), 
        new GaiaConvey.OffSwitchListener()
    ).connect('wss://DOMAIN_NAME/mqtt', 'IDENTITY_ID')
        .then(connection => {
            connection.subscribe(ChannelType.CONTEXT, (data) => console.log(data));
            connection.reception();
        });
</script>
```

## Channels
The communication with GAIA contains several channels where each one has its own purpose.

### TEXT

Is the main channel and is responsible for exchanging the elements configured in GAIA. Convey automatically subscribes to this channel. The messages in this channel are rendered to HTML elements.

### NOTIFICATION

Each notification configured in the GAIA BPMN process can be received if subscribed to this channel.

### LOG

GAIA sends logs for certain process executions which can be received by subscribing to this channel.


## Renderer
A Renderer defines how elements, arrived in the *TEXT* channel, are rendered in the HTML DOM tree. Furthermore, a renderer allows for specifying the layout of an integration project.

### Classic Renderer
The classic renderer renders the G.A.I.A. messages in a classic top-down manner.

### Content Centric Renderer
The content centric renderer tries to maximize the time a content is visible by updating the content if possible or displaying interrupting actions like intent cascading by overlaying the content.

### RevealJS Renderer
Renderer implementation which is based on the reveal.js library. This renderer supports horizontal as well as vertical navigation.

### NoopRenderer
No-operation dummy renderer. Mainly used for audio only use cases.


## Listener
A listener provides the functionality to react to certain events. Events can be
* Connected
* ConnectionLost
* PacketSend
* Disconnected
* Error
* Message

### Default Listener
Acts as the base listener.

### OffSwitch Listener
If an input text area should only be visible when a input is required, this is the listener to be used.


## Modules
The following modules are available:
* std: Contains default modules
* aud: Contains the audio module
* cod: Contains the code reader module (e.g. QRCode)
* map: Contains modules for Open Street Map and Google Maps
* vis: Contains modules for rendering data as charts
* all: Contains all modules


## Development

### Release
Releases are triggered locally. Just a tag will be pushed to trigger the CI release pipeline.

#### Major
Run `yarn trigger-release:major` locally.

#### Minor
Run `yarn trigger-release:minor` locally.

#### Patch
Run `yarn trigger-release:patch` locally.


