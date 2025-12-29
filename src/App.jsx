import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import PortfolioHeader from './components/PortfolioHeader';
import AssetSummaryCards from './components/AssetSummaryCards';
import AssetAllocationChart from './components/AssetAllocationChart';
import HoldingsTable from './components/HoldingsTable';
import ErrorAlert from './components/ErrorAlert';
import EmptyState from './components/EmptyState';
import { aggregatePortfolios, processIndividualPortfolio } from './utils/portfolioAggregator';

function App() {
  const [portfolios, setPortfolios] = useState([]);
  const [combinedData, setCombinedData] = useState(null);
  const [activeTab, setActiveTab] = useState('combined');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (portfolios.length > 0) {
      const aggregated = aggregatePortfolios(portfolios);
      setCombinedData(aggregated);
      
      // Set active tab to combined by default
      if (activeTab === 'combined' || !portfolios.find(p => p.id === activeTab)) {
        setActiveTab('combined');
      }
    } else {
      setCombinedData(null);
      setActiveTab('combined');
    }
  }, [portfolios]);

  const handleFilesUploaded = (files) => {
    setPortfolios(files);
    setErrorMessage('');
  };

  const handleError = (message) => {
    setErrorMessage(message);
  };

  const renderTabContent = () => {
    if (activeTab === 'combined' && combinedData) {
      return (
        <>
          <PortfolioHeader
            metadata={{
              holderName: 'Combined Family Portfolio',
              dpName: `${combinedData.portfolioCount} Portfolio(s)`,
              statementDate: portfolios[0]?.metadata?.statementDate || '',
            }}
            totalHoldings={combinedData.totalHoldings}
            totalValue={combinedData.totalValue}
          />
          <AssetSummaryCards assetAllocation={combinedData.assetAllocation} />
          <div className="row mb-4">
            <div className="col-lg-6">
              <AssetAllocationChart assetAllocation={combinedData.assetAllocation} />
            </div>
            <div className="col-lg-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Portfolio Summary</h5>
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="border rounded p-3 text-center">
                        <div className="text-muted small mb-1">Total Members</div>
                        <div className="h4 mb-0">{combinedData.portfolioCount}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="border rounded p-3 text-center">
                        <div className="text-muted small mb-1">Unique Holdings</div>
                        <div className="h4 mb-0">{combinedData.consolidatedHoldings.length}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="border rounded p-3 text-center">
                        <div className="text-muted small mb-1">Total Holdings</div>
                        <div className="h4 mb-0">{combinedData.allHoldings.length}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="border rounded p-3 text-center">
                        <div className="text-muted small mb-1">Asset Classes</div>
                        <div className="h4 mb-0">{combinedData.assetAllocation.length}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <HoldingsTable holdings={combinedData.consolidatedHoldings} showHolderInfo={false} />
        </>
      );
    }

    // Individual portfolio view
    const portfolio = portfolios.find(p => p.id === activeTab);
    if (portfolio) {
      const processedPortfolio = processIndividualPortfolio(portfolio);
      
      return (
        <>
          <PortfolioHeader
            metadata={processedPortfolio.metadata}
            totalHoldings={processedPortfolio.totalHoldings}
            totalValue={processedPortfolio.totalValue}
          />
          <AssetSummaryCards assetAllocation={processedPortfolio.assetAllocation} />
          <div className="row mb-4">
            <div className="col-lg-12">
              <AssetAllocationChart assetAllocation={processedPortfolio.assetAllocation} />
            </div>
          </div>
          <HoldingsTable holdings={processedPortfolio.holdings} showHolderInfo={false} />
        </>
      );
    }

    return null;
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-dark bg-primary shadow-sm mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-bar-chart-line me-2"
              viewBox="0 0 16 16"
            >
              <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2zm1 12h2V2h-2v12zm-3 0V7H7v7h2zm-5 0v-3H2v3h2z" />
            </svg>
            CDSL Portfolio Analyzer
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid px-4">
        {/* File Upload Section */}
        <FileUpload onFilesUploaded={handleFilesUploaded} onError={handleError} />

        {/* Error Alert */}
        {errorMessage && (
          <ErrorAlert message={errorMessage} onClose={() => setErrorMessage('')} />
        )}

        {/* Portfolio Content */}
        {portfolios.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'combined' ? 'active' : ''}`}
                  onClick={() => setActiveTab('combined')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-people me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
                  </svg>
                  Combined Portfolio
                </button>
              </li>
              {portfolios.map((portfolio) => (
                <li className="nav-item" key={portfolio.id}>
                  <button
                    className={`nav-link ${activeTab === portfolio.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(portfolio.id)}
                    title={`DP: ${portfolio.metadata?.dpId} | Client: ${portfolio.metadata?.clientId}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-person me-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                    </svg>
                    {portfolio.metadata?.holderName || `Portfolio ${portfolio.id}`}
                  </button>
                </li>
              ))}
            </ul>

            {/* Tab Content */}
            {renderTabContent()}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-5 py-4 bg-white border-top">
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col-md-6 text-center text-md-start">
              <p className="text-muted small mb-0">
                CDSL Portfolio Analyzer - Analyze your investments across asset classes
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <p className="text-muted small mb-0">
                Built with React, Bootstrap, and Recharts
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
