import React from 'react';
import {Link} from 'react-router-dom'
import {FiArrowRight} from 'react-icons/fi'
import '../styles/pages/landing.css';

import logoImg from '../images/logo.svg';

function Landing() {
  return (

    <div id="page-landing" className="animate__animated animate__fadeIn">
      <div className="content-wrapper">
        <div className="image-container">

          <img src={logoImg} alt="Logo" className="animate__animated animate__backInLeft" />
          <div className="location">
            <strong>Rio de Janeiro</strong>
            <span>RJ</span>
          </div>
        </div>
        <main>
          <h1 className="animate__animated animate__fadeInDown">Leve felicidade para o mundo</h1>
          <p className=" animate__animated animate__fadeInUp">Visite orfanatose mude o dia de muitas crianças.</p>
        </main>
        <Link to="/app" className="enter-app">
          <FiArrowRight size={26} color="rgba(0,0,0,0.6)" />
        </Link>
        <Link to="/login" className="button-login">
          Área restrita
        </Link>
      </div>
    </div>
  )

}

export default Landing;
