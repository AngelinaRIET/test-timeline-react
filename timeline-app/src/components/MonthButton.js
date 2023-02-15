import "./MonthButton.css";

function MonthButton({ onMonthButtonClick, value, monthName }) {
  return (
    <button className="round-btn" onClick={onMonthButtonClick}>
      {value === -1
        ? `${monthName.toUpperCase()}`
        : `${monthName.toUpperCase()}`}
    </button>
  );
}

export default MonthButton;
