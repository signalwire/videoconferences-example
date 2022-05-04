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
import Prebuilt from "./components/video/PrebuiltInCall.js";

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
        <Route path="/videoconf">
          {!roomDetails.user || !roomDetails.room ? (
            <Redirect to="/" />
          ) : (
            <Prebuilt roomDetails={roomDetails} />
          )}
        </Route>

        <Route path="/">
          <JoinCallForm
            onJoin={({ room, user }) => {
              console.log(user, room);
              setRoomDetails({ user, room, mod: true });
              console.log(history);
              history.push("/videoconf");
            }}
          />
        </Route>
      </Switch>
    </>
  );
}

export default App;
