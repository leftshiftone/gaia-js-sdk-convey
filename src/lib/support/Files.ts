
export function dataURLToFile(urlString: string, fileName: string) : File {
    let imageArr = atob(urlString);
    let n = imageArr.length;
    let u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = imageArr.charCodeAt(n);
    }
    return new File([u8arr], fileName, {type:"image/png"});
}

export function getBase64FromFile(file: File) : Promise<any> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result!);
        reader.onerror = error => reject(error);
    });
}

export function getFileExtensionFromFile(file: File) {
    const array = file.name.split(".");
    return array[array.length - 1].toLowerCase();
}

export function isImageFile(fileExtension : string) : Boolean {
    const allowedImageFileExtensions = ["jpg", "jpeg", "png"];
    return allowedImageFileExtensions.indexOf(fileExtension) !== -1
}


