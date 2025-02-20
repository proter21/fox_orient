import React from "react";

const results = [
  { id: 1, name: "Competition 1", date: "2023-10-01", winner: "John Doe" },
  { id: 2, name: "Competition 2", date: "2023-10-15", winner: "Jane Smith" },
  // ...more results...
];

const ResultsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b mt-12 from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Competition Results
          </h1>
          <p className="text-lg text-gray-600">
            View the latest competition outcomes and winners
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  {result.name}
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-600 flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    {result.date}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <TrophyIcon className="w-5 h-5 mr-2" />
                    {result.winner}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const TrophyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 24 24"
    stroke="currentColor"
  >
    <path d="M5 3h14M5 3v11.5M19 3v11.5M8 21h8m-4-6v6m-5.5-9h11" />
  </svg>
);

export default ResultsPage;
