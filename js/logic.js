//Declarating variables
const suggestSection = document.getElementById('suggest-section');
const trendGifs = 'https://api.giphy.com/v1/gifs/trending?api_key=qsOjAmeDhQKoL3IW1Cnaty7Rayav17Ix&limit=12&rating=G';
const menuThemeTrigger = document.getElementById("down-arrow");
const trendGifContainer = document.getElementById("trends-gifs");
const menuTheme = document.getElementById("theme-option");
const createGifosButton = document.getElementById("create-gifos-box");
const chooseThemeButton = document.getElementById("choose-theme-box");
const myGifText = document.getElementById("mygif-text");
const capturePNG = document.getElementById('capture-png');
const themeIndicator = localStorage.getItem('trueorfalse');
const stylesTag = document.getElementById('styles-tag');
const gifosLogo = document.getElementById("logo");
const firstWindow = document.getElementById('first-video-capturing-view');
const secondWindow = document.getElementById('preview');
const captureContainer = document.getElementById('capture-container');
const captureContainerFinalPart = document.getElementById('capturing-final-part');
const fourthWindow = document.getElementById('captured-gif');
const fifthWindow = document.getElementById('uploading-video-section');
const sixthWindow = document.getElementById('uploaded-gif-section');
const trendSection = document.getElementById('trend');
const firstWindowCancelButton = document.getElementById('first_button');
const firstWindowBeginButton = document.getElementById('second_button');
const secondWindowCaptureButton = document.getElementById('capture-text');
const thirdWindowReadyButton = document.getElementById('ready-text');
const fourthWindowRepeatCaptureButton = document.getElementById('repeat-capture');
const fourthWindowUploadCaptureButton = document.getElementById('uploadcapturetext');
const fourthWindowForwardButton = document.getElementById('forward-container');
const sixthWindowReadyButton = document.getElementById('uploaded-gif-ready-button');
const sixthWindowSecondLi = document.getElementById('second-li');
const sixthWindowThirdLi = document.getElementById('third-li');
const initiateCamera = document.getElementById('initiate-camera');
const readyRecording = document.getElementById('recording-ready');
const outputRecording = document.getElementById('stop-recording');
const sailorDay = document.getElementById("theme-day");
const sailorNight = document.getElementById("theme-night");
let gifRecorder;
let videoRecorder;
let gifSrc;
let gifID;

//Declariting functions
const sweepingArraysWithInherit = (show,hide) => {
    hide.forEach(element => {
        element.style.display="none";
    });
    show.forEach(element => {
        element.style.display="inherit";
    });
};
const sweepingArraysWithFlex = (show,hide) => {
    hide.forEach(element => {
        element.style.display="none";
    });
    show.forEach(element => {
        element.style.display="flex";
    });
};
const gettingInformation = async (url) => {
    const testing = await fetch(url);
    return testing.json();
};
const showingMenu = () => {
    if (menuTheme.style.display == "none") {
        menuTheme.style.display = "flex";
    } else {
        menuTheme.style.display = "none";
    };
};
const dayTheme = () => {
    stylesTag.setAttribute('href','../styles/light/styles.css');
    gifosLogo.setAttribute("src", "../asset/gifOF_logo.png");
    capturePNG.setAttribute('src','../asset/camera.svg');
    darkIndicator = false;
    localStorage.setItem('trueorfalse',darkIndicator);
};
const darkTheme = () => {
    stylesTag.setAttribute("href","../styles/dark/styles.css")
    gifosLogo.setAttribute("src", "../asset/gifOF_logo_dark.png");
    // capturePNG.setAttribute('src','../asset/camera_light.svg');
    // we need to check thisss"!!!!!!
    darkIndicator = true;
    localStorage.setItem('trueorfalse',darkIndicator);
};
const otherToHide = () => {
    var thingsToHide = [
        secondWindow,
        fourthWindow,
        fifthWindow,
        sixthWindow,
        createGifosButton,
        chooseThemeButton,
        myGifText,
        menuThemeTrigger
    ];
    var thingsToShow = [trendSection];
    sweepingArraysWithInherit(thingsToShow,thingsToHide);
};

