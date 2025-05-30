import React from 'react';
import { Container } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';

/**
 * Layout component that wraps the application content
 * Includes header and footer
 */
const Layout = ({ children, onSearch }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header onSearch={onSearch} />
      
      <Container fluid className="flex-grow-1 py-4">
        <main>
          {children}
        </main>
      </Container>
      
      <Footer />
    </div>
  );
};

export default Layout;
