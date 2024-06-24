import React, { FunctionComponent } from 'react';
import { Container } from "./styles";
// import { MOBILE_WIDTH } from "@/constants";

interface TitleRowProps {
  reversedFieldsOrder?: boolean;
  windowWidth: number;
}

const TitleRow: FunctionComponent<TitleRowProps> = ({reversedFieldsOrder = false, windowWidth}) => {
  const MOBILE_WIDTH = 800
  return (
    <Container data-testid='title-row'>
      {reversedFieldsOrder || windowWidth < MOBILE_WIDTH ?
        <>
          <span>SIZE</span>
          <span>PRICE (USD)</span>
          <span>Total</span>
        </> :
        <>
          <span>PRICE (USD)</span>
          <span>SIZE</span>
          <span>Total</span>
        </>}
    </Container>
  );
};

export default TitleRow;
