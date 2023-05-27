import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Form } from 'react-bootstrap';
import { ALLOWED_IMAGE_FORMAT } from '../utils/constants';

interface UploadImageProps {
    setImages: React.Dispatch<React.SetStateAction<File[]>>
}

export const UploadImage: React.FC<UploadImageProps> = observer(({ setImages }) => {
    const [drag, setDrag] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }
        setImages((prev) => [...prev, event.target.files![0]]);
    };

    const handleClick = () => {
        if (!inputRef.current) {
            return
        }
        inputRef.current.click();
    };

    function dragStartHandler(event: React.DragEvent<HTMLElement>): void {
        event.preventDefault()
        setDrag(true)
    }

    function dragLeaveHandler(event: React.DragEvent<HTMLElement>): void {
        event.preventDefault()
        setDrag(false)
    }

    function dropHandler(event: React.DragEvent<HTMLElement>): void {
        event.preventDefault()
        if (!event.dataTransfer.files || event.dataTransfer.files.length === 0) {
            return;
        }
        const file = event.dataTransfer.files[0];
        const allowedFormats = ['.jpg', '.jpeg', '.png'];
        // Check if the file format is allowed
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !allowedFormats.includes(`.${fileExtension}`)) {
            console.log('Invalid file format');
            return;
        }
        setImages((prev) => [...prev, file]);
        console.log(file)
        setDrag(false)
    }

    return (
        <div className="d-flex">
            {drag
                ? <div
                    className="p-2 d-flex text-center justify-content-center
                    align-items-center"
                    style={{
                        height: "300px",
                        width: "300px",
                        border: "dashed"
                    }}
                    onDragStart={(event) => dragStartHandler(event)}
                    onDragLeave={(event) => dragLeaveHandler(event)}
                    onDragOver={(event) => dragStartHandler(event)}
                    onDrop={(event) => dropHandler(event)}
                >
                    Drop file to upload
                </div>
                : <div
                    className=" border p-2 d-flex text-center justify-content-center
                    align-items-center"
                    onClick={handleClick}
                    onDragStart={(event) => dragStartHandler(event)}
                    onDragLeave={(event) => dragLeaveHandler(event)}
                    onDragOver={(event) => dragStartHandler(event)}
                >
                    <Form.Group >
                        <Form.Control
                            style={{ display: 'none' }}
                            ref={inputRef}
                            id="file"
                            name="file"
                            type="file"
                            accept={ALLOWED_IMAGE_FORMAT.join(" ")}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFileChange(event)} />
                        Drag file to upload
                    </Form.Group>
                </div>}
        </div>
    );
})
