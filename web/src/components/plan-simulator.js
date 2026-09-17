export function setupPlanSimulator() {
  const rowCountSlider = document.getElementById('simRowCountSlider');
  const selectivitySlider = document.getElementById('simSelectivitySlider');
  const rowCountVal = document.getElementById('simRowCountVal');
  const selectivityVal = document.getElementById('simSelectivityVal');
  const matchingRowsText = document.getElementById('simMatchingRowsText');
  const tippingMsg = document.getElementById('tippingPointMessage');

  const metricScanIO = document.getElementById('metricScanIO');
  const metricLookupIO = document.getElementById('metricLookupIO');
  const metricCoveringIO = document.getElementById('metricCoveringIO');

  const barScan = document.getElementById('barScan');
  const barLookup = document.getElementById('barLookup');
  const barCovering = document.getElementById('barCovering');

  const cardScan = document.getElementById('stratTableScan');
  const cardLookup = document.getElementById('stratKeyLookup');
  const cardCovering = document.getElementById('stratCovering');

  if (!rowCountSlider || !selectivitySlider) return;

  function calculate() {
    const N = parseInt(rowCountSlider.value, 10);
    const selPercent = parseFloat(selectivitySlider.value);
    const selectivity = selPercent / 100.0;
    const matchingRows = Math.round(N * selectivity);

    rowCountVal.textContent = N.toLocaleString() + ' rows';
    selectivityVal.textContent = selPercent.toFixed(2) + ' %';
    matchingRowsText.textContent = `Matching Rows: ${matchingRows.toLocaleString()}`;

    // Constants based on SQL Server 8 KB page storage internals
    // Average row size = 100 bytes -> 80 rows per 8 KB page
    const rowsPerPage = 80;
    const tablePages = Math.ceil(N / rowsPerPage);

    // 1. Table Scan IO: Pure sequential read of all data pages + IAM allocation map
    const scanPages = tablePages;

    // 2. Non-Clustered Seek + Key Lookup:
    // Non-clustered index row size = 25 bytes -> ~300 keys per page
    // B-tree depth ~ 3 pages
    // For EVERY matching row, 1 Key Lookup seek into the Clustered Index (3 random page reads per row!)
    const btreeDepth = N > 500000 ? 4 : 3;
    const indexLeafPages = Math.ceil(matchingRows / 300);
    const lookupRandomReads = matchingRows; // 1 clustered lookup per row
    const lookupPages = btreeDepth + indexLeafPages + lookupRandomReads;

    // 3. Covering Index Seek:
    // All requested columns are INCLUDED in leaf level. 0 lookups into clustered index!
    const coveringLeafPages = Math.ceil(matchingRows / 120);
    const coveringPages = btreeDepth + coveringLeafPages;

    // Render Metrics
    metricScanIO.textContent = `${scanPages.toLocaleString()} Pages`;
    metricLookupIO.textContent = `${lookupPages.toLocaleString()} Pages`;
    metricCoveringIO.textContent = `${coveringPages.toLocaleString()} Pages`;

    // Max for percentage bars
    const maxIO = Math.max(scanPages, lookupPages, coveringPages);
    barScan.style.width = `${Math.min(100, Math.round((scanPages / maxIO) * 100))}%`;
    barLookup.style.width = `${Math.min(100, Math.round((lookupPages / maxIO) * 100))}%`;
    barCovering.style.width = `${Math.max(3, Math.round((coveringPages / maxIO) * 100))}%`;

    // Tipping point check
    // Tipping point in SQL Server generally occurs between 2.5% and 5%
    const isScanCheaperThanLookup = scanPages < lookupPages;
    if (isScanCheaperThanLookup) {
      cardLookup.classList.remove('optimal');
      cardLookup.querySelector('.badge').className = 'badge badge-amber';
      cardLookup.querySelector('.badge').textContent = 'Sub-Optimal';

      tippingMsg.innerHTML = `
        <div style="font-weight: 700; color: #f59e0b; margin-bottom: 4px;">⚠️ Beyond the Tipping Point! (${selPercent.toFixed(1)}% Selectivity)</div>
        <div>Because matching rows exceed the tipping point threshold (~2.5% - 3%), the cost of <strong>${matchingRows.toLocaleString()} random IO Key Lookups</strong> (${lookupPages.toLocaleString()} pages) is higher than reading the entire table sequentially (${scanPages.toLocaleString()} pages). The Query Optimizer abandons the index seek and forces a <strong>Clustered Table Scan</strong>!</div>
      `;
    } else {
      cardLookup.querySelector('.badge').className = 'badge badge-cyan';
      cardLookup.querySelector('.badge').textContent = 'Index Seek Active';

      tippingMsg.innerHTML = `
        <div style="font-weight: 700; color: #38bdf8; margin-bottom: 4px;">✅ Below the Tipping Point (${selPercent.toFixed(1)}% Selectivity)</div>
        <div>With high selectivity, the index seek with key lookup (${lookupPages.toLocaleString()} pages) is cheaper than scanning the whole table (${scanPages.toLocaleString()} pages). However, a <strong>Covering Index</strong> remains <strong>${Math.round(lookupPages / coveringPages)}x faster</strong> by eliminating lookups entirely!</div>
      `;
    }
  }

  rowCountSlider.addEventListener('input', calculate);
  selectivitySlider.addEventListener('input', calculate);

  calculate();
}
