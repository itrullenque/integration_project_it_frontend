import React, { useState, useEffect } from "react";
import { Container, Col, Row, InputGroup, FormControl } from "react-bootstrap";
import { Accordion, Button } from "react-bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Spinner from "react-bootstrap/Spinner";
import StockGraph from "./StockGraph";

function DisplayPortfolio({
  data,
  details,
  handleDetailsClick,
  searchSymbol,
  search,
  setShowModal,
  setLoggedIn,
  setShowSignUp,
  fetchLogout,
}) {
  const [loadingComp, setLoadingComp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [activeKey, setActiveKey] = useState(null); // Track the active accordion - Here i know the state
  const [searchItem, setSearchItem] = useState("");
  const [searchResults, setSearchResults] = useState({});
  const [displayData, setDisplayData] = useState(data);
  const [sortedDetails, setSortedDetails] = useState([]);

  useEffect(() => {
    setDisplayData(data);
  }, [data]);

  const handleToggle = (eventKey) => {
    if (activeKey !== eventKey) {
      setActiveKey(eventKey); // Close previously open accordion changing the state of the activeKey
    }

    handleAccordionOpen(eventKey);
  };

  const handleAccordionOpen = async (eventKey) => {
    if (eventKey !== null) {
      setLoading(true);
      await handleDetailsClick(eventKey);
      setLoading(false);
    }
  };

  // Sort the details by date
  const sortDetailsByDate = () => {
    const sortedDetails = Object.entries(details).sort(
      ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
    );
    return Object.fromEntries(sortedDetails);
  };

  useEffect(() => {
    updateSortedDetails(details);
  }, [details]);

  function updateSortedDetails() {
    setLoadingComp(true);
    const sortedData = sortDetailsByDate();
    setSortedDetails(sortedData);
    setLoadingComp(false);
  }

  //Search bar to display the results
  const handleSearchChange = (event) => {
    if (event.target.value === "") {
      setSearchItem("");
      setSearchResults({});
      handleChangeAgain(); // Call the function to clear results
    } else {
      setSearchItem(event.target.value);
    }
  };

  const handleChangeAgain = () => {
    setSearchResults({}); // Set searchResults to an empty object
  };

  //executing the search for a specific stock
  const searchStocks = async () => {
    if (searchItem !== "") {
      setSearchResults({});
      setLoadingSearch(true);
      await searchSymbol(searchItem);
      setSearchResults(search);
      setLoadingSearch(false);
    } else {
      handleChangeAgain();
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const signOut = () => {
    setLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    setDisplayData({});
    setShowSignUp(false);
    fetchLogout();
  };

  const prepareChartData = (sortedDetails) => {
    const labels = Object.keys(sortedDetails).reverse();
    const data = Object.values(sortedDetails)
      .map((detail) => detail["4. close"])
      .reverse();

    return {
      labels,
      datasets: [
        {
          label: "Close Price",
          data,
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
        },
      ],
    };
  };

  return (
    <div className="App" style={{ marginTop: "30px" }}>
      <Col className="d-flex justify-content-center">
        <Button variant="secondary" onClick={signOut}>
          Sign Out
        </Button>
      </Col>
      <Container className="mb-4">
        <h1>Stock Tracker</h1>
        <Button variant="primary" onClick={handleShowModal}>
          Edit portfolio
        </Button>
      </Container>
      <Container className="mb-4">
        <Row>
          <Col xs={6}>
            <InputGroup className="text-center">
              <FormControl
                xs={1}
                aria-label="Search for stocks"
                aria-describedby="search-button"
                placeholder="Search for stocks"
                value={searchItem}
                onChange={handleSearchChange}
              />
              <Button
                variant="outline-primary"
                id="search-button"
                onClick={searchStocks}
              >
                Search
              </Button>
            </InputGroup>
          </Col>
        </Row>
        <Container>
          {loadingSearch ? (
            <Spinner animation="border" role="status" variant="secondary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            // Render search results only if searchResults is not empty
            Object.entries(searchResults).length > 0 && (
              <div>
                <ul>
                  {Object.entries(search).map(([symbol, companyName]) => (
                    <li key={symbol}>
                      {symbol} - {companyName}
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </Container>
      </Container>

      {loadingComp ? (
        <Container>
          <Spinner animation="border" role="status" variant="secondary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      ) : (
        <Container className="mb-4">
          <h5>My Portfolio</h5>
          <h5 style={{ color: "grey", fontWeight: "bold" }}>
            {displayData.portfolio_value && (
              <>
                Value:{" "}
                {`USD ${new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(displayData.portfolio_value)}`}
              </>
            )}
          </h5>
        </Container>
      )}

      {Object.keys(displayData).length > 0 ? (
        <div>
          {Object.entries(displayData)
            .filter(([symbol]) => symbol !== "portfolio_value")
            .map(([symbol, value], index) => (
              <Container key={index} className="text-center">
                <Col xs={6}>
                  <Accordion activeKey={activeKey} onSelect={handleToggle}>
                    <Accordion.Item
                      key={index}
                      eventKey={symbol}
                      id={`accordion-item-${symbol}`} // no necessary
                    >
                      <Accordion.Header>
                        <span className="badge bg-primary">
                          {value.quantity}
                        </span>
                        <span>&nbsp;</span>
                        <span style={{ fontWeight: "bold" }}>{symbol} - </span>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(value.total_value)}
                      </Accordion.Header>

                      <Accordion.Body>
                        {loading ? (
                          <Spinner
                            animation="border"
                            role="status"
                            variant="secondary"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        ) : (
                          <StockGraph
                            chartData={prepareChartData(sortedDetails)}
                          />
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Col>
              </Container>
            ))}
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default DisplayPortfolio;
