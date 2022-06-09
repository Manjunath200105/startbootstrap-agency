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
});
