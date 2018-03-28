$(document).ready(function(){
    $('.styler').styler({
        selectPlaceholder: '',
    });

    $('#mob-btn').click(function(e){
        e.preventDefault();
        $(this).toggleClass('active');
        $('.header__nav').toggleClass('active');
        $('#overlay').fadeToggle();
        $('body').toggleClass('body_fixed');
    })

    $('#overlay').click(function(){
        $('#mob-btn, .header__nav').removeClass('active');
        $(this).fadeOut();
        $('body').removeClass('body_fixed');
    });

    $(window).scroll(function(){
        if($(window).scrollTop()>400){
            $('#header').addClass('fixedHeader');
            var headerHeight=$('#header').innerHeight();
            $('#main').css({
                'padding-top':headerHeight,
            })
        }
        else{
            $('#header').removeClass('fixedHeader');
            $('#main').css({
                'padding-top':0,
            })
        }
    })


    $(function(){
        var note = $('#note'),
            //month param add - 1
            ts = new Date(2017, 08, 20),
            newYear = true;

        if((new Date()) > ts){
            // The new year is here! Count towards something else.
            // Notice the *1000 at the end - time must be in milliseconds
            ts = (new Date()).getTime() + 10*24*60*60*1000;
            newYear = false;
        }

        $('#countdown').countdown({
            timestamp   : ts,
            callback    : function(days, hours, minutes, seconds){

                var message = "";

                message += days + " day" + ( days==1 ? '':'s' ) + ", ";
                message += hours + " hour" + ( hours==1 ? '':'s' ) + ", ";
                message += minutes + " minute" + ( minutes==1 ? '':'s' ) + " and ";
                message += seconds + " second" + ( seconds==1 ? '':'s' ) + " <br />";
            }
        });
    });

    setTimeout(function() {
        $('.countDays').append('<span class="countUnits">days</span>')
        $('.countHours').append('<span class="countUnits">hours</span>')
        $('.countMinutes').append('<span class="countUnits">minutes</span>')
        $('.countSeconds').append('<span class="countUnits">seconds</span>')
    },100)

    $('.progress__fill').each(function(){
        var progressValue=$(this).data('value');
        $(this).css({
            'width':progressValue+'%',
            'height':progressValue+'%',
        });

        if (progressValue>0) {
            $('.progress__step').eq(0).addClass('active');
        }

        if (progressValue>33.3) {
            $('.progress__step').eq(1).addClass('active');
        }

        if (progressValue>66.6) {
            $('.progress__step').eq(2).addClass('active');
        }

        if (progressValue==100) {
            $('.progress__step:last').addClass('active');
        }
    })


    //tabs
    $('.tab-btn').click(function(e){
        e.preventDefault();
        var $tab = $(this).attr("href");
        $(this).addClass('active');
        $(this).closest('.tab-block').find('.tab-btn').not(this).removeClass('active');
        $(this).closest('.tab-block').find('.tab-item').removeClass('active');
        $($tab).addClass('active');
    });


    if($('.tokens__piechart').length){
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = google.visualization.arrayToDataTable([
                ['', ''],
                ['On Sale',60],
                ['Team and owners',20],
                ['Reserve',15],
                ['Advisers',5],
            ]);

            var data2 = google.visualization.arrayToDataTable([
                ['', ''],
                ['Development',35],
                ['Marketing',40],
                ['Legal',10],
                ['Listing on exchange & operations',15],
            ]);

            var options = {
                title: '',
                pieHole: 0.4,
                legend: 'none',
                backgroundColor: 'transparent',
                pieSliceBorderColor: 'transparent',
                pieSliceText: 'none',
                slices: {
                    0: { color: '#0053a9' },
                    1: { color: '#0070e3' },
                    2: { color: '#45a1ff' },
                    3: { color: '#76c7ff' }
                }
            };

            var options2 = {
                title: '',
                pieHole: 0.4,
                legend: 'none',
                backgroundColor: 'transparent',
                pieSliceBorderColor: 'transparent',
                pieSliceText: 'none',
                slices: {
                    0: { color: '#0053a9' },
                    1: { color: '#0070e3' },
                    2: { color: '#45a1ff' },
                    3: { color: '#76c7ff' }
                }
            };

            var chart = new google.visualization.PieChart(document.getElementById('piechart1'));
            var chart2 = new google.visualization.PieChart(document.getElementById('piechart2'));

            chart.draw(data, options);
            chart2.draw(data2, options2);
        }
    }


    //
    $('.h-lang-select__active').click(function(){
        $(this).parents('.h-lang-select').toggleClass('h-lang-select__open');
    });


    $("body").on('click touchstart',function(e){
        if(!$(e.target).closest('.h-lang-select').length) {
            $('.h-lang-select').removeClass('h-lang-select__open');
        }
    });

    $('.jq-selectbox__dropdown .flag_rus').click(function(){
        window.location.assign("/ru");
    });

    $('.jq-selectbox__dropdown .flag_usa').click(function(){
        window.location.assign("/");
    });

    var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if(ios) {
        $('.jq-selectbox__select').click(function(){
            $('.jq-selectbox').toggleClass('dropdown opened');
            $('.header__lang .jq-selectbox__dropdown').toggle();
        });
    }

    $('.soc_link').click(function() {
        window.open(
          $(this).data('link')
        );
        return false;
    });
});
