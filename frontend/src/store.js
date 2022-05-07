import {createStore,combineReducers,applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import  {productReducer,productDetailsReducer, newProductReducer,
   productsReducer, productReviewsReducer, reviewReducer, newReviewReducer} from "./reducer/productReducer";
import { allUsersReducer, forgotPasswordReducer, profileReducer, userDetailsReducer, userReducer } from "./reducer/userReducer";
import { cartReducer } from "./reducer/cartReducer";
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer, orderReducer } from "./reducer/orderReducer";

const reducer = combineReducers({
     products : productReducer,
     productDetails : productDetailsReducer,
     user : userReducer,
     profile : profileReducer,
     forgotPassword: forgotPasswordReducer,
     cart : cartReducer,
     newOrder:newOrderReducer,
     myOrders: myOrdersReducer,
     orderDetails: orderDetailsReducer,
     newProduct: newProductReducer,
     product: productsReducer,
     allOrders: allOrdersReducer,
     newReview: newReviewReducer,
     order: orderReducer,
     allUsers: allUsersReducer,
     userDetails: userDetailsReducer,
     productReviews: productReviewsReducer,
     review: reviewReducer,
});
let initialState={
    cart: {
        cartItems: localStorage.getItem("cartItems")
          ? JSON.parse(localStorage.getItem("cartItems"))
          : [],
        shippingInfo: localStorage.getItem("shippingInfo")
          ? JSON.parse(localStorage.getItem("shippingInfo"))
          : {},
      },
};
const middleware = [thunk];
const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);
export default store;





















