

import React, { useState, Fragment } from "react";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";
// import "./Search.css";

const Search = ({ history }) => {
  const [keyword, setKeyword] = useState("");
  let navigate = useNavigate();

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <Fragment>
      <MetaData title="Search A Product -- ECOMMERCE" />
      <form id="searchbar" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Q" />
      </form>
    </Fragment>
  );
};

export default Search;
