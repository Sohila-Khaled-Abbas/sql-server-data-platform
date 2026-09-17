import React, { useState, useMemo } from 'react';
import { Gauge, Sliders, AlertTriangle, CheckCircle, Zap, HardDrive, Search, Database } from 'lucide-react';

export default function PlanSimulator() {
  const [rowCount, setRowCount] = useState(100000);
  const [selectivity, setSelectivity] = useState(3.0); // 3.0%

  const metrics = useMemo(() => {
    const N = rowCount;
    const selPercent = selectivity;
    const selFraction = selPercent / 100.0;
    const matchingRows = Math.round(N * selFraction);

    // Internals: 8 KB page storage geometry
    // Average row size = 100 bytes -> 80 rows per 8 KB page
    const rowsPerPage = 80;
    const tablePages = Math.ceil(N / rowsPerPage);

    // 1. Table Scan IO: Sequential scan of all data pages
    const scanPages = tablePages;

    // 2. Non-Clustered Seek + Key Lookup:
    // B-tree depth ~ 3 (or 4 if > 500k)
    const btreeDepth = N > 500000 ? 4 : 3;
    const indexLeafPages = Math.ceil(matchingRows / 300);
    const lookupRandomReads = matchingRows; // 1 clustered lookup per row
    const lookupPages = btreeDepth + indexLeafPages + lookupRandomReads;

    // 3. Covering Index Seek:
    const coveringLeafPages = Math.ceil(matchingRows / 120);
    const coveringPages = btreeDepth + coveringLeafPages;

    const maxIO = Math.max(scanPages, lookupPages, coveringPages);
    const isScanCheaperThanLookup = scanPages < lookupPages;

    return {
      matchingRows,
      scanPages,
      lookupPages,
      coveringPages,
      maxIO,
      isScanCheaperThanLookup,
      speedup: Math.max(1, Math.round(lookupPages / coveringPages))
    };
  }, [rowCount, selectivity]);

  return (
    <div className="plan-simulator-hub">
      <div className="sim-header">
        <div className="ms-badge">Optimizer Internals</div>
        <h1>Query Optimizer Tipping Point Simulator</h1>
        <p>
          Simulate how the SQL Server Cost-Based Optimizer decides between an <strong>Index Seek + Key Lookup</strong> versus abandoning the index for a full <strong>Clustered Table Scan</strong>.
        </p>
      </div>

      {/* Control Sliders */}
      <div className="sim-controls-card">
        <div className="sim-control-group">
          <div className="control-label-row">
            <span className="control-name">Total Table Cardinality:</span>
            <span className="control-value">{rowCount.toLocaleString()} Rows</span>
          </div>
          <input
            type="range"
            min="10000"
            max="1000000"
            step="10000"
            value={rowCount}
            onChange={(e) => setRowCount(parseInt(e.target.value, 10))}
            className="sim-slider"
          />
        </div>

        <div className="sim-control-group">
          <div className="control-label-row">
            <span className="control-name">Query Filter Selectivity:</span>
            <span className="control-value">{selectivity.toFixed(2)} % ({metrics.matchingRows.toLocaleString()} rows)</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="15.0"
            step="0.1"
            value={selectivity}
            onChange={(e) => setSelectivity(parseFloat(e.target.value))}
            className="sim-slider"
          />
        </div>
      </div>

      {/* Tipping Point Alert Banner */}
      <div className={`tipping-alert-banner ${metrics.isScanCheaperThanLookup ? 'alert-warning' : 'alert-success'}`}>
        <div className="flex items-start gap-3">
          {metrics.isScanCheaperThanLookup ? (
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-6 h-6 text-sky-400 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className="text-base font-bold mb-1">
              {metrics.isScanCheaperThanLookup
                ? `Beyond the Tipping Point! (${selectivity.toFixed(1)}% Selectivity)`
                : `Below the Tipping Point (${selectivity.toFixed(1)}% Selectivity)`}
            </h3>
            <p className="text-sm leading-relaxed text-gray-300">
              {metrics.isScanCheaperThanLookup ? (
                <>
                  Because matching rows exceed the tipping point threshold (~2.5% - 3%), the cost of{' '}
                  <strong>{metrics.matchingRows.toLocaleString()} random I/O Key Lookups</strong> ({metrics.lookupPages.toLocaleString()} pages)
                  is higher than reading the entire table sequentially ({metrics.scanPages.toLocaleString()} pages).
                  The SQL Server Optimizer abandons the index seek and forces a <strong>Clustered Table Scan</strong>.
                </>
              ) : (
                <>
                  With high selectivity, the index seek with key lookup ({metrics.lookupPages.toLocaleString()} pages) is cheaper than scanning the whole table ({metrics.scanPages.toLocaleString()} pages).
                  However, creating a <strong>Covering Index with INCLUDE</strong> eliminates lookups entirely and is{' '}
                  <strong>{metrics.speedup}x faster</strong>!
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Comparative Cards */}
      <div className="sim-comparison-grid">
        {/* Table Scan Card */}
        <div className={`sim-card ${metrics.isScanCheaperThanLookup ? 'highlighted' : ''}`}>
          <div className="sim-card-top">
            <HardDrive className="w-5 h-5 text-gray-400" />
            <span className="strategy-tag">Sequential Read</span>
          </div>
          <h4>Clustered Table Scan</h4>
          <p className="strategy-desc">Reads all 8 KB data pages sequentially via IAM allocation maps.</p>
          <div className="io-metric">{metrics.scanPages.toLocaleString()} Pages</div>
          <div className="io-progress-bar">
            <div
              className="io-fill bg-gray-500"
              style={{ width: `${Math.min(100, (metrics.scanPages / metrics.maxIO) * 100)}%` }}
            />
          </div>
          <div className="access-type">I/O Type: Multi-Page Sequential Scan</div>
        </div>

        {/* Index Seek + Key Lookup Card */}
        <div className={`sim-card ${!metrics.isScanCheaperThanLookup ? 'highlighted' : ''}`}>
          <div className="sim-card-top">
            <Search className="w-5 h-5 text-sky-400" />
            <span className={`strategy-tag ${metrics.isScanCheaperThanLookup ? 'badge-amber' : 'badge-cyan'}`}>
              {metrics.isScanCheaperThanLookup ? 'Abandoned by Optimizer' : 'Optimizer Choice'}
            </span>
          </div>
          <h4>Index Seek + Key Lookup</h4>
          <p className="strategy-desc">Traverses B-Tree to find rows, then issues 1 random I/O clustered lookup per row.</p>
          <div className="io-metric">{metrics.lookupPages.toLocaleString()} Pages</div>
          <div className="io-progress-bar">
            <div
              className={`io-fill ${metrics.isScanCheaperThanLookup ? 'bg-amber-500' : 'bg-sky-500'}`}
              style={{ width: `${Math.min(100, (metrics.lookupPages / metrics.maxIO) * 100)}%` }}
            />
          </div>
          <div className="access-type">I/O Type: Random Page Lookups ({metrics.matchingRows.toLocaleString()})</div>
        </div>

        {/* Covering Index Card */}
        <div className="sim-card optimal-card">
          <div className="sim-card-top">
            <Zap className="w-5 h-5 text-emerald-400" />
            <span className="strategy-tag badge-emerald">Optimal Gold Standard</span>
          </div>
          <h4>Covering Index (INCLUDE)</h4>
          <p className="strategy-desc">All filter and projection columns reside in the index leaf pages. Zero lookups!</p>
          <div className="io-metric text-emerald-400">{metrics.coveringPages.toLocaleString()} Pages</div>
          <div className="io-progress-bar">
            <div
              className="io-fill bg-emerald-500"
              style={{ width: `${Math.max(4, (metrics.coveringPages / metrics.maxIO) * 100)}%` }}
            />
          </div>
          <div className="access-type">I/O Type: Direct Leaf Range Scan (0 Lookups)</div>
        </div>
      </div>
    </div>
  );
}
