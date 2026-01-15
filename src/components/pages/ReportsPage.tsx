import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { TrendingUp, Target, CheckCircle2, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Objective, Accomplishment, Tag } from '../../App';

interface ReportsPageProps {
  objectives: Objective[];
  accomplishments: Accomplishment[];
  tags: Tag[];
}

export function ReportsPage({ objectives, accomplishments, tags }: ReportsPageProps) {
  const [dateRange, setDateRange] = useState('all');
  const [selectedTagId, setSelectedTagId] = useState('all');

  // Filter data based on selections
  const filteredAccomplishments = useMemo(() => {
    let filtered = accomplishments.filter(a => a.done);

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (dateRange) {
        case '7days':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          cutoffDate.setDate(now.getDate() - 90);
          break;
      }

      filtered = filtered.filter(a => new Date(a.doneDate) >= cutoffDate);
    }

    // Filter by tag
    if (selectedTagId !== 'all') {
      const objectiveIds = objectives
        .filter(obj => obj.tagIds.includes(selectedTagId))
        .map(obj => obj.id);
      filtered = filtered.filter(a => objectiveIds.includes(a.objectiveId));
    }

    return filtered;
  }, [accomplishments, objectives, dateRange, selectedTagId]);

  const filteredObjectives = useMemo(() => {
    if (selectedTagId === 'all') return objectives;
    return objectives.filter(obj => obj.tagIds.includes(selectedTagId));
  }, [objectives, selectedTagId]);

  // Calculate summary stats
  const totalObjectives = filteredObjectives.length;
  const completedObjectives = filteredObjectives.filter(obj => {
    const objAccomplishments = accomplishments.filter(
      a => a.objectiveId === obj.id && a.done
    ).length;
    return objAccomplishments >= obj.targetAmount;
  }).length;
  const completionRate = totalObjectives > 0 
    ? Math.round((completedObjectives / totalObjectives) * 100) 
    : 0;
  const totalAccomplishments = filteredAccomplishments.length;

  // Accomplishments over time (last 7 days)
  const accomplishmentsOverTime = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: filteredAccomplishments.filter(a => a.doneDate === date).length,
    }));
  }, [filteredAccomplishments]);

  // Completion by objective type
  const completionByType = useMemo(() => {
    const types: { [key: string]: { total: number; completed: number } } = {
      daily: { total: 0, completed: 0 },
      weekly: { total: 0, completed: 0 },
      monthly: { total: 0, completed: 0 },
      yearly: { total: 0, completed: 0 },
    };

    filteredObjectives.forEach(obj => {
      types[obj.type].total++;
      const objAccomplishments = accomplishments.filter(
        a => a.objectiveId === obj.id && a.done
      ).length;
      if (objAccomplishments >= obj.targetAmount) {
        types[obj.type].completed++;
      }
    });

    return Object.entries(types).map(([type, data]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      total: data.total,
      completed: data.completed,
      rate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    }));
  }, [filteredObjectives, accomplishments]);

  // Tag distribution
  const tagDistribution = useMemo(() => {
    const distribution: { [key: string]: number } = {};
    
    filteredObjectives.forEach(obj => {
      obj.tagIds.forEach(tagId => {
        distribution[tagId] = (distribution[tagId] || 0) + 1;
      });
    });

    return Object.entries(distribution)
      .map(([tagId, count]) => {
        const tag = tags.find(t => t.id === tagId);
        return {
          name: tag?.name || 'Unknown',
          value: count,
          color: tag?.color || '#999999',
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [filteredObjectives, tags]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-neutral-900 mb-2">Reports</h1>
        <p className="text-neutral-600">Track your progress and analyze your performance</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Date Range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={[
                { value: 'all', label: 'All Time' },
                { value: '7days', label: 'Last 7 Days' },
                { value: '30days', label: 'Last 30 Days' },
                { value: '90days', label: 'Last 90 Days' },
              ]}
            />
            <Select
              label="Filter by Tag"
              value={selectedTagId}
              onChange={(e) => setSelectedTagId(e.target.value)}
              options={[
                { value: 'all', label: 'All Tags' },
                ...tags.map(tag => ({ value: tag.id, label: tag.name })),
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Objectives</p>
                <p className="text-2xl text-neutral-900">{totalObjectives}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Completed</p>
                <p className="text-2xl text-neutral-900">{completedObjectives}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Completion Rate</p>
                <p className="text-2xl text-neutral-900">{completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Accomplishments</p>
                <p className="text-2xl text-neutral-900">{totalAccomplishments}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accomplishments Over Time */}
        <Card>
          <CardHeader>
            <h3 className="text-lg text-neutral-900">Accomplishments Over Time</h3>
            <p className="text-sm text-neutral-600">Last 7 days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accomplishmentsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Completion by Type */}
        <Card>
          <CardHeader>
            <h3 className="text-lg text-neutral-900">Completion by Objective Type</h3>
            <p className="text-sm text-neutral-600">Total vs completed</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={completionByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="total" fill="#94a3b8" name="Total" />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tag Distribution */}
        {tagDistribution.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="text-lg text-neutral-900">Objectives by Tag</h3>
              <p className="text-sm text-neutral-600">Distribution across tags</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tagDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tagDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Completion Rate by Type */}
        <Card>
          <CardHeader>
            <h3 className="text-lg text-neutral-900">Completion Rate by Type</h3>
            <p className="text-sm text-neutral-600">Percentage completed</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completionByType.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-700">{item.name}</span>
                    <span className="text-sm text-neutral-900">{item.rate}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-neutral-500">
                      {item.completed} of {item.total} completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
