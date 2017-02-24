
/**********USER JS********************/
// to turn page


//var dayIndex;
var pagesLength;
var increment = 0;
var zoomLevel = 2000; //3000
var arrImages = [];
//var objPageDisplayNames = {};
var arrPageDisplayNames = [];
var arrCurrentPages = [];
//var objWebLinks = {};
function getPageNames() {
    //LoadWebLinks();
    //$.get(Pub_RootPath + '/' + datePath + '/thumbnails.xml', function (d) {
    //    dayIndex = $(d);
       
    //    pagesLength = dayIndex.find('Page').length;
    //    getThumbnails();
    //    loadArrImages();
    //    //getAdOnPage();   //loading ads to popup on particular page 
       
    //    loadApp(); 
    //}, 'xml');

  
    loadArrImages();
    loadApp();
    loadIssueTabs();
}


$(document).ready(function () {
    resizeViewport();
});
 

function loadArrImages() {
   
    $.each(dayIndex.find('Page'), function (i, p) {
        var pg = $(this);
        var pageName = pg.eq(0).attr('thumbSrc');
        var pageNo =  pg.eq(0).attr('pageNum');
        var pageDisplayName =  pg.eq(0).attr('secPageNum');
        arrImages.push(pageName);
        arrPageDisplayNames.push(pageDisplayName);
        pageNo = parseInt(pageNo);
        
       // objPageDisplayNames[pageNo] = pageDisplayName;
    });
}



function getPage(page_no) {

    // if (ShowPagesForGuest(page_no)) {
    if ($('.magazine').hasClass('zoom-in')) {
        $('.magazine-viewport').zoom('zoomOut');
        setTimeout(function () { pageTurn(page_no); }, 1000);  //to run after zoomout 
    }
    else {
        pageTurn(page_no);
    }
    // }

}

 

//function getPage(page_no) {

//    // if (ShowPagesForGuest(page_no)) {
//    if ($('.magazine').hasClass('zoom-in')) {
//        $('.magazine-viewport').zoom('zoomOut');
//        setTimeout(function () { pageTurn(page_no); }, 1000);  //to run after zoomout 
//    }
//    else {
//        if (isInArray(page_no, ["next", "prev", "last", "first"])) {
//            pageTurn(page_no);
//        }
//        else {
//            page_no = page_no.toUpperCase();
//            var pageIndex = arrPageDisplayNames.indexOf(page_no);
//            if (pageIndex < 0) {
//                $('#pageNum').val($('#hdn_pageNum').val());
//                return false;
//            }

//            var _page = arrImages[pageIndex];
//            page_no = parseInt(_page.split('_')[3]);
//            pageTurn(page_no);
//        }
//    }
//    // }

//}


function isInArray(value, array) {
    return array.indexOf(value) > -1;
}






function pageTurn(page_no) {

    if (page_no == 'first')
        $('.magazine').turn('page', 1);
    else if (page_no == 'last')
        $('.magazine').turn('page', pagesLength);
    else if (page_no == 'next')
        $('.magazine').turn('next');
    else if (page_no == 'prev')
        $('.magazine').turn('previous');
    else {

        $('.magazine').turn('page', page_no);
    }
}
/**********USER JS********************/






