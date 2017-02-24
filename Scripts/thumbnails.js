 
var thumb_flag = 0;
//function bottomAdShowHide() {
//    var adHeight = $('#thumbnails').height();
//    if (thumb_flag == 1) {
//        $('#bottom-thums-panel').stop(true).animate({ 'margin-bottom': 0 }, { queue: false, duration: 300 });
//        $('#ThumbPanelHideShow').html('<i class="fa fa-angle-double-down"></i> <span>Hide thumbnails</span> <i class="fa fa-angle-double-down"></i>');
//        thumb_flag = 0;
//    }
//    else {
//        $('#bottom-thums-panel').stop(true).animate({ 'margin-bottom': -adHeight }, { queue: false, duration: 300 });
//        $('#ThumbPanelHideShow').html('<i class="fa fa-angle-double-up"></i> <span>Show thumbnails</span> <i class="fa fa-angle-double-up"></i>');
//        thumb_flag = 1;
//    }
//}
 
 
$(document).ready(function () {
    getThumbnails();
});

function bottomAdShowHide() {
    
    if (thumb_flag == 1) {
        $('#thumbnails').slideUp(function () {
            $('#ThumbPanelHideShow').html('<i class="fa fa-angle-double-up"></i> <span>Show Thumbnails</span> <i class="fa fa-angle-double-up"></i>');
            thumb_flag = 0;
        });

    }
    else {
        $('#thumbnails').slideDown(function () {
            $('#ThumbPanelHideShow').html('<i class="fa fa-angle-double-down"></i> <span>Hide Thumbnails</span> <i class="fa fa-angle-double-down"></i>');
            thumb_flag = 1;
        });

    }

}

//Integrated by Vamsi 02-08-2016 calling in menu-events.js -->hideAllSideMenus()
function HideThumbnails() { 
    if (thumb_flag == 1) {
        $('#thumbnails').slideUp(function () {
            $('#ThumbPanelHideShow').html('<i class="fa fa-angle-double-up"></i> <span>Show Thumbnails</span> <i class="fa fa-angle-double-up"></i>');
            thumb_flag = 0;
        });

    }
}
//Integrated by Vamsi 02-08-2016

function getThumbnails() {
    if (isMobile) {
        loadSingleThumbnails(dayIndex);
        loadThumbCarousel("singleThumbnailsContainer");
        return;
    }
    else {
        if (displaymode == "D") {        //D - doublepage, S - singlepage
            loadThumbnails(dayIndex);
            loadThumbCarousel("thumbnailsContainer");
            return;
        }
        else if (displaymode == "S") {
            loadSingleThumbnails(dayIndex);
            loadThumbCarousel("singleThumbnailsContainer");
        }
    }

        //bottomThumbnail('thumbnailsContainer');
        //if (isFirstLoad) {
        //    bottomAdShowHide();
        //    isFirstLoad = false;
        //}

        //scrollThumbs();    // to apply carousel for scroll all thumbs
    }



function loadThumbnails(d) {

    $('#thumbnailsContainer').empty();
    var lastPage = pagesLength - 1;
    var htmls = "";
    var item = 0;
    noOfThumbs = 8;
    arrThumbPages = [];
    dayIndex.find('Page').each(function (i) {
        //CURRENT PAGE ATTRIBUTES
        var currentElement = $(this);
        

       
        //var arrArtname = currentElement.attr('name').split('_');
        var Thumbname = currentElement.attr('thumbSrc');
        var PageNum = currentElement.attr('secPageNum');
        var displayName = currentElement.attr('secPageNum');
        var artText = currentElement.attr('sectionTitle');
        var p1 = parseInt(Thumbname.split('_')[3]);

        //NEXT PAGE ATTRIBUTES
        var NextPageNum;
        var NextThumbname; 
        var nextDisplayName;
        var nextArtText;
        var p2;
        if (i != pagesLength - 1) {
            var nextElement = $(this).next();

            NextThumbname = nextElement.attr('thumbSrc');
            NextPageNum = nextElement.attr('secPageNum');
            nextDisplayName = nextElement.attr('secPageNum');
            nextArtText = nextElement.attr('sectionTitle');
            p2 = parseInt(NextThumbname.split('_')[3]);
        }
        
    
        var imageSrcCurrent = Pub_RootPath + '/' + datePath + '/thumbnails/' + Thumbname + '.jpg'

        var imageSrcNext = Pub_RootPath + '/' + datePath + '/thumbnails/' + NextThumbname + '.jpg'

        var blank_page = ROOT + "Content/images/blank-image.jpg";
        if (i == 0) {    //first page
            item++;
            // htmls += '<li class="i"><img src="' + imageSrcCurrent + '" width="76" height="100" class="page-' + pageNo1 + '"><span>' + pageNo1 + '</span></li>';
            htmls += '<div class="item i pg_0_' + p1 + '"><img class="img-left thumb-lazy goto" data-page="' + p1 + '" data-original="' + imageSrcCurrent + '" alt="' + displayName + '" ' +
                    ' src="' + blank_page + '"><span style="display:block;">' + displayName + '</span></div>';
            arrThumbPages.push(item);
        }
        else if (i % 2 !== 0 && i < lastPage) {  //all pages except 1st and last
            item++;

            htmls += '<div class="item d pg_' + p1 + '_' + p2 + '">';
            htmls += '<img class="img-left thumb-lazy goto" data-page="' + p1 + '" data-original="' + imageSrcCurrent + '" alt="' + p1 + '" ' +
                    ' src=' + blank_page + '>';
            htmls += '<img class="img-right thumb-lazy goto" data-page="' + p2 + '" data-original="' + imageSrcNext + '" alt="' + nextDisplayName + '" ' +
                    'src=' + blank_page + '>';
            htmls += '<span style="display:block;">' + displayName + '-' + nextDisplayName + '</span>';
            htmls += '</div>';

            arrThumbPages.push(item);
        }
        else if (i === lastPage && pagesLength % 2 == 0) {   // final page
            item++;
            htmls += '<div class="item i pg_' + p1 + '_0"><img class="img-left thumb-lazy goto" data-page="' + p1 + '" data-original="' + imageSrcCurrent + '" alt="' + displayName + '" ' +
                    'src="' + blank_page + '"><span style="display:block;">' + displayName + '</span></div>';
            arrThumbPages.push(item);
        }

    });
    $('#thumbnailsContainer').append($(htmls));
    $('.item').hover(function () { $(this).find('p').toggle(); });  // show - hide page numbers

}


