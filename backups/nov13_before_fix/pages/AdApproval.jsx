import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, Eye, MessageSquare } from 'lucide-react';

export default function AdApproval() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  const fetchPendingSubmissions = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/campaigns/pending');
      const data = await res.json();
      setSubmissions(data.submissions || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (!selectedSubmission) return;

    try {
      const endpoint = action === 'approve' 
        ? `/api/v1/campaigns/${selectedSubmission.submission_id}/approve`
        : action === 'reject'
        ? `/api/v1/campaigns/${selectedSubmission.submission_id}/reject`
        : `/api/v1/campaigns/${selectedSubmission.submission_id}/request-changes`;

      const body = action === 'approve'
        ? { approver: 'admin', notes: actionNotes }
        : action === 'reject'
        ? { rejector: 'admin', reason: actionNotes }
        : { reviewer: 'admin', changes: actionNotes };

      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await res.json();

      if (result.success) {
        // Refresh submissions
        fetchPendingSubmissions();
        setSelectedSubmission(null);
        setActionNotes('');
        setActionType(null);
      }
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  const getComplianceStatusColor = (passed) => {
    return passed ? 'text-green-400' : 'text-red-400';
  };

  const ComplianceCheck = ({ check, label }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
      <div className={`mt-1 ${check.passed ? 'text-green-400' : 'text-red-400'}`}>
        {check.passed ? <CheckCircle size={20} /> : <XCircle size={20} />}
      </div>
      <div className="flex-1">
        <p className={`font-semibold ${check.passed ? 'text-green-400' : 'text-red-400'}`}>
          {label}
        </p>
        <p className="text-gray-500 text-sm mt-1">{check.rule}</p>
        <p className="text-gray-400 text-sm mt-1">{check.details}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Ad Campaign Approval</h1>
          <p className="text-gray-400">Review and approve brand campaign submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <Clock className="text-yellow-400 mb-2" size={24} />
            <p className="text-gray-400 text-sm">Pending Review</p>
            <p className="text-2xl font-bold text-white">{submissions.length}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <CheckCircle className="text-green-400 mb-2" size={24} />
            <p className="text-gray-400 text-sm">Auto-Passed Checks</p>
            <p className="text-2xl font-bold text-white">
              {submissions.filter(s => s.compliance_checks?.all_passed).length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <AlertCircle className="text-red-400 mb-2" size={24} />
            <p className="text-gray-400 text-sm">Requires Attention</p>
            <p className="text-2xl font-bold text-white">
              {submissions.filter(s => !s.compliance_checks?.all_passed).length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <Eye className="text-blue-400 mb-2" size={24} />
            <p className="text-gray-400 text-sm">Avg Review Time</p>
            <p className="text-2xl font-bold text-white">24h</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submissions List */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Pending Submissions</h2>
            <div className="space-y-4">
              {submissions.length === 0 ? (
                <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                  <CheckCircle className="mx-auto text-green-400 mb-4" size={48} />
                  <p className="text-white font-semibold mb-2">All Caught Up!</p>
                  <p className="text-gray-400">No pending campaign submissions</p>
                </div>
              ) : (
                submissions.map((submission, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedSubmission(submission)}
                    className={`bg-gray-800 rounded-xl p-6 border cursor-pointer transition-colors ${
                      selectedSubmission?.submission_id === submission.submission_id
                        ? 'border-orange-600'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold mb-1">{submission.campaign_name}</h3>
                        <p className="text-gray-400 text-sm">{submission.brand}</p>
                      </div>
                      <div className={`px-3 py-1 rounded text-xs font-semibold ${
                        submission.compliance_checks?.all_passed
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-red-900/30 text-red-400'
                      }`}>
                        {submission.compliance_checks?.all_passed ? 'All Checks Passed' : 'Needs Review'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Budget</p>
                        <p className="text-white">₹{parseInt(submission.budget).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p className="text-white">{submission.duration_days} days</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Channels</p>
                        <p className="text-white">{submission.channels?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Submitted</p>
                        <p className="text-white">{new Date(submission.submitted_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Submission Details */}
          <div>
            {selectedSubmission ? (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 sticky top-8">
                <h2 className="text-xl font-bold text-white mb-6">Campaign Review</h2>

                {/* Campaign Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">{selectedSubmission.campaign_name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Brand:</span>
                      <span className="text-white">{selectedSubmission.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Objective:</span>
                      <span className="text-white capitalize">{selectedSubmission.objective}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Budget:</span>
                      <span className="text-white">₹{parseInt(selectedSubmission.budget).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Start Date:</span>
                      <span className="text-white">{selectedSubmission.start_date}</span>
                    </div>
                  </div>
                </div>

                {/* Ad Copy */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-2">Ad Copy</h4>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <p className="text-white font-semibold mb-2">{selectedSubmission.headline}</p>
                    <p className="text-gray-400 text-sm">{selectedSubmission.ad_copy}</p>
                  </div>
                </div>

                {/* Compliance Checks */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Automated Compliance Checks</h4>
                  <div className="space-y-3">
                    {selectedSubmission.compliance_checks?.checks && (
                      <>
                        <ComplianceCheck 
                          check={selectedSubmission.compliance_checks.checks.image_text_ratio}
                          label="Image to Text Ratio"
                        />
                        <ComplianceCheck 
                          check={selectedSubmission.compliance_checks.checks.content_moderation}
                          label="Content Moderation"
                        />
                        <ComplianceCheck 
                          check={selectedSubmission.compliance_checks.checks.brand_safety}
                          label="Brand Safety"
                        />
                        <ComplianceCheck 
                          check={selectedSubmission.compliance_checks.checks.technical_specs}
                          label="Technical Specifications"
                        />
                        <ComplianceCheck 
                          check={selectedSubmission.compliance_checks.checks.legal_compliance}
                          label="Legal Compliance"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {!actionType && (
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setActionType('approve')}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                    >
                      <CheckCircle size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => setActionType('changes')}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold"
                    >
                      <MessageSquare size={18} />
                      Changes
                    </button>
                    <button
                      onClick={() => setActionType('reject')}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                    >
                      <XCircle size={18} />
                      Reject
                    </button>
                  </div>
                )}

                {/* Action Form */}
                {actionType && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 mb-2">
                        {actionType === 'approve' ? 'Approval Notes (Optional)' : 
                         actionType === 'reject' ? 'Rejection Reason *' : 
                         'Requested Changes *'}
                      </label>
                      <textarea
                        value={actionNotes}
                        onChange={(e) => setActionNotes(e.target.value)}
                        rows={4}
                        placeholder={
                          actionType === 'approve' ? 'Any additional notes...' : 
                          actionType === 'reject' ? 'Please provide detailed reason for rejection...' :
                          'Specify what changes are needed...'
                        }
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setActionType(null);
                          setActionNotes('');
                        }}
                        className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAction(actionType)}
                        disabled={actionType !== 'approve' && !actionNotes}
                        className={`flex-1 px-4 py-3 rounded-lg text-white font-semibold disabled:opacity-50 ${
                          actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                          actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                          'bg-yellow-600 hover:bg-yellow-700'
                        }`}
                      >
                        Confirm {actionType === 'approve' ? 'Approval' : actionType === 'reject' ? 'Rejection' : 'Changes'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                <Eye className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400">Select a submission to review</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