function loadApp() {

    $('#canvas').fadeIn(1000);

    var flipbook = $('.magazine');

    // Check if the CSS was already loaded

    if (flipbook.width() == 0 || flipbook.height() == 0) {
        setTimeout(loadApp, 10);
        return;
    }

    // Create the flipbook

    flipbook.turn({

        // Magazine width

        //width: (window.innerWidth-100),

        // Magazine height

        //height: (window.innerHeight-50),

        // Duration in millisecond

        duration: 1000,

        // Hardware acceleration

        acceleration: !isChrome(),

        // Enables gradients

        gradients: true,

        display: 'double',
        // Auto center this flipbook


        autoCenter: true,

        // Elevation from the edge of the flipbook when turning a page

        elevation: 50,

        // The number of pages

        pages: pagesLength,

        // Events

        when: {
            turning: function (event, page, view) {
                playFlip();
                DestroyCrop(); //to destroy the current page crop

                var book = $(this),
                currentPage = book.turn('page'),
                pages = book.turn('pages');

                // Update the current URI
                 
                var page = arrPageDisplayNames[page - 1];   //added by ashok 25-07-2016
                Hash.go('page/' + page).update();

                // Show and hide navigation buttons

                disableControls(page);


                $('.thumbnails .page-' + currentPage).
                    parent().
                    removeClass('current');

                $('.thumbnails .page-' + page).
                    parent().
                    addClass('current');



            },

            turned: function (event, page, view) {

                disableControls(page);

                $(this).turn('center');

                if (page == 1) {
                    $(this).turn('peel', 'br');
                }

                

                currentPage = $(this).turn('view')[1];
                pageNumbers = $(this).turn('view');

                var p1 = 0, p2 = 0;

                if (pageNumbers[0] == 0) {      //for last page only
                    p2 = pageNumbers[1];
                    p2 == (undefined ? p2 = pageNumbers[0] : p2 = pageNumbers[1]);
                    var lastPgNo = arrPageDisplayNames[p2 - 1];
                    $('.pageNum').val(lastPgNo);
                    $('#hdn_pageNum').val(p2);
                    $('.prev').hide();
                    $('.next').show();

                    $('.cm-next, .cm-last').show();
                    $('.cm-previous, .cm-first').hide();
                } else if (pageNumbers[0] == pagesLength) {     //for first page only
                    p1 = pageNumbers[0];
                    var firstPgNo = arrPageDisplayNames[p1 - 1];
                    $('.pageNum').val(firstPgNo);
                    $('#hdn_pageNum').val(p1);
                    $('.prev').show();
                    $('.next').hide();

                    $('.cm-previous, .cm-first').show();
                    $('.cm-next, .cm-last').hide();
                } else if (pageNumbers.length == 1) {
                    p1 = pageNumbers[0];

                    var pgNo1 = p1;
                    $('.pageNu').val(pgNo1);
                    $(' #hdn_pageNum').val(p1);
                    $('.prev').show();
                    $('.next').show();
                    $('.cm-previous, .cm-next, .cm-last, .cm-first').show();
                }
                else {
                    //for all pages except first/last
                   
                    p1 = pageNumbers[0],
                    p2 = pageNumbers[1];

                    var pgNo1 = arrPageDisplayNames[p1-1];
                    var pgNo2 = arrPageDisplayNames[p2-1];
                    $('.pageNum').val(pgNo1 + ' - ' + pgNo2);
                    $('#hdn_pageNum').val(p1 + ' - ' + p2);
                    $('.prev').show();
                    $('.next').show();
                    arrCurrentPages.push(arrImages[p1 - 1]);
                    arrCurrentPages.push(arrImages[p2 - 1]);
                    $('.cm-previous, .cm-next, .cm-last, .cm-first').show();
                }

                $('.pageNum, #hdn_pageNum').attr('pageNumbs', pageNumbers.toString()); // binding original page numbers

                //if ($('#displayMode').attr('now-mode') == 'double')
                activeThumbCss(p1, p2);  //to add highlighr css to current slide
                getImgSize();
                //else
                //    activeThumbCss(0, p1);



                //carousel.trigger('owl.jumpTo', 3)




                //contextMenu(); //right click menu
                //  if ($('.zoomImg').length > 0)
                //  $('.zoomImg').Remove();

                //  alert($('body').find('.zoomImg').length);
                ShowHideIssueTabs(p2);
                isPageLoaded = true;

                
              // loadContentLinks();   // load table of content links if not added
                

                $("#thumbnailsContainer").trigger('owl.jumpTo', p1 / 2);
                $('#canvas').focus().select();
                $('#full-page-container').fadeIn(function () { $('#loader-wrapper').fadeOut('fast'); });

                PagelinksFadeIn();

            },

            missing: function (event, pages) {

                // Add pages that aren't in the magazine

                for (var i = 0; i < pages.length; i++)
                    addPage(pages[i], $(this));

            }
        }

    });

    function playFlip()
    {
        try {
            var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
            if (!isSafari) {
                var flipAudio = new Audio(ROOT + 'Content/flip-sound/page-flip.mp3');
                flipAudio.play(); 
            }
 
        }
        catch(ex){
            throw ex;
        }
         
    }


    function getImgSize() {
        var currentslidepagenum = $('#hdn_pageNum').val().split('-');
        var _page = parseInt(currentslidepagenum[0].trim());
       var _imageName = arrImages[_page - 1];
       var img_id = Pub_RootPath + "/" + datePath + "/page/" + _imageName + ".jpg";
        //var img = $("#" + img_id);
        // Create dummy image to get real width and height
        $("<img>").attr("src", img_id).load(function () {
            var pic_real_width = this.width;
            var pic_real_height = this.height;
            $('#imgOrginalSizes').val(pic_real_width + "," + pic_real_height);

        });
    }

    function threeDigitNumber(str, max) {
        str = str.toString();
        return str.length < max ? threeDigitNumber("0" + str, max) : str;
    }


    // Zoom.js

    $('.magazine-viewport').zoom({
        flipbook: $('.magazine'),

        max: function () {

            return largeMagazineWidth() / $('.magazine').width();

        },

        when: {

            swipeLeft: function () {

                $(this).zoom('flipbook').turn('next');

            },

            swipeRight: function () {

                $(this).zoom('flipbook').turn('previous');

            },

            resize: function (event, scale, page, pageElement) {

                if (scale == 1)
                    loadSmallPage(page, pageElement);
                else {
                    loadLargePage(page, pageElement);
                    //loadPNGLargePage(page, pageElement);
                    //loadJPGLargePage(page, pageElement);
                } 
            },

            zoomIn: function () {

                PagelinksFadeIn();

                $('.thumbnails').hide();
                $('.made').hide();
                $('.magazine').removeClass('animated').addClass('zoom-in');
                $('.zoom-icon').removeClass('zoom-icon-in').addClass('zoom-icon-out');

                if (!window.escTip && !$.isTouch) {
                    escTip = true;

                    $('<div />', { 'class': 'exit-message' }).
						html('<div>Press ESC to exit</div>').
							appendTo($('body')).
							delay(2000).
							animate({ opacity: 0 }, 500, function () {
							    $(this).remove();
							});
                }
            },

            zoomOut: function () {

                PagelinksFadeIn();

                $('.exit-message').hide();
                $('.thumbnails').fadeIn();
                $('.made').fadeIn();
                $('.zoom-icon').removeClass('zoom-icon-out').addClass('zoom-icon-in');

                setTimeout(function () {
                    $('.magazine').addClass('animated').removeClass('zoom-in');
                    resizeViewport();
                }, 0);

            }
        }
    });

    // Zoom event

    if ($.isTouch) 
        $('.magazine-viewport').bind('zoom.doubleTap', zoomTo);
    
    else
        $('.magazine-viewport').bind('zoom.tap', zoomTo);
    


    // Using arrow keys to turn the page

    $(document).keydown(function (e) {

        var previous = 37, next = 39, esc = 27;

        switch (e.keyCode) {
            case previous:

                // left arrow
                getPage('prev');
                e.preventDefault();

                break;
            case next:

                //right arrow
                getPage('next');
                e.preventDefault();

                break;
            case esc:

                $('.magazine-viewport').zoom('zoomOut');
            
                e.preventDefault();
                

                break;
        }
    });

    // URIs - Format #/page/1 

    Hash.on('^page\/([cC]?[0-9]*)$', {
        yep: function (path, parts) {
            var page = parts[1]; 
            if (page !== undefined) {
                if ($('.magazine').turn('is')) {  
                    var pageindex = arrPageDisplayNames.indexOf(page.toUpperCase()); //added by ashok 25-07-2016
                    $('.magazine').turn('page', (pageindex + 1));
                }
            }

        },
        nop: function (path) {

            if ($('.magazine').turn('is'))
                $('.magazine').turn('page', 1);
        }
    });


    $(window).resize(function () {
        resizeViewport();
    }).bind('orientationchange', function () {
        resizeViewport();
    });

    // Events for thumbnails

    $('.thumbnails').click(function (event) {

        var page;

        if (event.target && (page = /page-([0-9]+)/.exec($(event.target).attr('class')))) {
            $('.magazine').turn('page', page[1]);
        }
    });

    $('.thumbnails li').
		bind($.mouseEvents.over, function () {

		    $(this).addClass('thumb-hover');

		}).bind($.mouseEvents.out, function () {

		    $(this).removeClass('thumb-hover');

		});

    if ($.isTouch) {

        $('.thumbnails').
			addClass('thumbanils-touch').
			bind($.mouseEvents.move, function (event) {
			    event.preventDefault();
			});

    } else {

        $('.thumbnails ul').mouseover(function () {

            $('.thumbnails').addClass('thumbnails-hover');

        }).mousedown(function () {

            return false;

        }).mouseout(function () {

            $('.thumbnails').removeClass('thumbnails-hover');

        });

    }




    // Regions

    //if ($.isTouch) {
    //    $('.magazine').bind('touchstart', regionClick);
    //} else {
    //    $('.magazine').click(regionClick);
    //}

    // Events for the next button
    if (!EnableTabs) {
        $('.next-button').bind($.mouseEvents.over, function () {

            $(this).addClass('next-button-hover');

        }).bind($.mouseEvents.out, function () {

            $(this).removeClass('next-button-hover');

        }).bind($.mouseEvents.down, function () {

            $(this).addClass('next-button-down');

        }).bind($.mouseEvents.up, function () {

            $(this).removeClass('next-button-down');

        }).click(function () {

            $('.magazine').turn('next');

        });

        // Events for the next button

        $('.previous-button').bind($.mouseEvents.over, function () {

            $(this).addClass('previous-button-hover');

        }).bind($.mouseEvents.out, function () {

            $(this).removeClass('previous-button-hover');

        }).bind($.mouseEvents.down, function () {

            $(this).addClass('previous-button-down');

        }).bind($.mouseEvents.up, function () {

            $(this).removeClass('previous-button-down');

        }).click(function () {

            $('.magazine').turn('previous');

        });
    }

    resizeViewport();

    $('.magazine').addClass('animated');

}




