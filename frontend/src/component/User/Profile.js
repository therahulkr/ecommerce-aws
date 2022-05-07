import React, { Fragment, useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import Loader from "../Loader";
import { Link } from "react-router-dom";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import Header from "../layout/header/Header";



const Profile = () => {
    // const dispatch = useDispatch();

  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  console.log(isAuthenticated);

  
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/");
    }
  }, [navigate, isAuthenticated]);

  return (
    <Fragment>
         {loading ? (
            <Loader />
          ) : (
            <Fragment>
                {/* <div className="back"></div> */}
              <MetaData title={`${user.name}'s Profile`} />
              <div className="profileContainer">
                <div>
                  <h1>My Profile</h1>
                  <img src={user.avatar.url} alt={user.name} />
                  <Link to="/profile/update">Edit Profile</Link>
                </div>
                <div>
                  <div>
                    <h4>Full Name</h4>
                    <p>{user.name}</p>
                  </div>
                  <div>
                    <h4>Email</h4>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <h4>Joined On</h4>
                    <p>{String(user.createdAt).substr(0, 10)}</p>
                  </div>
                  <div>
                    <h4>Role</h4>
                    <p>{user.role}</p>
                  </div>
                  <div>
                    <Link to="/orders">My Orders</Link>
                    <Link to="/password/update">Change Password</Link>
                  </div>
                </div>
              </div>
            </Fragment>
          )}
        </Fragment>
  );
};

export default Profile;
