import React, { useEffect, useState } from 'react';
import { Centrifuge } from 'centrifuge';
import GlobalStyle from "@/styles/global";
import OrderBook from "@/components/OrderBook";
import StatusMessage from '@/components/StatusMessage';
import {get} from 'lodash';

interface Delta {
  bids: any[][];
  asks: any[][];
}

function App() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [connected, setConnected] = useState(false)
  const [sequence, setSequence] = useState(null);
  const [orderbook, setOrderbook] = useState<Delta>({ bids: [], asks: [] });

  useEffect(() => {
    // connect web socket
    const centrifuge = new Centrifuge('wss://api.prod.rabbitx.io/ws', {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDAwMDAwMDAwIiwiZXhwIjo2NTQ4NDg3NTY5fQ.o_qBZltZdDHBH3zHPQkcRhVBQCtejIuyq8V1yj5kYq8"
  });
    centrifuge.on('connected', function(ctx) {
      setConnected(true);
      console.log('Connected to RabbitX');
    });

    // disconnect
    // centrifuge.on('disconnected', function(ctx) {
    //   setConnected(false);
    //   console.log('Disconnected from RabbitX');
    // });

    // subscript orderbook, using BTC-USD
    const sub = centrifuge.newSubscription('orderbook:BTC-USD');

    sub.on('publication', function(ctx) {
      const data = ctx.data;
      if (sequence !== null && get(ctx, 'data.sequence') !== sequence + 1) {
        console.warn('Sequence mismatch, resubscribing...');
        sub.unsubscribe();
        sub.subscribe();
      }
      setOrderbook((prevOrderbook:Delta) => updateOrderbook(prevOrderbook, data));
      setSequence(get(ctx, 'data.sequence'))
    });

    
    sub.subscribe();
    centrifuge.connect();

    // Cleanup function to disconnect on unmount
    return () => {
      sub.unsubscribe();
      centrifuge.disconnect();
    };
  }, [])

  // update data 
  const updateOrderbook = (prevOrderbook:Delta, data:any) => {
    const { bids, asks } = data;
    const updatedBids = updateLevels(prevOrderbook.bids, bids);
    const updatedAsks = updateLevels(prevOrderbook.asks, asks);
    return { bids: updatedBids, asks: updatedAsks };
  };

  const updateLevels = (prevLevels: any, newLevels:any) => {
    const merged = [...prevLevels];
    newLevels.map((data: string[]) => {
      //[[bid_prize, bid_size]] from https://docs.rabbitx.io/api-documentation/data-structure
      const price = get(data, '0')
      const size = get(data, '1')

      const index = merged.findIndex(level => level[0] === price);
      if (index > -1) {
        if (parseFloat(size) === 0) {
          merged.splice(index, 1);
        } else {
          merged[index][1] = size;
        }
      } else {
        merged.push([price, size]);
      }
    });
    return merged.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  };
  // 
  return (
    <>
      <GlobalStyle />
      <StatusMessage connected={connected}/>
      <OrderBook windowWidth={windowWidth} orderBook={orderbook}/>
    </>
  );
}

export default App;
