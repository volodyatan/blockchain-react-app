import React, { useState } from 'react'
import { FormGroup, InputGroup, ControlGroup, Label, Button, Spinner, Dialog } from "@blueprintjs/core";
import { Link } from 'react-router-dom'
import axios from 'axios';


export default function Register( { userID } ){
  const [plates, setPlates] = useState('')
  const [make, setMake] = useState('')
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  const [price, setPrice] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    console.log('trying ')
    setIsLoading(true)
    await axios
      .put('http://localhost:9000/addCar', {
        id: userID,
        plates: plates,
        make: make,
        color: color,
        size: size,
        price: price
      })
      .then((res)=> console.log(res))
    setIsLoading(false)
    setOpenModal(true)
  }

  const renderSpinner = () => {
    console.log('spinner', isLoading);
    if(isLoading){
      return <Spinner/>
    }else{
      return <InputGroup type="submit" value="Submit" />
    }
  }

  return(
    <>
      <div>
        <h1>Register Car</h1>
        <form onSubmit={handleSubmit}>
            <FormGroup >
              <Label>
                Plate number:
                <InputGroup fill={false} label="plates" type="text" name="plates" onChange = {(e) => setPlates(e.target.value)} value={plates}/>
              </Label>
              <Label>
                Car make/brand:
                <InputGroup fill={false} label="make" type="text" name="make" onChange = {(e) => setMake(e.target.value)} value={make}/>
              </Label>
              <Label>
                Car color:
                <InputGroup fill={false} label="color" type="text" name="color" onChange = {(e) => setColor(e.target.value)} value={color}/>
              </Label>
              <Label>
                Car size:
                <InputGroup fill={false} label="size" type="text" name="size" onChange = {(e) => setSize(e.target.value)} value={size} placeholder='number of seats'/>
              </Label>
              <Label>
                Price ($):
                <InputGroup fill={false} label="price" type="number" name="price" onChange = {(e) => setPrice(e.target.value)} value={price}/>
              </Label>
                {renderSpinner()}
            </FormGroup>
          </form>
          <Dialog isOpen={openModal} canOutsideClickClose={true} canEsacpeKeyClose={true}>
            <div style={{ marginTop: '20px', marginLeft: '15px' }}>
              <h6>Car Registered!</h6>
              <Button onClick={()=> setOpenModal(false)}>OK</Button>
            </div>
          </Dialog>
        </div>
    </>
  )
}
