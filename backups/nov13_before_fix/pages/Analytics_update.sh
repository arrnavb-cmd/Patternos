#!/bin/bash

# Backup original
cp Analytics.jsx Analytics.jsx.backup_$(date +%s)

# Add state variables after line 13 (after compareBy)
sed -i '' '13a\
  const [platformSummary, setPlatformSummary] = useState(null);\
  const [realChannelData, setRealChannelData] = useState([]);
' Analytics.jsx

# Add useEffect and fetchAnalyticsData function after the user/brand variables (around line 20)
# First, find where to insert (after the isAggregator line)
LINE=$(grep -n "const isAggregator" Analytics.jsx | cut -d: -f1)
INSERT_LINE=$((LINE + 2))

# Create temp file with the new functions
cat > /tmp/analytics_functions.txt << 'EOF'

  // Fetch real data from API
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

EOF

# Insert the functions
sed -i '' "${INSERT_LINE}r /tmp/analytics_functions.txt" Analytics.jsx

echo "✅ Analytics.jsx updated with API integration!"
echo "📁 Backup saved as: Analytics.jsx.backup_*"
