import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FormGroup, InputGroup, ControlGroup, Label } from "@blueprintjs/core";



export default function Signup( {userID, addUser} ){
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')


  const handleSubmit = e => {
    e.preventDefault()
    addUser({username: username, password: password, name: name, email: email})
  }

  return(
    <>
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
          <FormGroup >
            <Label>
              Full name:
              <InputGroup fill={false} label="name" type="text" name="name" onChange = {(e) => setName(e.target.value)} value={name}/>
            </Label>
            <Label>
              Username:
              <InputGroup fill={false} label="username" type="text" name="username" onChange = {(e) => setUsername(e.target.value)} value={username}/>
            </Label>
            <Label>
              Email:
              <InputGroup fill={false} label="email" type="text" name="email" onChange = {(e) => setEmail(e.target.value)} value={email}/>
            </Label>
            <Label>
              Password:
              <InputGroup fill={false} label="password" type="password" name="password" onChange = {(e) => setPassword(e.target.value)} value={password}/>
            </Label>
            <InputGroup type="submit" value="Signup" />
          </FormGroup>
        </form>
      </div>
    </>
  )
}
