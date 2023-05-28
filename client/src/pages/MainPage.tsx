import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
// import { Context } from '..'
// import { SocketsTest } from '../components/SocketsTest'
import { useNavigate } from 'react-router-dom'
import { NavBar } from '../components/Navbar'
import Carousel from '../components/Carousel/Carousel'
import { UploadImage } from '../components/UploadImage'
import { Context } from '..'
import { SwapButton } from '../components/SwapButton'


const MainPage: React.FC = observer(() => {
  const { faces } = useContext(Context)
  const navigate = useNavigate()

  return (
    <>
      <NavBar />
      <Carousel />
      {/* <h2>user id: {user.userId}</h2> */}
      <SwapButton />
      {/* <Button onClick={() => user.logOut()} className="me-5 ms-3">log out</Button> */}
    </>
  )
})


export default MainPage
