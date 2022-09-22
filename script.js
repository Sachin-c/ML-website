const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('https://gitcdn.xyz/repo/justadudewhohacks/face-api.js/master/weights/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('https://gitcdn.xyz/repo/justadudewhohacks/face-api.js/master/weights/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('https://gitcdn.xyz/repo/justadudewhohacks/face-api.js/master/weights/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('https://gitcdn.xyz/repo/justadudewhohacks/face-api.js/master/weights/models'),
  faceapi.nets.ageGenderNet.loadFromUri('https://gitcdn.xyz/repo/justadudewhohacks/face-api.js/master/weights/models'),
  
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
