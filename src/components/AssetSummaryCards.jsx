import React from 'react';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/formatters';
import { getAssetColor } from '../utils/assetClassifier';

function AssetSummaryCards({ assetAllocation }) {
  if (!assetAllocation || assetAllocation.length === 0) {
    return null;
  }

  return (
    <div className="row g-3 mb-4">
      {assetAllocation.map((asset) => (
        <div key={asset.assetType} className="col-md-6 col-lg-4 col-xl-3">
          <div className="card asset-card h-100 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="card-title mb-0">{asset.assetType}</h6>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: getAssetColor(asset.assetType),
                  }}
                ></div>
              </div>
              <h4 className="mb-2">{formatCurrency(asset.totalValue)}</h4>
              <div className="d-flex justify-content-between text-muted small">
                <span>{formatPercentage(asset.percentage)}</span>
                <span>{formatNumber(asset.count)} holdings</span>
              </div>
              <div className="progress mt-2" style={{ height: '4px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${asset.percentage}%`,
                    backgroundColor: getAssetColor(asset.assetType),
                  }}
                  aria-valuenow={asset.percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AssetSummaryCards;
