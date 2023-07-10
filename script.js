if ('serviceWorker' in navigator) {
    let registration;
    const registerServiceWorker = async () => {
        registration = await navigator.serviceWorker.register('./service-worker.js', {scope: 'https://dinoosauro.github.io/msedge-img-edit/'});
    };
    registerServiceWorker();
}
let appVersion = "1.1.2";
fetch("https://dinoosauro.github.io/UpdateVersion/msedgeimg-updatecode", {cache: "no-store"}).then((res) => res.text().then((text) => {if (text.replace("\n", "") !== appVersion) if (confirm(`There's a new version of image-converter. Do you want to update? [${appVersion} --> ${text.replace("\n", "")}]`)) caches.keys().then((names) => {for (let item in names) {caches.delete(item); location.reload(true);}})}).catch((e) => {console.error(e)})).catch((e) => console.error(e));
function openPicker() {
    document.getElementById("fileOpen").click();
}
function getOptionalLibraries(url) {
    return new Promise((resolve, reject) => {
        let contentLoader = document.createElement("script");
        contentLoader.src = url
        contentLoader.setAttribute("crossorigin", "anonymous");
        contentLoader.onload = function () {
            resolve("");
        }
        document.body.append(contentLoader);
    });
}
function getTiff(dataURL) {
    if (!localTiff) {
        getOptionalLibraries("https://cdn.jsdelivr.net/npm/utif@3.1.0/UTIF.min.js").then(() => {
            continueTiff();
        })
    } else {
        continueTiff();
    }
    function continueTiff() {
            const base64 = dataURL.split(",")[1];
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            let img = bytes.buffer;
            var ifds = UTIF.decode(img);
            UTIF.decodeImage(img, ifds[0])
            var rgba = UTIF.toRGBA8(ifds[0]);
            var canvas = document.createElement("canvas");
            canvas.width = ifds[0].width;
            canvas.height = ifds[0].height;
            var ctx = canvas.getContext("2d");
            var imgData = ctx.createImageData(canvas.width, canvas.height);
            imgData.data.set(rgba);
            ctx.putImageData(imgData, 0, 0);
            document.getElementById("img").src = canvas.toDataURL("image/png");
}
}
function getHeif(getItem) {
    if (!localHeic) {
        getOptionalLibraries("https://dinoosauro.github.io/image-converter/heic2any.js").then(() => {
            localHeic = true;
            getPng();
        })
    } else {
        getPng();
    }
    function getPng() {
        fetch(getItem).then((res) => {
            res.blob().then((blob) => {
                heic2any({ blob }).then((img) => {
                    let image = new Image();
                    image.onload = () => {
                        let canvas = document.createElement("canvas");
                        canvas.width = image.width;
                        canvas.height = image.height;
                        let ctx = canvas.getContext("2d");
                        ctx.drawImage(image, 0, 0, image.width, image.height);
                        document.getElementById("img").src = canvas.toDataURL("image/png");
                    }
                    image.src = URL.createObjectURL(img);
                },)
            })
        });
    }
}
let localHeic = false;
let localTiff = false;
document.getElementById("fileOpen").onchange = function () {
    if (document.getElementById("fileOpen").files) {
        let fileRead = new FileReader();
        fileRead.onload = function () {

            switch(document.getElementById("fileOpen").files[0].name.substring(document.getElementById("fileOpen").files[0].name.lastIndexOf(".") + 1)) {
                case "heic": case "heif":
                    getHeif(fileRead.result);
                    break;
                case "tiff": case "tif":
                    getTiff(fileRead.result);
                    break;
                default:
                    document.getElementById("img").src = fileRead.result;
            }
        }
        fileRead.readAsDataURL(document.getElementById("fileOpen").files[0]);
    }
    document.getElementById("firststep").style.display = "none";
    document.getElementById("secondstep").style.display = "inline";
}
function goToConvert() {
    window.location.href = "https://dinoosauro.github.io/image-converter/index.html?fromedgeimg";
}
function back() {
    document.getElementById("firststep").style.display = "inline";
    document.getElementById("secondstep").style.display = "none";
    document.getElementById("reset").reset();
}
if (localStorage.getItem("imageconverter-theme") === null) localStorage.setItem("imageconverter-theme", JSON.stringify({
    text: "#edeeed",
    background: "#151515",
    card: "#292929",
    input: "#474747",
    accent: "#865e5e"
}));
let JSONTheme = JSON.parse(localStorage.getItem("imageconverter-theme"));
for (let i = 0; i < Object.keys(JSONTheme).length; i++) document.documentElement.style.setProperty(`--${Object.keys(JSONTheme)[i]}`, JSONTheme[Object.keys(JSONTheme)[i]]);
document.getElementById("themechange").addEventListener("click", () => { if (confirm("The theme of msedge-img-edit is synced with the theme of image-converter. Do you want to change it? You'll be redirected there.")) window.location.href = "https://dinoosauro.github.io/image-converter/index.html?fromedgeimg&themeoptions" });
for (let item of document.getElementsByClassName("hoverAnimate")) item.addEventListener("mouseleave", () => {
    item.classList.add("hoverAnimateBack");
    setTimeout(() => {
        item.classList.remove("hoverAnimateBack");
    }, 350);
})

function manageDialog(id, show) {
    if (show) {
        document.getElementById(id).show();
        document.getElementById(id).style.opacity = 1;
     } else {
        document.getElementById(id).style.opacity = 0;
        setTimeout(() => {document.getElementById(id).close();}, 360);
     }
}
function goToReEnc() {
    window.location.href = "https://dinoosauro.github.io/image-converter/index.html";
}
async function getClipboard() {
    let clipboardAsk = await navigator.permissions.query({
        name: "clipboard-read",
    });
    if (clipboardAsk.state === "denied") {
        alert("Without reading the image from the clipboard, it's impossible to transcode the image.");
        return;
    }
    let clipboard = await navigator.clipboard.read();
    for (let item of clipboard) {
        let isImage = -1;
        for (let i = 0; i < item.types.length; i++) if (item.types[i].indexOf("image/") !== -1) isImage = i;
        if (isImage === -1) continue;
        let blob = await item.getType(item.types[isImage]);
        switch (item.types[isImage].substring(item.types[isImage].indexOf(".") + 1)) {
            case "heic": case "heif":
                getHeif(URL.createObjectURL(blob));
                break;
                case "tiff": case "tif":
                    getTiff(URL.createObjectURL(blob));
                    break;
                default:
                    document.getElementById("img").src = URL.createObjectURL(blob);
        }
        document.getElementById("firststep").style.display = "none";
        document.getElementById("secondstep").style.display = "inline";    
    }
}
openPicker(); // 99% this won't work, but let's keep this just in case.
let installationPrompt;
window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installationPrompt = event;
});
document.getElementById("appInstall").addEventListener("click", () => {installationPrompt.prompt();});
for (let item of document.querySelectorAll("[data-license]")) item.addEventListener("click", () => {
    document.getElementById("licenseLabel").innerHTML = `Copyright (c) ${item.getAttribute("data-license")}<br><br>Permission is hereby granted, free of charge, to any person obtaining a copy of this software
    and associated documentation files (the "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
    following conditions:<br><br>The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.<br><br>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
    PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF
    OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`
})
document.getElementById("iconText").addEventListener("click", () => {
    document.getElementById("licenseLabel").innerHTML = "Icons are provided by Microsoft's Fluent UI Icons.";
})