import React, { FunctionComponent } from 'react'
import { OrderType } from '@components/OrderBook'

interface DepthProps {
    depth: number
    orderType: OrderType
    windowWidth: number
}

const DepthColors = {
    BIDS: '#113534',
    ASKS: '#3d1e28',
}

const DepthComponet: FunctionComponent<DepthProps> = ({
    windowWidth,
    depth,
    orderType,
}) => {
    const MOBILE_WIDTH = 800
    return (
        <div
            data-testid="depth"
            style={{
                backgroundColor: `${orderType === OrderType.BIDS ? DepthColors.BIDS : DepthColors.ASKS}`,
                height: '1.250em',
                width: `${depth}%`,
                position: 'relative',
                top: 21,
                left: `${orderType === OrderType.BIDS && windowWidth > MOBILE_WIDTH ? `${100 - depth}%` : 0}`,
                marginTop: -24,
                zIndex: 1,
            }}
        />
    )
}
export default DepthComponet
