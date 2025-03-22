
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


  export function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}