import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FormGroup, InputGroup, ControlGroup, Label } from "@blueprintjs/core";

export default function Login( {userID, attemptLogin} ){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    attemptLogin({username: username, password: password})
  }

  return(
    <>
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
          <FormGroup >
            <Label>
              Username:
              <InputGroup fill={false} label="username" type="text" name="username" onChange = {(e) => setUsername(e.target.value)} value={username}/>
            </Label>
            <Label>
              Password:
              <InputGroup fill={false} label="password" type="password" name="password" onChange = {(e) => setPassword(e.target.value)} value={password}/>
            </Label>
            <InputGroup type="submit" value="Login" />
          </FormGroup>
        </form>
      </div>
    </>
  )
}
