import React, { useState, useEffect, useReducer } from "react";
import DisplayPortfolio from "./components/DisplayPortfolio";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ModalStocks from "./components/ModalStocks";

function App() {
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const [ticker, setSymbol] = useState(null);
  const [search, setSearch] = useState({});
  const [update, setUpdate] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [userId, setUserId] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Function to fetch data from the API
  async function fetchData(userId) {
    try {
      const response = await fetch(`http://127.0.0.1:5000/${userId}`, {
        credentials: "include",
      });
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
      const response = await fetch(`http://127.0.0.1:5000/ticker/${symbol}`, {
        credentials: "include",
      });
      const jsonData = await response.json();
      setDetails(jsonData);
      setSymbol(symbol);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const searchSymbol = async (symbol) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/search/${symbol}`, {
        credentials: "include",
      });
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
      const response = await fetch("http://127.0.0.1:5000/edit_stock", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Referrer-Policy": "origin-when-cross-origin",
        },
        body: JSON.stringify(modifiedProperties),
      });
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
  }

  async function fetchLogin(userLogin) {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Referrer-Policy": "origin-when-cross-origin",
        },
        body: JSON.stringify(userLogin),
      });
      const responseData = await response.json();
      if (responseData && responseData.error_code === 200) {
        setUpdate(responseData);
        setUserId(userLogin.userId);
      } else {
        console.log("no info for the user");
      }
      return responseData;
    } catch (error) {
      console.error("Error sending POST request:", error);
      return {
        error_code: 500,
        message: "An error occurred in the login",
      };
    }
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userId = localStorage.getItem("userId");
    if (isLoggedIn && userId) {
      setLoggedIn(true);
      setUserId(userId);
    }
  }, []);

  async function fetchLogout() {
    try {
      const response = await fetch("http://127.0.0.1:5000/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Referrer-Policy": "origin-when-cross-origin",
        },
        body: JSON.stringify(),
      });
      const responseData = await response.json();
      if (responseData && responseData.error_code === 200) {
        setUserId("");
        setLoggedIn(false);
      }
      return responseData;
    } catch (error) {
      console.error("Error sending POST request:", error);
      return {
        error_code: 500,
        message: "An error occurred in the logout",
      };
    }
  }

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
            fetchLogout={fetchLogout}
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