function loadSingleThumbnails(d) { 
    $('#singleThumbnailsContainer').empty();
    var lastPage = pagesLength - 1;
    var htmls = "";
    var item = 0;
    noOfThumbs = 8;
    arrThumbPages = [];
    dayIndex.find('Page').each(function (i) {
        var currentElement = $(this);
        //var arrArtname = currentElement.attr('name').split('_');
        var Thumbname = currentElement.attr('thumbSrc');
        var PageNum = currentElement.attr('secPageNum');
        var displayName = currentElement.attr('secPageNum');
        var artText = currentElement.attr('sectionTitle');
        var p1 = parseInt(Thumbname.split('_')[3]);
        var imageSrcCurrent = Pub_RootPath + '/' + datePath + '/thumbnails/' + Thumbname + '.jpg'
        var blank_page = ROOT + "Content/images/blank-image.jpg";
        item++;
        htmls += '<div class="item i pg_' + p1 + '"><img style="width:80%;" class="img-left thumb-lazy goto" data-page="' + p1 + '" data-original="' + imageSrcCurrent + '" alt="' + displayName + '" ' +
                  'src="' + blank_page + '"><span style="display:block;">' + displayName + '</span></div>';
        arrThumbPages.push(item);
    });
    $('#singleThumbnailsContainer').append($(htmls));
    $('.item').hover(function () { $(this).find('p').toggle(); });  // show - hide page numbers

}


var timeout;
function loadThumbCarousel(containerId) {

    var owl = $("#" + containerId);
    //timeout = setInterval(viewportImageLoading, 100);
    //timeout = setInterval(function () { $("img").lazyload({ effect: "fadeIn" }); }, 100);
    owl.owlCarousel({

        // Define custom and unlimited items depending from the width
        // If this option is set, itemsDeskop, itemsDesktopSmall, itemsTablet, itemsMobile etc. are disabled
        // For better preview, order the arrays by screen size, but it's not mandatory
        // Don't forget to include the lowest available screen size, otherwise it will take the default one for screens lower than lowest available.
        // In the example there is dimension with 0 with which cover screens between 0 and 450px

        itemsCustom: [
          [0, 3],
          [450, 4],
          [600, 5],
          [700, 6],
          [1000, 6],
          [1200, 10],
          [1400, 13],
          [1600, 15]
        ], 
        navigation: true,
        navigationText: [
          "<i class='fa fa-chevron-left un-click'></i>",
          "<i class='fa fa-chevron-right un-click'></i>"
        ]
        , afterAction: function () {
            viewportThumbLoading();
        }
 

    });

    $('img.goto').on('click', function (event) {
            
          
        var $this = $(this);
            
        var pageNumber = $this.attr('data-page');
        if ($this.parents('.item').hasClass('page-select')) {
            //$this.removeAttr('style').removeClass('clicked');
        } else {
            getPage(pageNumber);
            $('.bottom-thumbs .item').removeClass('page-select');
            //$this.css('background', '#7fc242');
            $this.parents('.item').addClass('page-select');
        }
    });
}



   


    
 //viewport reference :http://www.appelsiini.net/projects/viewport
//image load based on viewport
    function viewportThumbLoading() {
        $('.item:in-viewport').each(function () {
            var _this = $(this),
            _leftImage = _this.find('img.img-left'),
            _rightImage = _this.find('img.img-right');
            _leftImage.attr('src', _leftImage.attr('data-original'));
            _rightImage.attr('src', _rightImage.attr('data-original'));
            //console.log($(this).find('img.thumb-lazy').attr('alt'));
        });
    } 