// Zoom icon

$('.zoom-icon').bind('mouseover', function () {

    if ($(this).hasClass('zoom-icon-in'))
        $(this).addClass('zoom-icon-in-hover');

    if ($(this).hasClass('zoom-icon-out'))
        $(this).addClass('zoom-icon-out-hover');

}).bind('mouseout', function () {

    if ($(this).hasClass('zoom-icon-in'))
        $(this).removeClass('zoom-icon-in-hover');

    if ($(this).hasClass('zoom-icon-out'))
        $(this).removeClass('zoom-icon-out-hover');

}).bind('click', function () {

    if ($(this).hasClass('zoom-icon-in'))
        $('.magazine-viewport').zoom('zoomIn');
    else if ($(this).hasClass('zoom-icon-out'))
        $('.magazine-viewport').zoom('zoomOut');

});

$('#canvas').hide();






/*
 * Magazine sample
*/

function addPage(page, book) {

    var id, pages = book.turn('pages');

    // Create a new element for this page
    var element = $('<div />', {});

    // Add the page to the flipbook
    if (book.turn('addPage', element, page)) {

        // Add the initial HTML
        // It will contain a loader indicator and a gradient
        element.html('<div class="gradient"></div><div class="loader"></div>');

        var indexedPage = dayIndex.find('Page').eq((page - 1)).attr('thumbSrc');

        //element.html('<div id="' + indexedPage + 'divToolbar" class="clip-toolbar" style="display:none;z-index:9999;position:absolute"><button type="button" width="8" height="16" page-no=' + page + ' onclick="ShareCropedImage(this);" class="btn btn-info"><i class="fa fa-share-square-o"></i> Share</button>&nbsp;<button type="button" width="8" height="16" onclick=" DestroyCrop();" class="btn btn-info"><i class="fa fa-times"></i> Close</button></div>');
        //element.html('<div id="' + indexedPage + 'divToolbar"  class="popover fade top in clip-toolbar" role="tooltip"><div style="left: 50%;" class="arrow"></div><div class="popover-content">' +
        //            '<button id="clip-options-save"  onclick="ShareCropedImage(this);" class="btn btn-primary">Clip &amp; Share</button><button id="clip-options-cancel" style="display:none;" onclick="DestroyCurrentCrop(\'' + indexedPage + '\');" class="btn btn-link">' +
        //            '<i class="fa fa-times"></i> Cancel</button></div></div>');
        
        // Load the page
        loadPage(page, element);
    }

}

