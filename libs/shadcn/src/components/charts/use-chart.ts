import { ApexOptions } from 'apexcharts';
import merge from 'lodash/merge';
import { alpha } from '../../utils/style';

// Define your custom colors
const customColors = {
  primary: '#007bff',
  warning: '#ffc107',
  info: '#17a2b8',
  error: '#dc3545',
  success: '#28a745',
  textPrimary: '#212529',
  textSecondary: '#6c757d',
  disabled: '#6c757d',
  divider: '#dee2e6',
  background: '#ffffff',
  grey: '#808080',
  fontFamily: 'Arial, sans-serif',
  fontSizeH3: '1.75rem',
  fontSizeSubtitle2: '0.875rem',
  fontWeightH3: 'bold',
  fontWeightSubtitle2: 'normal',
  lineHeightH3: '1.2',
  lineHeightSubtitle2: '1.5',
};

export default function useChart(options?: ApexOptions) {
  const LABEL_TOTAL = {
    show: true,
    label: 'Total',
    color: customColors.textSecondary,
    fontSize: customColors.fontSizeSubtitle2,
    fontWeight: customColors.fontWeightSubtitle2,
    lineHeight: customColors.lineHeightSubtitle2,
  };

  const LABEL_VALUE = {
    offsetY: 8,
    color: customColors.textPrimary,
    fontSize: customColors.fontSizeH3,
    fontWeight: customColors.fontWeightH3,
    lineHeight: customColors.lineHeightH3,
  };

  const baseOptions = {
    // Colors
    colors: [
      customColors.primary,
      customColors.warning,
      customColors.info,
      customColors.error,
      customColors.success,
      customColors.warning,
      customColors.success,
      customColors.info,
      customColors.info,
    ],

    // Chart
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: customColors.disabled,
      fontFamily: customColors.fontFamily,
    },

    // Grid
    grid: {
      strokeDashArray: 3,
      borderColor: customColors.divider,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    // Markers
    markers: {
      size: 0,
      strokeColors: customColors.background,
    },

    // Legend
    legend: {
      show: true,
      fontSize: 13,
      position: 'top',
      horizontalAlign: 'right',
      markers: {
        radius: 12,
      },
      fontWeight: 500,
      itemMargin: {
        horizontal: 8,
      },
      labels: {
        colors: customColors.textPrimary,
      },
    },

    // plotOptions
    plotOptions: {
      // Bar
      bar: {
        borderRadius: 4,
        columnWidth: '28%',
      },

      // Pie + Donut
      pie: {
        donut: {
          labels: {
            show: true,
            value: LABEL_VALUE,
            total: LABEL_TOTAL,
          },
        },
      },

      // Radialbar
      radialBar: {
        track: {
          strokeWidth: '100%',
          background: alpha(customColors.grey, 0.16),
        },
        dataLabels: {
          value: LABEL_VALUE,
          total: LABEL_TOTAL,
        },
      },

      // Radar
      radar: {
        polygons: {
          fill: { colors: ['transparent'] },
          strokeColors: customColors.divider,
          connectorColors: customColors.divider,
        },
      },

      // polarArea
      polarArea: {
        rings: {
          strokeColor: customColors.divider,
        },
        spokes: {
          connectorColors: customColors.divider,
        },
      },
    },

    // Responsive
    responsive: [
      {
        // sm
        breakpoint: 576,
        options: {
          plotOptions: { bar: { columnWidth: '40%' } },
        },
      },
      {
        // md
        breakpoint: 768,
        options: {
          plotOptions: { bar: { columnWidth: '32%' } },
        },
      },
    ],
  };

  return merge(baseOptions, options);
}
