import React, { Fragment, useEffect,useState } from 'react';
import { productDetailsReducer } from '../../reducer/productReducer';
import "./ProductDetails.css"
import {useSelector,useDispatch}from "react-redux"
import { clearErrors, getProductDetails,newReview } from '../../actions/productAction';
import { useParams } from 'react-router-dom';
import Rating from 'react-rating-stars-component'
import ReviewCard from "./ReviewCard.js";
import Loader from "../Loader";
import {useAlert} from "react-alert";
import { CLEAR_ERROR } from '../../constants/productConstant';
import Header from '../layout/header/Header';
import { addItemsToCart } from '../../actions/cartAction';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
// import { Rating } from "@material-ui/lab";

const ProductDetails = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const params = useParams();
    console.log(params)
    const {product,loading,error}=useSelector((state)=>state.productDetails);
    const {isAuthenticated} = useSelector((state)=>state.user);
    console.log(isAuthenticated+"auth")

    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(()=>{
         if(error){
            alert.error(error);
            dispatch(clearErrors())
         }
         dispatch(getProductDetails(params.id))
    },[dispatch,params.id,error,alert]);


    const options={
        edit:false,
        color:'gold',
        activeColor : 'tomato',
        size: window.innerWidth < 600?15:20,
        value : product.ratings,
        isHalf:true,
    }

    // const [quantity, setQuantity] = useState(1);


    const increaseQuantity = () => {
      if (product.Stock <= quantity) return;
  
      const qty = quantity + 1;
      setQuantity(qty);
    };
  
    const decreaseQuantity = () => {
      if (1 >= quantity) return;
  
      const qty = quantity - 1;
      setQuantity(qty);
    };

    
      const addToCartHandler = ()=>{
        if(isAuthenticated){dispatch(addItemsToCart(params.id,quantity));
      alert.success("Item Added to the Cart")}else{
        alert.error("you have to login first");return;
      }
    }

    const submitReviewToggle = () => {
      open ? setOpen(false) : setOpen(true);
    };
  
    const reviewSubmitHandler = () => {
      const myForm = new FormData();
  
      myForm.set("rating", rating);
      myForm.set("comment", comment);
      myForm.set("productId", params.id);
  
      dispatch(newReview(myForm));
  
      setOpen(false);
    };


  return (
      <Fragment>
          {loading ? <Loader/> : <Fragment>
          <div className='back'></div>
          <div className='ProductDetails'>
            {/* <div className='parent'> */}

             {/* <button id="leftarrow" onclick={moveleft()}>left </button> */}
             <div id='imgs'>
                {product.images&&
                  product.images.map((item,i)=>(
                     <img
                     src={item.url}
                     alt={`${1}`}
                     id={`${i}`}/>
                 ))
                }
             </div>
             {/* <button id="rightarrow" onclick={moveright()}>right</button> */}

            {/* </div> */}
          <div>

              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({product.numofReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">

                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                      <span>{quantity}</span> 
                    <button onClick={increaseQuantity}>+</button>
                  </div>

                  <button
                    disabled={product.Stock < 1 ? true : false}
                    onClick={addToCartHandler}
                    className='addToCart'
                  >
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button onClick={submitReviewToggle}  className="submitReview">
                Submit Review
              </button>
            </div>
           </div>
           <h3 className="reviewsHeading">REVIEWS</h3>

           <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
           {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
      </Fragment>}
      </Fragment>
  );
};

export default ProductDetails;
