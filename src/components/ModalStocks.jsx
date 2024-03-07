import React, { useState, useEffect } from "react";
import { Modal, Button, Container, Col, Row } from "react-bootstrap"; // Assuming you're using Bootstrap
import "./Styles.css";

const ModalStocks = ({ show, handleClose, portfolio, postStock }) => {
  const [selectedStock, setSelectedStock] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [newStock, setNewStock] = useState("");
  const [newStockName, setNewStockName] = useState("");
  const [newStockQuantity, setNewStockQuantity] = useState(0);
  const [response, setResponse] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [stockId, setStockId] = useState(null);

  console.log(portfolio);
  const handleStockChange = (event) => {
    const selectedSymbol = event.target.value;
    console.log("event", event.target.value);
    if (selectedSymbol && portfolio[selectedSymbol]) {
      setSelectedStock(selectedSymbol);
      setQuantity(portfolio[selectedSymbol].quantity);
      setStockId(portfolio[selectedSymbol].stock_id);
      setNewStock("");
    } else if (selectedSymbol === "8") {
      setSelectedStock("");
      setNewStock("newStock");
      setQuantity(0);
    } else {
      setSelectedStock("");
      setNewStock("");
      setQuantity(0);
    }
  };

  const handleNewStockQuantityChange = (event) => {
    const quantityInput = event.target.value;
    if (/^\d+$/.test(quantityInput) && parseInt(quantityInput) > 0) {
      setNewStockQuantity(quantityInput);
    } else {
      setResponse("Quantity must be a positive integer");
      setNewStockQuantity(0);
    }
  };

  const handleQuantityChange = (event) => {
    const quantityInput = event.target.value;
    if (/^\d+$/.test(quantityInput) && parseInt(quantityInput) > 0) {
      setQuantity(quantityInput);
    } else {
      setResponse("Quantity must be a positive integer");
      setQuantity(0);
    }
  };

  const handleNewStockNameChange = (event) => {
    setNewStockName(event.target.value);
  };

  const handleSubmit = async () => {
    if (newStock) {
      console.log("new stock", newStock);
      const createStock = {
        action: "create",
        newStockName,
        newStockQuantity,
        stockId,
      };
      const upperNameStock = createStock.newStockName.toUpperCase();
      let stockExist = false;
      for (const stockName in portfolio) {
        if (upperNameStock === stockName) {
          stockExist = true;
          break;
        }
      }
      if (stockExist === false) {
        let responseData = await postStock(createStock);
        setResponse(responseData);
      } else {
        setResponse(
          `Stock ${createStock.newStockName} is already in the portfolio`
        );
      }
    } else {
      const modifyStock = {
        action: "modify",
        selectedStock,
        quantity,
        stockId,
      };
      console.log("mody:", modifyStock);
      let responseData = await postStock(modifyStock);
      console.log(responseData);
      setResponse(responseData);
    }
  };

  const handleDelete = async () => {
    const modifyStock = {
      action: "delete",
      selectedStock,
      quantity,
      stockId,
    };
    console.log("delete:", modifyStock);
    let responseData = await postStock(modifyStock);
    setResponse(responseData);
    setSelectedStock("");
    handleClose();
  };

  useEffect(() => {
    console.log("in use effect", response);
    if (response) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [response]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Stock Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Container className="mb-4">
          <p>Select a stock to edit its quantity or add a new one.</p>{" "}
          {/* Legend for clarification */}
          <select
            className="form-select"
            aria-label="Stock selection"
            defaultValue="" // No pre-selected option
            onChange={handleStockChange} // Your handler function
          >
            <option value="" disabled>
              Select the options
            </option>{" "}
            <option value="8">--Add new stock--</option>
            {Object.entries(portfolio)
              .filter(([symbol]) => symbol !== "portfolio_value")
              .map(([symbol, data]) => (
                <option key={symbol} value={symbol}>
                  {symbol} - {data.quantity}
                </option>
              ))}
          </select>
          {newStock && (
            <Container className="mt-4">
              <Col xs={4}>
                <Row>
                  <label htmlFor="newStockNameInput">New Stock Name: </label>
                  <input
                    type="text"
                    id="newStockNameInput"
                    value={newStockName}
                    onChange={handleNewStockNameChange}
                  />
                </Row>

                <Row>
                  <label htmlFor="newStockQuantityInput">Quantity: </label>
                  <input
                    type="number"
                    id="newStockQuantityInput"
                    value={newStockQuantity}
                    onChange={handleNewStockQuantityChange}
                  />
                </Row>
              </Col>
            </Container>
          )}
        </Container>

        <Container className="mt-4">
          {selectedStock && !newStock && (
            <div>
              <label htmlFor="quantityInput">Quantity: </label>
              <input
                type="number"
                id="quantityInput"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
          )}
        </Container>
      </Modal.Body>

      <Modal.Footer>
        <div>
          {showMessage && (
            <div className={response.error_code === 200 ? "success" : "error"}>
              {response.error_code && response.message ? (
                <p>{response.message}</p>
              ) : (
                <p>{response}</p>
              )}
            </div>
          )}
        </div>
        {selectedStock && !newStock && (
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        )}
        <Button variant="primary" onClick={handleSubmit}>
          Send Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalStocks;
