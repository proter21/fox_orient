import React from "react";

const results = [
  { id: 1, name: "Competition 1", date: "2023-10-01", winner: "John Doe" },
  { id: 2, name: "Competition 2", date: "2023-10-15", winner: "Jane Smith" },
  // ...more results...
];

const ResultsPage = () => {
  return (
    <div>
      <h1>Competition Results</h1>
      <ul>
        {results.map((result) => (
          <li key={result.id}>
            <h2>{result.name}</h2>
            <p>Date: {result.date}</p>
            <p>Winner: {result.winner}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsPage;
