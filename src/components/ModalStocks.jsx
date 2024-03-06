import React, { useState } from "react";
import { Modal, Button, Container, Col, Row } from "react-bootstrap"; // Assuming you're using Bootstrap

const ModalStocks = ({ show, handleClose, portfolio, postStock }) => {
  const [selectedStock, setSelectedStock] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [newStock, setNewStock] = useState("");
  const [newStockName, setNewStockName] = useState("");
  const [newStockQuantity, setNewStockQuantity] = useState(0);

  const handleStockChange = (event) => {
    const selectedSymbol = event.target.value;
    if (selectedSymbol && portfolio[selectedSymbol]) {
      setSelectedStock(selectedSymbol);
      setQuantity(portfolio[selectedSymbol].quantity);
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
    setNewStockQuantity(event.target.value);
  };

  const handleNewStockNameChange = (event) => {
    setNewStockName(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleSubmit = async () => {
    console.log("New Stock Name:", newStockName, newStockQuantity);
    if (newStock) {
      const createStock = {
        action: "create",
        newStockName,
        newStockQuantity,
      };
      await postStock(createStock);
    } else {
      console.log("Selected Stock:", selectedStock, quantity);
      const modifyStock = {
        action: "modify",
        selectedStock,
        quantity,
      };
      await postStock(modifyStock);
    }
    handleClose();
  };

  const handleDelete = async () => {
    console.log("New delete Name:", newStockName, newStockQuantity);
    const modifyStock = {
      action: "delete",
      selectedStock,
      quantity,
    };
    await postStock(modifyStock);
    handleClose();
  };

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
            <option value=""></option> {/* Placeholder option for clarity */}
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
