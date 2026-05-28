export interface LogEvent {
  id: string;
  title: string;
  timestamp: string;
  status: 'success' | 'info' | 'warning' | 'error' | 'verbose';
  description: string;
}

const STATUSES: LogEvent['status'][] = ['success', 'info', 'warning', 'error', 'verbose'];

const LOG_TITLES = {
  success: ['Task Completed', 'Backup Successful', 'System Login Granted', 'Sync Finished'],
  info: ['Service Started', 'Update Initialized', 'Device Connected', 'Config Reloaded'],
  warning: ['High Memory Alert', 'Disk Space Low', 'Slow Response Time', 'Session Timeout'],
  error: ['Connection Failed', 'Database Error', 'Auth Rejected', 'Write Permission Denied'],
  verbose: ['Component Rendered', 'API Request Sent', 'Cache Hit', 'State Dispatched']
};

export const generateMockLogs = (): LogEvent[] => {
  const logs: LogEvent[] = [];
  const baseDate = new Date(2026, 1, 1); 

  for (let i = 0; i < 250; i++) { 
  const currentDate = new Date(baseDate);
  currentDate.setDate(baseDate.getDate() + Math.floor(i / 20)); 

  currentDate.setHours(i % 24); 

  const status = STATUSES[i % STATUSES.length];
  const titles = LOG_TITLES[status];
  const titleBase = titles[i % titles.length];

  logs.push({
    id: `log-${i+1}`,
    title: `${titleBase} #${i+1}`,
    timestamp: currentDate.toISOString(), 
    status: status,
    description: `Detailed log information for event #${i+1} with status ${status}.`
  });
}
  return logs;
};

export const initialMockData = generateMockLogs();