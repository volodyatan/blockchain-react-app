import React, {useState} from 'react'
import { Tab, Tabs, Button } from "@blueprintjs/core";
import { Link } from 'react-router-dom'

import Register from './Register.js'
import List from './List.js'
import Buy from './Buy.js'

export default function Home( { userID } ){

  return(
    <>
      <Tabs>
        <Tab id="register" title="Register" panel={<Register userID={userID} />} />
        <Tab id="list" title="List" panel={<List userID={userID} />} />
        <Tab id="buy" title="Buy" panel={<Buy userID={userID}/>} />
      </Tabs>
    </>
  )
}
