import React from 'react';
import "./Footer.css"

const Footer = () => {
  return (
      <section id="details">

          <div className="number">
          <a className="webname" href="/" style={{
              width:"30%"
          }}>
              Ecommerce
          </a>
              <div id="inner">
              <h1>Contact Details:</h1>
                  <ol>
                      <li>Rahul Kumar</li>
                      <li>8178595005</li>
                      <li>rk19980555@gmail.com</li>
                  </ol>
              </div>
          </div>

          <div id="icon">
                <img src={require('../images/whitapp/fblogo.jpeg')}/>
                <img src={require('../images/whitapp/instalogo.jpeg')}/>
                <img src={require('../images/whitapp/ytubelogo.jpeg')}/>
                <img src={require('../images/whitapp/twitter.jpeg')}/>
                <a href="#join"><img id="waimg" src={require('../images/whitapp/wa.jpeg')}/></a>

    </div>


      </section>
  );
};

export default Footer;

