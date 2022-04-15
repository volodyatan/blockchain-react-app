import React, { useState } from 'react'
import { FormGroup, InputGroup, ControlGroup, Label, Button, Spinner, Dialog } from "@blueprintjs/core";
import Form from 'react-bootstrap/Form'
import { Link } from 'react-router-dom'
import axios from 'axios';


export default function List( { userID } ){
  const [carList, setCarList] = useState([{ID:'please update....'}])
  const [selectedCarID, setSelectedCarID] = useState()
  const [selectedCar, setSelectedCar] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const updateAssets = (e) => {
    if(e){
      e.preventDefault()
    }
    axios
      .get('http://localhost:9000/getAllCars')
      .then((res)=> {
        console.log(res)
        let userCars = []
        let cars = res.data
        for (let car of cars){
          console.log('car ', car)
          if (car.Owner == userID){
            userCars.push(car)
          }
        }
        setCarList(userCars)
        // if(userCars.length > 0){
          setSelectedCar(userCars[0])
          setSelectedCarID(userCars[0].ID)
        // }
        console.log(' selected car ', selectedCar);
        console.log(' selected car id ', selectedCarID);
        console.log(' all user cars ', userCars);
      })
  }

  const listCar = async e => {
    e.preventDefault()
    setIsLoading(true)
    await axios
      .put('http://localhost:9000/listCar', {
        id: userID,
        car: selectedCar
      })
      .then((res)=> console.log(res))
    updateAssets()
    setIsLoading(false)
    setOpenModal(true)
  }

  const populateSelect = () => {
    let cars = []

    for (let car in carList){
      cars.push(<option key={carList[car].ID} value={carList[car].ID}>{carList[car].ID}</option>)
    }

    return cars
  }

  const onDropdownSelected = (e) => {
    console.log("THE VAL", e.target.value);
    for(let car of carList){
      if(car.ID == e.target.value){
        setSelectedCar(car)
        setSelectedCarID(car.ID)
        return
      }
    }
  }

  const renderSpinner = () => {
    console.log('spinner', isLoading);
    if(isLoading){
      return <Spinner/>
    }else{
      return <Button style={{ color: 'white' }} onClick={listCar}>List Car</Button>
    }
  }

  const renderCar = () => {
    let carData = []
    console.log('selected car rendering', carList)
    for (let ele in selectedCar){
      if(selectedCar.Validated == '' || selectedCar.Validated == false){
          continue
      }
      carData.push(
        <div>
          <h6>{ele}:</h6><p>{`${selectedCar[ele]}`}</p>

        </div>)
    }
    if(carData.length == 0){
      return <div><p>This car is not validated</p></div>
    }else{
      return <div>{carData}{renderSpinner()}<hr/></div>
    }
  }


  return(
    <div>
      <div>
        <Button style={{ color: 'white' }} onClick={updateAssets}>Update cars</Button>
      </div><br/>
      <div>
        <h3>Select car:</h3>
        <Form.Select value={selectedCarID} onChange={onDropdownSelected}>
          {populateSelect()}
        </Form.Select><br/>
        <h3>Car details</h3>
          {renderCar()}
      </div>
      <Dialog isOpen={openModal} canOutsideClickClose={true} canEsacpeKeyClose={true}>
        <div style={{ marginTop: '20px', marginLeft: '15px' }}>
          <h6>Car Listed!</h6>
          <Button onClick={()=> setOpenModal(false)}>OK</Button>
        </div>
      </Dialog>
    </div>
  )
}
