import React from 'react';
import theme from '@styles/theme';
import ChartSkeleton from '../chart-skeleton';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import useLineChart from './hooks/useLineChart';
import { formatWithPrefix } from '@/utils/unit-utils';

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
    loading: () => <ChartSkeleton />
});

const ClaimsTimelineChart = ({
    isLineChartDataPending,
    lineChartSeries,
    categories
}: {
    isLineChartDataPending: boolean
    lineChartSeries: any
    categories: any
}) => {
    if (isLineChartDataPending) {
        return <ChartSkeleton />
    }

    const series = lineChartSeries

    const options: ApexOptions = {
        chart: {
            height: 350,
            type: 'area',
            toolbar: { show: false },
            foreColor: '#9CA3AF'
        },
        colors: [theme.colors.main.primary, '#10B981', '#FF9500', '#EF4444'],
        dataLabels: { enabled: false },
        stroke: { curve: 'straight', width: 2 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 0,
                opacityFrom: 0,
                opacityTo: 0,
                stops: [0, 90, 100]
            }
        },
        xaxis: {
            categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: {
                    colors: '#6B7280',
                    fontSize: '12px',
                    fontFamily: 'Montserrat'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#6B7280',
                    fontSize: '12px',
                    fontFamily: 'Montserrat'
                },
                formatter: (val: number) => `${formatWithPrefix(val, '', 0)}`
            }
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '12px',
            fontWeight: 500,
            fontFamily: 'Montserrat',
            markers: { shape: 'square' }
        },
        grid: {
            borderColor: theme.colors.border.primary,
            strokeDashArray: 4,
            yaxis: { lines: { show: true } }
        },
        markers: {
            size: 7,
            shape: 'circle',
            colors: undefined,
            strokeColors: '#fff',
            strokeWidth: 2,
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function (value: any) {
                    return value;
                }
            }
        }
    };

    return (
        <Chart
            options={options}
            series={series}
            type="area"
            height={450}
        />
    )
};

export default ClaimsTimelineChart;
