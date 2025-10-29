import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Target, DollarSign, Users, ShoppingCart, Zap, Eye } from 'lucide-react';

// Main Dashboard Component
export default function PatternOSDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <Header />

        {/* Time Range Selector */}
        <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics Grid */}
            <MetricsGrid />

            {/* Active Segments */}
            <ActiveSegments />

            {/* Recent Activity */}
            <RecentActivity />
          </>
        )}

        {activeTab === 'segments' && <SegmentsView />}
        {activeTab === 'analytics' && <AnalyticsView />}
      </div>
    </div>
  );
}

// Header Component
function Header() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: '32px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            PatternOS Dashboard
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Real-time customer segmentation & analytics
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <StatusBadge status="Live" color="#10b981" />
          <button style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

// Status Badge
function StatusBadge({ status, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      background: `${color}15`,
      borderRadius: '20px'
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: color,
        animation: 'pulse 2s infinite'
      }}></div>
      <span style={{ color: color, fontWeight: '600', fontSize: '14px' }}>{status}</span>
    </div>
  );
}

// Time Range Selector
function TimeRangeSelector({ timeRange, setTimeRange }) {
  const ranges = [
    { value: '24h', label: 'Last 24h' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '15px',
      marginBottom: '30px',
      display: 'flex',
      gap: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {ranges.map(range => (
        <button
          key={range.value}
          onClick={() => setTimeRange(range.value)}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            background: timeRange === range.value ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
            color: timeRange === range.value ? 'white' : '#666',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

// Tab Navigation
function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { value: 'overview', label: 'Overview', icon: '📊' },
    { value: 'segments', label: 'Segments', icon: '👥' },
    { value: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '10px',
      marginBottom: '30px',
      display: 'flex',
      gap: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => setActiveTab(tab.value)}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            background: activeTab === tab.value ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
            color: activeTab === tab.value ? 'white' : '#666',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1,
            justifyContent: 'center',
            transition: 'all 0.3s'
          }}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Metrics Grid
function MetricsGrid() {
  const metrics = [
    {
      icon: '👥',
      value: '299,234',
      label: 'Total Customers',
      change: '+12.5%',
      trend: 'up',
      color: '#3b82f6'
    },
    {
      icon: '📈',
      value: '3.8%',
      label: 'Conversion Rate',
      change: '+0.4%',
      trend: 'up',
      color: '#10b981'
    },
    {
      icon: '🎯',
      value: '4.2x',
      label: 'ROAS',
      change: '+0.8x',
      trend: 'up',
      color: '#f59e0b'
    },
    {
      icon: '💰',
      value: '₹66.3L',
      label: 'Revenue',
      change: '+18.2%',
      trend: 'up',
      color: '#ef4444'
    },
    {
      icon: '🛒',
      value: '₹2,215',
      label: 'Avg Order Value',
      change: '+5.3%',
      trend: 'up',
      color: '#8b5cf6'
    },
    {
      icon: '⚡',
      value: '89%',
      label: 'Customer Satisfaction',
      change: '+2.1%',
      trend: 'up',
      color: '#06b6d4'
    },
    {
      icon: '👁️',
      value: '1.2M',
      label: 'Page Views',
      change: '+23.4%',
      trend: 'up',
      color: '#ec4899'
    },
    {
      icon: '🔄',
      value: '67%',
      label: 'Repeat Purchase Rate',
      change: '+3.8%',
      trend: 'up',
      color: '#14b8a6'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    }}>
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}

// Metric Card
function MetricCard({ icon, value, label, change, trend, color }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: `${color}15`,
        borderRadius: '50%',
        transform: 'translate(30%, -30%)'
      }}></div>

      <div style={{ fontSize: '48px', marginBottom: '15px', position: 'relative' }}>{icon}</div>
      <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#333', marginBottom: '8px', position: 'relative' }}>
        {value}
      </div>
      <div style={{ color: '#666', fontSize: '14px', marginBottom: '12px', position: 'relative' }}>{label}</div>
      <div style={{
        color: trend === 'up' ? '#10b981' : '#ef4444',
        fontWeight: '600',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        position: 'relative'
      }}>
        <span>{trend === 'up' ? '↑' : '↓'}</span>
        {change}
      </div>
    </div>
  );
}

// Active Segments
function ActiveSegments() {
  const segments = [
    {
      name: 'Eco-Seekers',
      count: '120,000',
      color: '#3b82f6',
      percentage: '40%',
      description: 'Environmentally conscious buyers'
    },
    {
      name: 'Quick-Buyers',
      count: '34,000',
      color: '#10b981',
      percentage: '11%',
      description: 'Fast decision makers'
    },
    {
      name: 'Home-Lovers',
      count: '89,000',
      color: '#f59e0b',
      percentage: '30%',
      description: 'Home & lifestyle enthusiasts'
    },
    {
      name: 'Bargain-Hunters',
      count: '56,000',
      color: '#ef4444',
      percentage: '19%',
      description: 'Deal seekers'
    }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ margin: '0 0 25px 0', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
        🎯 Active Customer Segments
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {segments.map((segment, index) => (
          <SegmentCard key={index} {...segment} />
        ))}
      </div>
    </div>
  );
}

// Segment Card
function SegmentCard({ name, count, color, percentage, description }) {
  return (
    <div style={{
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '25px',
      transition: 'all 0.3s',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 8px 16px ${color}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        background: color,
        margin: '0 auto 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        {percentage}
      </div>
      <div style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        {count}
      </div>
      <div style={{
        color: '#666',
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        {name}
      </div>
      <div style={{
        color: '#999',
        fontSize: '13px',
        textAlign: 'center'
      }}>
        {description}
      </div>
    </div>
  );
}

// Recent Activity
function RecentActivity() {
  const activities = [
    { type: 'segment', action: 'New segment created', name: 'Premium Shoppers', time: '2 min ago', color: '#3b82f6' },
    { type: 'conversion', action: 'Conversion spike detected', name: 'Eco-Seekers +15%', time: '5 min ago', color: '#10b981' },
    { type: 'alert', action: 'Low engagement alert', name: 'Bargain-Hunters', time: '12 min ago', color: '#f59e0b' },
    { type: 'campaign', action: 'Campaign launched', name: 'Summer Sale 2025', time: '1 hour ago', color: '#8b5cf6' }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ margin: '0 0 25px 0', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
        ⚡ Recent Activity
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </div>
    </div>
  );
}

// Activity Item
function ActivityItem({ type, action, name, time, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '15px',
      background: '#f9fafb',
      borderRadius: '10px',
      transition: 'all 0.3s',
      cursor: 'pointer'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#f3f4f6';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#f9fafb';
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: color }}></div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '15px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
          {action}
        </div>
        <div style={{ fontSize: '13px', color: '#666' }}>{name}</div>
      </div>
      <div style={{ fontSize: '13px', color: '#999', whiteSpace: 'nowrap' }}>{time}</div>
    </div>
  );
}

// Segments View (placeholder)
function SegmentsView() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '40px',
      textAlign: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ fontSize: '28px', marginBottom: '15px' }}>📊 Detailed Segments View</h2>
      <p style={{ color: '#666', fontSize: '16px' }}>Complete segment analysis and management coming soon...</p>
    </div>
  );
}

// Analytics View (placeholder)
function AnalyticsView() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '40px',
      textAlign: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ fontSize: '28px', marginBottom: '15px' }}>📈 Advanced Analytics</h2>
      <p style={{ color: '#666', fontSize: '16px' }}>Deep dive analytics and reporting tools coming soon...</p>
    </div>
  );
}