const ifFirstWindowCancelButton = () => {
    var thingsToShow = [createGifosButton,
    chooseThemeButton,
    myGifText,
    menuThemeTrigger,
    trendSection
    ];
    var thingsToHide = [firstWindow];
    sweepingArraysWithInherit(thingsToShow,thingsToHide);
};
const ifCreateGifosButton = () => {
    var thingsToShow = [firstWindow];
    var thingsToHide = [secondWindow,
    fourthWindow,
    fifthWindow,
    sixthWindow,
    createGifosButton,
    chooseThemeButton,
    myGifText,
    menuThemeTrigger];
    sweepingArraysWithFlex(thingsToShow,thingsToHide);
};
const ifFirstWindowBeginButton = () => {
    var thingsToShow = [secondWindow];
    var thingsToHide = [firstWindow,captureContainerFinalPart];
    captureContainer.style.display = 'inherit';
    sweepingArraysWithFlex(thingsToShow,thingsToHide);
    getStream();
};
const ifSecondWindowCaptureButton = () => {
    var thingsToShow = [captureContainerFinalPart];
    var thingsToHide = [captureContainer];
    sweepingArraysWithFlex(thingsToShow,thingsToHide);
    startRecording();
};

const getStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            height: { max: 480}
        }
    });
    initiateCamera.srcObject = stream;
    await initiateCamera.play();
};
const startRecording = async () => {
    const stream = initiateCamera.srcObject;
    videoRecorder = new RecordRTCPromisesHandler(stream, {
        type: "video",
        mimeType: "video/webm; codecs=vp8",
        disableLogs: true,
        videoBitsPerSecond: 128000,
        frameRate: 30,
        quality: 10,
        width: 480,
        hidden: 240
    });
    gifRecorder = new RecordRTCPromisesHandler(stream, {
        disableLogs: true,
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden:240
    });
    await gifRecorder.startRecording();
    await videoRecorder.startRecording();
    videoRecorder.stream = stream;
}
const stopRecording = async () => {
    await gifRecorder.stopRecording();
    await videoRecorder.stopRecording();
    const videoBlob = await videoRecorder.getBlob();
    const gifBlob = await gifRecorder.getBlob();

    videoRecorder.stream.getTracks().forEach( t => t.stop());
    initiateCamera.srcObject = null;
    await videoRecorder.reset();
    await videoRecorder.destroy();
    await gifRecorder.reset();
    await gifRecorder.destroy();
    gifSrc = await gifBlob;
    outputRecording.src = URL.createObjectURL( await videoBlob);
    outputRecording.play();
    gifRecorder = null;
    videoRecorder = null;
    
}
const ifThirdWindowReadyButton = () => {
    var thingsToShow = [ fourthWindow ];
    var thingsToHide = [ secondWindow ];
    sweepingArraysWithFlex(thingsToShow,thingsToHide);
    stopRecording();
};

const playingAgain = () => {
    outputRecording.play();
};

const ifRepeatingCapture = () => {
    var thingsToShow = [secondWindow,captureContainerFinalPart];
    var thingsToHide = [fourthWindow];
    sweepingArraysWithFlex(thingsToShow,thingsToHide);
    getStream();
    startRecording();
};

