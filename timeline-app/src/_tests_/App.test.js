import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

test('Hello, world!', () => {
  render(<App />);
  const textElement = screen.getByText(/Hello, world!/i);
  expect(textElement).toBeInTheDocument();
});