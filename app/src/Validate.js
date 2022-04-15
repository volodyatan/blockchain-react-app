import React, {useState} from 'react'
import { Tab, Tabs, Button, Spinner, Dialog } from "@blueprintjs/core";
import axios from 'axios'

export default function Validate( { userID } ){
  const [carList, setCarList] = useState([])
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

        let listedCars = []
        let cars = res.data
        for (let car of cars){
          if (!car.Validated){
            listedCars.push(car)
          }
        }
        setCarList(listedCars)

        console.log(' all unvalidated cars ', listedCars);
      })
  }

  const validateCar = async car => {
    console.log('value ', car);
    setIsLoading(true)
    await axios
      .put('http://localhost:9000/validateCar', {
        id: userID,
        car: car
      })
      .then((res)=> console.log(res))
    updateAssets()
    setIsLoading(false)
    setOpenModal(true)
  }

  const renderSpinner = car => {
    console.log('spinner', isLoading);
    if(isLoading){
      return <Spinner/>
    }else{
      return <Button style={{ color: 'white' }} onClick={()=> validateCar(car)}>Validate Car</Button>
    }
  }

  const renderCars = () => {
    let carData = []
    for (let car of carList) {
      carData.push(<h3>Car details</h3>)
      for (let ele in car){
        carData.push(
          <div>
            <h6>{ele}:</h6><p>{`${car[ele]}`}</p>
          </div>)
      }
      carData.push(renderSpinner(car))
      carData.push(<hr/>)
    }

    return <div>{carData}</div>
  }

  return(
    <>
      <div>
        <div>
          <Button style={{ color: 'white' }} onClick={updateAssets}>Fetch unvalidated cars</Button>
        </div><br/>
        <div>
            {renderCars()}
        </div>
        <Dialog isOpen={openModal} canOutsideClickClose={true} canEsacpeKeyClose={true}>
          <div style={{ marginTop: '20px', marginLeft: '15px' }}>
            <h6>Car Validated!</h6>
            <Button onClick={()=> setOpenModal(false)}>OK</Button>
          </div>
        </Dialog>
      </div>
    </>
  )
}
