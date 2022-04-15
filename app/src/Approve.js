import React, {useState} from 'react'
import { Tab, Tabs, Button, Spinner, Dialog } from "@blueprintjs/core";
import axios from 'axios'

export default function Approve( { userID } ){
  const [carList, setCarList] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [modalText, setModalText] = useState('default')
  const [isLoading, setIsLoading] = useState(false)

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
          if (car.Status.includes('buying')){
            listedCars.push(car)
          }
        }
        setCarList(listedCars)

        console.log(' all buying cars ', listedCars);
      })
  }

  const approveTransaction = async car => {
    console.log('value ', car);
    setIsLoading(true)
    await axios
      .put('http://localhost:9000/approveTransaction', {
        id: userID,
        car: car
      })
      .then((res)=> console.log(res))
    updateAssets()
    setIsLoading(false)
    alertUser('', 'transaction')
  }

  const alertUser = (userName, type) => {
    if(type == 'seller'){
      setModalText(`Contacted seller "${userName}"!`)
    }else if(type == 'buyer'){
      setModalText(`Contacted buyer "${userName}"!`)
    }else if(type == 'transaction'){
      setModalText('Transaction approved!')
    }
    setOpenModal(true)
  }

  const renderSpinner = (car) => {
    console.log('spinner', isLoading);
    if(isLoading){
      return <Spinner/>
    }else{
      return <div>
              <Button style={{ color: 'white' }} onClick={()=> alertUser(car.Owner,'seller')}>Contact Seller</Button>
              <Button style={{ color: 'white' }} onClick={()=> alertUser((car.Status.split(','))[1],'buyer')}>Contact Buyer</Button>
              <Button intent='primary' onClick={()=> approveTransaction(car)}><h6 style={{ color: 'white' }}>Approve</h6></Button>
            </div>
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
          <Button style={{ color: 'white' }} onClick={updateAssets}>Fetch pending buy orders</Button>
        </div><br/>
        <div>
            <Dialog isOpen={openModal} canOutsideClickClose={true} canEsacpeKeyClose={true}>
              <div style={{ marginTop: '20px', marginLeft: '15px' }}>
                <h6>{modalText}</h6>
                <Button onClick={()=> setOpenModal(false)}>Close</Button>
              </div>
            </Dialog>
            {renderCars()}
        </div>
      </div>
    </>
  )
}
