import React, { useState,Fragment, useEffect } from 'react';
import "./Header.css";
import media from "../images/whitapp/fblogo.jpeg"
import { Link } from "react-router-dom";
import Search from '../../Product/Search';
import { logout } from "../../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import store from "../../../store";
import { loadUser } from '../../../actions/userAction';
import {useNavigate} from "react-router-dom"
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import About from "../About/About";

import { useAlert } from "react-alert";

const Header = () => {
        const alert = useAlert();
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const { isAuthenticated, user } 
        = useSelector((state) => state.user);
        
        console.log(isAuthenticated);
        function logoutUser() {
            dispatch(logout());
            alert.success("Logout Successfully");
            navigate("/")
        }
        function cart() {
            navigate("/cart");
          }
          function orders() {
            navigate("/orders");
          }
          function account() {
            navigate("/account");
          }
          function dashboard() {
            navigate("/admin/dashboard");
          }

return (
    <nav id="navigation">
        <div id='phelasection'>
            <Link className="webname" to="/">
            Ecommerce
        </Link>
            {/* <img
            // className="speedDialIcon"
            src={user.avatar.url ? user.avatar.url : "/Profile.png"}
            alt="Profile"
          /> */}
          <Search/>
          </div>
        <ul id = "heading">
                <li><Link to="/">HOME</Link></li>
                <li><Link to="/about">ABOUT</Link></li>
                <li><Link to="/products">PRODUCTS</Link></li>
                <li><a href="#details">CONTACT-US</a></li>
                {!isAuthenticated?(<Link to="/login" ><ExitToAppIcon /></Link>):
                    (<div> 
                      <div className="dropdown">
                    <div className="dropbtn">
                    <PersonIcon /></div>
                    
                    <div className="dropdown-content">
                   { (user.role==="admin") && <a onClick={dashboard}><DashboardIcon />Dashboard</a>}
                      <a onClick={orders}><ListAltIcon />Orders</a>
                      <a onClick={account}><PersonIcon />My Account</a>
                      <a onClick={cart}><ShoppingCartIcon/>Cart</a>
                      <a onClick={logoutUser}><ExitToAppIcon />LOG-OUT</a>
                    </div>

</div>

                    </div>)
                    } 
                {/* <li>{isAuthenticated && <a onClick={logoutUser}>LOG-OUT</a>}</li> */}
        </ul>
        
            
            {/* <div id="searchbar"> */}
        
                {/* </div> */}
               

              
    </nav>
);
};

export default Header;

