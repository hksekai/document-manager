import React from 'react';
import { Navbar, Container, Nav, Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaBook, FaCog, FaBell } from 'react-icons/fa';

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
    <Navbar variant="dark" expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand href="#" className="d-flex align-items-center">
          <FaBook className="me-2" size={20} />
          <span>NotebookLM</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="main-navbar" />
        
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link href="#" active>Documents</Nav.Link>
            <Nav.Link href="#">Library</Nav.Link>
            <Nav.Link href="#">Recent</Nav.Link>
            <Nav.Link href="#">Shared</Nav.Link>
          </Nav>
          
          <Form className="d-flex mx-auto" style={{ maxWidth: '450px' }}>
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
          
          <Nav className="align-items-center">
            <Nav.Link href="#" className="me-2 position-relative">
              <FaBell size={18} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.5rem', padding: '0.25em 0.4em' }}>
                3
              </span>
            </Nav.Link>
            <Button variant="outline-light" className="d-flex align-items-center me-3">
              <FaCog className="me-2" size={16} />
              <span>Settings</span>
            </Button>
            <div className="user-avatar">
              <span>L</span>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
