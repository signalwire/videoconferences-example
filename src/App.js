import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header.js";

import {
  Switch,
  Route,
  useHistory,
  useLocation,
  Redirect,
} from "react-router-dom";

import JoinCallForm from "./components/JoinCallForm.js";
import InviteForm from "./components/InviteForm";
import Prebuilt from "./components/prebuilt/PrebuiltInCall.js";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  let query = useQuery();
  let history = useHistory();
  let [roomDetails, setRoomDetails] = useState({});

  return (
    <>
      <Header />
      <Switch>
        <Route path="/prebuilt">
          {!roomDetails.user || !roomDetails.room ? (
            <Redirect to="/" />
          ) : (
            <Prebuilt roomDetails={roomDetails} />
          )}
        </Route>

        <Route path="/invite">
          <InviteForm
            mod={query.get("m") === "mod"}
            roomName={query.get("rn")}
            onJoin={({ name, mod }) => {
              let room = query.get("r");
              console.log(name, room, mod);
              setRoomDetails({ name, room, mod });
              console.log(history);
              history.push("/prebuilt");
            }}
          />
        </Route>
        <Route path="/">
          <JoinCallForm
            onJoin={({ room, user }) => {
              console.log(user, room);
              setRoomDetails({ user, room, mod: true });
              console.log(history);
              history.push("/prebuilt");
            }}
          />
        </Route>
      </Switch>
    </>
  );
}

export default App;
