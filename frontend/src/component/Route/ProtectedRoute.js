// import React, { Fragment } from "react";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Loader from "../Loader";

const  ProtectedRoute = (props) => {

  return <Fragment>
    {props.auth?<Outlet/>:<Navigate to="/login"/>}
  </Fragment>

};

export default ProtectedRoute;
