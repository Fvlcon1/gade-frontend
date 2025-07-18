import React from 'react';
import theme from '@styles/theme';
import ChartSkeleton from '../chart-skeleton';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import useLineChart from './hooks/useLineChart';
import { useTheme } from '@styles/theme-context';

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
    loading: () => <ChartSkeleton />
});

const ReportsLineChart = ({
    isLineChartDataPending,
    lineChartSeries,
    categories
}: {
    isLineChartDataPending: boolean
    lineChartSeries: any
    categories: any
}) => {
    const {themeColor, theme} = useTheme()

    if (isLineChartDataPending) {
        return <ChartSkeleton />
    }

    const series = lineChartSeries

    const options: ApexOptions = {
        chart: {
            height: 350,
            type: 'line',
            toolbar: { show: false },
            foreColor: '#9CA3AF'
        },
        colors: [theme.colors.main.primary, '#10B981', '#FF9500', '#EF4444'],
        dataLabels: { enabled: false },
        stroke: { curve: 'straight', width: 2 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0,
                opacityTo: 0,
                stops: [0, 90, 100]
            }
        },
        xaxis: {
            categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            title: {
                text: "Months",
                style: {
                    fontSize: '14px',
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    color: theme.colors.text.primary
                }
            },
            labels: {
                style: {
                    colors: '#6B7280',
                    fontSize: '12px',
                    fontFamily: 'Montserrat'
                }
            }
        },
        yaxis: {
            title: {
                text: "Reports",
                style: {
                    fontSize: '14px',
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    color: theme.colors.text.primary
                }
            },
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
            theme: themeColor,
            y: {
                formatter: function (value: any) {
                    return value ;
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

export default ReportsLineChart;
