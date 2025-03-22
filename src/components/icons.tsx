import React from 'react';

import LogoSvg  from '../assets/icons/logo.svg';

// Import additional icons as needed

// Create wrapper components for each icon with consistent props
export const LogoIcon = ({ size = 24, color = 'currentColor', className = '', ...props }) => (
    <img 
      src={LogoSvg}
      width={size}
      height={size}
      className={className}
      alt="Logo"
      {...props}
    />
  );