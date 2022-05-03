# SignalWire Video Conference example

This repo demonstrates integration of prebuilt SignalWire Video Conferences
in your custom React UI. Video Conferences expose the [`RoomSession`](https://developer.signalwire.com/client-sdk/reference/js-video-roomsession)
object, which you can use to programmatically control the conference.

## Running the App

Simply `git clone`, `npm install`, then `npm start`, as you would any React app.

## Running the App via Docker

1. Build the container `docker build -t videoconf:dev .`

2. Run the container we built with a docker run command: `docker run -it --rm -v ${PWD}:/app -v /app/node_modules -p 3000:3000 videoconf:dev`

## Learn More

You can learn more about SignalWire Video Conferences here: 📖 [Video Conferences](https://developer.signalwire.com/apis/docs/video-conferences)
