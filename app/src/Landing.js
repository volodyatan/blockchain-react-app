import React from 'react'
import { Tab, Tabs } from "@blueprintjs/core";

import Login from './Login.js'
import Signup from './Signup.js'

export default function Landing( {userID, addUser, attemptLogin} ){
  return(
    <>
      <Tabs>
        <Tab id="login" title="Login" panel={<Login userID={userID} attemptLogin={attemptLogin}/>} />
        <Tab id="signup" title="Signup" panel={<Signup userID={userID} addUser={addUser}/>} />
      </Tabs>
    </>
  )
}
