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

var toggleLoadingIcon = function (payload) {
    $("#graph-details").toggleClass("visually-hidden");
    $("#CompareLoadingSpinner").toggleClass("visually-hidden");
    if ($('#chartForComparison').length === 0) {
        $('#compare .container').append('<div class=\"apex-charts\" id=\"chartForComparison\"</div>');
        $("#CompareLoadingSpinner strong").text("");
    } else {
        $("#chartForComparison").remove();
        $("#CompareLoadingSpinner strong").text("Fetching data of " + (payload['type'] == 'past_data' ? "past" : "next") + " " + payload['noOfDays'] + " days for " + payload['currencies']);
    }
}

var showError = function (message) {
    $('#alert-modal-title').html('Error!!!!');
    $('#alert-modal-body').html(message);
    $('#alert-modal').modal('show');
}

$(document).ready(function () {
    $('#alert-modal button').click(function () {
        $('#alert-modal').modal('hide');
        window.location.href = '/#compare';
        return false;
    });

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
            "currencies": $('#currencies').val().join(","),
            "noOfDays": $('#noOfDays').val()
        }

        if (comparisonType == 'predictions' && payload["noOfDays"] <= 0) {
            showError("Prediction requires at least 1 day to show the graph. Please check your input and try again!")
            event.preventDefault();
            return;
        }

        toggleLoadingIcon(payload)

        $.post(
            {
                url: "http://127.0.0.1:8080/predict",
                dataType: "json",
                data: payload,
                success: function (data) {
                    toggleLoadingIcon(payload)
                    render_comparision_chart(data, comparisonType)
                },
                failure: function (data) {
                    toggleLoadingIcon(payload)
                    showError(data['msg'])
                }
            });

        // alert( "Handler for .submit() called." );
        event.preventDefault();
    });
});
