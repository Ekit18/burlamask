import React from 'react'
import { observer } from 'mobx-react-lite'

interface CarouselItemProps {
    description?: string,
    children: React.ReactNode[] | React.ReactNode
}

export const CarouselItem: React.FC<CarouselItemProps> = observer(({ description, children }) => {
    return (
        <div className="border" style={{ minHeight: 300, minWidth: 300 }}>
            <div className="child-container" style={{
                height: 300,
                width: 300,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {children}
            </div>
            <div className="text-center">
                {description && <h2>{description}</h2>}
            </div>
        </div>
    );
})
