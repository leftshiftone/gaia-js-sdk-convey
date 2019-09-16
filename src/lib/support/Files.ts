/**
 * Function loads a file from the given URL and returns
 * it as a File.
 *
 * @param urlString
 * @param fileName
 * @returns File
 */
export function dataURLToFile(urlString: string, fileName: string) : File {
    let imageArr = atob(urlString);
    let n = imageArr.length;
    let u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = imageArr.charCodeAt(n);
    }
    return new File([u8arr], fileName, {type:"image/png"});
}

/**
 * Function takes a file and returns it as a base64 variant of the
 * file.
 *
 * @param File
 * @returns Promise<any> base64 file representation
 */
export function getBase64FromFile(file: File) : Promise<any> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result!);
        reader.onerror = error => reject(error);
    });
}

/**
 * Function returns the file type of the given file.
 *
 * @param file File
 * @returns string file extension
 */
export function getFileExtensionFromFile(file: File) {
    const array = file.name.split(".");
    return array[array.length - 1].toLowerCase();
}

/**
 * Function verifies whether a given file extension is
 * a supported image file type for the image compression.
 * Supported types are jpeg, jpg and png.
 *
 * @param fileExtension
 * @returns Boolean
 */
export function isImageFile(fileExtension : string) : Boolean {
    const allowedImageFileExtensions = ["jpg", "jpeg", "png"];
    return allowedImageFileExtensions.indexOf(fileExtension) !== -1
}


