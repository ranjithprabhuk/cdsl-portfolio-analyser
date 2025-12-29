import React from 'react';

function EmptyState() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                fill="currentColor"
                className="bi bi-file-earmark-spreadsheet text-muted mb-4"
                viewBox="0 0 16 16"
              >
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5v2zM3 12v-2h2v2H3zm0 1h2v2H4a1 1 0 0 1-1-1v-1zm3 2v-2h3v2H6zm4 0v-2h3v1a1 1 0 0 1-1 1h-2zm3-3h-3v-2h3v2zm-7 0v-2h3v2H6z" />
              </svg>
              <h4 className="mb-3">No Portfolio Data</h4>
              <p className="text-muted mb-4">
                Upload your CDSL portfolio CSV files to get started with analysis.
                You can upload multiple files for different family members.
              </p>
              <div className="alert alert-info text-start">
                <h6 className="alert-heading">Expected CSV Format:</h6>
                <ul className="mb-0 small">
                  <li>Header section with DP ID, Client ID, Holder Name (lines 1-8)</li>
                  <li>Column headers on line 10</li>
                  <li>Data rows starting from line 11</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmptyState;
