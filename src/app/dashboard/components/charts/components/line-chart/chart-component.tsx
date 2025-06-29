import React from 'react';
import theme from '@styles/theme';
import ChartSkeleton from '../chart-skeleton';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import useLineChart from './hooks/useLineChart';

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
    loading: () => <ChartSkeleton />
});

const ClaimsTimelineChart = ({
    isLineChartDataPending,
    lineChartSeries,
}: {
    isLineChartDataPending: boolean
    lineChartSeries: any
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
        stroke: { curve: 'smooth', width: 2 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.2,
                stops: [0, 90, 100]
            }
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
                }
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
        tooltip: {
            theme: 'light',
            y: {
                formatter: function (value: any) {
                    return value + ' claims';
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
