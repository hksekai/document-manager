import React from 'react';
import { Navbar, Container, Nav, Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaBook, FaCog } from 'react-icons/fa';

/**
 * Header component with navigation and search
 */
const Header = ({ onSearch }) => {
  const handleSearchChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand href="#" className="d-flex align-items-center">
          <FaBook className="me-2" />
          <span>NotebookLM</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="main-navbar" />
        
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link href="#" active>Documents</Nav.Link>
            <Nav.Link href="#">Library</Nav.Link>
            <Nav.Link href="#">Recent</Nav.Link>
          </Nav>
          
          <Form className="d-flex mx-auto" style={{ maxWidth: '400px' }}>
            <InputGroup>
              <InputGroup.Text className="bg-secondary border-secondary text-white">
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Search documents..."
                className="bg-secondary border-secondary text-white"
                aria-label="Search"
                onChange={handleSearchChange}
              />
            </InputGroup>
          </Form>
          
          <Nav>
            <Button variant="outline-light" className="d-flex align-items-center">
              <FaCog className="me-2" />
              <span>Settings</span>
            </Button>
            <div className="ms-3 d-flex align-items-center">
              <div 
                className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px' }}
              >
                <span className="text-white fw-bold">L</span>
              </div>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
