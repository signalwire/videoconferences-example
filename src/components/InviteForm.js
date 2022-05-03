import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function JoinCallForm({ roomName, onJoin = () => {} }) {
  let [name, setName] = useState("");
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col lg={4}>
          <h4>Join '{roomName}'</h4>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group className="mb-3" controlId="VideoCallName">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                pattern="[^' ']+"
                required
              />
            </Form.Group>
            <Button
              className="mt-1"
              variant="primary"
              type="submit"
              onClick={() => {
                if (name !== "") {
                  onJoin({ name, room: roomName });
                } else {
                  alert("Please fill all fields");
                }
              }}
            >
              Join
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
