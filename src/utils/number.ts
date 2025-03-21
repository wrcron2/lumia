
export const formatNumber = (value: number): string => {
    // Handle 0, null, undefined, NaN
    if (!value && value !== 0) return '0';
    if (value === 0) return '0';
    
    // For negative numbers
    const isNegative = value < 0;
    const absValue = Math.abs(value);
    let formatted: string;
    
    if (absValue >= 1000000) {
      // Convert to millions (M)
      const millions = absValue / 1000000;
      // Check if we need a decimal place
      formatted = millions % 1 === 0 
        ? `${Math.floor(millions)}M` 
        : `${millions.toFixed(1).replace(/\.0$/, '')}M`;
    } else if (absValue >= 1000) {
      // Convert to thousands (K)
      const thousands = absValue / 1000;
      // Same decimal check
      formatted = thousands % 1 === 0 
        ? `${Math.floor(thousands)}K` 
        : `${thousands.toFixed(1).replace(/\.0$/, '')}K`;
    } else {
      formatted = Math.round(absValue).toString();
    }
    
    // Add the negative sign if needed
    return isNegative ? `-${formatted}` : formatted;
  };
  
  /**
   * Alternative version that accepts a prefix and suffix
   */
  export const formatNumberWithAffixes = (
    value: number, 
    prefix: string = '', 
    suffix: string = ''
  ): string => {
    const formatted = formatNumber(value);
    return `${prefix}${formatted}${suffix}`;
  };