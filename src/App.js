import React, { useState, useEffect, useReducer } from "react";
import DisplayPortfolio from "./components/DisplayPortfolio";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ModalStocks from "./components/ModalStocks";

function App() {
  // State to store the fetched data
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const [ticker, setSymbol] = useState(null);
  const [search, setSearch] = useState({});
  const [update, setUpdate] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [userId, setUserId] = useState("");
  const [showModal, setShowModal] = useState(false);
  //const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  // Function to fetch data from the API
  async function fetchData(userId) {
    try {
      const response = await fetch(
        `https://itrulle-mcsbt-integration.ew.r.appspot.com/${userId}`
      );
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  useEffect(() => {
    if (loggedIn) {
      fetchData(userId); // Fetch data only when logged in
    }
  }, [update, userId]);

  const handleDetailsClick = async (symbol) => {
    try {
      const response = await fetch(
        `https://itrulle-mcsbt-integration.ew.r.appspot.com/ticker/${symbol}`
      );
      const jsonData = await response.json();
      setDetails(jsonData);
      setSymbol(symbol);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const searchSymbol = async (symbol) => {
    try {
      const response = await fetch(
        `https://itrulle-mcsbt-integration.ew.r.appspot.com/search/${symbol}`
      );
      const jsonData = await response.json();
      setSearch(jsonData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  async function modifyStockPost(modProp) {
    try {
      const modifiedProperties = {
        ...modProp,
        userId: userId, // Assuming userId is accessible in this scope
      };
      const response = await fetch(
        "https://itrulle-mcsbt-integration.ew.r.appspot.com/edit_stock",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Referrer-Policy": "origin-when-cross-origin",
          },
          body: JSON.stringify(modifiedProperties),
        }
      );
      const responseData = await response.json();
      setUpdate(responseData);
      return responseData;
    } catch (error) {
      console.error("Error sending POST request:", error);
      return {
        error_code: 500,
        message: "An error occurred editing the stocks",
      };
    }
    //forceUpdate();
  }

  async function fetchLogin(userLogin) {
    try {
      const response = await fetch(
        "https://itrulle-mcsbt-integration.ew.r.appspot.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Referrer-Policy": "origin-when-cross-origin",
          },
          body: JSON.stringify(userLogin),
        }
      );
      const responseData = await response.json();
      setUpdate(responseData);
      setUserId(userLogin.userId);
      return responseData;
    } catch (error) {
      console.error("Error sending POST request:", error);
      return {
        error_code: 500,
        message: "An error occurred in the login",
      };
    }
    //forceUpdate();
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userId = localStorage.getItem("userId");
    if (isLoggedIn && userId) {
      setLoggedIn(true);
      setUserId(userId);
    }
  }, []);

  return (
    <div className="App">
      {loggedIn ? (
        <>
          <DisplayPortfolio
            data={data}
            details={details}
            handleDetailsClick={handleDetailsClick}
            searchSymbol={searchSymbol}
            search={search}
            postStock={modifyStockPost}
            setShowModal={setShowModal}
            setLoggedIn={setLoggedIn}
            setShowSignUp={setShowSignUp}
          />
          {showModal && (
            <ModalStocks
              postStock={modifyStockPost}
              setShowModal={setShowModal}
              show={showModal}
              portfolio={data}
            />
          )}
        </>
      ) : showSignUp ? (
        <SignUp
          fetchLogin={fetchLogin}
          setLoggedIn={setLoggedIn}
          setShowSignUp={setShowSignUp}
        />
      ) : (
        <Login
          fetchLogin={fetchLogin}
          setLoggedIn={setLoggedIn}
          setShowSignUp={setShowSignUp}
        />
      )}
    </div>
  );
}

export default App;