const uploadGifCaptured = async () => {
    const formData = new FormData();
    formData.append("file",gifSrc,"mygif.gif");
    const params = {
        method: "POST",
        body: formData,
        json: true
    };
    const data = await fetch("https://upload.giphy.com/v1/gifs?api_key=qsOjAmeDhQKoL3IW1Cnaty7Rayav17Ix",params);
    const response = await data.json();
    return response
};
const savingGifInLocalStorage = async (gif) => {
    APIkey = "qsOjAmeDhQKoL3IW1Cnaty7Rayav17Ix";
    const response = await fetch(`https://api.giphy.com/v1/gifs/${gif}?api_key=${APIkey}`);
    const information = await response.json();
    gifID = await information.data.id;
    fifthWindow.style.display = "none";
    sixthWindow.style.display = "flex";
    readyRecording.setAttribute('src',information.data.images.fixed_width.url);
    const stringifiedData = JSON.stringify( await information.data);
    localStorage.setItem("gif-" + gifID, await stringifiedData);
    return "OK"
};
const ifFourthWindowUploadCaptureButton = () => {
    fifthWindow.style.display = "flex";
    fourthWindow.style.display= "none";
    uploadGifCaptured().then(data => {
        savingGifInLocalStorage(data.data.id);
    }).catch(e => {
        console.log(e + "error"); 
    });
};
const ifSixthWindowSecondLiButton = () => {
    const tempElement = document.createElement("textarea");
    tempElement.value = `https://giphy.com/gifs/${gifID}`;
    tempElement.setAttribute("readonly", "");
    tempElement.style = 'display: "none"';
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand("copy");
    alert ("Link copiado con exito al portapapeles");
    document.body.removeChild(tempElement);
};
const ifSixthWindowDownloadCreatedGif = async () => {
    const gifFound = await fetch (`https://media.giphy.com/media/${gifID}/giphy.gif`);
    const urlOfGif = URL.createObjectURL(await (gifFound.blob()));
    const temporaryImage = document.createElement('a');
    temporaryImage.href = urlOfGif;
    temporaryImage.download = "guifo.gif";
    temporaryImage.style = 'display: "none"';
    document.body.appendChild(temporaryImage);
    temporaryImage.click();
    document.body.removeChild(temporaryImage);

};
const gettingAndRenderingGifsFromLocalStorage = () => {
    var listOfGifs = []
    var thingsToHide = [firstWindow,
        secondWindow,
        fourthWindow,
        fifthWindow,
        sixthWindow];
    var thingsToShow = [trendSection];
    sweepingArraysWithInherit(thingsToShow,thingsToHide);
    keys = Object.keys(localStorage);
    i = keys.length;
    while ( i-- ) {
        if (keys[i].startsWith("gif\-")) {
            listOfGifs.push(localStorage.getItem(keys[i]))
        };
    };
    while(trendGifContainer.firstChild) {
        trendGifContainer.removeChild(trendGifContainer.firstChild);
    }
    i = listOfGifs.length;
    while ( i-- ) {
        let newChild = document.createElement('img')
        newChild.setAttribute('src',JSON.parse(listOfGifs[i]).images.original.url)
        newChild.style.margin = '0 0 15px 3%';
        trendGifContainer.appendChild(newChild)
    };    
};
const onlyOneTime = () => {
    listOfGifs = [];
    keys = Object.keys(localStorage);
    i = keys.length;
    while ( i-- ) {
        if (keys[i].startsWith("gif\-")) {
            listOfGifs.push(localStorage.getItem(keys[i]))
        };
    };
    while(trendGifContainer.firstChild) {
        trendGifContainer.removeChild(trendGifContainer.firstChild);
    }
    i = listOfGifs.length;
    while ( i-- ) {
        let newChild = document.createElement('img')
        newChild.setAttribute('src',JSON.parse(listOfGifs[i]).images.original.url)
        newChild.style.margin = '0 0 15px 3%';
        trendGifContainer.appendChild(newChild)
    }; 
};

//First time Logic  
if (themeIndicator === 'true') {
    darkTheme();
} else {
    dayTheme();
};
otherToHide();
onlyOneTime();

//Listeners
myGifText.addEventListener('click',gettingAndRenderingGifsFromLocalStorage);
sixthWindowReadyButton.addEventListener('click',gettingAndRenderingGifsFromLocalStorage);
sixthWindowThirdLi.addEventListener('click',ifSixthWindowDownloadCreatedGif);
sixthWindowSecondLi.addEventListener('click',ifSixthWindowSecondLiButton);
fourthWindowUploadCaptureButton.addEventListener('click',ifFourthWindowUploadCaptureButton);
fourthWindowRepeatCaptureButton.addEventListener('click',ifRepeatingCapture);
fourthWindowForwardButton.addEventListener('click',playingAgain);
thirdWindowReadyButton.addEventListener('click',ifThirdWindowReadyButton);
secondWindowCaptureButton.addEventListener('click',ifSecondWindowCaptureButton);
firstWindowBeginButton.addEventListener('click',ifFirstWindowBeginButton);
createGifosButton.addEventListener('click',ifCreateGifosButton);
firstWindowCancelButton.addEventListener('click',ifFirstWindowCancelButton);
menuThemeTrigger.addEventListener("click", showingMenu);
sailorDay.addEventListener("click", dayTheme);
sailorNight.addEventListener("click", darkTheme);