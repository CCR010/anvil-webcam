// script to allow webcam to be displayed on avil.works via a canvas component
// in action see https://webcamcapture.anvil.app/
// discussion see  https://anvil.works/forum/t/access-and-capture-image-from-webcam/16843

// Get the webcam element from the HTML
var webcamElement = document.getElementById("webcam"); // Get the canvas element from the HTML and set up the canvas context
// Declare a variable to keep track of whether the video is currently being displayed
var liveVideo = false;
// Declare a variable to define frequency of 
var drawImageInterval = 30;
// Declare a variable to keep track of the current camera facing mode (front or back)
var currentFacingMode = "user";

// variable to store ideal webcam feed resolution
// set this in anvil using anvil.js.window.webcamResolution["height"]=xx
var webcamResolution = {
    height: undefined,
    width: undefined
}; 

// starts the webcam and displays the video on a canvas element
function startWebcam() {

    var canvasElement = document.getElementById("webcam_canvas"); // change to name of anvil canvas element
    var context = canvasElement.getContext("2d");

    // Request access to the user's camera and microphone
    navigator.mediaDevices
        .getUserMedia({
            audio: false, // not needed, only video
            video: {
                facingMode: currentFacingMode,
                width: {
                    ideal: webcamResolution["width"]
                },
                height: {
                    ideal: webcamResolution["height"]
                },
            },
        })
        .then(function(stream) {
            // get the resolution of the webcam.
            // const settings = stream.getVideoTracks()[0].getSettings();
            // console.log(`webcam started. resolution: ${settings.width}x${settings.height}.`);

            // If access is granted, set the video source and start playing the video
            webcamElement.srcObject = stream;
            webcamElement.play();
            console.log("webcam started:", currentFacingMode);
            
            // draw the video stream onto the canvas every 'drawImageInterval' milliseconds (if not paused)
            liveVideo = true;
            setInterval(() => {
                if (liveVideo == true) {
                    context.drawImage(webcamElement, 0, 0, canvasElement.width, canvasElement.height);
                }
            }, drawImageInterval);
        })
        .catch(function(error) {
            // If access is denied or an error occurs, log the error to the console
            console.log("failed to get webcam stream", error);
        });
} // end of startWebcam()

// toggle the liveVideo variable between true and false to pause or resume the video playback
function pauseWebcam() {
    liveVideo = !liveVideo;
    console.log("live feed paused/restarted");
}

// stop the video playback and releases the camera and microphone resources
function stopWebcam() {
    const stream = webcamElement.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(function(track) {
            track.stop();
        });
        webcamElement.srcObject = null;
    }
    console.log("webcam stopped");
}

// toggle the camera facing mode between front and back cameras
function changeCameraSource() {
    stopWebcam();
    if (currentFacingMode === "environment") {
        currentFacingMode = "user";        
    } else {
        currentFacingMode = "environment";
    }
    startWebcam();
}
