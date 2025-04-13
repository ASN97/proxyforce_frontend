"use client"

import { X, FileText, Mail, Loader } from "lucide-react"

const EmailModal = ({
  emailTemplate,
  setEmailTemplate,
  onClose,
  onSend,
  onRegenerate,
  isGenerating,
  isSending,
  stakeholders = [],
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#151528] rounded-xl border border-amber-500/30 p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Generate Status Update Email</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Recipient</label>
            <select
              value={emailTemplate.recipient}
              onChange={(e) => setEmailTemplate({ ...emailTemplate, recipient: e.target.value })}
              className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="all">All Stakeholders</option>
              {stakeholders.map((stakeholder, index) => (
                <option key={index} value={stakeholder.name}>
                  {stakeholder.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
            <input
              type="text"
              value={emailTemplate.subject}
              onChange={(e) => setEmailTemplate({ ...emailTemplate, subject: e.target.value })}
              className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeTimeline"
                checked={emailTemplate.includeTimeline}
                onChange={(e) => setEmailTemplate({ ...emailTemplate, includeTimeline: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="includeTimeline" className="text-sm text-gray-300">
                Include Timeline
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeTaskSummary"
                checked={emailTemplate.includeTaskSummary}
                onChange={(e) => setEmailTemplate({ ...emailTemplate, includeTaskSummary: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="includeTaskSummary" className="text-sm text-gray-300">
                Include Task Summary
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email Content</label>
            <div className="relative">
              {isGenerating && (
                <div className="absolute inset-0 bg-[#0B0B19]/70 flex items-center justify-center rounded-lg">
                  <Loader className="h-8 w-8 text-amber-500 animate-spin" />
                </div>
              )}
              <textarea
                value={emailTemplate.content}
                onChange={(e) => setEmailTemplate({ ...emailTemplate, content: e.target.value })}
                className="w-full bg-[#0B0B19] border border-amber-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[200px] font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-300 hover:text-white">
            Cancel
          </button>
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="bg-[#0B0B19] hover:bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Regenerate
          </button>
          <button
            onClick={onSend}
            disabled={isSending || isGenerating}
            className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-4 py-2 rounded-lg flex items-center"
          >
            {isSending ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
            Send Email
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmailModal
