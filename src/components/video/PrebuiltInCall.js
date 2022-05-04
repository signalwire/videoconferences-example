import React, { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Events from "../Events";
import VideoconfEmbed from "./VideoconfEmbed";

import { useHistory, useLocation } from "react-router";
import * as slack from "../../integrations/slack"
import InviteForm from "../InviteForm";

export default function InCall({
  roomDetails
}) {
  // let history = useHistory();

  let [room, setRoom] = useState(null);
  let [event, setEvent] = useState(null);

  let logEvent = useCallback((msg, title, variant) => {
    setEvent({ text: msg, title, variant });
  }, []);

  useEffect(() => {
    if (!room) return

    room.on('room.joined', (e) => {
      const message = "You joined the room"
      logEvent(message)
      slack.sendMessage(roomDetails.user.id, message)
    })

    room.on('member.joined', (e) => {
      // Send a Slack message to the user
      const message = `${e.member.name} has joined the room`
      logEvent(message)
      slack.sendMessage(roomDetails.user.id, message)
    })

    room.on('member.left', (e) => {
      // Send a Slack message to the user
      const message = `${e.member.name} has left the room`
      logEvent(message)
      slack.sendMessage(roomDetails.user.id, message)

      if (e.member.id === room.memberId) {
        // history.push("/");
        window.location.href = '/';
      }
    })

    return () => room?.removeAllListeners()
  }, [room])

  return (
    <Container fluid>
      <Row className="mt-3">
        <Col
          style={{ width: "75%" }}
          className="justify-content-md-center"
          sm="auto"
          xs="auto"
        >
          <VideoconfEmbed
            onRoomReady={(rs) => setRoom(rs)}
            token={roomDetails.room}
            user={roomDetails.user.name}
          />
          <Events log={event} />
        </Col>
        <Col className="col">
          <InviteForm currentUser={roomDetails.user.name} />
        </Col>
      </Row>
    </Container>
  );
}
