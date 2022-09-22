const video = document.getElementById('video')
let modelsUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/";
Promise.all([
  
faceapi.nets.tinyFaceDetector.loadFromUri(modelsUrl + 'tiny_face_detector_model-weights_manifest.json'),
faceapi.nets.faceLandmark68Net.loadFromUri(modelsUrl + 'face_landmark_68_model-weights_manifest.json'),
faceapi.nets.faceRecognitionNet.loadFromUri(modelsUrl + 'face_recognition_model-weights_manifest.json'),
faceapi.nets.ssdMobilenetv1.loadFromUri(modelsUrl + 'ssd_mobilenetv1_model-weights_manifest.json')
]).then(startVideo)

function startVideo() {
  
  
  navigator.mediaDevices.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )

  navigator.getWebcam = (navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.moxGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({  audio: true, video: true })
    .then(function (stream) {
       video.srcObject = stream
     })
     .catch(function (e) { logError(e.name + ": " + e.message); });
}
else {
navigator.getWebcam({ audio: true, video: true }, 
     function (stream) {
      video.srcObject = stream
     }, 
     function () { logError("Web cam is not accessible."); });
}
}

video.addEventListener('play', () => {
  
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    resizedDetections.forEach(result => {
      
      const { age, gender, genderProbability } = result
      
      new faceapi.draw.DrawTextField(
        [
          `${Math.round(age)} years`,
          `${gender} (${Math.round(genderProbability)})`
        ],
        result.detection.box.bottomLeft
      ).draw(canvas)
    })
  }, 100)
})
