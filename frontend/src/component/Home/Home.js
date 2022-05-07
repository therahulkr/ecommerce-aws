import React, { Fragment, useEffect } from 'react';
import "./Home.css";
import Product from "./ProductCard.js";
import MetaData from "../layout/MetaData"
import {useSelector,useDispatch} from "react-redux";
import {clearErrors, getProduct} from "../../actions/productAction"
import Loader from '../Loader';
import { useAlert } from "react-alert";
import Header from '../layout/header/Header';



const Home = () => {
  const alert = useAlert();
  const { loading, error, products,productsCount } = useSelector((state) => state.products);
    console.log(products);
    
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }
        dispatch(getProduct());
      }, [dispatch, error, alert]);
    

return( 
    <Fragment>
        {loading? (<Loader/>): (<Fragment>

<MetaData title="HOME PAGE"/>
<div className='banner'>
    <p>
    Welcome to the Ecommerce
    </p>
    <h1>
        Find some Amazing Products
    </h1>
    <a href="#homehandling">
        <button>Scroll <i class="fas fa-mouse"></i></button>
    </a>
</div >
<h2 className='homehandling'id="homehandling">Featured Products</h2>

 <div className='container' id="container">
     {products && products.map(product=>(
         <Product product={product}/>
     ))}
     {/* <Product product={product}/> */}
 </div>

</Fragment>)}
    </Fragment>
 );
};



export default Home;
