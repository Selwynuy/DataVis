'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Shield, Clock, Lock, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface SuspiciousSession {
  sessionId: string;
  networkPacketSize: number;
  protocolType: string;
  loginAttempts: number;
  sessionDuration: number;
  encryptionUsed: string;
  ipReputationScore: number;
  failedLogins: number;
  browserType: string;
  unusualTimeAccess: boolean;
  attackDetected: boolean;
  riskScore: number;
}

interface SuspiciousSessionsTableProps {
  data: SuspiciousSession[];
  limit?: number;
}

export default function SuspiciousSessionsTable({ data, limit = 20 }: SuspiciousSessionsTableProps) {
  const [selectedSession, setSelectedSession] = useState<SuspiciousSession | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = limit;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayData = data.slice(startIndex, endIndex);

  // Reset to page 1 when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const getReputationBadge = (score: number) => {
    if (score < 0.3) return { label: 'High Risk', color: 'bg-red-100 text-red-700 border-red-200' };
    if (score < 0.7) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    return { label: 'Low Risk', color: 'bg-green-100 text-green-700 border-green-200' };
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 50) return 'text-orange-600';
    if (score >= 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <>
      <Card className="border-slate-800 bg-slate-950/60">
        <CardHeader className="pb-2 pt-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-100">
                <AlertCircle className="w-4 h-4 text-red-400" />
                Suspicious Sessions
              </CardTitle>
              <p className="text-[11px] text-slate-400 mt-0.5">Click row for details</p>
            </div>
            <Badge variant="outline" className="px-2 py-1 text-[11px] border-slate-700 text-slate-200">
              {data.length} total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-slate-100">
              <thead>
                <tr className="border-b border-slate-800/80">
                  <th className="text-left py-1.5 px-2 font-medium text-slate-300">Session ID</th>
                  <th className="text-left py-1.5 px-2 font-medium text-slate-300">Status</th>
                  <th className="text-left py-1.5 px-2 font-medium text-slate-300">Risk</th>
                  <th className="text-left py-1.5 px-2 font-medium text-slate-300">Protocol</th>
                  <th className="text-left py-1.5 px-2 font-medium text-slate-300">Browser</th>
                  <th className="text-center py-1.5 px-2 font-medium text-slate-300">Login / Failed</th>
                  <th className="text-left py-1.5 px-2 font-medium text-slate-300">Encryption</th>
                  <th className="text-left py-1.5 px-2 font-medium text-slate-300">IP Rep</th>
                  <th className="text-center py-1.5 px-2 font-medium text-slate-300">Time</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((session, index) => {
                  const repBadge = getReputationBadge(session.ipReputationScore);
                  return (
                    <tr
                      key={index}
                      onClick={() => setSelectedSession(session)}
                      className="border-b border-slate-800/60 hover:bg-slate-900/80 cursor-pointer transition-colors"
                    >
                      <td className="py-1.5 px-2">
                        <span className="font-mono text-[11px] text-slate-100">
                          {session.sessionId.substring(0, 10)}...
                        </span>
                      </td>
                      <td className="py-1.5 px-2">
                        {session.attackDetected ? (
                          <Badge className="bg-red-900/60 text-red-300 border-0 text-[11px] px-1.5 py-0">
                            Attack
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-900/60 text-emerald-300 border-0 text-[11px] px-1.5 py-0">
                            Clean
                          </Badge>
                        )}
                      </td>
                      <td className="py-1.5 px-2">
                        <span className={`font-bold text-[11px] ${getRiskColor(session.riskScore)}`}>
                          {session.riskScore.toFixed(0)}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-slate-300">{session.protocolType}</td>
                      <td className="py-1.5 px-2 text-slate-300">{session.browserType}</td>
                      <td className="py-1.5 px-2 text-center">
                        <span className="text-slate-300">
                          {session.loginAttempts} / <span className="text-red-600 font-semibold">{session.failedLogins}</span>
                        </span>
                      </td>
                      <td className="py-1.5 px-2">
                        <span
                          className={`${
                            session.encryptionUsed === 'AES' ? 'text-emerald-300' : 'text-orange-300'
                          }`}
                        >
                          {session.encryptionUsed}
                        </span>
                      </td>
                      <td className="py-1.5 px-2">
                        <Badge
                          variant="outline"
                          className={`text-[11px] px-1.5 py-0 border-slate-700 ${repBadge.color}`}
                        >
                          {session.ipReputationScore.toFixed(2)}
                        </Badge>
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        {session.unusualTimeAccess ? (
                          <Clock className="w-3.5 h-3.5 text-purple-400 mx-auto" />
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
              <div className="text-slate-400">
                Page {currentPage} of {totalPages} ({startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length})
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="h-7 px-2"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="h-7 px-2"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Detail Drawer */}
      <Sheet open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
          {selectedSession && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Session Details
                </SheetTitle>
                <SheetDescription>
                  Session ID: <span className="font-mono">{selectedSession.sessionId}</span>
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Status Card */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">Status & Risk</h3>
                    {selectedSession.attackDetected ? (
                      <Badge className="bg-red-100 text-red-700 border-0">Attack Detected</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 border-0">Clean Session</Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Risk Score</span>
                      <span className={`font-bold ${getRiskColor(selectedSession.riskScore)}`}>
                        {selectedSession.riskScore.toFixed(1)} / 100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Behavior Summary */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">Behavior Summary</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-slate-600">Login Attempts</p>
                      <p className="text-lg font-bold text-slate-900">{selectedSession.loginAttempts}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Failed Logins</p>
                      <p className="text-lg font-bold text-red-600">{selectedSession.failedLogins}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Session Duration</p>
                      <p className="text-lg font-bold text-slate-900">{selectedSession.sessionDuration.toFixed(1)}s</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Time Access</p>
                      <div className="flex items-center gap-1">
                        {selectedSession.unusualTimeAccess ? (
                          <>
                            <Clock className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-purple-600">Off-Hours</span>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-green-600">Business Hours</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Summary */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">Technical Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Protocol</span>
                      <Badge variant="outline">{selectedSession.protocolType}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Encryption</span>
                      <Badge
                        variant="outline"
                        className={selectedSession.encryptionUsed === 'AES' ? 'border-green-300' : 'border-orange-300'}
                      >
                        {selectedSession.encryptionUsed}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Browser</span>
                      <Badge variant="outline">{selectedSession.browserType}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Packet Size</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {selectedSession.networkPacketSize.toLocaleString()} bytes
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">IP Reputation Score</span>
                      <Badge variant="outline" className={getReputationBadge(selectedSession.ipReputationScore).color}>
                        {selectedSession.ipReputationScore.toFixed(3)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">Risk Factors</h3>
                  <div className="space-y-2">
                    {selectedSession.ipReputationScore < 0.3 && (
                      <div className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                        <span className="text-slate-700">Low IP reputation score (&lt;0.3)</span>
                      </div>
                    )}
                    {selectedSession.failedLogins >= 3 && (
                      <div className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                        <span className="text-slate-700">Multiple failed login attempts</span>
                      </div>
                    )}
                    {selectedSession.unusualTimeAccess && (
                      <div className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-purple-600 mt-0.5" />
                        <span className="text-slate-700">Access during off-hours</span>
                      </div>
                    )}
                    {(selectedSession.encryptionUsed === 'DES' || selectedSession.encryptionUsed === 'None') && (
                      <div className="flex items-start gap-2 text-sm">
                        <Lock className="w-4 h-4 text-orange-600 mt-0.5" />
                        <span className="text-slate-700">Weak or no encryption</span>
                      </div>
                    )}
                    {selectedSession.loginAttempts > 5 && (
                      <div className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <span className="text-slate-700">Excessive login attempts (&gt;5)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
