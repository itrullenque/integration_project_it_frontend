import React, { useState, useEffect } from "react";
import { Container, Col, Row, InputGroup, FormControl } from "react-bootstrap";
import { Accordion, Card, Button } from "react-bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Spinner from "react-bootstrap/Spinner";
import ModalStocks from "./ModalStocks";

function DisplayPortfolio({
  data,
  details,
  handleDetailsClick,
  searchSymbol,
  search,
  postStock,
}) {
  const [loadingComp, setLoadingComp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [activeKey, setActiveKey] = useState(null); // Track the active accordion - Here i know the state
  const [searchItem, setSearchItem] = useState("");
  const [searchResults, setSearchResults] = useState({});
  const [showModal, setShowModal] = useState(false);
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

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="App" style={{ marginTop: "30px" }}>
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
                          <table className="table">
                            <thead>
                              <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Open</th>
                                <th scope="col">High</th>
                                <th scope="col">Low</th>
                                <th scope="col">Close</th>
                                <th scope="col">Volume</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(sortedDetails).map(
                                ([date, value], index) => (
                                  <tr key={index}>
                                    <td>{date}</td>
                                    <td>{value["1. open"]}</td>
                                    <td>{value["2. high"]}</td>
                                    <td>{value["3. low"]}</td>
                                    <td>{value["4. close"]}</td>
                                    <td>{value["5. volume"]}</td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Col>
              </Container>
            ))}
          {showModal && (
            <ModalStocks
              show={showModal}
              handleClose={handleCloseModal}
              portfolio={displayData}
              postStock={postStock}
            />
          )}
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default DisplayPortfolio;
