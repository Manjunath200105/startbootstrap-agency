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

var get_date_range = function (numberOfDays, type) {
    if (type == 'past_data') {
        return _.range(-Math.abs(numberOfDays), 0).map((current, index, range) => {
            return moment().add(current, 'day').format('DD-MM-YYYY')
        })
    }
    return _.range(0, numberOfDays).map((current, index, range) => {
        return moment().add(current, 'day').format('DD-MM-YYYY')
    })
}


// var render_chart = function (data) {
//     var predictions = data['predictions']
//     var options = {
//         chart: {
//             type: 'line'
//         },
//         series: [{
//             name: 'stock-price',
//             data: predictions
//         }],
//         xaxis: {
//             categories: get_date_range(predictions.length)
//         }
//     }
//
//     var chart = new ApexCharts(document.querySelector("#chart"), options);
//
//     chart.render();
// }

var render_comparision_chart = function (data, type) {
    var comparisonType = _.snakeCase(type).toLowerCase();
    var currencyList = Object.keys(data)
    var options = {
        series: currencyList.map(function (currency) {
            return {
                name: currency,
                data: data[currency][comparisonType]
            }
        }),
        chart: {
            type: 'line',
            toolbar: {
                show: false
            },
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
            categories: get_date_range(data[currencyList[0]][comparisonType].length, type),
        },
        grid: {
            borderColor: '#f1f1f1',
        }
    };

    var chart = new ApexCharts(document.querySelector("#chartForComparison"), options);
    chart.render();
}

var toggleLoading = function (data) {
    $("#PredictDropdownButton").toggleClass("disabled").text(data)
    $("#PredictionLoadingSpinner").toggleClass("visually-hidden")
    $("#stockName").toggleClass("visually-hidden")
    $("#stockName h2").text(data)
    $("#chart").toggleClass("visually-hidden")
}

var toggleLoadingIcon = function () {
    $("#graph-details").toggleClass("visually-hidden");
    $("#CompareLoadingSpinner").toggleClass("visually-hidden");
    if ($('#chartForComparison').length === 0) {
        $('#compare .container').append('<div class=\"apex-charts\" id=\"chartForComparison\"</div>');
    } else {
        $("#chartForComparison").remove();
    }
}

$(document).ready(function () {
    $("select").selectize({
        plugins: ["remove_button"],
        delimiter: ",",
        persist: false,
        create: function (input) {
            return {
                value: input,
                text: input,
            };
        },
    });


    $("#graph-details").submit(function (event) {
        var comparisonType = $('#type').val()
        var payload = {
            "type": comparisonType,
            "currency": $('#currency').val().join(","),
            "noOfDays": $('#noOfDays').val()
        }

        toggleLoadingIcon()

        $.post(
            {
                url: "http://127.0.0.1:8080/predict",
                dataType: "json",
                data: payload,
                success: function (data) {
                    toggleLoadingIcon()
                    render_comparision_chart(data, comparisonType)
                },
                failure: function (data) {
                    toggleLoading(comparisonType)
                }
            });

        // alert( "Handler for .submit() called." );
        event.preventDefault();
    });


    $('#PredictDropdownMenu a').on('click', function () {
        var cryptoCurrency = ($(this).text());
        toggleLoading(cryptoCurrency)
        $.post(
            {
                url: "http://127.0.0.1:8080/predict",
                data: {name: cryptoCurrency},
                success: function (data) {
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
        var comparisonType = ($(this).text());
        toggleComparisonLoading(comparisonType)
        $.get(
            {
                url: "http://127.0.0.1:8080/predict-all",
                success: function (data) {
                    toggleComparisonLoading(comparisonType)
                    render_comparision_chart(data, comparisonType)
                },
                failure: function (data) {
                    console.log(data)
                }
            });
    });
});
