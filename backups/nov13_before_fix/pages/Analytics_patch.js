// Add these state variables at the top (after line 13, after compareBy state)
const [platformSummary, setPlatformSummary] = useState(null);
const [realChannelData, setRealChannelData] = useState([]);

// Add this useEffect to fetch data
useEffect(() => {
  if (isAggregator && activeTab === 'platform') {
    fetchAnalyticsData();
  }
}, [dateRange, customStartDate, customEndDate, activeTab]);

const fetchAnalyticsData = async () => {
  setLoading(true);
  try {
    let url = `http://localhost:3025/api/v1/analytics/platform-summary?date_range=${dateRange}`;
    
    if (dateRange === 'custom' && customStartDate && customEndDate) {
      url += `&start_date=${customStartDate}&end_date=${customEndDate}`;
    }
    
    const [summaryRes, channelRes] = await Promise.all([
      fetch(url),
      fetch(`http://localhost:3025/api/v1/analytics/channel-performance?date_range=${dateRange}`)
    ]);
    
    const summary = await summaryRes.json();
    const channels = await channelRes.json();
    
    setPlatformSummary(summary);
    setRealChannelData(channels.channels || []);
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
  } finally {
    setLoading(false);
  }
};

const formatCurrency = (amount) => {
  if (!amount) return '₹0';
  if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + 'Cr';
  if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L';
  return '₹' + amount.toLocaleString();
};
