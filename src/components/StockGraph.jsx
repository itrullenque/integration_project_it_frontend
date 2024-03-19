import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const StockGraph = ({ chartData }) => {
  return <Line data={chartData} />;
};
export default StockGraph;