function loadPage(page, pageElement) {

    // Create an image element

    var img = $('<img />');

    img.mousedown(function (e) {
        e.preventDefault();
    });

    img.load(function () {

        // Set the size
        $(this).css({ width: '100%', height: '100%' });

        // Add the image to the page after loaded

        $(this).appendTo(pageElement);

        // Remove the loader indicator

        pageElement.find('.loader').remove();
    });

    var indexedPage = dayIndex.find('Page').eq((page - 1)).attr('thumbSrc');
    var currPageNo = indexedPage;

    // Load the page

    //img.attr('src', 'pages/' +  page + '.jpg');
    img.attr('src', Pub_RootPath + '/' + datePath + '/' + 'page/' + indexedPage + '.jpg').attr({ id: indexedPage, class: 'pageClass' });

    img.attr('data-id', indexedPage);
   

   

    if (strWebLinks != '') {        
        loadRegions(currPageNo, pageElement, img);    // loading region values
    }   
    
}




// Zoom in / Zoom out

function zoomTo(event) {
  
    
    if (cropping == 0) {
        setTimeout(function () {
            if ($('.magazine-viewport').data().regionClicked) {
                $('.magazine-viewport').data().regionClicked = false;
            } else {
                //Santoh commented for Croping 16/03/2016
                if ($('.magazine-viewport').zoom('value') == 1) {
                    $('.magazine-viewport').zoom('zoomIn', event);
                } else {
                    $('.magazine-viewport').zoom('zoomOut');
                }
                //Santoh commented for Croping 16/03/2016
            }
        }, 1);

    }
}



 //Load regions

//function loadRegions(page, element, img) {

//    $.get(Pub_RootPath + '/' + datePath + '/WebLinks.xml', function (d) {
         
//        $(d).find("links").each(function (i, regionData) {
//            var region = $(regionData);
//            var vPageName = $(this).attr("page");
//            if (page == vPageName)
//                addRegion(region, element, img, vPageName);
//        });
//    }, 'xml');
//}

 
 
