import React from 'react';

const FootballFieldIcon = ({ width = 100, height = 100, strokeColor = '#2C3E50', fillColor = 'none', strokeWidth = 2 ,style}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill={fillColor}
        strokeWidth={strokeWidth}
        style={style}
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="10" y="10" width="80" height="60" rx="10" stroke={strokeColor} strokeWidth={strokeWidth} />
        <line x1="50" y1="10" x2="50" y2="70" stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="50" cy="40" r="10" stroke={strokeColor} strokeWidth={strokeWidth} />
        <rect x="10" y="30" width="10" height="20" rx="2" stroke={strokeColor} strokeWidth={strokeWidth} />
        <rect x="80" y="30" width="10" height="20" rx="2" stroke={strokeColor} strokeWidth={strokeWidth} />
    </svg>
);

export default FootballFieldIcon;
