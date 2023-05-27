import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import * as faceapi from 'face-api.js';
import Resizer from "react-image-file-resizer";
interface FaceImageProps {
    file: File
}

export const FaceImage: React.FC<FaceImageProps> = observer(({ file }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [faces, setFaces] = useState<any[][]>([]);
    const [imageURL, setImageURL] = useState<string>("");
    useEffect(() => {
        const getImage = () => {
            Resizer.imageFileResizer(
                file,
                300,
                300,
                "JPEG",
                100,
                0,
                (uri) => {
                    const img = new Image();
                    img.src = URL.createObjectURL(uri as Blob);
                    img.onload = () => {
                        setImageURL(img.src);
                        // const link = document.createElement("a");
                        // link.href = img.src;
                        // link.download = "my_image.jpg";
                        // link.click();
                    };
                },
                "blob",
                300,
                300
            );
        };

        if (file) {
            getImage();
        }
    }, [file]);

    const handleImage = async () => {
        if (!imgRef) {
            return
        }
        if (!imgRef.current) {
            return;
        }
        const detections = await faceapi.detectAllFaces(
            imgRef.current,
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions();
        if (!canvasRef.current) {
            return;
        }
        const context = canvasRef.current.getContext("2d");
        if (!context) {
            console.log('CONTEXT NULL!')
            return;
        }

        setFaces(detections.map((d) => Object.values(d)));
        console.log(detections)
        console.log(imgRef.current.width)
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(imgRef.current).innerHTML;

        faceapi.matchDimensions(canvasRef.current, {
            width: 300,
            height: 300
        });
        faceapi.draw.drawDetections(canvasRef.current, detections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, detections);
        faceapi.draw.drawFaceExpressions(canvasRef.current, detections);

        const dotIndices = [18, 20, 25, 27, 58];
        const dots = dotIndices.map((index) => detections[0].landmarks.positions[index - 1]);
        const width = Math.abs(dots[0].x - dots[3].x) + 20;
        const height = Math.abs(Math.max(dots[1].y, dots[2].y) - dots[4].y) + 60;
        const top = Math.max(dots[1].y, dots[2].y) - 50;
        const left = dots[0].x - 10;
        console.log(dots)

        context.strokeRect(left, top, width, height);
    };

    interface Rectangle {
        top: number,
        left: number,
        width: number,
        height: number,
    }

    // const enter = () => {
    //     const canvas = canvasRef.current;
    //     if (!canvas) {
    //         console.log('CANVAS NULL!')
    //         return;
    //     }
    //     const context = canvas.getContext("2d");
    //     if (!context) {
    //         console.log('CONTEXT NULL!')
    //         return;
    //     }
    //     console.log(faces)
    //     context.lineWidth = 5;
    //     context.strokeStyle = "yellow";
    //     console.log('DRAWING!')
    //     faces.map((face) => context.strokeRect(face[0], face[1], face[2], face[3]));
    // };

    useEffect(() => {
        const loadModels = () => {
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
                faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
                faceapi.nets.faceExpressionNet.loadFromUri("/models"),
            ])
                .then(() => {
                    console.log("test");
                    // handleImage();
                })
                .catch((e) => console.log(e));
        };
        if (imgRef.current) {
            loadModels()
        }
        // faceapi.detectSingleFace(ref.current!, new faceapi.TinyFaceDetectorOptions()).then((detect: faceapi.FaceDetection | undefined) => {
        //     if (!detect) {
        //         return
        //     }
        //     const detection = detect;
        //     console.log(detection);
        //     return detect;
        // })
    }, [])
    console.log()
    return (
        <>
            <div className="d-flex flex-column position-relative">

                <img ref={imgRef} id="myInput" crossOrigin="anonymous" src={imageURL} />
                <canvas ref={canvasRef} style={{ position: 'absolute', left: 0 }} width={imgRef.current?.clientWidth} height={imgRef.current?.clientHeight} />
                <div>
                    <button onClick={() => handleImage()} style={{ position: "absolute" }}>test</button>
                </div>
            </div>
        </>
    );
})
