import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

/**
 * Footer component with copyright and links
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-4 mt-auto">
      <Container>
        <Row className="py-3">
          <Col lg={5} className="mb-4 mb-lg-0">
            <h5 className="mb-3 d-flex align-items-center">
              <span className="me-2">NotebookLM</span>
              <Badge bg="primary" className="text-uppercase">Beta</Badge>
            </h5>
            <p className="text-muted mb-3">
              A powerful document management system with AI-powered features for enhanced productivity.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-decoration-none text-muted">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="text-decoration-none text-muted">
                <FaGithub size={18} />
              </a>
              <a href="#" className="text-decoration-none text-muted">
                <FaLinkedin size={18} />
              </a>
            </div>
          </Col>
          
          <Col sm={6} md={4} lg={3} className="mb-4 mb-md-0">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Home</a></li>
              <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Documents</a></li>
              <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Library</a></li>
              <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Settings</a></li>
            </ul>
          </Col>
          
          <Col sm={6} md={4} lg={3}>
            <h6 className="mb-3">Help & Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Documentation</a></li>
              <li className="mb-2"><a href="#" className="text-decoration-none text-muted">FAQ</a></li>
              <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Contact Us</a></li>
              <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Privacy Policy</a></li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4 bg-secondary" />
        
        <Row>
          <Col md={6} className="text-center text-md-start text-muted mb-2 mb-md-0">
            <small>&copy; {currentYear} NotebookLM. All rights reserved.</small>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <small className="text-muted">Made with ❤️ by the NotebookLM Team</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
