import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { SwappedImageData } from '../store/ImagesStore';
import useCopyToClipboard from './useCopyToClipboard';
import { CopyIcon } from '../ui/icons';

interface SwappedImageItemProps {
    image: SwappedImageData
}

export const SwappedImageItem: React.FC<SwappedImageItemProps> = observer(({ image }) => {
    const [value, copy] = useCopyToClipboard()
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    return (
        <div className="d-flex flex-column align-items-center position-relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => copy(image.url)}
            style={{
                cursor: isHovered
                    ? "pointer"
                    : ""
            }}
        >
            <img style={{
                filter: isHovered
                    ? "brightness(50%)"
                    : ""
            }} src={image.url} alt={image.description} />
            <h4 className=" w-100 text-center" style={{
                bottom: -10, backgroundColor: "white", filter: isHovered
                    ? "brightness(50%)"
                    : ""
            }}>{image.description}</h4>
            {isHovered &&
                <div className="position-absolute" style={{ zIndex: 10, top: 150 }}>
                    <CopyIcon />
                </div>
            }
        </div>
    );
})
