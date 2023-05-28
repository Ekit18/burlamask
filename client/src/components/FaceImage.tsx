import React, { useContext, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import * as faceapi from 'face-api.js';
import Resizer from "react-image-file-resizer";
import { Context } from '..';
import { FACE_DOTS_INDICES, IMAGE_CARD_SIZE } from '../utils/constants';
import Compress from "compress.js"
import { DeleteIcon } from '../ui/icons';
import { Buffer } from 'buffer';
interface FaceImageProps {
    file: File
}

export const FaceImage: React.FC<FaceImageProps> = observer(({ file }) => {
    const { faces, images } = useContext(Context)
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [imageURL, setImageURL] = useState<string>("");
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    useEffect(() => {
        console.log("render")
        const getImage = () => {
            // Resizer.imageFileResizer(
            //     file,
            //     IMAGE_CARD_SIZE,
            //     IMAGE_CARD_SIZE,
            //     "JPEG",
            //     100,
            //     0,
            //     (uri) => {
            //         const img = new Image();
            //         img.src = URL.createObjectURL(uri as Blob);
            //         img.onload = () => {
            //             setImageURL(img.src);
            //             // const link = document.createElement("a");
            //             // link.href = img.src;
            //             // link.download = "my_image.jpg";
            //             // link.click();
            //         };
            //     },
            //     "blob",
            //     IMAGE_CARD_SIZE,
            //     IMAGE_CARD_SIZE
            // );
            const compress = new Compress()

            compress.compress([file], {
                size: 4,
                quality: 1,
                maxWidth: 300,
                maxHeight: 300,
                resize: true,
            }).then((data) => {
                console.log(file.arrayBuffer())
                const img = new Image();
                img.src = data[0].prefix + data[0].data;
                img.onload = () => {
                    setImageURL(img.src);
                };
            })
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
        if (!detections.length) {
            return alert("Face not found")
        }
        if (!canvasRef.current) {
            return;
        }
        // setFaces(detections.map((d) => Object.values(d)));
        console.log(detections)
        console.log(imgRef.current.width)
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(imgRef.current).innerHTML;

        faceapi.matchDimensions(canvasRef.current, {
            width: IMAGE_CARD_SIZE,
            height: IMAGE_CARD_SIZE
        });
        faceapi.draw.drawDetections(canvasRef.current, detections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, detections);
        faceapi.draw.drawFaceExpressions(canvasRef.current, detections);
        console.log(detections)
        const dots = FACE_DOTS_INDICES.map((index) => detections[0].landmarks.positions[index - 1]);
        const width = Math.abs(dots[0].x - dots[3].x) + 20;
        const height = Math.abs(Math.max(dots[1].y, dots[2].y) - dots[4].y) + 60;
        const top = Math.max(dots[1].y, dots[2].y) - 50;
        const left = dots[0].x - 10;
        const imageBlob = await (await fetch(imageURL)).blob();
        const resizedFile = new File([imageBlob], file.name, { type: file.type });
        faces.addFace({ file: resizedFile, detection: { width, height, top, left }, description: file.name })
        const context = canvasRef.current.getContext("2d");
        if (!context) {
            console.log('CONTEXT NULL!')
            return;
        }
        context.strokeRect(left, top, width, height);
    };


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
                    handleImage()
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

    function handleDeleteClick() {
        faces.deleteFaces(file.name)
        images.deleteImages(file.name)
    }

    return (
        <>
            <div className="d-flex flex-column position-relative"
                style={{ overflow: "hidden" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >

                <img ref={imgRef} id="myInput" crossOrigin="anonymous" src={imageURL} />
                <canvas ref={canvasRef} style={{ position: 'absolute', left: 0 }} width={IMAGE_CARD_SIZE} height={IMAGE_CARD_SIZE} />
                <div>
                    <button onClick={() => handleImage()} style={{ position: "absolute", top: "50%" }}>test</button>
                </div>

                {isHovered &&
                    <span
                        className="position-absolute translate-middle p-2 rounded-circle"
                        style={{ top: 10, left: "95%", backgroundColor: "white", cursor: "pointer" }}
                        onClick={() => {
                            handleDeleteClick();
                        }}
                    >
                        <DeleteIcon />
                    </span>
                }
            </div>
        </>
    );
})
