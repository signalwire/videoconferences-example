import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as slack from "../integrations/slack"

export default function InviteForm({ currentUser }) {
  const slackUsers = slack.useSlackUsers();
  const [selectedUser, setSelectedUser] = useState(null)

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Form.Group className="mb-3">
        <Form.Label>Invite someone</Form.Label>
        <Form.Select
          aria-label="User name"
          value={selectedUser?.id}
          onChange={(e) => setSelectedUser(slackUsers.find(u => u.id === e.target.value))}>
          <option>Select a person</option>
          {slackUsers.map(u => <option key={u.id} value={u.id}>{u.real_name}</option>)}
        </Form.Select>
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        disabled={!selectedUser}
        onClick={async () => {
          await slack.sendMessage(selectedUser.id, `${currentUser} invited you to join a call at ${window.location.origin}`)
          setSelectedUser(null)
        }}
      >
        Invite
      </Button>
    </Form>
  )
}