// Load large page
var zoomedTo = 1;
function loadLargePage(page, pageElement) {
     
    var pageName = dayIndex.find('Page').eq((page - 1)).attr('thumbSrc'),
    rows = 2, columns = 2;

    //calculation to set image width & height based on the function largeMagazineWidth()
    var smallImgWidth = ($('.magazine').width() / 2) / columns,
        smallImgHeight = $('.magazine').height() / rows,
        ratio = largeMagazineWidth() / $('.magazine').width(),
        largeImgWidth = ratio * smallImgWidth,
        largeImgheight = ratio * smallImgHeight;
//largeImgheight = '502';

    var percentage = $('.magazine').width() / largeMagazineWidth() * 100;

    //if (pageElement.find("div#z_" + pageName).length > 0) {
       // if ($("div#z_" + pageName).css('display') == 'none') {
            //$('.div-table-col').css({ width: largeImgWidth, height: largeImgheight });
       // }
       // $('.div-table-col').css({ width: largeImgWidth, height: largeImgheight });
       // $("div#z_" + pageName).fadeIn();
    //} else {
         
        var zpagesPath = Pub_RootPath + '/' + datePath + '/' + 'Panning/' + pageName.split('_')[3];
        var htmlData = '<div  id="z_' + pageName + '" class="zoomImg"><div class="div-table">';

        for (i = 0; i < rows; i++) {   // loop until 4 means number of large images for a column
            htmlData += '<div class="div-table-row">';
            for (j = 0; j < columns; j++) {   // loop until 4 means number of large images for a row
                                htmlData += '<div class="div-table-col" style="width:' + largeImgWidth + 'px; height:' + largeImgheight + 'px;"><img class="lazy" data-original="' + zpagesPath + '/' + pageName + '_x' + j + 'y' + i + '.jpg"' +
                                         ' src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" '+
                                         'alt="' + pageName + '" id="' + pageName + '_' + i + '_' + j + '" style="width:500px; height:676px;"/></div>';

                //htmlData += '<div class="div-table-col" style="width:' + largeImgWidth + 'px; height:' + largeImgheight + 'px;" ><img class="lazy" data-original="' + zpagesPath + '/' + pageName + '_x' + j + 'y' + i + '.jpg"' +
                //         ' asrc="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" ' +
                //         ' id="' + pageName + '_' + i + '_' + j + '" style="width:100%; height:100%;" /></div>';


                //htmlData += '<div style="background-repeat: no-repeat;background-size: 100% 100%;" class="div-table-col" data-original="' + zpagesPath + '/' + pageName + '_x' + j + 'y' + i + '.jpg" style="width:' + largeImgWidth + 'px; height:' + largeImgheight + 'px;" >' +
                //        ' </div>';
            } //td
            htmlData += '</div>';
        } //tr
        htmlData += "</div></div>";

        pageElement.append(htmlData);

        //to change cursor icon
        $('.zoomImg, .highlighter').addClass('grab');
        $('.zoomImg, .highlighter').mousedown(function () { $(this).removeClass('grab').addClass('grabbing'); });
        $('.zoomImg, .highlighter').mouseup(function () {
            $(this).removeClass('grabbing').addClass('grab');
        });



        if (increment === 0) {   // to effect after completion of loading two pages
            $('#zoom-value').text(zoomedTo);
            $(window).bind('mousedown mouseover mousemove scroll', function () {
                viewportImageLoading();
            });

            //first time call after zoom
            timeout = setInterval(viewportImageLoading, 100);

            // restting the slider values



        }

        increment++;


        //var img = $('<img />');

        //img.load(function() {

        //	var prevImg = pageElement.find('img');
        //	$(this).css({width: '100%', height: '100%'});
        //	$(this).appendTo(pageElement);
        //	prevImg.remove();

        //});

        //// Loadnew page

        //img.attr('src', 'pages/' +  page + '-large.jpg');

   // }
}







//function loadPNGLargePage(page, pageElement) {

//    var pageName = dayIndex.find('Page').eq((page - 1)).attr('thumbSrc'),
//    rows = 4, columns = 4;

//    //calculation to set image width & height based on the function largeMagazineWidth()
//    var smallImgWidth = ($('.magazine').width() / 2) / columns,
//        smallImgHeight = $('.magazine').height() / rows,
//        ratio = largeMagazineWidth() / $('.magazine').width(),
//        largeImgWidth = ratio * smallImgWidth,
//        largeImgheight = ratio * smallImgHeight;

//    var percentage = $('.magazine').width() / largeMagazineWidth() * 100;

//    //if (pageElement.find("div#png_z_" + pageName).length > 0) {
//    //    if ($("div#png_z_" + pageName).css('display') == 'none') {
//    //        //$('.div-table-col').css({ width: largeImgWidth, height: largeImgheight });
//    //    }
//    //    $('.div-table-col').css({ width: largeImgWidth, height: largeImgheight });
//    //    $("div#png_z_" + pageName).fadeIn();
//    //} else {

//        var zpagesPath = Pub_RootPath + '/' + datePath + '/' + 'Panning/png/' + pageName.split('_')[3];
//        var htmlData = '<div  id="png_z_' + pageName + '" class="zoomImg"  style="z-index:9999;"><div class="div-table">';

//        for (i = 0; i < rows; i++) {   // loop until 4 means number of large images for a column
//            htmlData += '<div class="div-table-row">';
//            for (j = 0; j < columns; j++) {   // loop until 4 means number of large images for a row
//                htmlData += '<div style="background-repeat: no-repeat;background-size: 100% 100%;" class="div-table-col" data-original="' + zpagesPath + '/' + pageName + '_x' + j + 'y' + i + '.png" style="width:' + largeImgWidth + 'px; height:' + largeImgheight + 'px;" >' +
//                        ' </div>';
//            } //td
//            htmlData += '</div>';
//        } //tr
//        htmlData += "</div></div>";

//        pageElement.append(htmlData);

//        //to change cursor icon
//        $('.zoomImg, .highlighter').addClass('grab');
//        $('.zoomImg, .highlighter').mousedown(function () { $(this).removeClass('grab').addClass('grabbing'); });
//        $('.zoomImg, .highlighter').mouseup(function () {
//            $(this).removeClass('grabbing').addClass('grab');
//        });



