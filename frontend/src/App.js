import './App.css';
import React from "react";
import {BrowserRouter as Router,Routes,Route, useParams, useNavigate} from "react-router-dom"
import Header from "./component/layout/header/Header.js"
import Footer from './component/layout/footer/Footer.js';
import Home from './component/Home/Home.js';
import Loader from './component/Loader';
// import { route } from 'express/lib/application';
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from './component/Product/Products.js';
import Search from "./component/Product/Search.js"
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store"
import { useEffect,useState } from 'react';
// import userOptions from './component/layout/header/userOptions';
import { loadUser } from './actions/userAction';
import { useSelector,useDispatch } from 'react-redux';
import Profile from "./component/User/Profile.js";
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from "./component/User/UpdateProfile.js"
import ForgotPassword from './component/User/ForgotPassword';
import UpdatePassword from "./component/User/UpdatePassword"
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from './component/Cart/ConfirmOrder';
import axios from "axios";
import Payment from './component/Cart/Payment.js';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js"
import OrderDetails from "./component/Order/OrderDetails.js"
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct.js";
import UpdateProduct from "./component/Admin/UpdateProduct.js";
import OrderList from "./component/Admin/OrderList.js";
import ProcessOrder from "./component/Admin/ProcessOrder.js";
import UsersList from "./component/Admin/UsersList.js";
import UpdateUser from "./component/Admin/UpdateUser.js";
import ProductReviews from "./component/Admin/ProductReviews.js";
import About from "./component/layout/About/About.js";


function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(()=>{
    store.dispatch(loadUser());
    getStripeApiKey();
  },[]);

const {isAuthenticated,user} = useSelector((state)=>state.user);

// window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
<div>


    <Router>
      <Header/>
     
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/product/:id" element={<ProductDetails/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/products/:keyword" element={<Products/>}/>
        <Route path="/login" element={<LoginSignUp/>}/>
        <Route path="/password/forgot" element={<ForgotPassword/>}/>
        <Route  path="/password/reset/:token" element={<ResetPassword/>} />
        <Route path="/about" element={<About/>}/>

<Route element={<ProtectedRoute auth={isAuthenticated}/>}>
              <Route path="/profile/update" element={<UpdateProfile/>}/>
              <Route path="/account" element={<Profile/>}/>
              <Route path="/password/update" element={<UpdatePassword/>}/>
              <Route  path="/cart" element={<Cart/>} />
              <Route  path="/shipping" element={<Shipping/>} />
              <Route  path="/order/confirm" element={<ConfirmOrder/>} />
              <Route path="/process/payment" element={<Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements>}/>
              <Route  path="/success" element={<OrderSuccess/>} />
              <Route  path="/orders" element={<MyOrders/>} />
              <Route  path="/order/:id" element={<OrderDetails/>} />

              {/* <Route element={<ProtectedRoute2 role={user.role}/>}> */}
                  <Route  path="/admin/dashboard" element={<Dashboard/>} />
                  <Route  path="/admin/products" element={<ProductList/>} />
                  <Route  path="/admin/product" element={<NewProduct/>} />
                  <Route  path="/admin/product/:id" element={<UpdateProduct/>} />
                  <Route  path="/admin/orders" element={<OrderList/>} />
                  <Route  path="/admin/order/:id" element={<ProcessOrder/>} />
                  <Route  path="/admin/users" element={<UsersList/>} />
                  <Route  path="/admin/user/:id" element={<UpdateUser/>} />
                  <Route  path="/admin/reviews" element={<ProductReviews/>} />
              {/* </Route> */}
</Route>
          
              
         <Route path="*" element={<h1>not found</h1>}/>
        
      </Routes>
        <Footer/>
    </Router>
    </div>
  );
}



export default App;
