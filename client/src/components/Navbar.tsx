import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Image } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Context } from '..';

export const NavBar: React.FC = observer(() => {
  const { faces, images } = useContext(Context)
  const [description, setDescription] = useState<string>('');
  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (!description.length) {
      alert("Query can't be empty")
    }
    images.searchImages(description)
  }

  return (<>
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand href="#" className="fw-bold">
          <Image width={100} src="https://i.pinimg.com/originals/1a/3a/1a/1a3a1a7b678fd85f10f425277d2a5486.png" className="me-4" />BurlaMask</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button variant="outline-success" type="submit" onClick={(event) => handleClick(event)}>Search</Button>
          </Form>
        </Navbar.Collapse>
        <hr />
      </Container>
    </Navbar>
  </>);
})
