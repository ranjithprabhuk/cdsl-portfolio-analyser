import React from 'react';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';

function PortfolioHeader({ metadata, totalHoldings, totalValue }) {
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <div className="row">
          <div className="col-md-8">
            <h4 className="card-title mb-3">
              {metadata?.holderName || 'Portfolio Holder'}
            </h4>
            <div className="row g-3">
              <div className="col-sm-6">
                <small className="text-muted d-block">DP ID</small>
                <strong>{metadata?.dpId || 'N/A'}</strong>
              </div>
              <div className="col-sm-6">
                <small className="text-muted d-block">Client ID</small>
                <strong>{metadata?.clientId || 'N/A'}</strong>
              </div>
              <div className="col-sm-6">
                <small className="text-muted d-block">DP Name</small>
                <strong>{metadata?.dpName || 'N/A'}</strong>
              </div>
              <div className="col-sm-6">
                <small className="text-muted d-block">Statement Date</small>
                <strong>{formatDate(metadata?.statementDate) || 'N/A'}</strong>
              </div>
            </div>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <div className="mb-3">
              <small className="text-muted d-block">Total Portfolio Value</small>
              <h3 className="text-primary mb-0">
                {formatCurrency(totalValue || metadata?.totalPortfolioValue || 0)}
              </h3>
            </div>
            <div>
              <small className="text-muted d-block">Total Holdings</small>
              <h5 className="mb-0">{formatNumber(totalHoldings || 0)}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioHeader;
