/**
 * Formats a date to the local date string (e.g., "5/12/2023")
 * @param {string|Date} date - The date to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    timeZone: 'UTC'
  };
  
  return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Formats a date to ISO string format for input fields (e.g., "2023-05-12")
 * @param {string|Date} date - The date to format
 * @returns {string} ISO formatted date string (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
};

/**
 * Calculates time left between now and a future date
 * @param {string|Date} endDate - The end date
 * @returns {string} Formatted time left string or "Expired" if in the past
 */
export const getTimeLeft = (endDate) => {
  if (!endDate) return '';
  
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;
  
  if (diff <= 0) {
    return 'Expired';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

/**
 * Validates a date range
 * @param {string|Date} startDate - The start date
 * @param {string|Date} endDate - The end date
 * @returns {boolean} True if valid (end date is after start date)
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return end > start;
};

/**
 * Gets a readable relative time (e.g., "2 days ago", "in 3 hours")
 * @param {string|Date} date - The date to format
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = dateObj - now;
  
  const seconds = Math.round(diff / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30);
  const years = Math.round(months / 12);
  
  if (Math.abs(years) >= 1) {
    return rtf.format(years, 'year');
  } else if (Math.abs(months) >= 1) {
    return rtf.format(months, 'month');
  } else if (Math.abs(days) >= 1) {
    return rtf.format(days, 'day');
  } else if (Math.abs(hours) >= 1) {
    return rtf.format(hours, 'hour');
  } else if (Math.abs(minutes) >= 1) {
    return rtf.format(minutes, 'minute');
  } else {
    return rtf.format(seconds, 'second');
  }
}; 