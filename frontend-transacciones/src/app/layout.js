'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from 'react-bootstrap';
import {Container} from 'react-bootstrap';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
        <body className='container-fluid p-0' bg="dark" data-bs-theme="dark">
        <Navbar bg="secondary" data-bs-theme="dark">     
          <Container>
            <Navbar.Brand href='/'>Prueba Tecnica</Navbar.Brand>
          </Container>
        </Navbar>
        {children}
        </body>
    </html>
  );
}
