export interface Detection {
    width: number,
    height: number,
    top: number,
    left: number
}
export class ChangeFacesDto {
    descriptions: string;
    detections: string;
}
