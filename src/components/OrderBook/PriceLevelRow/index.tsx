import React, { FunctionComponent } from 'react';

import { Container } from "./styles";

interface PriceLevelRowProps {
  size: string;
  price: string;
  total: string;
  reversedFieldsOrder: boolean;
  windowWidth: number;
}

const PriceLevelRow: FunctionComponent<PriceLevelRowProps> = ({
                                                                size,
                                                                total,
                                                                price,
                                                                reversedFieldsOrder = false,
                                                                windowWidth
                                                              }) => {
  const MOBILE_WIDTH = 800
  // data for each row
  return (
    <Container data-testid='price-level-row' isRight={!reversedFieldsOrder} windowWidth={windowWidth}>
      {reversedFieldsOrder || windowWidth < MOBILE_WIDTH ?
        <>
          <span>{size}</span>
          <span className='price'>{price}</span>
          <span className='total'>{total}</span>

        </> :
        <>
          <span className='price'>{price}</span>
          <span>{size}</span>
          <span className='total'>{total}</span>
        </>}
    </Container>
  );
};

export default PriceLevelRow;
