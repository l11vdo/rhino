import React from 'react';
import { Container } from 'react-bootstrap';

function Header() {
  return (
    <Container>
        <img src={require('../../assets/drinks-text.png')} height={window.innerHeight/10} alt="Drinks!!!" style={{padding: 10}}/>
    </Container>
  )
}

export default Header;