//        if (increment === 0) {   // to effect after completion of loading two pages
//            $('#zoom-value').text(zoomedTo);
//            $(window).bind('mousedown mouseover mousemove', function () {
//                viewportImageLoading();
//            });

//            //first time call after zoom
//            timeout = setInterval(viewportImageLoading, 100);

//            // restting the slider values



//        }

//        increment++;


//        //var img = $('<img />');

//        //img.load(function() {

//        //	var prevImg = pageElement.find('img');
//        //	$(this).css({width: '100%', height: '100%'});
//        //	$(this).appendTo(pageElement);
//        //	prevImg.remove();

//        //});

//        //// Loadnew page

//        //img.attr('src', 'pages/' +  page + '-large.jpg');

//    //}
//}

//function loadJPGLargePage(page, pageElement) {
    
//    var pageName = dayIndex.find('Page').eq((page - 1)).attr('thumbSrc'),
//    rows = 4, columns = 4;

//    //calculation to set image width & height based on the function largeMagazineWidth()
//    var smallImgWidth = ($('.magazine').width() / 2) / columns,
//        smallImgHeight = $('.magazine').height() / rows,
//        ratio = largeMagazineWidth() / $('.magazine').width(),
//        largeImgWidth = ratio * smallImgWidth,
//        largeImgheight = ratio * smallImgHeight;

//    var percentage = $('.magazine').width() / largeMagazineWidth() * 100;

//    //if (pageElement.find("div#jpg_z_" + pageName).length > 0) {
//    //    if ($("div#jpg_z_" + pageName).css('display') == 'none') {
//    //        //$('.div-table-col').css({ width: largeImgWidth, height: largeImgheight });
//    //    }
//    //    $('.div-table-col').css({ width: largeImgWidth, height: largeImgheight });
//    //    $("div#jpg_z_" + pageName).fadeIn();
//    //} else {

//        var zpagesPath = Pub_RootPath + '/' + datePath + '/' + 'Panning/jpg/' + pageName.split('_')[3];
//        var htmlData = '<div  id="jpg_z_' + pageName + '" class="zoomImg" style="z-index:9998;"><div class="div-table">';

//        for (i = 0; i < rows; i++) {   // loop until 4 means number of large images for a column
//            htmlData += '<div class="div-table-row">';
//            for (j = 0; j < columns; j++) {   // loop until 4 means number of large images for a row
//                htmlData += '<div style="background-repeat: no-repeat;background-size: 100% 100%;" class="div-table-col" data-original="' + zpagesPath + '/' + pageName + '_x' + j + 'y' + i + '.jpg" style="width:' + largeImgWidth + 'px; height:' + largeImgheight + 'px;" >' +
//                        ' </div>';
//            } //td
//            htmlData += '</div>';
//        } //tr
//        htmlData += "</div></div>";

//        pageElement.append(htmlData);

//        //to change cursor icon
//        $('.zoomImg, .highlighter').addClass('grab');
//        $('.zoomImg, .highlighter').mousedown(function () { $(this).removeClass('grab').addClass('grabbing'); });
//        $('.zoomImg, .highlighter').mouseup(function () {
//            $(this).removeClass('grabbing').addClass('grab');
//        });



//        if (increment === 0) {   // to effect after completion of loading two pages
//            $('#zoom-value').text(zoomedTo);
//            $(window).bind('mousedown mouseover mousemove', function () {
//                viewportImageLoading();
//            });

//            //first time call after zoom
//            timeout = setInterval(viewportImageLoading, 100);

//            // restting the slider values



//        }

//        increment++;


//        //var img = $('<img />');

//        //img.load(function() {

//        //	var prevImg = pageElement.find('img');
//        //	$(this).css({width: '100%', height: '100%'});
//        //	$(this).appendTo(pageElement);
//        //	prevImg.remove();

//        //});

//        //// Loadnew page

//        //img.attr('src', 'pages/' +  page + '-large.jpg');

//    //}
//}


//image load based on viewport
function viewportImageLoading() {
    $("img.lazy").each(function () {
        var attr = $(this).attr('data-original');
        if ($(this).is_on_screen() && typeof attr !== typeof undefined && attr !== false) {
            $(this).fadeOut('fast', function () {
                $(this).attr("src", $(this).attr("data-original")).fadeIn('fast');
                $(this).removeAttr("data-original");
            });
        }
    });


    //$('.div-table-col:in-viewport').each(function () {
    //    if ($('.magazine').hasClass('zoom-in')) {
    //        var _this = $(this);
    //        var attr = _this.attr('data-original');
    //       if (typeof attr !== typeof undefined && attr !== false) {
    //        _Image = _this.attr('data-original');
    //            _this.css('background-image', 'url("' + _Image + '")');
    //            _this.removeAttr('data-original');
    //        }
    //    }
    //});


    clearInterval(timeout);
}


