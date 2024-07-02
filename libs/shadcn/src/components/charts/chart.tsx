import styled from '@emotion/styled';
import dynamic from 'next/dynamic';
import { FC, memo } from 'react';
import { Props } from 'react-apexcharts';
// ----------------------------------------------------------------------

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Define your custom colors
const customColors = {
  background: '#ffffff',
  text: '#000000',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '5px',
  grey: '#808080',
  fontWeightBold: 'bold',
};

// @ts-ignore
const Chart: FC<Props> = styled(ApexChart)(() => ({
  '& .apexcharts-canvas': {
    // Tooltip
    '& .apexcharts-tooltip': {
      color: customColors.text,
      boxShadow: customColors.boxShadow,
      borderRadius: customColors.borderRadius,
      marginTop: 30,
      '&.apexcharts-theme-light': {
        borderColor: 'transparent',
      },
    },
    '& .apexcharts-xaxistooltip': {
      borderColor: 'transparent',
      color: customColors.text,
      boxShadow: customColors.boxShadow,
      borderRadius: customColors.borderRadius,
      '&:before': {
        borderBottomColor: customColors.grey,
      },
      '&:after': {
        borderBottomColor: customColors.background,
      },
    },
    '& .apexcharts-tooltip-title': {
      textAlign: 'center',
      fontWeight: customColors.fontWeightBold,
      backgroundColor: customColors.grey,
      color: customColors.text,
    },

    // LEGEND
    '& .apexcharts-legend': {
      padding: 0,
    },
    '& .apexcharts-legend-series': {
      display: 'inline-flex !important',
      alignItems: 'center',
    },
    '& .apexcharts-legend-marker': {
      marginRight: 8,
    },
    '& .apexcharts-legend-text': {
      lineHeight: '18px',
      textTransform: 'capitalize',
    },
  },
}));

export default memo(Chart);
