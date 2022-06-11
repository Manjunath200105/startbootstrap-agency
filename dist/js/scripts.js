/*!
* Start Bootstrap - Agency v7.0.11 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
//

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }
    ;

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});

var get_date_range = function (numberOfDays) {
    return _.range(0, numberOfDays).map((current, index, range) => {
        return moment().add(current, 'day').format('DD-MM-YYYY')
    })
}


var render_chart = function (data) {
    var predictions = data['predictions']
    var options = {
        chart: {
            type: 'line'
        },
        series: [{
            name: 'stock-price',
            data: predictions
        }],
        xaxis: {
            categories: get_date_range(predictions.length)
        }
    }

    var chart = new ApexCharts(document.querySelector("#chart"), options);

    chart.render();
}

var render_comparision_chart = function (data) {
    var currencyList = ["BTC-USD", "BCH-USD", "XMR-USD", "ZEC-USD", "XRP-USD", "XLM-USD", "DASH-USD",
        "BTG-USD", "XRP-USD", "TRX-USD", "ETC-USD", "MIOTA-USD", "LTC-USD", "ADA-USD", "XEM-USD", "BTCD-USD"]
    var options = {
        series: [
            {
                name: "BTC-USD",
                data: data["BTC-USD"]["predictions"]
            },
            {
                name: "BCH-USD",
                data: data["BCH-USD"]["predictions"]
            },
            {
                name: "XMR-USD",
                data: data["XMR-USD"]["predictions"]
            }
        ],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: [5, 7, 5],
            curve: 'straight',
            dashArray: [0, 8, 5]
        },
        title: {
            text: 'Page Statistics',
            align: 'left'
        },
        legend: {
            tooltipHoverFormatter: function (val, opts) {
                return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
            }
        },
        markers: {
            size: 0,
            hover: {
                sizeOffset: 6
            }
        },
        xaxis: {
            categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
                '10 Jan', '11 Jan', '12 Jan'
            ],
        },
        tooltip: {
            y: [
                {
                    title: {
                        formatter: function (val) {
                            return val + " (mins)"
                        }
                    }
                },
                {
                    title: {
                        formatter: function (val) {
                            return val + " per session"
                        }
                    }
                },
                {
                    title: {
                        formatter: function (val) {
                            return val;
                        }
                    }
                }
            ]
        },
        grid: {
            borderColor: '#f1f1f1',
        }
    };

    var chart = new ApexCharts(document.querySelector("#chartForComparision"), options);
    chart.render();
}

var toggleLoading = function (data) {
    $("#PredictDropdownButton").toggleClass("visually-hidden")
    $("#PredictDropdownLoadingButton").toggleClass("visually-hidden")
    $("#PredictDropdownLoadingButton").text(data)
    $("#PredictionLoadingSpinner").toggleClass("visually-hidden")
    $("#stockName").toggleClass("visually-hidden")
    $("#stockName h2").text(data)
    $("#chart").toggleClass("visually-hidden")
}

$(document).ready(function () {

    $('#PredictDropdownMenu a').on('click', function () {
        var cryptoCurrency = ($(this).text());
        toggleLoading(cryptoCurrency)
        $.post(
            {
                url: "http://127.0.0.1:8080/predict",
                data: {name: cryptoCurrency},
                success: function (data) {
                    console.log(data)
                    toggleLoading(cryptoCurrency)
                    render_chart(data)
                },
                failure: function (data) {
                    console.log(data)
                    toggleLoading(cryptoCurrency)
                }
            });
    });
    $('#CompareDropdownMenu a').on('click', function () {
        var cryptoCurrency = ($(this).text());
        toggleLoading(cryptoCurrency)
        $.get(
            {
                url: "http://127.0.0.1:8080/predict-all",
                success: function (data) {
                    // var data = { name: 'Bob', age: 12 };
                    // Window.localStorage.setItem('', data);
                    // localStorage.clear();
                    // var data = Window.localStorage.getItem('person');
                    render_comparision_chart(data)
                },
                failure: function (data) {
                    console.log(data)
                }
            });
    });
});
