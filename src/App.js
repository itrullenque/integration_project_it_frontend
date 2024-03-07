import React, { useState, useEffect, useReducer } from "react";
import DisplayPortfolio from "./components/DisplayPortfolio";

function App() {
  // State to store the fetched data
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const [ticker, setSymbol] = useState(null);
  const [search, setSearch] = useState({});
  const [update, setUpdate] = useState(null);
  //const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://itrulle-mcsbt-integration.ew.r.appspot.com/"
      );
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [update]);

  const handleDetailsClick = async (symbol) => {
    try {
      const response = await fetch(
        `https://itrulle-mcsbt-integration.ew.r.appspot.com/${symbol}`
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
      console.log("in the app", symbol);
      const response = await fetch(
        `https://itrulle-mcsbt-integration.ew.r.appspot.com/search/${symbol}`
      );
      const jsonData = await response.json();
      setSearch(jsonData);
      console.log("in the app", jsonData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  async function modifyStockPost(modProp) {
    try {
      const response = await fetch(
        "https://itrulle-mcsbt-integration.ew.r.appspot.com/edit_stock",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Referrer-Policy": "origin-when-cross-origin",
          },
          body: JSON.stringify(modProp),
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

  return (
    <div className="App">
      <DisplayPortfolio
        data={data}
        details={details}
        handleDetailsClick={handleDetailsClick}
        searchSymbol={searchSymbol}
        search={search}
        postStock={modifyStockPost}
      />
    </div>
  );
}

export default App;
