import React, { FunctionComponent } from 'react';
import { Container } from "./styles";

interface StatusMessageProps {
  connected: boolean;
}

const StatusMessage: FunctionComponent<StatusMessageProps> = ({connected}) => {
  return (
    <Container>
      {connected ? 'Connected' : 'Disconnected'}
    </Container>
  );
};

export default StatusMessage;
