import { Button } from '@/components/ui/button';
import { ErrorState, LoadingState } from '@/components/ui/feedback';
import { validationApi, UserRoleStatistics } from '@/features/validation/api/validation';
import { motion } from 'framer-motion';
import { Users, RefreshCw, UserCheck, Shield, Eye } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Colors for different user roles
const ROLE_COLORS = {
  SUPER_ADMIN: '#8b5cf6', // Purple
  ORG_ADMIN: '#3b82f6',   // Blue
  VALIDATOR: '#10b981',   // Green
};

// Role display names and icons
const ROLE_INFO = {
  SUPER_ADMIN: { label: 'Super Admin', icon: Shield },
  ORG_ADMIN: { label: 'Org Admin', icon: UserCheck },
  VALIDATOR: { label: 'Validator', icon: Eye },
};

export const UserRoleChart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserRoleStatistics | null>(null);
  const [activeChart, setActiveChart] = useState<'pie' | 'bar'>('pie');

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await validationApi.getUserRoleStatistics();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user role statistics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  if (isLoading) {
    return <LoadingState message="Loading user role statistics..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!stats) {
    return <ErrorState message="No user role statistics available" />;
  }

  // Prepare chart data
  const chartData = stats.roleStats.map(item => ({
    ...item,
    label: ROLE_INFO[item.role as keyof typeof ROLE_INFO]?.label || item.role,
    color: ROLE_COLORS[item.role as keyof typeof ROLE_COLORS] || '#6b7280',
  }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ label, percentage }) => `${label}: ${percentage}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
                animationDuration={1500}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
                formatter={(value, name) => [`${value} users`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
                formatter={(value) => [`${value} users`, 'Count']}
              />
              <Legend />
              <Bar 
                dataKey="count" 
                name="User Count"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Role Distribution</h2>
          <p className="text-gray-600">
            System-wide distribution of users by role ({stats.totalUsers} total users)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStatistics}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {/* Total Users Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700">Total Users</h3>
            <div className="p-2 bg-blue-50 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
          <p className="text-sm text-gray-500 mt-1">All system users</p>
        </div>

        {/* Individual Role Cards */}
        {stats.roleStats.map((roleStat) => {
          const roleInfo = ROLE_INFO[roleStat.role as keyof typeof ROLE_INFO];
          const IconComponent = roleInfo?.icon || Users;
          const color = ROLE_COLORS[roleStat.role as keyof typeof ROLE_COLORS];
          
          return (
            <div key={roleStat.role} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">
                  {roleInfo?.label || roleStat.role}
                </h3>
                <div className="p-2 rounded-full" style={{ backgroundColor: `${color}20` }}>
                  <IconComponent className="h-5 w-5" style={{ color }} />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">{roleStat.count}</p>
              <p className="text-sm text-gray-500 mt-1">{roleStat.percentage}% of total</p>
            </div>
          );
        })}
      </motion.div>

      {/* Chart Type Toggle */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-700">Chart Visualization</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={activeChart === 'pie' ? 'default' : 'outline'}
              onClick={() => setActiveChart('pie')}
              className={activeChart === 'pie' ? 'bg-blue-600' : ''}
            >
              Pie Chart
            </Button>
            <Button
              size="sm"
              variant={activeChart === 'bar' ? 'default' : 'outline'}
              onClick={() => setActiveChart('bar')}
              className={activeChart === 'bar' ? 'bg-blue-600' : ''}
            >
              Bar Chart
            </Button>
          </div>
        </div>
        {chartData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No user role data available.</p>
          </div>
        ) : (
          renderChart()
        )}
      </motion.div>
    </motion.div>
  );
};