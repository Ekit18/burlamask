import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
// import { Context } from '..'
// import { SocketsTest } from '../components/SocketsTest'
import { useNavigate } from 'react-router-dom'
import { NavBar } from '../components/Navbar'
import Carousel from '../components/Carousel/Carousel'
import { UploadImage } from '../components/UploadImage'


const MainPage: React.FC = observer(() => {
  // const { user } = useContext(Context)
  const navigate = useNavigate()
  const [images, setImages] = useState<File[]>([])

  return (
    <>
      <NavBar />
      <Carousel images={images} setImages={setImages} />
      {/* <h2>user id: {user.userId}</h2> */}
      {/* <Button onClick={() => user.logOut()} className="me-5 ms-3">log out</Button> */}
    </>
  )
})


export default MainPage
