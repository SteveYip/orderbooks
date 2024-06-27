import React, { FunctionComponent, useEffect, useState } from 'react'
import TitleRow from './TitleRow'
import { Container, TableContainer, AllPriceLevelRowsContainer } from './styles'
import PriceLevelRow from './PriceLevelRow'
import Loader from '../Loader'
import { PriceLevelRowContainer } from './PriceLevelRow/styles'
import { get, sum } from 'lodash'
import DepthComponet from './Depth'

export enum OrderType {
    BIDS,
    ASKS,
}

interface OrderBookProps {
    windowWidth: number
    orderBook: Delta
    connected: boolean
}

interface Delta {
    bids: any[][]
    asks: any[][]
}

const OrderBook: FunctionComponent<OrderBookProps> = ({
    windowWidth,
    orderBook,
    connected,
}) => {
    const MOBILE_WIDTH = 800
    const ORDERBOOK_LEVELS = 25
    const formatNumber = (arg: number): string => {
        return new Intl.NumberFormat('en-US').format(arg)
    }

    const formatPrice = (arg: number): string => {
        return arg.toLocaleString('en', {
            useGrouping: true,
            minimumFractionDigits: 2,
        })
    }

    const buildPriceLevels = (
        levels: number[][],
        orderType: OrderType = OrderType.BIDS
    ): React.ReactNode => {
        // sort level from asc or desc base on bids or asks
        const sortedLevelsByPrice: number[][] = [...levels].sort(
            (currentLevel: number[], nextLevel: number[]): number => {
                let result: number = 0
                if (
                    orderType === OrderType.BIDS ||
                    windowWidth < MOBILE_WIDTH
                ) {
                    result = nextLevel[0] - currentLevel[0]
                } else {
                    result = currentLevel[0] - nextLevel[0]
                }
                return result
            }
        )

        return (
            // filter which data is empty array
            sortedLevelsByPrice
                .filter((arr) => arr.length > 0)
                .map((level, idx) => {
                    const levels = get(level, '0', null)
                    const price: string = formatNumber(get(level, '0', 0))
                    const size: string = formatNumber(get(level, '1', 0))
                    const filteredArray = sortedLevelsByPrice
                        .filter((arr) => arr.length > 0)
                        .slice(0, idx + 1)
                    // calucate total size by sum 0 to index each asks and biz size
                    // e.g ['priceA', 'sizeA'], [priceB, sizeB]
                    // get sizeA + sizeB = total
                    const sizeArray: number[] = filteredArray.reduce(
                        (acc: any, curr: any) => {
                            const lastSize = curr[curr.length - 1]
                            acc.push(parseFloat(lastSize))
                            return acc
                        },
                        []
                    )
                    let totalDepth = 0
                    const maxTotal = sum(
                        sortedLevelsByPrice
                            .filter((arr) => arr.length > 0)
                            .reduce((acc: any, curr: any) => {
                                const lastSize = curr[curr.length - 1]
                                acc.push(parseFloat(lastSize))
                                return acc
                            }, [])
                    )
                    const total: number = sum(sizeArray)
                    const depth = (total / maxTotal) * 100
                    return (
                        <PriceLevelRowContainer key={idx + price + size}>
                            <DepthComponet
                                key={`${idx + price + size}_depth`}
                                windowWidth={windowWidth}
                                depth={depth}
                                orderType={orderType}
                            />
                            <PriceLevelRow
                                key={size + idx}
                                size={size}
                                total={formatNumber(total)}
                                price={price}
                                reversedFieldsOrder={
                                    orderType === OrderType.ASKS
                                }
                                windowWidth={windowWidth}
                            />
                        </PriceLevelRowContainer>
                    )
                })
        )
    }

    return (
        <Container>
            {get(orderBook, 'bids') && get(orderBook, 'asks') && connected ? (
                <>
                    <TableContainer>
                        <TitleRow
                            windowWidth={windowWidth}
                            reversedFieldsOrder={false}
                        />
                        <AllPriceLevelRowsContainer>
                            {buildPriceLevels(
                                get(orderBook, 'bids', []),
                                OrderType.BIDS
                            )}
                        </AllPriceLevelRowsContainer>
                    </TableContainer>
                    <TableContainer>
                        <TitleRow
                            windowWidth={windowWidth}
                            reversedFieldsOrder={true}
                        />
                        <AllPriceLevelRowsContainer>
                            {buildPriceLevels(
                                get(orderBook, 'asks', []),
                                OrderType.ASKS
                            )}
                        </AllPriceLevelRowsContainer>
                    </TableContainer>
                </>
            ) : (
                <Loader />
            )}
        </Container>
    )
}

export default OrderBook
