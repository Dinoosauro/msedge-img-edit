# msedge-img-edit
Use the Microsoft Edge's image editor for editing local photos on your device (even for macOS), and then convert the result to JPG or WebP; with HEIF/HEIC support

Try it: https://dinoosauro.github.io/msedge-img-edit/

## Why this
There are two reasons to this:
- Microsoft Edge doesn't support HEIC/HEIF photos. In this way, also HEIC/HEIF photos can be edited
- Even if in Windows it's possible to edit the other image formats natively, on Linux and macOS Microsoft Edge doesn't permit to edit image files saved on the device, but only images from a webpage. So, what this webpage does is to allow the user to choose an image, and then it'll be displayed in the webpage. The user can now right click and edit the image with the Microsoft Edge tools. 

If the user wants, they can compress their image as a JPG/WebP or resize it thanks to [image-converter](https://dinoosauro.github.io/image-converter/). To do that, copy the edited image in the clipboard, and then click on the "Convert image" button. Then select the "Copy from clipboard" button from the new page and the converted JPG/WebP will be downloaded. For more information about image-converter, see [this GitHub page](https://github.com/Dinoosauro/image-converter).

## How to use it
Open this website. Then, click on the "Choose the image" button. Select the image, and then right click the image preview. Click on "Edit image" from that dropdown menu and edit it. Now:
- If you want to have a PNG: just save it from the "Save" dropdown menu in Microsoft Edge's editor
- If you want to have a JPG/WebP or if you want to resize it: on the "Save" dropdown menu in Microsoft Edge's editor, click to "Copy to clipboard". Then, close the editor and click the "Convert image" button. In the new page, customize the settings and then click "Copy from clipboard". Your JPG/WebP will be downloaded.

## Privacy

Everything is elaborated locally on your device. Nothing is sent to a server. The only thing saved on your device is the preferred theme in the website's isolated local storage

### Connected domains:
- GitHub pages: hosting of the webpage
- Google Fonts: only for getting fonts and make the webpage a little decent, no other data is sent or fetched from Google.
