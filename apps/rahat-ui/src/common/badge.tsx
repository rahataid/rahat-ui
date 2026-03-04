import React from 'react';

interface BadgeProps {
  bgColor?: string;
  textColor?: string;
  label: string;
  type?: 'primary' | 'warning'; // presets
}

const presetColors = {
  primary: { bgColor: '#ECFDF3', textColor: '#027A48' }, // green
  warning: { bgColor: '#FFFAEB', textColor: '#B54708' }, // red/orange
};

export const Badge: React.FC<BadgeProps> = ({
  bgColor,
  textColor,
  label,
  type,
}) => {
  const colors = type ? presetColors[type] : { bgColor, textColor };

  return (
    <div
      className="inline-flex items-center h-[28px] rounded-full px-[20px] py-[4px]"
      style={{
        backgroundColor: colors?.bgColor,
        color: colors?.textColor,
      }}
    >
      {label}
    </div>
  );
};
