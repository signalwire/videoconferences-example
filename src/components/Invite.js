import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

export default function InviteButton({
  room = "room",
  roomName = "Room",
  eventLogger = (msg) => {
    console.log("InviteEvent", msg);
  },
}) {
  function generateLink(r, type = "normal") {
    return (
      window.location.protocol +
      "//" +
      window.location.host +
      "/invite?r=" +
      r +
      "&rn=" +
      roomName
    );
  }

  return (
    <>
      <Dropdown drop="up">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Invite
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item
            style={{
              maxWidth: 200,
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
            onClick={() => {
              let tx = document.createElement("textarea");
              document.body.appendChild(tx);
              tx.value = generateLink(room, "mod");
              tx.select();
              document.execCommand("copy");
              document.body.removeChild(tx);
              eventLogger(
                "The link " +
                  generateLink(room, "mod") +
                  " copied to clipboard.",
                "Link copied",
                "info"
              );
            }}
          >
            {generateLink(room, "mod")}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
