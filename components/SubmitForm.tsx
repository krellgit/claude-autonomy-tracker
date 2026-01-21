'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubmitForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    task_description: '',
    autonomous_duration: '',
    action_count: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const duration = parseInt(formData.autonomous_duration);
      const actions = formData.action_count ? parseInt(formData.action_count) : 0;

      if (isNaN(duration) || duration < 0) {
        throw new Error('Invalid duration value');
      }

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          task_description: formData.task_description || null,
          autonomous_duration: duration,
          action_count: actions,
          session_start: new Date().toISOString(),
          session_end: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit session');
      }

      setSuccess(true);
      setFormData({
        username: '',
        task_description: '',
        autonomous_duration: '',
        action_count: '',
      });

      // Redirect to homepage after 2 seconds
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Submit Session</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Session submitted successfully! Redirecting...
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username *
            </label>
            <input
              type="text"
              id="username"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              placeholder="Your username"
            />
          </div>

          <div>
            <label htmlFor="task_description" className="block text-sm font-medium mb-1">
              Task Description
            </label>
            <textarea
              id="task_description"
              value={formData.task_description}
              onChange={(e) => setFormData({ ...formData, task_description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              placeholder="What task did Claude work on?"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="autonomous_duration" className="block text-sm font-medium mb-1">
              Autonomous Duration (seconds) *
            </label>
            <input
              type="number"
              id="autonomous_duration"
              required
              min="0"
              value={formData.autonomous_duration}
              onChange={(e) => setFormData({ ...formData, autonomous_duration: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              placeholder="e.g., 1800 (30 minutes)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Time between your messages in seconds
            </p>
          </div>

          <div>
            <label htmlFor="action_count" className="block text-sm font-medium mb-1">
              Action Count
            </label>
            <input
              type="number"
              id="action_count"
              min="0"
              value={formData.action_count}
              onChange={(e) => setFormData({ ...formData, action_count: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              placeholder="Number of autonomous actions"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Session'}
          </button>
        </div>
      </form>
    </div>
  );
}
