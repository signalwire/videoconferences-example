import React, { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Events from "../Events";
import Participants from "../Participants";
import ReadyRoomVideo from "./ReadyRoomVideo";

import { useHistory, useLocation } from "react-router";
import * as slack from "../../integrations/slack"
import InviteForm from "../InviteForm";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function InCall({
  roomDetails,
  setRoomDetails = () => {},
}) {
  let history = useHistory();

  let [room, setRoom] = useState(null);
  let [event, setEvent] = useState(null);
  let [thisMemberId, setThisMemberId] = useState(null);

  let [memberList, setMemberList] = useState([]);

  let [roomDisplayName, setRoomDisplayName] = useState("");

  let logEvent = useCallback((msg, title, variant) => {
    console.log("Displaying toast for", msg, title, variant);
    setEvent({ text: msg, title, variant });
  }, []);
  let onRoomInit = useCallback((room) => setRoom(room), []);

  let onRoomJoin = useCallback((room) => {
    setRoomDisplayName(room.display_name);
  }, []);

  let onRoomUpdate = useCallback(
    (updatedValues) => {
      if (updatedValues.left === true) {
        // history.push("/");
        window.location.href = '/';
      }
      if (updatedValues.thisMemberId !== undefined) {
        console.log("SETTING THIS MEMBER ID", updatedValues.thisMemberId);
        setThisMemberId(updatedValues.thisMemberId);
      }
    },
    [history, thisMemberId]
  );

  let query = useQuery();
  let location = useLocation();
  useEffect(() => {
    if (roomDetails === undefined) {
      let r = query.get("r");
      let n = query.get("u");
      let mod = query.get("mod");
      console.log(r, n, mod, "on join");
      setRoomDetails({ room: r, name: n, mod: mod === "true" });
    }
  }, [location, query, history, roomDetails, setRoomDetails]);

  useEffect(() => {
    if (!room) return

    room.on('member.joined', (e) => {
      // Send a Slack message to the user
      slack.sendMessage(roomDetails.user.id, `${e.member.name} has joined the room`)
    })

    room.on('member.left', (e) => {
      // Send a Slack message to the user
      slack.sendMessage(roomDetails.user.id, `${e.member.name} has left the room`)
    })

    return () => room?.removeAllListeners()
  }, [room])

  return (
    <Container fluid>
      <Row className="mt-3">
        <Col
          style={{ backgroundColor: "black", width: "70%" }}
          className="justify-content-md-center"
          sm="auto"
          xs="auto"
        >
          <ReadyRoomVideo
            onRoomInit={onRoomInit}
            onRoomJoined={onRoomJoin}
            onRoomUpdate={onRoomUpdate}
            joinDetails={{ room: roomDetails.room, name: roomDetails.user.name }}
            eventLogger={logEvent}
            onMemberListUpdate={useCallback((list) => {
              setMemberList(list);
            }, [])}
          />
          <Events log={event} />
        </Col>
        <Col className="col">
          <InviteForm currentUser={roomDetails.user.name} />
          <Participants
            memberList={memberList}
            mod={true}
            onMemberUpdate={async (event) => {
              if (room !== undefined && room === {}) return;
              if (event.action === "remove") {
                if (room === undefined || room === null) return;
                console.log("Removing Member", event.id);
                await room.removeMember({ memberId: event.id });
                console.log("Removed member", event.id);
                if (event.id === thisMemberId) history.push("/");
              } else if (event.action === "mute_video") {
                await room.videoMute({ memberId: event.id });
                if (event.id === thisMemberId) setVideoMuted(true);
              } else if (event.action === "mute_audio") {
                await room.audioMute({ memberId: event.id });
                if (event.id === thisMemberId) setAudioMuted(true);
              } else if (event.action === "unmute_audio") {
                await room.audioUnmute({ memberId: event.id });
                if (event.id === thisMemberId) setAudioMuted(false);
              } else if (event.action === "unmute_video") {
                await room.videoUnmute({ memberId: event.id });
                if (event.id === thisMemberId) setVideoMuted(false);
              }
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}
