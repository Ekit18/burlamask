import React from 'react'
import { observer } from 'mobx-react-lite'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Image } from 'react-bootstrap';

export const NavBar: React.FC = observer(() => {
  return (<>
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand href="#" className="fw-bold">
          <Image width={100} src="https://i.pinimg.com/originals/1a/3a/1a/1a3a1a7b678fd85f10f425277d2a5486.png" className="me-4"/>BurlaMask</Navbar.Brand>
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
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      <hr />
      </Container>
    </Navbar>
  </>);
})
