import { Button } from '@/components/ui/button';
import { ErrorState, LoadingState } from '@/components/ui/feedback';
import { DailyStatItem } from '@/features/validation/api/types';
import { validationApi } from '@/features/validation/api/validation';
import { format, parseISO, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ValidationStatisticsProps {
  organizationId?: string;
}

export const ValidationStatistics = ({ organizationId }: ValidationStatisticsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DailyStatItem[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });
  const [activeChart, setActiveChart] = useState<'bar' | 'line' | 'area' | 'composed'>('bar');

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await validationApi.getDailyStatistics(
        dateRange.startDate,
        dateRange.endDate,
        organizationId
      );
      setStats(data.dailyStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
    } finally {
      setIsLoading(false);
    }
  }, [dateRange.startDate, dateRange.endDate, organizationId]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const adjustDateRange = (days: number) => {
    const newStartDate = format(subDays(parseISO(dateRange.startDate), days), 'yyyy-MM-dd');
    const newEndDate = format(subDays(parseISO(dateRange.endDate), days), 'yyyy-MM-dd');
    setDateRange({ startDate: newStartDate, endDate: newEndDate });
  };

  const totalSuccessCount = stats.reduce((sum, item) => sum + item.successCount, 0);
  const totalFailureCount = stats.reduce((sum, item) => sum + item.failureCount, 0);
  const totalValidations = totalSuccessCount + totalFailureCount;
  const successRate = totalValidations > 0 ? (totalSuccessCount / totalValidations) * 100 : 0;

  const chartData = stats.map(item => ({
    ...item,
    date: format(parseISO(item.date), 'MMM dd'),
    total: item.successCount + item.failureCount,
  }));

  if (isLoading) {
    return <LoadingState message="Loading validation statistics..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

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
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
                formatter={(value) => [`${value}`, '']}
              />
              <Legend />
              <Bar 
                dataKey="successCount" 
                name="Successful Validations" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar 
                dataKey="failureCount" 
                name="Failed Validations" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
                formatter={(value) => [`${value}`, '']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="successCount" 
                name="Successful Validations" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
              <Line 
                type="monotone" 
                dataKey="failureCount" 
                name="Failed Validations" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <defs>
                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorFailure" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
                formatter={(value) => [`${value}`, '']}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="successCount" 
                name="Successful Validations" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorSuccess)"
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="failureCount" 
                name="Failed Validations" 
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorFailure)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
                formatter={(value) => [`${value}`, '']}
              />
              <Legend />
              <Bar 
                dataKey="successCount" 
                name="Successful Validations" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar 
                dataKey="failureCount" 
                name="Failed Validations" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                name="Total Validations" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
            </ComposedChart>
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
          <h2 className="text-2xl font-bold text-gray-800">
            {organizationId ? 'Organization Validation Statistics' : 'System-wide Validation Statistics'}
          </h2>
          <p className="text-gray-600">
            {dateRange.startDate} to {dateRange.endDate}
            {!organizationId && <span className="ml-2 text-blue-600 font-medium">(All Organizations)</span>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustDateRange(7)}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustDateRange(-7)}
            className="flex items-center gap-1"
          >
            Next Month
            <ChevronRight className="h-4 w-4" />
          </Button>
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
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700">Total Validations</h3>
            <div className="p-2 bg-blue-50 rounded-full">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{totalValidations}</p>
          <p className="text-sm text-gray-500 mt-1">During selected period</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700">Success Rate</h3>
            <div className="p-2 bg-green-50 rounded-full">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{successRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-500 mt-1">
            {totalSuccessCount} successful / {totalFailureCount} failed
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700">Chart Type</h3>
            <div className="p-2 bg-purple-50 rounded-full">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button
              size="sm"
              variant={activeChart === 'bar' ? 'default' : 'outline'}
              onClick={() => setActiveChart('bar')}
              className={activeChart === 'bar' ? 'bg-blue-600' : ''}
            >
              Bar
            </Button>
            <Button
              size="sm"
              variant={activeChart === 'line' ? 'default' : 'outline'}
              onClick={() => setActiveChart('line')}
              className={activeChart === 'line' ? 'bg-blue-600' : ''}
            >
              Line
            </Button>
            <Button
              size="sm"
              variant={activeChart === 'area' ? 'default' : 'outline'}
              onClick={() => setActiveChart('area')}
              className={activeChart === 'area' ? 'bg-blue-600' : ''}
            >
              Area
            </Button>
            <Button
              size="sm"
              variant={activeChart === 'composed' ? 'default' : 'outline'}
              onClick={() => setActiveChart('composed')}
              className={activeChart === 'composed' ? 'bg-blue-600' : ''}
            >
              Composed
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
      >
        {stats.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No validation data available for the selected period.</p>
          </div>
        ) : (
          renderChart()
        )}
      </motion.div>
    </motion.div>
  );
};
