export interface PickedMedia {
    uri: string;
    type: 'image' | 'video';
    fileName: string;
    mimeType: string;
}

export interface UploadedMedia {
    url: string;
    type: 'image' | 'video';
}