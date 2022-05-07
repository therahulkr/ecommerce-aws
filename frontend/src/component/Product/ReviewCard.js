// import { Rating } from "@material-ui/lab";
import React from "react";
import profilePng from "../layout/images/Profile.png";
import Rating from "react-rating-stars-component";

const ReviewCard = ({ review }) => {
  const options = {
    dit:false,
        color:'gold',
        activeColor : 'tomato',
        size: window.innerWidth < 600?15:20,
        value : review.rating,
        isHalf:true,
  };

  return (
    <div className="reviewCard">
      <img src={profilePng} alt="User" />
      <p>{review.name}</p>
      <Rating {...options} />
      <span className="reviewCardComment">{review.comment}</span>
    </div>
  );
};

export default ReviewCard;