http://upshots.org/javascript/jquery-test-if-element-is-in-viewport-visible-on-screen
//function to check element viewport status
(function ($) {
    $.fn.is_on_screen = function () {
        var win = $(window);
        var viewport = {
            top: win.scrollTop(),
            left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var bounds = this.offset();
        bounds.right = bounds.left + this.outerWidth();
        bounds.bottom = bounds.top + this.outerHeight();

        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    };
})(jQuery);


// Load small page

function loadSmallPage(page, pageElement) {

    var pageName = dayIndex.find('Page').eq((page - 1)).attr('name');
    var img = pageElement.find('img');
    increment = 0;

    $(".zoomImg").remove();
    //$('#zoom-level').fadeOut();
    $('#zoomLevel').fadeOut();
    $('.highlighter').removeClass('grab grabbing');

    //var img = pageElement.find('img');

    //img.css({width: '100%', height: '100%'});

    //img.unbind('load');
    //// Loadnew page

    //img.attr('src', 'pages/' +  page + '.jpg');
}

// http://code.google.com/p/chromium/issues/detail?id=128488

function isChrome() {

    return navigator.userAgent.indexOf('Chrome') != -1;

}

function disableControls(page) {
    if (page == 1)
        $('.previous-button').hide();
    else
        $('.previous-button').show();

    if (page == $('.magazine').turn('pages'))
        $('.next-button').hide();
    else
        $('.next-button').show();
}

// Set the width and height for the viewport

function resizeViewport1() {
    var width = $('.main-container').width(),
       height = $('.main-container').height(),
       options = $('.magazine').turn('options');

    $('.magazine').removeClass('animated');

    $('.magazine-viewport').css({
        width: width,
        height: height
    }).
	zoom('resize');


    if ($('.magazine').turn('zoom') == 1) {
        var bound = calculateBound({
            width: options.width,
            height: options.height,
            boundWidth: Math.min(options.width, width),
            boundHeight: Math.min(options.height, height)
        });



        if (bound.width % 2 !== 0)
            bound.width -= 1;
        if (bound.width != $('.magazine').width() || bound.height != $('.magazine').height()) {

            $('.magazine').turn('size', bound.width, bound.height);

            if ($('.magazine').turn('page') == 1)
                $('.magazine').turn('peel', 'br');

            $('.next-button').css({ height: bound.height, backgroundPosition: '-38px ' + (bound.height / 2 - 32 / 2) + 'px' });
            $('.previous-button').css({ height: bound.height, backgroundPosition: '-4px ' + (bound.height / 2 - 32 / 2) + 'px' });
        }

        // $('.magazine').css({ top: -bound.height / 2, left: -bound.width / 2 });
    }

}

function resizeViewport() {
    
    try{
        var LeftAdWidth = $('#LeftBannerAd').width();
        var NextPrevButtonsWidth = 45; //$('.previous-button').width() + $('.next-button').width();

        if (EnableTabs) { NextPrevButtonsWidth = 70 }

        var width = $(window).width() - NextPrevButtonsWidth - LeftAdWidth,  //here 40 is scrollbar width + ad margin
           height = $(window).height() - ($('header').height()),
            options = $('.magazine').turn('options');
        $('#LeftBannerAd').css({ height: height });
        $('.magazine').removeClass('animated');

        $('.magazine-viewport').css({
            width: width + NextPrevButtonsWidth,
            height: height
        }).
        zoom('resize');
        var w = 1, marginLeft = 0;
        if ($('#display-mode').attr('now-mode') == 'single') {
            w = 2;
            marginLeft = (width / w) / 2;
        }
        else {
            w = 1;
            marginLeft = 0;
        }


        if ($('.magazine').turn('zoom') == 1) {
            var bound = calculateBound({
                width: (options.width + NextPrevButtonsWidth) / w,
                height: options.height,
                boundWidth: Math.min(options.width, width),
                boundHeight: Math.min(options.height, height)
            });

            if (bound.width % 2 !== 0)
                bound.width -= 1;


            if (bound.width != $('.magazine').width() || bound.height != $('.magazine').height()) {

                $('.magazine').turn('size', bound.width, bound.height);

                if ($('.magazine').turn('page') == 1)
                    $('.magazine').turn('peel', 'br');

                $('.next-button').css({ height: bound.height, backgroundPosition: '-38px ' + (bound.height / 2 - 32 / 2) + 'px' });
                $('.previous-button').css({ height: bound.height, backgroundPosition: '-4px ' + (bound.height / 2 - 32 / 2) + 'px' });
            }

            $('.magazine').css({ top: -bound.height / 2, left: -bound.width / 2 });
        }

        var magazineOffset = $('.magazine').offset(),
            boundH = height - magazineOffset.top - $('.magazine').height(),
            marginTop = (boundH - $('.thumbnails > div').height()) / 2;

        if (marginTop < 0) {
            $('.thumbnails').css({ height: 1 });
        } else {
            $('.thumbnails').css({ height: boundH });
            $('.thumbnails > div').css({ marginTop: marginTop });
        }

        if (magazineOffset.top < $('.made').height())
            $('.made').hide();
        else
            $('.made').show();

        $('.magazine').addClass('animated');
        
        
        //var currentslidepagenum = $('#hdn_pageNum').val().split('-');
        //$.each(currentslidepagenum, function (i, item) {
        //    var pgName = datePath + "_" + threeDigitNumber($.trim(item), 3);
        //    $('.jcrop-tracker, .jcrop-holder,.jcrop-holder > img, #' + pgName).css({ width: '100%', height: '100%' });
         
        //    getImgSize(pgName);
        //    applyJCrop(pgName);
        //});
    }
    catch(err)
    { 
       // throw 500;
    }
    

}


// Number of views in a flipbook

function numberOfViews(book) {
    return book.turn('pages') / 2 + 1;
}

// Current view in a flipbook

function getViewNumber(book, page) {
    return parseInt((page || book.turn('page')) / 2 + 1, 10);
}

function moveBar(yes) {
    if (Modernizr && Modernizr.csstransforms) {
        $('#slider .ui-slider-handle').css({ zIndex: yes ? -1 : 10000 });
    }
}

function setPreview(view) {

    var previewWidth = 112,
		previewHeight = 73,
		previewSrc = 'pages/preview.jpg',
		preview = $(_thumbPreview.children(':first')),
		numPages = (view == 1 || view == $('#slider').slider('option', 'max')) ? 1 : 2,
		width = (numPages == 1) ? previewWidth / 2 : previewWidth;

    _thumbPreview.
		addClass('no-transition').
		css({
		    width: width + 15,
		    height: previewHeight + 15,
		    top: -previewHeight - 30,
		    left: ($($('#slider').children(':first')).width() - width - 15) / 2
		});

    preview.css({
        width: width,
        height: previewHeight
    });

    if (preview.css('background-image') === '' ||
		preview.css('background-image') == 'none') {

        preview.css({ backgroundImage: 'url(' + previewSrc + ')' });

        setTimeout(function () {
            _thumbPreview.removeClass('no-transition');
        }, 0);

    }

    preview.css({
        backgroundPosition:
            '0px -' + ((view - 1) * previewHeight) + 'px'
    });
}

// Width of the flipbook when zoomed in

function largeMagazineWidth() {

    return zoomLevel;

}

// decode URL Parameters

function decodeParams(data) {

    var parts = data.split('&'), d, obj = {};

    for (var i = 0; i < parts.length; i++) {
        d = parts[i].split('=');
        obj[decodeURIComponent(d[0])] = decodeURIComponent(d[1]);
    }

    return obj;
}

// Calculate the width and height of a square within another square

function calculateBound(d) {

    var bound = { width: d.width, height: d.height };

    if (bound.width > d.boundWidth || bound.height > d.boundHeight) {

        var rel = bound.width / bound.height;

        if (d.boundWidth / rel > d.boundHeight && d.boundHeight * rel <= d.boundWidth) {

            bound.width = Math.round(d.boundHeight * rel);
            bound.height = d.boundHeight;

        } else {

            bound.width = d.boundWidth;
            bound.height = Math.round(d.boundWidth / rel);

        }
    }

    return bound;
}


 

//Issues tabs scripts -Vamshi---------------start---------------------
function loadIssueTabs() {
    if (EnableTabs) {
        // $.get(Pub_RootPath + '/' + datePath + '/IssueTabs/IssueTabs.xml', function (data) {
        var _html = "";
        _html = _html + '<div style="position: absolute; height: 99%;">';
        objIssueTabs.find('TAB').each(function () {
            var pageNo = $(this).attr('page');
            var xmlsrc = $(this).attr('src');
            var src = Pub_RootPath + '/' + datePath + '/'+xmlsrc;
            var pageindex = arrImages.indexOf(pageNo) + 1;
            _html = _html + "<img class='imgIssueTabs' title='goto page: " + arrPageDisplayNames[pageindex] + "' pageindex='" + pageindex + "' onclick=getPage(" + pageindex + ") id='imgTab" + pageNo + "' src='" + src + "'></img>";
        });
        _html = _html + "</div>";
        $('.previous-button').append(_html);
        $('.next-button').append(_html);
        //}, 'xml');
    }
}

function ShowHideIssueTabs(currPageIndex) {
    if (EnableTabs) {
        $('.previous-button .imgIssueTabs').each(function (index) {
            var tabindex = parseInt($(this).attr('pageindex'));
            if (tabindex <= currPageIndex) {
                $(this).css('visibility','visible');
            }
            else { $(this).css('visibility', 'hidden'); }
        });
        $('.next-button .imgIssueTabs').each(function (index) {
            var tabindex = parseInt($(this).attr('pageindex'));
            if (tabindex > currPageIndex) {
                $(this).css('visibility', 'visible');
            } else { $(this).css('visibility', 'hidden'); }
        });
    }
}

//Issues tabs scripts -Vamshi---------------end---------------------

function PagelinksFadeIn() {
    var IsPagelinkFadein = true; // need to make this configurable 
    if (IsPagelinkFadein) {
        $('.region').fadeTo("fast", 0.2);
        setTimeout(function () { $('.region').fadeTo("slow", 0) }, 1000);
    }
}