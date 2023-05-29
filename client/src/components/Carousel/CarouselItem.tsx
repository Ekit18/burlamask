import React from 'react'
import { observer } from 'mobx-react-lite'
import { IMAGE_CARD_SIZE } from '../../utils/constants';

interface CarouselItemProps {
    description?: string,
    children: React.ReactNode[] | React.ReactNode
}

export const CarouselItem: React.FC<CarouselItemProps> = observer(({ description, children }) => {
    return (
        <div className="border" style={{ minHeight: IMAGE_CARD_SIZE, minWidth: IMAGE_CARD_SIZE }}>
            <div className="child-container" style={{
                height: IMAGE_CARD_SIZE,
                width: IMAGE_CARD_SIZE,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // overflow: "hidden"
            }}>
                {children}
            </div>
            <div className="text-center">
                {description && <h2>{description}</h2>}
            </div>
        </div>
    );
})
