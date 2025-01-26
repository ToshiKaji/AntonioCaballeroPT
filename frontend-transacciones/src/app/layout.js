'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from 'react-bootstrap';
import {Container} from 'react-bootstrap';
import { Proveedor } from './Contexto/contexto';



export default function RootLayout({ children }) {

  //con el uso del contexto trasladare el id de la tarjeta entre vsitas sin consultas extras y sin exponer el mismo a vista del usuario


  return (
    <html lang="en">
      
        <body className='container-fluid p-0' bg="dark" data-bs-theme="dark">
        <Navbar bg="secondary" data-bs-theme="dark">     
          <Container>
            <Navbar.Brand href='/'>Prueba Tecnica</Navbar.Brand>
          </Container>
        </Navbar>
          <Proveedor>
            {children}
          </Proveedor>
        
        </body>
    </html>
  );
}

