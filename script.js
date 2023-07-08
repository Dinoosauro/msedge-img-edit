if ('serviceWorker' in navigator) {
    let registration;
    const registerServiceWorker = async () => {
        registration = await navigator.serviceWorker.register('./service-worker.js', {scope: 'https://dinoosauro.github.io/msedge-img-edit/'});
    };
    registerServiceWorker();
}
let appVersion = "1.1.1";
fetch("https://dinoosauro.github.io/UpdateVersion/msedgeimg-updatecode", {cache: "no-store"}).then((res) => res.text().then((text) => {if (text.replace("\n", "") !== appVersion) if (confirm(`There's a new version of image-converter. Do you want to update? [${appVersion} --> ${text.replace("\n", "")}]`)) caches.keys().then((names) => {for (let item in names) {caches.delete(item); location.reload(true);}})}).catch((e) => {console.error(e)})).catch((e) => console.error(e));
function openPicker() {
    document.getElementById("fileOpen").click();
}
function getHeif(getItem) {
    if (!localHeic) {
        let heicLoader = document.createElement("script");
        heicLoader.src = "https://dinoosauro.github.io/image-converter/heic2any.js";
        heicLoader.setAttribute("crossorigin", "anonymous");
        heicLoader.onload = function () {
            localHeic = true;
            getPng();
        }
        document.body.append(heicLoader);
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
document.getElementById("fileOpen").onchange = function () {
    if (document.getElementById("fileOpen").files) {
        let fileRead = new FileReader();
        fileRead.onload = function () {
            if (document.getElementById("fileOpen").files[0].name.endsWith(".heic") || document.getElementById("fileOpen").files[0].name.endsWith(".heif")) getHeif(fileRead.result); else document.getElementById("img").src = fileRead.result;
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
    if (show) document.getElementById(id).show(); else document.getElementById(id).close();
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
        if (item.types[isImage].indexOf("heic") !== -1 || item.types[isImage].indexOf("heif") !== -1) getHeif(URL.createObjectURL(blob)); else document.getElementById("img").src = URL.createObjectURL(blob);
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
