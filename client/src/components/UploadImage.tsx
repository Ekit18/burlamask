import React, { useContext, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Form } from 'react-bootstrap';
import { ALLOWED_IMAGE_FORMAT, IMAGE_CARD_SIZE } from '../utils/constants';
import { Context } from '..';
import { DragDropIcon } from '../ui/icons';


export const UploadImage: React.FC = observer(() => {
    const { images } = useContext(Context)
    const [drag, setDrag] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }
        images.addImages(event.target.files![0])
        images.setSwappedImages([])
        // setImages((prev) => [...prev,]);
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
            alert('Invalid file format');
            return;
        }
        images.addImages(file)
        console.log(file)
        images.setSwappedImages([])
        setDrag(false)
    }

    return (
        <div className="d-flex" style={{ cursor: "pointer" }}>
            {drag
                ? <div
                    className="p-2 d-flex text-center justify-content-center
                    align-items-center"
                    style={{
                        height: IMAGE_CARD_SIZE,
                        width: IMAGE_CARD_SIZE,
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
                    style={{
                        height: IMAGE_CARD_SIZE,
                        width: IMAGE_CARD_SIZE,
                    }}
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
                            accept={ALLOWED_IMAGE_FORMAT.map((format) => `image/${format.replace('.', '')}`).join(',')}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFileChange(event)} />
                        <div className="d-flex flex-column text-center justify-content-center align-items-center">
                            Drag file to upload
                            <DragDropIcon />
                        </div>
                    </Form.Group>
                </div>}
        </div>
    );
})
