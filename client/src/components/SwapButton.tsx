import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Context } from '..';

export const SwapButton: React.FC = observer(() => {
  const { faces } = useContext(Context)
  const handleButtonClick = () => {
    faces.uploadFaces()
  };

  return (
    <>
      <Container>
        <Row className="text-center mt-5 position-relative">
          <Col>
            <Button
              onClick={handleButtonClick}
              variant="success"
              disabled={faces.faces.length < 2}
              style={{ opacity: 1, backgroundColor: "#6dac8f" }}
            >
              Swap Images
            </Button>
            <hr
              className="position-absolute w-100"
              style={{ top: "5px", transform: "translateY(-50%)", zIndex: -1 }}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
});
