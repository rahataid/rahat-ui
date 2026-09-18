import React from 'react';
import { toast } from 'react-toastify';

type ShowToastParams = {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
};

export const showToast = ({ type, title, description }: ShowToastParams) => {
  toast[type](
    <div className="space-y-1">
      <div className="text-base font-semibold text-foreground">{title}</div>

      {description && (
        <div className="text-sm font-normal text-foreground">{description}</div>
      )}
    </div>,
  );
};
