import React, {useState} from 'react'
import { Tab, Tabs, Button } from "@blueprintjs/core";
import { Link } from 'react-router-dom'

import Validate from './Validate.js'
import Approve from './Approve.js'

export default function AdminPanel( { userID } ){

  return(
    <>
      <Tabs>
        <Tab id="validate" title="Validate" panel={<Validate userID={userID} />} />
        <Tab id="approve" title="Approve transaction" panel={<Approve userID={userID} />} />
      </Tabs>
    </>
  )
}
