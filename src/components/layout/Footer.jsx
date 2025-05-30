import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

/**
 * Footer component with copyright and links
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container>
        <Row>
          <Col md={6} className="mb-3 mb-md-0">
            <h5 className="mb-3">NotebookLM</h5>
            <p className="text-muted mb-0">
              A powerful document management system with AI-powered features for enhanced productivity.
            </p>
          </Col>
          
          <Col md={3} className="mb-3 mb-md-0">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-decoration-none text-muted">Home</a></li>
              <li><a href="#" className="text-decoration-none text-muted">Documents</a></li>
              <li><a href="#" className="text-decoration-none text-muted">Library</a></li>
              <li><a href="#" className="text-decoration-none text-muted">Settings</a></li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h6 className="mb-3">Help & Support</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-decoration-none text-muted">Documentation</a></li>
              <li><a href="#" className="text-decoration-none text-muted">FAQ</a></li>
              <li><a href="#" className="text-decoration-none text-muted">Contact Us</a></li>
              <li><a href="#" className="text-decoration-none text-muted">Privacy Policy</a></li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4 bg-secondary" />
        
        <Row>
          <Col className="text-center text-muted">
            <small>&copy; {currentYear} NotebookLM. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
