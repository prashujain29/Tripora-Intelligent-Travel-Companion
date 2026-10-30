import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  DollarSign,
  PieChart as PieIcon,
  TrendingUp,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  Compass,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { BudgetAnalysis, ExpenseItem } from '../types';
import { api } from '../services/api';

export const BudgetStudioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<BudgetAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // New Expense Item Modal / Inline Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    category: 'activities',
    amount: 50,
    day_number: 1,
    notes: '',
  });

  const fetchBudget = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await api.getBudgetAnalysis(id);
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [id]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newExpense.title.trim()) return;

    try {
      await api.addExpense(id, {
        trip_id: id,
        title: newExpense.title,
        category: newExpense.category,
        amount: Number(newExpense.amount),
        day_number: Number(newExpense.day_number),
        notes: newExpense.notes,
        currency: analysis?.currency || 'USD',
        is_estimate: true,
      });

      // Reset & refresh backend calculation
      setNewExpense({
        title: '',
        category: 'activities',
        amount: 50,
        day_number: 1,
        notes: '',
      });
      setShowAddForm(false);
      await fetchBudget();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!id) return;
    if (window.confirm('Delete this expense line item?')) {
      await api.deleteExpense(id, expenseId);
      await fetchBudget();
    }
  };

  if (isLoading || !analysis) {
    return (
      <div className="py-32 text-center space-y-4">
        <Compass className="w-12 h-12 text-cobalt animate-spin mx-auto" />
        <h3 className="font-editorial text-2xl font-bold">Calculating Financial Model...</h3>
        <p className="text-xs text-charcoal-muted">Synthesizing budget benchmarks & daily burn rates...</p>
      </div>
    );
  }

  // Format donut chart data
  const chartData = analysis.categories.filter((c) => c.amount > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-border">
        <div>
          <div className="flex items-center gap-2 text-xs text-charcoal-muted mb-1">
            <Link to={`/itinerary/${id}`} className="hover:text-cobalt flex items-center gap-1 font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Itinerary Workspace
            </Link>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-cobalt">
            Financial Suite
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-charcoal">
            Budget Studio
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Track category spending allocations, daily cost burn, and per-person estimates.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-2.5 rounded-full bg-coral hover:bg-coral-600 text-white text-xs font-bold shadow-md shadow-coral/25 transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Cancel Entry' : 'Add Itemized Expense'}</span>
        </button>
      </div>

      {/* Primary Financial Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-1.5">
          <span className="text-xs font-semibold text-charcoal-muted uppercase">Target Budget</span>
          <div className="text-2xl sm:text-3xl font-bold font-editorial text-charcoal">
            ${analysis.total_budget_limit.toLocaleString()} {analysis.currency}
          </div>
          <p className="text-[11px] text-charcoal-muted">Total ceiling limit</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-1.5">
          <span className="text-xs font-semibold text-charcoal-muted uppercase">Estimated Spending</span>
          <div className="text-2xl sm:text-3xl font-bold font-editorial text-cobalt">
            ${analysis.total_estimated_spending.toLocaleString()} {analysis.currency}
          </div>
          <p className="text-[11px] text-charcoal-muted">All categories combined</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-1.5">
          <span className="text-xs font-semibold text-charcoal-muted uppercase">Remaining Buffer</span>
          <div className={`text-2xl sm:text-3xl font-bold font-editorial ${analysis.is_over_budget ? 'text-coral' : 'text-emerald-600'}`}>
            ${analysis.remaining_budget.toLocaleString()} {analysis.currency}
          </div>
          <p className="text-[11px] text-charcoal-muted">Unallocated headroom</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-1.5">
          <span className="text-xs font-semibold text-charcoal-muted uppercase">Per-Person Expense</span>
          <div className="text-2xl sm:text-3xl font-bold font-editorial text-coral">
            ${analysis.per_person_expense.toLocaleString()}
          </div>
          <p className="text-[11px] text-charcoal-muted">Across {analysis.total_travelers} traveler(s)</p>
        </div>
      </div>

      {/* Budget Utilization Progress Bar */}
      <div className="p-6 rounded-3xl bg-white border border-charcoal-border shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-charcoal flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cobalt" />
            Budget Utilization: {analysis.budget_utilization_percentage}%
          </span>
          <span className="text-charcoal-muted">
            Benchmark: ~${analysis.daily_spending_estimate}/day per party
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-warm-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              analysis.budget_utilization_percentage > 100
                ? 'bg-coral'
                : analysis.budget_utilization_percentage > 85
                ? 'bg-amber-500'
                : 'bg-cobalt'
            }`}
            style={{ width: `${Math.min(analysis.budget_utilization_percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Inline Add Expense Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddExpense}
          className="p-6 rounded-3xl bg-surface-pale border border-cobalt-200 space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-xl font-bold text-cobalt">
              Record or Estimate New Expense
            </h3>
            <span className="text-xs text-charcoal-muted">Computed by Tripora Backend</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                placeholder="e.g. Sorrento to Positano Shuttle or Special Wine Pairing"
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-border bg-white text-xs outline-none focus:ring-2 focus:ring-cobalt"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-border bg-white text-xs outline-none focus:ring-2 focus:ring-cobalt"
              >
                <option value="accommodation">Accommodation</option>
                <option value="food">Food & Dining</option>
                <option value="activities">Activities & Tours</option>
                <option value="transportation">Transportation</option>
                <option value="shopping">Shopping</option>
                <option value="misc">Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                Amount ({analysis.currency}) *
              </label>
              <input
                type="number"
                min="0"
                step="5"
                required
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-border bg-white text-xs outline-none focus:ring-2 focus:ring-cobalt"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-muted hover:bg-warm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-bold bg-cobalt hover:bg-cobalt-600 text-white shadow-sm"
            >
              Save Line Item
            </button>
          </div>
        </form>
      )}

      {/* Visual Analytics Grid: Donut Breakdown + Daily Burn Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Donut Breakdown (6 cols) */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl font-bold text-charcoal">
              Category Distribution
            </h3>
            <span className="text-xs text-charcoal-muted font-semibold">
              {chartData.length} active buckets
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="amount"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Legend & Percentage List */}
          <div className="space-y-3 pt-2 border-t border-charcoal-border/60">
            {analysis.categories.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium text-charcoal">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-charcoal-muted">{cat.percentage}%</span>
                  <span className="font-bold text-charcoal">
                    ${cat.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Spending Bar Chart (6 cols) */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl font-bold text-charcoal">
              Daily Expenditure Burn
            </h3>
            <span className="text-xs text-charcoal-muted font-semibold">
              {analysis.trip_duration_days} Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.daily_breakdown}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RechartsTooltip
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Daily Total']}
                />
                <Bar dataKey="amount" fill="#2864D8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Budget disclaimer note */}
          <div className="p-4 rounded-2xl bg-warm-100 border border-charcoal-border/70 flex items-start gap-2.5 text-xs text-charcoal-light">
            <Info className="w-4 h-4 text-cobalt flex-shrink-0 mt-0.5" />
            <span>
              <strong>Budget Grounding:</strong> Line items and category estimates reflect standard seasonal tourist rates and planned activities. Exchange fluctuations and dynamic peak hotel surcharges should be budgeted with a 10-15% reserve.
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Expenses Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-charcoal-border shadow-soft space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-editorial text-2xl font-bold text-charcoal">
            Itemized Expense Portfolio
          </h3>
          <span className="text-xs text-charcoal-muted font-semibold">
            {analysis.expenses.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-charcoal-border text-charcoal-muted uppercase text-[11px] font-bold">
                <th className="py-3 px-2">Expense Title</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Day</th>
                <th className="py-3 px-2">Notes</th>
                <th className="py-3 px-2 text-right">Amount</th>
                <th className="py-3 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-border/50 text-charcoal">
              {analysis.expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-warm-100/50 transition-colors">
                  <td className="py-3.5 px-2 font-semibold">{exp.title}</td>
                  <td className="py-3.5 px-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-pale text-cobalt border border-cobalt-100">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-charcoal-muted">
                    {exp.day_number ? `Day ${exp.day_number}` : 'Pre-trip'}
                  </td>
                  <td className="py-3.5 px-2 text-charcoal-muted text-xs max-w-xs truncate">
                    {exp.notes || '—'}
                  </td>
                  <td className="py-3.5 px-2 text-right font-bold text-coral">
                    ${exp.amount.toLocaleString()} {exp.currency}
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="p-1.5 rounded-lg text-charcoal-muted hover:text-coral transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

