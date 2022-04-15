import React, { useState, useEffect } from 'react'
import { Route, Routes, useNavigate, Link } from 'react-router-dom'
import { Alert, Tag, Button } from "@blueprintjs/core";
import Landing from '../../../RE-Project/app/src/Landing.js'
import Home from '../../../RE-Project/app/src/Home.js'
import AdminPanel from '../../../RE-Project/app/src/AdminPanel.js'
import axios from 'axios'

function App() {
  const [userID, setUserID] = useState('')
  const [userList, setUserList] = useState({
    'admin': { username: 'admin', password: '123', name: 'Admin', email: 'admin@admin.com'}
  })

  useEffect(() => {
    axios
      .get('http://localhost:9000/init')
      .then((res)=> console.log(res))
  }, []);

  const navigate = useNavigate()

  const addUser = (newUserData) => {
    let username = newUserData.username
    let password = newUserData.password
    let name = newUserData.name
    let email = newUserData.email
    let newList = userList

    try{
      axios
        .put('http://localhost:9000/newAddress', {id:username})
        .then((res)=> console.log(res))
    }catch(e){
      console.log('cannot connect to blockchain...\n ', e);
    }

    newList[username] = {
      username: username,
      password: password,
      name: name,
      email: email
    }
    setUserList(newList)
    setUserID(username)

    // move to home page
    navigate('/home')
  }

  const attemptLogin = (userData) => {
    let username = userData.username
    let password = userData.password

    if(!userList[username]){
      alert("incorrect username or password")
    }else{
      if (userList[username].password == password){
        setUserID(username)
        navigate('/home')
      }else{
        alert("incorrect username or password")
      }
    }
  }

  const renderPanel = () => {
    if(userID == 'admin'){
      return <AdminPanel userID={userID}/>
    }else{
      return <Home userID={userID} />
    }
  }

  return (

      <div className="App">
        <Tag fill={true} large={true} style={{ backgroundColor: '#674EA7' }}><div style={{ display: 'flex', width: '100%' }}><h4 style={{ color: 'white', width: '92%' }}>safeXchange</h4><Button intent="danger" style={{ color: 'white', width: '8%' }}><Link to='/' style={{ color: 'white' }}>Logout</Link></Button></div></Tag>
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Landing userID={userID} addUser={addUser} attemptLogin={attemptLogin}/>}></Route>
            <Route path="/home" element={renderPanel()}></Route>
          </Routes>
        </div>

      </div>


  );
}

export default App;
