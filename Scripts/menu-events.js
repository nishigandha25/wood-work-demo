


function createTag(tag) {
    return $('<' + tag + '/>');
}


//region click is in index.js
//if ($.isTouch) {
//    $('.common-holder').bind('touchstart', regionClick);
//} else {
//    $('.common-holder').click(regionClick);
//}

$(document).ready(function () {


    jQuery(document).on('keyup', function (evt) {
        if (evt.keyCode == 27) {
            DestroyCrop();
            zoomClose();
        }
    });



    //Navigation Menu Slider
    $('#more').on('click', function (e) {
        e.preventDefault();
        moreOptionsShowHide();
    });
    $('body').click(function (e) {
        if (!$(e.target).hasClass('un-click')) {
            hideAllSideMenus();
        }
    });

    //backissues btn click
    //if (displaymode == "D") {
    //    $('#back-issues').on('click', function (e) {
    //        e.preventDefault();
    //        $('#divMore').removeClass();
    //        $('#divArchives').toggleClass('nav-expanded');
    //    });

    //}
    //else if (displaymode == "S") {
    //    $('#back-issues').datepicker({
    //        todayBtn: "linked",
    //        autoclose: true
    //    });
    //}

    $('#back-issues').on('click', function (e) {
        backissuesShowHide(); 
        e.preventDefault();
            });


    //print btn click
    $('#page-print').on('click', function (e) {
        e.preventDefault();
        showPrintDialog(this);
    });

    //save btn click
    $('#page-save').on('click', function (e) { 
        e.preventDefault();
        showSavePdfDialog(this);
    });

    $('#liLogin').on('click', function (e) {
        e.preventDefault();
        window.location.href = ROOT+'/login'
    });

    $('#liLogout').on('click', function (e) {
        e.preventDefault();
        window.location.href = ROOT + 'login'
        window.location.href = 'login'
    });

    //share btn click
    $('#link-share').on('click', function (e) {
        e.preventDefault();
        showShareDialog();
    });

    //crop btn click
    $('#crop-page').click(function () {
        //showCropDialog();
        Cropimage();
    });

  //crop btn click
    $('#TOC-link').click(function () {
        showContentDialog();
    });
    //bottom thumbnails btn click
    $('#ThumbPanelHideShow').click(function () {
        bottomAdShowHide();
        setTimeout(viewportThumbLoading, 500);
    });

    //displaymode btn click (1-page / 2-page)
    $('#display-mode').click(function () {
        changeDisplayMode(this);
    });

    //bookmarks btn click
    $('#bookmarks').click(function () {
        showBookmarkDialog();
    });

    //page number textbox event
    $('#pageNum').keypress(function (e) {
        GotoPageOnKeyPress(e, 'gotopage');
    });

    //page number textbox event
    $('#btn-first-page').click(function (e) {
        getPage('first');
    });

    //page number textbox event
    $('#btn-prev-page').click(function (e) {
        getPage('prev');
    });

    //page number textbox event
    $('#btn-next-page').click(function (e) {
        getPage('next');
    });

    //page number textbox event
    $('#btn-last-page').click(function (e) {
        getPage('last');
    });
});


function backissuesShowHide() { 
    $('#divMore').removeClass();
    $('#divArchives').toggleClass('nav-expanded');
}


function moreOptionsShowHide() { 
    $('#divMore').toggleClass('nav-expanded');
    $('#divArchives').removeClass();
}

function hideAllSideMenus() {
    $('#divMore').removeClass();
    $('#divArchives').removeClass();
    HideThumbnails();
}

//================================================================//
//--------------------START PRINT BUTTON SCRIPT-------------------//
//================================================================//

var pages = [];
var printPagesCount = 0;
var arrImageSrc = [];
var OpenWindow = false;
function getPages() {
    pages = [];
    dayIndex.find('Page').each(function (i) {
        var imageNum = $(this).attr("name");
        //pages.push(imageNum.toLowerCase());

        var arrThumbname = $(this).attr('thumbSrc');
        var imageSrc = Pub_RootPath + '/' + datePath + '/thumbnails/' + arrThumbname + '.jpg';
        arrImageSrc.push(imageSrc);
    });

}


function showPrintDialog(args) {

    var dialog = BootstrapDialog.show({
        title: '<i class="fa fa-print"></i> Print',
        cssClass: 'auto-scroll',
        //size: BootstrapDialog.SIZE_WIDE,
        message: function (dialog) {
            var $message = thumbLoadForPrintSave('print');
            return $message;
        },
        onShow: function (dialogItself) {

            //$('#thumbsColl').parents('.modal-body').addClass('auto-scroll');
        },
        buttons: [{
            icon: 'fa fa-print',
            label: 'Print',
            cssClass: 'btn-primary',
            action: function (dialogRef) {
                printPages();
                //setTimeout(function () {
                //    dialogRef.close();
                //}, 100);
            }
        }, {
            label: 'Cancel',
            action: function (dialogItself) {
                dialogItself.close();
            }
        }],
        onhidden: function (dialogRef) {
            printPagesCount = 0;    // reset selected images to print
            $('#mag-container').focus().select();
        }
    });


}


//GETTING DATA FROM DAYIDEX AND CREATING CURRENT-PAGE-DATA / NEXT-PAGE-DATA OBJECT
function dayIndexDataForThumbs() {
    var arrThumbsData = new Array();
    dayIndex.find('Page').each(function (i) {

        var pageDisplayNames = {}, thumbSrcs = {}, pageNumbers = {}, articleText = {};
        //CURRENT PAGE ATTRIBUTES

        var currentElement = $(this);
        //var arrArtname = currentElement.attr('name').split('_');
        var arrThumbname = currentElement.attr('thumbSrc');
        var artPageNum = currentElement.attr('secPageNum');
        var displayName = currentElement.attr('secPageNum');
        var artText = currentElement.attr('sectionTitle');

        //NEXT PAGE ATTRIBUTES
        var artNextPageNum;
        var arrNextThumbname;
        var arrArtNextname = [];
        var nextDisplayName;
        var nextArtText;
        if (i != pagesLength - 1) {
            var nextElement = $(this).next();

            //arrArtNextname = nextElement.attr('name').split('_');
            arrNextThumbname = nextElement.attr('thumbSrc');
            artNextPageNum = nextElement.attr('secPageNum');
            nextDisplayName = nextElement.attr('secPageNum');
            nextArtText = nextElement.attr('sectionTitle');
        }
        //alert(nextDisplayName);

        var currentPageSrc = Pub_RootPath + '/' + datePath + '/thumbnails/' + arrThumbname + '.jpg';
        var nextPageSrc = Pub_RootPath + '/' + datePath + '/thumbnails/' + arrNextThumbname + '.jpg';

        var thumbsDataObj = {
            current: { displayName: displayName, artText: artText, imgSrc: currentPageSrc, pageNo: artPageNum, pageName: arrThumbname },
            next: { displayName: nextDisplayName, artText: nextArtText, imgSrc: nextPageSrc, pageNo: artNextPageNum, pageName: arrNextThumbname }
        };

        arrThumbsData.push(thumbsDataObj);
    });

    return arrThumbsData;
}

function thumbLoadForPrintSave(opt) {
    var data = dayIndexDataForThumbs();    //getting data for thumbnails
    var print_html = "";
    var prevPage = 0;
    var lastPage = pagesLength - 1;
    print_html += '<div id="thumbsColl">';
   
    $.each(data, function (i, item) {
         
        var currentPageNumber = parseInt(item.current.pageName.split('_')[3]);
        if (prevPage != currentPageNumber) {
            print_html += '<div class="col-xs-6 col-sm-6 col-md-3"><div class="thumbnail"><div class="row  thumbToPrint">';

            print_html += ' <a class="printPage col-xs-6 col-sm-6 col-md-6" href="javascript:void(0)" call-from="' + opt + '" onclick="pageSelectToPrintSave(this);">' +
                      '<img src="' + item.current.imgSrc + '" class="img-responsive" alt="' + item.current.displayName + '"><span class="p-left">' + item.current.displayName + '</span><input type="checkbox" id="chkPage_' + item.current.pageNo + '" name="printsavecheckboxlist"  pageno="' + item.current.pageName + '"  class="chkThumbLeft"></a>';

            if (i != 0 && i < lastPage) {
                print_html += '<a class="printPage col-xs-6 col-sm-6 col-md-6" href="javascript:void(0)" call-from="' + opt + '" onclick="pageSelectToPrintSave(this);">' +
                        '<img src="' + item.next.imgSrc + '" class="img-responsive" alt="' + item.next.displayName + '"><span class="p-right">' + item.next.displayName + '</span><input type="checkbox" id="chkPage_' + item.next.pageNo + '"  name="printsavecheckboxlist"  pageno="' + item.next.pageName + '"  class="chkThumbLeft"></a>';
            }
            if (i != data.length - 1) {
                var nextPageNumber = parseInt(item.next.pageName.split('_')[3]);
                if (nextPageNumber > 2)
                    prevPage = nextPageNumber;
            }

            print_html += '</div></div></div>';
        }


    });
    print_html += '</div>';
    return print_html;
}

function pageSelectToPrintSave(args) {
    var divBox = $(args);

    var opt = divBox.attr('call-from');
    var chkBox = divBox.find('input.chkThumbLeft');
    var pageImg = divBox.find('img');
    if (chkBox.is(':checked')) {
        chkBox.parent().find('img').removeClass("page-select");
        chkBox.prop("checked", false);
        pageImg.fadeTo('speed', 1);
        //printPagesCount--;
    }
    else {
        if (opt == 'print') {
            chkBox.parent().find('img').addClass("page-select");
            chkBox.prop("checked", true);
            //printPagesCount++;
        }
        else if (opt == 'save') {
            //$('.printPage').find('input.chkThumbLeft').prop("checked", false);
            //$('.printPage').find('img').removeClass('page-select');
            //$('.printPage img').not(pageImg).fadeTo('speed', 1);
            chkBox.parent().find('img').addClass("page-select");
            chkBox.prop("checked", true);
        }

        pageImg.fadeTo('speed', 0.5);
    }


}

function printPages() {
     
    
    var MainPrintDiv = createTag('div').attr('class', 'page-wrap');

    if ($('#thumbsColl img.page-select').length === 0) {
        alert('please select page(s)');
        return false;
    }
    else {

        $('#thumbsColl .page-select').each(function () {
             
            var printPageDiv = createTag('div').attr('class', 'printSection');

            var page_src = this.src.replace('thumbnails', 'page');


            var img = $('<img/>');

            img.attr('src', page_src);
            img.appendTo(printPageDiv);
            printPageDiv.appendTo(MainPrintDiv);
        });

        //var checkValues = $('#thumbsColl input[name=printsavecheckboxlist]:checked').map(function () {
        //    return $(this).attr('pageno');
        //}).get();

 

       // OpenWindow = null;
       // $.ajax({
       //    url: ROOT + 'Index/PrintPages',
       //     type: "POST",
       //     dataType: "html",
       //     data: { pages: checkValues.toString() },
       //     success: function (data) {
                //var message = data.Message; 
                //debugger
                //if ((OpenWindow == null) || (OpenWindow.closed)) {
                    
                //var left = (screen.width / 2) - (700 / 2);
                //var top = (screen.height / 2) - (800 / 2);
                //var OpenWindow = window.open("", 'print', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + 700 + ', height=' + 800 + ', top=' + top + ', left=' + left);
                 
                //$(OpenWindow.document.body).html(data);

               
                //         //CHECK WHETHER PRINT WINDOW IS ALREADY OPENED OR NOT
                        
                //        $('.overlay-div').show();
                //        $('.overlay-div').click(function () {
                //            OpenWindow.focus();
                //            return false;
                //        }).keydown(function () {
                //            OpenWindow.focus();
                //            return false;
                //        });
 
                //        OpenWindow.print();
                //        OpenWindow.focus();

                //        $(OpenWindow).on('beforeunload', function () {
                //            $('.overlay-div').hide();
                //        });
                //    }

                //Popup(data);
            //}
        //});
    }


    //function Popup(data) {
    //    debugger
    //    var mywindow = window.open('', 'new div', 'height=400,width=600');
    //    mywindow.document.write('<html><head><title>my div</title>');
    //    /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
    //    mywindow.document.write('</head><body >');
    //    mywindow.document.write(data);
    //    mywindow.document.write('</body></html>');

    //    mywindow.print();
    //    mywindow.close();

    //    return true;
    //}

     

    $('.printSection').children().addClass('printversion');
    var printContent = $('head').html() + MainPrintDiv.html();
    $('.printSection').children().removeClass('printversion');

    //var uniqueName = new Date();
    //var windowName = 'PrintSection' + uniqueName.getTime();
    var output = MainPrintDiv.html();
    var left = (screen.width / 2) - (700 / 2);
    var top = (screen.height / 2) - (800 / 2);
    OpenWindow = null;
    if ((OpenWindow == null) || (OpenWindow.closed)) {
         //CHECK WHETHER PRINT WINDOW IS ALREADY OPENED OR NOT
        OpenWindow = window.open(ROOT + 'print.html', 'print', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + 700 + ', height=' + 800 + ', top=' + top + ', left=' + left);
        $('.overlay-div').show();
        $('.overlay-div').click(function () {
            OpenWindow.focus();
            return false;
        }).keydown(function () {
            OpenWindow.focus();
            return false;
        });
        OpenWindow.dataFromParent = output; // dataFromParent is a variable in child.html
        //$("#printDialog").dialog("close");
        OpenWindow.print();
        OpenWindow.focus();

        $(OpenWindow).on('beforeunload', function () {
            $('.overlay-div').hide();
        });
    }

}



//================================================================//
//-------------------END PRINT BUTTON SCRIPT----------------------//
//================================================================//


//================================================================//
//----------------------SAVE PDF START----------------------------//
//================================================================//


function showSavePdfDialog() {

    var dialog = BootstrapDialog.show({
        title: '<i class="fa fa-download"></i> Select pages to save as PDF',
        //size: BootstrapDialog.SIZE_WIDE,
        cssClass: 'auto-scroll',
        message: function (dialog) {
            var $message = thumbLoadForPrintSave('save');
            return $message;
        },
        buttons: [
            {
                icon: 'fa fa-download',
                label: 'Download Selected Pages',
                cssClass: 'btn-primary',
                action: function (dialogRef) {
                    savePage();
                }
            },
            {
                icon: 'fa fa-download',
                label: 'Download All Pages',
                cssClass: 'btn-primary',
                action: function (dialogRef) {
                    saveEntirePdf();
                }
            },

        {
            label: 'Cancel',
            action: function (dialogItself) {
                dialogItself.close();
            }
        }],
        onhidden: function (dialogRef) {
            printPagesCount = 0;    // reset selected images to print
            $('#mag-container').focus().select();
        }
    });


}

function savePage1() {
    var selectedPage = $('input[type="checkbox"]:checked').attr("pageno");
    if (selectedPage == undefined) {
        alert('Please select a page');
        return false;
    }
    downloadpdf(0, selectedPage);
}


function savePage() {

    var MainPrintDiv = createTag('div').attr('class', 'page-wrap');

    if ($('#thumbsColl img.page-select').length === 0) {
        alert('please select page(s)');
        return false;
    }
    else {
       
        var count = $('#thumbsColl img.page-select').length;

        var arrSelectedPages = [];
        var arrDisplayNames = [];

        $("#thumbsColl input:checkbox[class=chkThumbLeft]:checked").each(function () {
             
            var selectedPage = $(this).attr('pageno');
            var displayNumber =this.id.split('_')[1];
            arrSelectedPages.push(selectedPage);
            arrDisplayNames.push(displayNumber);
           
        }); 
        //to download selected pages as zip
         window.location = ROOT + 'Index/DownloadSelectedPages?strSelectedPages=' + arrSelectedPages.toString() + '&strDisplayNames=' + arrDisplayNames.toString() + '&strCurrentDate=' + datePath.toString();
    }
}

function saveEntirePdf() {
    if (confirm('Are you sure, you want to download all pages in a single PDF?')) {
        var selectedPage = $('input[type="radio"][name="rdoPageGroup"]:first').attr("pageno");
        downloadpdf(1, selectedPage);
    }
    else return false;
}


//**********************SAVE PDF START***********22Dec14*************//
function downloadpdf(configPdfTypeValue, currentslidepagenum) {
    //if (strLogin == "InValid") {
    //    conformation();
    //    return false;
    //}

    var PDFName = currentslidepagenum;

    if (configPdfTypeValue == "1") {// if it is entire pdf then
        PDFName = Pub_RootPath + '/' + datePath + '/Runpdf/' + datePath + ".pdf";
    }
    else {
        PDFName = Pub_RootPath + '/' + datePath + '/Pageprint/' + PDFName + ".pdf";
    }

    window.open(PDFName, 'PDF', 'top=0, left=0,resizable=yes,scrollbars=yes,toolbar=no,status=yes');

}
//**********************SAVE PDF END***********22Dec14*************//


//================================================================//
//-------------------------SAVE PDF END---------------------------//
//================================================================//





//================================================================//
//-------------------------SHARE PAGE START-----------------------//
//================================================================//



function showShareDialog() {
    BootstrapDialog.show({
        title: '<i class="fa fa-share-alt"></i> Share',
        //size: BootstrapDialog.SIZE_WIDE,
        message: function (dialog) {
            var $message = ShareDialogContent();
            return $message;
        },
        onshown: function () {
            $('#linkUrl').val(document.URL);
            tabRelevantBtns();
            socialIcons();
        },
        buttons: [{
            id: 'send-mail-btn',
            icon: 'glyphicon glyphicon-envelope',
            label: 'Send email',
            cssClass: 'btn-primary tab-btns',
            action: function (dialogRef) {
                postShareForm();
            }
        },

        {
            id: 'copy-link-btn',
            icon: 'glyphicon glyphicon-copy',
            label: 'Copy this link',
            cssClass: 'btn-primary tab-btns',
            action: function (dialogRef) {
                copyToClipBoard();
            }
        },
        {
            id: 'share-opts-btn',
            icon: 'fa fa-share',
            label: 'More',
            cssClass: 'btn-primary tab-btns',
            action: function (dialogRef) {
                moreSocialIcons();
            }
        },
        {
            label: 'Cancel',
            action: function (dialogItself) {
                dialogItself.close();
            }
        }],
        onhidden: function (dialogRef) {
            printPagesCount = 0;    // reset selected images to print
            $('#mag-container').focus().select();
        }
    });
}



function copyToClipBoard() {
    var copyTextarea = document.querySelector('#linkUrl');
    copyTextarea.select();

    try {
        var successful = document.execCommand('copy');
        //var msg = successful ? 'successful' : 'unsuccessful';
        if (successful)
            alert('URL copied to your clipboard..!!');
    } catch (err) {
        console.log('Oops, unable to copy');
    }
}

function moreSocialIcons() {
    var urlText = document.URL;
    var url = encodeURIComponent(urlText);
    var redirectUrl = "http://www.addthis.com/bookmark.php?v=15&winname=addthis&pub=addthis&s=more&url=" + url + "&title=pressmart";
    // alert(redirectUrl);
    window.open(redirectUrl, '_blank');
}




//function to create social icons to share
function socialIcons() {
    var s_url = encodeURIComponent(document.URL), artTitle = $('#share-header').val();
    var html_icons = "";
    //creating all social network details as objects
    var facebook = { name: 'facebook', url: 'http://www.facebook.com/sharer/sharer.php?u=' + s_url + "&t=" + artTitle, imageUrl: '../images/social-icons/facebook.png' },
        twitter = { name: 'twitter', url: 'https://twitter.com/intent/tweet?text=' + artTitle + "&url=" + s_url, imageUrl: '../images/social-icons/twitter.png' },
        delicious = { name: 'delicious', url: 'http://del.icio.us/post?url=' + s_url + "&title=" + artTitle, imageUrl: '../images/social-icons/delicious.png' },
        stumbleupon = { name: 'stumbleupon', url: 'http://www.stumbleupon.com/submit?url=' + s_url + "&title=" + artTitle, imageUrl: '../images/social-icons/stumbleupon.png' },
        digg = { name: 'digg', url: 'http://digg.com/submit?phase=2&url=' + s_url + "&title=" + artTitle, imageUrl: '../images/social-icons/digg.png' },
        linkedin = { name: 'linkedin', url: 'http://www.linkedin.com/shareArticle?mini=true&url=' + s_url + "&title=" + artTitle, imageUrl: '../images/social-icons/linkedin.png' },
        googleplus = { name: 'google-plus', url: 'https://plus.google.com/share?url=' + s_url + "&title=" + artTitle, imageUrl: '../images/social-icons/googleplus.png' };

    //array of objects
    var socialIcons = [facebook, twitter, linkedin, googleplus, digg, stumbleupon, delicious];
    //creating html with above social network icons
    html_icons = '<div class="row"><div class="col-md-12 text-center"><br/><ul class="social-network social-circle">';
    for (i = 0; i < socialIcons.length; i++) {
        html_icons += '<li><a href="#" class="ico' + socialIcons[i].name + '" data-href="' + socialIcons[i].url + '" title="Share on ' + socialIcons[i].name + '" onclick="shareUrlRedirect(this);" title="Rss">' +
                        '<i class="fa fa-' + socialIcons[i].name + '"></i></a></li>';
    }
    html_icons += '</ul></div></div>';
    //return html_icons;
    $('#socialIconsShare').empty().append(html_icons);

    //$('.tooltip a').tipsy({ fade: true, gravity: 'n' });   //tool tip


}

function shareUrlRedirect(args) {
    //if (confirm('Are you sure, you want to share the article?')) {
    var Url = $(args).attr('data-href');
    window.open(Url, "_blank", "toolbar=no, scrollbars=yes, resizable=no, top=300, left=500, width=500, height=500");
    // }
    // else return false;
}


function tabRelevantBtns() {
    //$('#tabContent li').click(function () {
    //    var _this = $(this);
    //    $('.tab-btns').hide();
    //    var _btn_id = _this.find('a').attr('href') + '-btn';
    //    $(_btn_id).show();
    //});
     
    $('#share-opts-btn, #add-bookmark-btn').show();
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $('.tab-btns').hide();
        var target = $(e.target).attr("href") // activated tab
        var _btn_id = target + '-btn';
        $(_btn_id).show();
    });
}



function ShareDialogContent() {
    _shareHtml = "";
    _shareHtml += '<ul class="nav nav-tabs" id="tabContent">' +
        '<li class="active"><a href="#share-opts" data-toggle="tab"><span class="glyphicon glyphicon-share"></span> Share</a></li>' +
        '<li><a href="#copy-link" data-toggle="tab"><span class="glyphicon glyphicon-link"></span> Copy the link</a></li>' +
        '<li><a href="#send-mail" onclick="getShareForm();" data-toggle="tab"><span class="glyphicon glyphicon-envelope"></span> Send as Mail</a></li>' +
        '</ul><div class="tab-content">' +

        '<div class="tab-pane" id="copy-link"><div class="form-group">' +
        '<label for="comment">Link to this Page:</label>' +
        '<textarea class="form-control" readonly id="linkUrl" rows="3"></textarea>' +
        '</div></div>' +
        '<div class="tab-pane  active" id="share-opts"><span id="socialIconsShare"></span></div>' +
        '<div class="tab-pane" id="send-mail">' + 
    '</div></div>';

   
    return _shareHtml;

   
}

//to get send mail form
function getShareForm() {
    $('#send-mail').empty().html('');
    $.get(ROOT + 'Index/SendMail', function (data) {
        $('#send-mail').append(data);
    });
}

function postShareForm() { 
    var form = $('#frmSendMail');
    var formCollection = form.serialize();
    var path = form.attr('action');
 
    if (validateForm()) {
        $.post(path, formCollection, function (data) {
             
            $('#frmSendMail input').val('');
            $('#frmSendMail .message').slideDown();
        });
    }
}

function validateForm() {
    var validate = true; 
    $('#frmSendMail input').each(function () {
        var element = $(this);
        if ($.trim(element.val()).length == 0) {
            element.parent().addClass('has-error');
            validate = false;
        }
        else {
            element.parent().removeClass('has-error');
        }
    });

    return validate;

}

//================================================================//
//-------------------------SHARE PAGE END-------------------------//
//================================================================//



//$(document).ready(function () {

//    //Navigation Menu Slider
//    $('#back-issues').on('click', function (e) {
//        e.preventDefault();
//        $('body').toggleClass('nav-expanded');
//    });
//    $('#nav-close').on('click', function (e) {
//        e.preventDefault();
//        $('body').removeClass('nav-expanded');
//    });
//});



//================================================================//
//-------------------------DISPLAY MODE START---------------------//
//================================================================//

function changeDisplayMode(args) {
    var _args = $(args);
    var page_no = 0;
    if (_args.attr('now-mode') == "double") {
        _args.attr('now-mode', "single");
        _args.html('<span><i class="fa fa-columns"></i></span>2-Page View');
        _args.attr('title', "Double");
        $(".magazine").bind("start", function (event, pageObject, corner) {
            if (corner != null) {
                event.preventDefault();
            }
        });
    } else {
        _args.attr('now-mode', "double");
        _args.html('<span><i class="fa fa-file-o"></i></span>1-Page View');
        _args.attr('title', "Single");
    }
    resizeViewport();
    $('.magazine').turn('display', _args.attr('now-mode')).css({ overflow: 'visible' });
    //getThumbnails();
    getPage('next');
    getPage('prev');

}

//================================================================//
//-------------------------DISPLAY MODE END-----------------------//
//================================================================//



//================================================================//
//-------------------------FULL SCREEN START----------------------//
//================================================================//


$(document).ready(function () {
    //to make fullscreen
    $('#full-screen').click(function () {
        // check native support
        $('#support').text($.fullscreen.isNativelySupported() ? 'supports' : 'doesn\'t support');
        $('#container').fullscreen();
        return false;
    });

    //fullscreen events
    $(document).bind('fscreenchange', function (e, state, elem) {
        if ($.fullscreen.isFullScreen()) {
            $('#full-screen-menu').show();
            $('.draggable-div').drags();
            //$('#container').removeAttr('style');
            $('#container').css({ 'overflow': 'auto' });
            //$('#divZoom').css({ 'overflow': 'auto', 'z-index': '999999' });
        }
        else {
            $('#full-screen-menu').hide();
        }
    });
});

//to exit fullscreen
function exitfullscreen() {
    $.fullscreen.exit();
    turnAutoPlay(false);
    //$('#mag-container').focus().select();
    return false;
}






/**************Draggable div************/
(function ($) {
    $.fn.drags = function (opt) {

        opt = $.extend({ handle: "", cursor: "move" }, opt);

        if (opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function (e) {
            if (opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function (e) {
                $('.draggable').offset({
                    top: e.pageY + pos_y - drg_h,
                    left: e.pageX + pos_x - drg_w
                }).on("mouseup", function () {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function () {
            if (opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    }
})(jQuery);



var timer = 0;
function turnAutoPlay(bool) {
    if (bool) {
        if (layoutType == 'm') {
            timer = setInterval(function () {
                if ($('.magazine').turn('page') == $('.magazine').turn('pages')) {
                    $('.magazine').turn('page', 1);
                } else {
                    $('.magazine').turn('next');
                }
            }, 3000);
        }
        else {
            timer = setInterval(function () {
                var currentPage = parseInt($("#hdn_pageNum").val());
                jpageContainer.jPages(currentPage + 1);
            }, 3000);
        }
        $('#button_play').addClass('stop btn-danger').find('i').removeClass('fa-play').addClass('fa-stop');

    } else {
        $('#button_play').removeClass('stop btn-danger').find('i').removeClass('fa-stop').addClass('fa-play');
        clearInterval(timer);
    }
}


function turnPlayToggle(args) {

    if (!$(args).hasClass('stop')) {
        turnAutoPlay(true);
        $(args).addClass('stop btn-danger').find('i').removeClass('fa-play').addClass('fa-stop');
    }
    else {
        turnAutoPlay(false);
        $(args).removeClass('stop btn-danger').find('i').removeClass('fa-stop').addClass('fa-play');
    }
}



//================================================================//
//-------------------------FULL SCREEN END------------------------//
//================================================================//


//================================================================//
//-------------------------BOOKMARKS START------------------------//
//================================================================//


function showBookmarkDialog() {
    BootstrapDialog.show({
        title: '<i class="fa fa-bookmark"></i>  Add / View Bookmarks(s)',
        //size: BootstrapDialog.SIZE_WIDE,
        message: function (dialog) {
            var $message = BookmarkDialogContent();
            return $message;
        },
        onshown: function () {
            GetBookmarkDetails();
            tabRelevantBtns();
        },
        buttons: [{
            id: 'add-bookmark-btn',
            icon: 'fa fa-plus-square',
            label: 'Add',
            cssClass: 'btn-primary tab-btns',
            action: function (dialogRef) {
                AddBookmark();
            }
        },

        {
            id: 'view-bookmark-btn',
            icon: 'fa fa-trash',
            label: 'Delete',
            cssClass: 'btn-primary tab-btns',
            action: function (dialogRef) {
                DeleteBookmarks();
            }
        },

        {
            label: 'Cancel',
            action: function (dialogItself) {
                dialogItself.close();
            }
        }],
        onhidden: function (dialogRef) {
            printPagesCount = 0;    // reset selected images to print
            $('#mag-container').focus().select();
        }
    });
}

function BookmarkDialogContent() {
    _shareHtml = "";
    _shareHtml += '<ul class="nav nav-tabs  full-width-tabs" id="tabContent">' +
        '<li class="active take-all-space-you-can"><a href="#add-bookmark" data-toggle="tab">Add Bookmark</a></li>' +
        '<li class="take-all-space-you-can"><a href="#view-bookmark" data-toggle="tab">View Bookmark(s)</a></li>' +
        '</ul>' +
        '<div class="tab-content">' +
        '<div class="tab-pane active" id="add-bookmark"><div class="form-group">' +
        '<label for="comment">Add your comments:</label>' +
        '<textarea class="form-control" rows="5" id="bookmark-comments"></textarea>' +
        '<br/><small>Max Length: 25 characters</small></div></div>' +
        '<div class="tab-pane" id="view-bookmark">' +
        '<div id="view-bookmarks"><table id="tbl-bookmarks" class="table"><thead></thead><tbody></tbody></table></div></div></div>' +
        '<div id="bookmark-msg" class="alert fade in" style="display:none;">' +
        //'<a href="#" class="close">&times;</a>'+
        '<strong class="msg-status"></strong> <span>-message-<span></div>';
    return _shareHtml;
}


//to add bookmarks
function AddBookmark() {
     
    var comments = $('#bookmark-comments').val();

    var pageNo = $('#hdn_pageNum').val();
    $.ajax({

        url: ROOT + 'api/MagazineAPI/SaveBookmarkDetails',
        type: 'POST',
        data: { Message: comments, pageNo: pageNo, pubName: urlProductName, issueDate: urlIssueDate },
        dataType: 'json',
        success: function (data) {
            var msg = data["Message"];
            var label_msg = "";
            var msg_status = "";
            if (msg == "S") {
                $('#bookmark-msg').removeClass('alert-danger').addClass('alert-success');
                label_msg = "Bookmark added";
                msg_status = "Success!";
                $('#bookmark-comments').val('');
            }
            else if (msg = "E") {
                $('#bookmark-msg').removeClass('alert-success').addClass('alert-danger');
                label_msg = "Bookmark already exist";
                msg_status = "Failed!";
            }
            var CookieName = data["CookieName"];
            $('#bookmark-msg').show();
            $('#bookmark-msg span').text(label_msg);
            $('#bookmark-msg .msg-status').text(msg_status);

            $('.alert').fadeTo(2000, 500).slideUp(500, function () {
                $(this).hide();
            });

            //setTimeout(function () { $('#label-msg').fadeOut().text(''); }, 5000);
            GetBookmarkDetails();     // refreshing the grid
        },
        failure: function () { alert(); }

    });
}





function GetBookmarkDetails() {

    $('#tbl-bookmarks tbody, #tbl-bookmarks thead').empty();
    //var header = $('<tr><th style="width: 25%">Page number</th><th>Comments</th><th style="width: 2%"></th></tr>');
    var header = $('<tr><th>Page number</th><th>Comments</th><th>#</th></tr>');
    $('#tbl-bookmarks thead').append(header);

    if (document.cookie.length) {
        var theCookies = document.cookie.split(';');
        $.each(theCookies, function (index, value) {
            var cookieName = value.split('=')[0];
            var pg_no = value.indexOf("&") > -1 ? value.split('=')[2].split('&')[0] : value.split('=')[2];
            var edition = value.indexOf("&") > -1 ? value.split('=')[3].split('&')[0] : value.split('=')[3];
            var comment = value.split('=')[4];
            var cookieElementName = value.split('=')[1];

            //binding the bookmark details to grid
            var product = urlProductName + urlIssueDate.toString();
            if (product == edition) {
                if (cookieElementName.trim().toLowerCase() == 'pageno') {
                    //var checkbox1 = '<input type="checkbox" class="chk-delete" name="' + cookieName + '" onClick="SelectRowToDelete(this);"/>';
                    var checkbox = '<label class="btn btn-default"><input type="checkbox" name="' + cookieName + '"  onChange="SelectRowToDelete(this);" class="chk-delete hidden" autocomplete="off"><span class="glyphicon glyphicon-ok"></span></label>';
                    var pageNo = $.trim($.trim(pg_no).split('-')[0]);
                    var pageNum = pageNo;
                    var row = $('<tr style="cursor:pointer;" data-toggle="buttons" onClick="getPage(' + pageNum + ')"><td>' + pg_no + '</td><td>' + comment + '</td><td>' + checkbox + '</td></tr>');
                    $('#tbl-bookmarks tbody').append(row);
                }
            }
        });
    }
}



function SelectRowToDelete(args) {
    var currentChk = $(args);
    if (currentChk.is(':checked')) {
        currentChk.parent().parents('tr').addClass('to-delete alert-danger');
    }
    else {
        currentChk.parent().parents('tr').removeClass('to-delete alert-danger');
    }
}



//delete bookmarks
function DeleteBookmarks() {

    $('#tbl-bookmarks  tr').each(function () {
        var row = $(this);
        var chk = row.find('.chk-delete');
        if (row.hasClass('to-delete')) {
            var cookieName = chk.attr('name');
            if (cookieName != "") {
                document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

                $('#bookmark-msg').removeClass('alert-danger').addClass('alert-success').show();
                $('#bookmark-msg span').text("Selected bookmark was deleted..!!");
                $('#bookmark-msg .msg-status').text("Success!");
                //$('.alert .close').on('click', function (e) {
                //    $(this).parent().hide();
                //});

                $('.alert').fadeTo(2000, 500).slideUp(500, function () {
                    $(this).hide();
                });

            }

        }
    });
    GetBookmarkDetails();   // refreshing the grid
}
//================================================================//
//-------------------------BOOKMARKS END--------------------------//
//================================================================//


//================================================================//
//----------------------SEARCH SCRIPT STRAT-----------------------//
//================================================================//

$('#pageNum').focus(function () {
    $(this).val("");
}).blur(function () { 
    var currentslidepagenum = $('#hdn_pageNum').attr('pagenumbs').split(',');
    var _page1 = parseInt(currentslidepagenum[0].trim());
    var _page2 = parseInt(currentslidepagenum[1].trim());
    if (displaymode == "D") {
        var pageNumbers = arrPageDisplayNames[_page1 - 1] + ' - ' + arrPageDisplayNames[_page2 - 1];
        $(this).val(pageNumbers);
    }
    else if (displaymode == "S") {
        $(this).val(arrPageDisplayNames[_page2 - 1]);
    }
});


function GotoPageOnKeyPress(e, frombox) {

    if (frombox == "submit") {
        return false;
    }
    var key = e.which || e.keyCode;
    if (frombox == "gotopage") {
        if (key > 31 && (key < 48 || key > 57)) {
            return false;
            return true;
        }
        else {
            if (key == 13 && frombox == "gotopage") {
                if (document.getElementById('pageNum').value != "") {
                    var page_no = $('#pageNum').val();
                    page_no = page_no.toUpperCase();
                    var pageIndex = arrPageDisplayNames.indexOf(page_no);
                    if (pageIndex < 0) {
                         $('#pageNum').val($('#hdn_pageNum').val());
                          return false;
                     }

                    var _page = arrImages[pageIndex];
                    page_no = parseInt(_page.split('_')[3]);
                    getPage(page_no);
                   // getPage($('#pageNum').val());
                    return false;
                }
                else {
                    alert("Please enter number to go to page");
                    return false;
                }

            }
        }
    }
    if (key == 13 && frombox == "basicsearch") {

        if (key > 31 && (key < 48 || key > 57)) {
            return false;
        }
        else {
            getSearchResults();
        }
    }

}


function getSearchResults() {
    if (document.getElementById('txtSearchText').value != "") {
        searchkeywords();
        return false;
    }
    else {
        alert("Please enter text to search");
        return false;
    }
}

/*added by ashok****************start*********02042015*/
var pageIndex = 0, _pages = [];
var intervaldata;
function searchkeywords() {
    var searchTerm = $("#txtSearchText").val();
    var data0 = { Keyword: searchTerm, IssuePath: Pub_RootPath + '/' + datePath, DatePath: datePath };
    $.ajax({

        url: ROOT + 'Index/GetSearch',
        type: 'GET',
        data: data0,
        dataType: 'json',
        beforeSend: function () {
            $('#search_content, #SearchModal .modal-header h4').empty().html('');
            pageIndex = 0;
            _pages = [];
        },
        success: function (data) {


            if (data == "none") {
                getSearchDataByPage(data, $("#txtSearchText").val());
            }
            else {
                //document.getElementById('divSearch').innerHTML = data;
                _pages = data.SearchResult.split(',');
                var pageCount = _pages.length;
                // to load first few results of the search
                intervaldata = setInterval(function () {
                    $('#load_more').show();
                    if (pageIndex <= 7) {
                        var value = _pages[pageIndex];
                        getSearchDataByPage(_pages[pageIndex], $("#txtSearchText").val());
                        pageIndex++;

                    }
                    else {
                        clearInterval(intervaldata);
                    }
                }, 100);

                
                // to load results on scroll
                $('.modal-body').bind('scroll', function () {
                    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 100) {
                        if (pageIndex <= pageCount) {
                            var value = _pages[pageIndex];
                            getSearchDataByPage(_pages[pageIndex], $("#txtSearchText").val());     // to load remaining results of the search on scroll
                            $('#s_loading').show().html('<i class="fa fa-spinner fa-spin"></i> loading results...');
                            pageIndex++;
                        }
                        else {
                            $('#load_more, #s_loading').hide();
                            $('#s_loading').html("Total results <b>" + $('#search_content .search-result').length + "</b>").show();
                        }
                    }
                });

               
            }
        }
    });

    if (isMobile) {
        $('#SearchModal').on('shown.bs.modal', function () {
            var height = $(window).height() - 150;
            $(this).find('.modal-dialog').css({
                width: 'auto',
                height: 'auto',
                'max-height': '100%'
            });
            $(this).find(".modal-body").css("height", height);
        }).modal('show');
    }
    else {

        $("#SearchModal").on("show.bs.modal", function () {
            var height = $(window).height() - 200;
            $(this).find(".modal-body").css("height", height);
        }).modal('show');

    }

    $('#SearchModal').on('hidden.bs.modal', function () {
        $("#txtSearchText").val('');
    })

    //$("#SearchModal").modal('show');
}


//var objWebLinks;
//function LoadWebLinks() {
//    if (is_link_xml_exist == 'True') {
//        $.get(Pub_RootPath + '/' + datePath + '/weblinks.xml', function (d) {
//            objWebLinks = $(d);
//        }, 'xml');
//    }
//}




function getSearchDataByPage(page, keyword) {


    var edition_name = urlProductName;
    if (page === undefined) {
        return false;
    }
    if (page == "none") {
        $('#search_content').html("<div class='content'><p>Sorry! search keyword(s) not found!" + " " + "for" + " '" + keyword + "'<p><div>");
        $('#load_more, #s_loading').hide();
        return false;
    }

    $('#SearchModal .modal-header h4').html("Search Results for '<b><i>" + keyword + "</i></b>'");
    $.get(Pub_RootPath + '/' + datePath + '/searchcontent/' + datePath + '_' + page + '.xml', function (xml) {
        var _searchHtml = "";
        $(xml).find('Page > Flow').each(function () {

            var pageObj = $(this).parent();
            var pageBox = pageObj.attr('crop_box').split(',');
            var pageWidth = pageBox[2], pageHight = pageBox[3];
            $(this).find('Para').each(function () {  //Flow tag
                //$(this).find('Word').each(function () {
                var paraObj = $(this);
                var kw = $.trim(keyword).toLowerCase();
                var s_wrod = $.trim(paraObj.text()).toLowerCase();
                // if (kw === s_wrod) { 
                if (s_wrod.indexOf(kw) > -1) {
                    //var _style = paraObj.find('Line').attr('style');
                    var _content = paraObj.text().toString();
                    if (_content.length > 120) {
                        var _content = _content.substring(0, 120) + '....';  //taking first 120 charecters in the result content
                    }
                    var _onClick = "gotoLinkPage('" + parseInt(page) + "');";
                    //_searchHtml += '<div id="' + page + '" class="content" onclick="' + _onClick + '">';
                    //_searchHtml += '<img src="' + Pub_RootPath + "/" + datePath + "/thumbnails/" + datePath + "_" + page + ".jpg" + '"/>';
                    //_searchHtml += '<p class="result_content"><span class="heading">' + edition_name + ' - Page ' + parseInt(page) + '</span></br>' + _content + '</p>';
                    //_searchHtml += '</div>';

                    var displayName = arrPageDisplayNames[parseInt(page)-1];
                    _searchHtml += '<div class="search-result row bg-info">';
                    _searchHtml += '<a href="javascript:' + _onClick + '" title="Page ' + parseInt(page) + '" class="thumbnail hidden-xs col-sm-2 col-md-2"><img src="' + Pub_RootPath + "/" + datePath + "/thumbnails/" + datePath + "_" + page + ".jpg" + '"/></a>';
                    _searchHtml += '<div class="col-xs-12 col-sm-9 col-md-9">';
                    _searchHtml += '<h5><a href="javascript:' + _onClick + '"  onclick="' + _onClick + '" title="">' + edition_name + ' - Page ' + displayName + '</a></h5>';
                    _searchHtml += '<p class="">' + _content + '</p>';
                    _searchHtml += '</div></div>';


                    //to highlight the keyword on page images
                    paraObj.find('Word').each(function () {
                        var wordObj = $(this);
                        var _wrod = $.trim(wordObj.text()).toLowerCase();
                        if (_wrod.indexOf(kw) > -1) {
                            var box = wordObj.attr('box').split(',');
                            //console.log(box);
                            var _left = box[0],
                                        _bottom = box[1],
                                        _width = box[2],
                                        _height = box[3],
                                        page_id = parseInt(page);
                            addHighlights(_bottom, _left, _width, _height, page, pageWidth, pageHight);
                        }
                    });


                }
                //});
            });
        });

        $('#search_content').append(_searchHtml);
        $(".search-result p").highlight(keyword, "highlight");
        $('#s_loading').fadeOut('4000');
       
    }, 'xml');
}


//user defined function to ckeck is container has scrollbar or not
(function ($) {
    $.fn.hasScrollBar = function () {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);


//to highlight particular word(s) in a string of a container
jQuery.fn.highlight = function (str, className) {
     
    var regex = new RegExp(str, "gi");
   // return this.each(function () {
        $(this).contents().filter(function () {
            return this.nodeType == 3 && regex.test(this.nodeValue);
        }).replaceWith(function () {
            return (this.nodeValue || "").replace(regex, function (match) {
                return "<span class=\"" + className + "\">" + match + "</span>";
            });
        });
    //});
};


function addHighlights(bt, lt, wt, ht, id, pw, ph) {
    var bottom = (bt / ph * 100) + '%',
                 left = (lt / pw * 100) + '%',
                 width = (wt / pw * 100) + '%',
                 height = (ht / ph * 100) + '%';

    var reg = $('<div />', { 'class': 'highlighter-s' });

    reg.css({ bottom: bottom, left: left, width: width, height: height });

    var pageElement = $('img#' + datePath + "_" + id).parent();


    //debugger


    //var image = new Image();
    //image.src = $('img#' + datePath + "_" + id).attr('src');
    //var imgOriginalWidth = 1000;

    //$(image).load(function () {

    //    var originalWidth = this.width;
    //    var originalHeight = this.height;


    //    var _ratio = originalWidth / originalHeight;

    //    var canvasWidth = imgOriginalWidth;
    //    var canvasHeight = canvasWidth / _ratio;

    //    // Figure out the ratio
    //    var ratioX = parseFloat(canvasWidth) / parseFloat(originalWidth);
    //    var ratioY = parseFloat(canvasHeight) / parseFloat(originalHeight);


    //    // use whichever multiplier is smaller
    //    var ratio = ratioX < ratioY ? ratioX : ratioY;

    //    // now we can get the new height and width
    //    var newHeight = parseInt(originalHeight * ratio);
    //    var newWidth = parseInt(originalWidth * ratio);

    //    var top = (bt / newHeight * 100) + '%',
    //        left = (lt / newWidth * 100) + '%',
    //        width = (wt / newWidth * 100) + '%',
    //        height = (ht / newHeight * 100) + '%';

    //    var reg = $('<div />', { 'class': 'highlighter-s' });
    //    reg.css({
    //        top: top,
    //        left: left,
    //        width: width,
    //        height: height,
    //        'border-right-width': '2px',
    //        'border-top-width': '2px',
    //        'z-index': '106'
    //    });

    //    reg.appendTo(pageElement);
    //});

    reg.appendTo(pageElement);

}
/*added by ashok****************end*********02042014*/



function gotoLinkPage(pg) {
    //$('#divSearchContent').dialog("close");
    $("#SearchModal").modal('hide');
    getPage(pg);
    var _id = 'img#' + datePath + "_" + threeDigitNumber(pg, 3);
     
   //blinker(_id);
}

function threeDigitNumber(str, max) {
    str = str.toString();
    return str.length < max ? threeDigitNumber("0" + str, max) : str;
}





function blinker(id) {
    var timesRun = 0;
    var interval = setInterval(function () {
        timesRun += 1;
        if (timesRun === 5) {
            clearInterval(interval);
            $('.highlighter-s').remove();
        }
        $('.highlighter-s').fadeOut(500)
                      .fadeIn(500);

    }, 2000);

}



//================================================================//
//----------------------SEARCH SCRIPT END-------------------------//
//================================================================//


//================================================================//
//----------------------CROP SCRIPT END-------------------------//
//================================================================//

//function showCropDialog() {
//    var currentPages = $('#hdn_pageNum').val();
//    if (currentPages == null)
//        return;
//    $.ajax({
//        url: ROOT + 'Index/Crop',
//        data: { pages: currentPages },
//        dataType: 'html',
//        success: function (data) {
//            $('#crop_content').html(data);

//            $(".modal-wide").on("show.bs.modal", function () {
//                var height = $(window).height();
//                $(this).find(".modal-body").css("max-height", height);
//            });

//            $("#CropModal").modal('show');

//        }
//    });
//}




//================================================================//
//----------------------CROP SCRIPT END-------------------------//
//================================================================//

//=======================================================================//
//----------------------New CROP SCRIPT Started-------------------------//
//======================================================================//

var crpPagePath, crpX, crpY, crpH, crpW, crpX2, crpY2;
var ActW, ActH;
function updateCoords(c, id) {

    crpPagePath = id;
    crpX = c.x; crpY = c.y; crpH = c.h; crpW = c.w, crpX2 = c.x2, crpY2 = c.y2;
    ActW = $('#' + id).width();
    ActH = $('#' + id).height();

    var theDiv = $('#' + id + 'divToolbar');
    if (c.h > 0) {
        theDiv.attr('target-img-id', id);
        theDiv.show();
        theDiv.css({
            left: (c.x),
            top: (c.y - 50)
        });
    }
}

function hideToolbar(id) {
    $('#' + id + 'divToolbar').hide();
}


function SetCoordinates(c, id, t) {   
    if (t == 'left') {
        $('#imgX1').val(c.x);
        $('#imgY1').val(c.y);
        $('#imgWidth1').val(c.w);
        $('#imgHeight1').val(c.h);
    }
    else if (t == 'right') {
        $('#imgX2').val(c.x);
        $('#imgY2').val(c.y);
        $('#imgWidth2').val(c.w);
        $('#imgHeight2').val(c.h);
    }
    //var fromTop = c.y;
    //var imagHalfHeight = ($('#imgOrginalSizes').val().split(',')[1])/2;


    if ($("#" + id + "divToolbar").length == 0) {
        var page_no = id.split('_')[3];
        var pg = (displaymode == "D" && !isMobile ? page_no : 1);

        var HtmlCropOptions = '<div id="' + id + 'divToolbar" class="clip-toolbar" style="display:none;z-index:9999;position:absolute;"><button type="button" width="8" height="16" page-no=' + pg + ' onclick="ShareCropedImage(this);" class="btn btn-info share-crop"><i class="fa fa-share-square-o"></i> Share</button>&nbsp;<button type="button" width="8" height="16" onclick="DestroyCrop(event);" class="btn btn-info crop-destroy"><i class="fa fa-times"></i> Close</button></div>';
       
        //if (imagHalfHeight > fromTop)
        //    $("#" + id).siblings('.jcrop-holder').prepend(HtmlCropOptions);
        //else
            $("#" + id).siblings('.jcrop-holder').append(HtmlCropOptions);
    }

    var theDiv = $('#' + id + 'divToolbar');
    ActW = $('#' + id).width();
    ActH = $('#' + id).height();
    var img_org_w = $('#imgOrginalSizes').val().split(',')[0];
    var img_org_h = $('#imgOrginalSizes').val().split(',')[1];
    var _W = $('#' + id).width() / img_org_w;
    var _H = $('#' + id).height() / img_org_h;
    if (c.h > 0) {
        theDiv.attr('target-img-id', id);

        var topValue = ((c.y * _H) - 35);
        if (topValue - 10 < 0)
            topValue = ((c.y * _H + c.h * _H));


        theDiv.show();
        theDiv.css({
            left: (c.x * _W), 
            top: topValue
            //bottom:(ActH-(c.y * _H))
        });
    }

};

$('#clip-page').on('click', function () {
    //jcrop_api.destroy(); 
    DestroyCrop();

});



var pgName;
var cropping = 0;
var jcrop_api_left = '', jcrop_api_right = '';
function Cropimage() {
     
    $('#crop-page, #clip-page').toggle();
    cropping = 1;
    var currentslidepagenum = $('#hdn_pageNum').attr('pagenumbs').split(',');//This is the Current Page Number  
    if (currentslidepagenum == null)
        return;

    var img_org_w = $('#imgOrginalSizes').val().split(',')[0];
    var img_org_h = $('#imgOrginalSizes').val().split(',')[1];

    var page_1 = parseInt(currentslidepagenum[0]);
    var page_2 = parseInt(currentslidepagenum[1]);

    if (page_1 != 0) {
        var pg1 = arrImages[page_1 - 1];//datePath + "_" + threeDigitNumber($.trim(page_1), 3);
        applyJCrop(pg1, 'left');
    }

    if (page_2 != 0) {
        var pg2 = arrImages[page_2 - 1]; //datePath + "_" + threeDigitNumber($.trim(page_2), 3);
        applyJCrop(pg2, 'right');
    }
}

function applyJCrop(pgName, page_var) {
    var img_org_w = $('#imgOrginalSizes').val().split(',')[0];
    var img_org_h = $('#imgOrginalSizes').val().split(',')[1];
    $('#' + pgName).Jcrop({
        onSelect: function (c) {
            //updateCoords(c, id); 
            SetCoordinates(c, pgName, page_var);
        },
        onChange: function (c) {
            //var id = $(this.ui.holder[0]).children('.pageClass').data('id');
            hideToolbar(pgName);
            //SetCoordinates(c, id);
        },
        trueSize: [img_org_w, img_org_h],
        onRelease: function (e) {
            // alert('onRelease'); 
            var id = $(this.ui.holder[0]).children('.pageClass').data('id');
            ReleaseCroping(id);
        }
    }, function () {
        if (page_var == 'left')
            jcrop_api_left = this;
        else if (page_var == 'right')
            jcrop_api_right = this;
    });


}

function getImgSize() { 
    var currentslidepagenum = $('#hdn_pageNum').attr('pagenumbs').split(',');
    var _page = parseInt(currentslidepagenum[1].trim());
    var _imageName = arrImages[_page - 1];
    var img_id = Pub_RootPath + "/" + datePath + "/Page/" + _imageName + ".jpg";
    //var img = $("#" + img_id);
    // Create dummy image to get real width and height
    $("<img>").attr("src", img_id).load(function () {
        var pic_real_width = this.width;
        var pic_real_height = this.height;
        $('#imgOrginalSizes').val(pic_real_width + "," + pic_real_height);

    });
}




function ReleaseCroping(id) {
    //$('#crop-page').show();
    //$('#clip-page').hide();
    $('#' + id + 'divToolbar').hide();

    //jcrop_api = $('#'+id).data('Jcrop');
    //jcrop_api.destroy();
    //cropping = 0;
}

function DestroyCrop(e) {
    if (cropping == 1) {
       

        $('#crop-page, #clip-page').toggle();
        $('.clip-toolbar').hide();

        if (jcrop_api_right != "") {
            jcrop_api_right.destroy();
        }

        if (jcrop_api_left != "") {
            jcrop_api_left.destroy();
        }

        var currentslidepagenum = $('#hdn_pageNum').attr('pagenumbs').split(',');//This is the Current Page Number  

        var page_1 = parseInt(currentslidepagenum[0]);
        var page_2 = parseInt(currentslidepagenum[1]);

        var pg1 = arrImages[page_1 - 1]; //datePath + "_" + threeDigitNumber($.trim(page_1), 3);
        var pg2 = arrImages[page_2 - 1]; //datePath + "_" + threeDigitNumber($.trim(page_2), 3);
        $('#' + pg1 + ', #' + pg2).removeAttr('style');

        cropping = 0;

        $('.page-wrapper img').css({ width: 'inherit', height: 'inherit' }); //for mobileweb
    }
}

var shareoptions = '';

function ShareCropedImage(args) {
    
    //$('#CropModal').modal('show'); 
    var num = $(args).attr('page-no');
    var page_position = (parseInt(num) % 2 == 0) ? 'left' : 'right';
    var x1, y1, width, height;
    if (page_position == 'left') {
        x1 = $('#imgX1').val();
        y1 = $('#imgY1').val();
        width = $('#imgWidth1').val();
        height = $('#imgHeight1').val();
    }
    else if (page_position == 'right') {
        x1 = $('#imgX2').val();
        y1 = $('#imgY2').val();
        width = $('#imgWidth2').val();
        height = $('#imgHeight2').val();
    }
    var canvas = $("#crop_canvas")[0];
    var context = canvas.getContext('2d');
    var img = new Image();
    img.onload = function () {
        canvas.height = height;
        canvas.width = width;
        context.drawImage(img, x1, y1, width, height, 0, 0, width, height);
        saveCropImage();
    };


    var target_img_id = $(args).parents('[id*=divToolbar]').attr('target-img-id');
    //img.src = $('#' + target_img_id).attr("src").replace('page','Zoompage');
    img.src = $('#' + target_img_id).attr("src");



    //var crpurl =  Pub_RootPath + '/' + datePath + '/page/' + crpPagePath + '.jpg';

    //$.ajax({
    //    url:ROOT + 'Index/CropedImage',
    //    type: 'POST',
    //    data: { PagePath: crpurl, crpx: crpX, crpy: crpY, crpW: crpW, crpH: crpH, ActualWidth: ActW, ActualHeight: ActH, crpX2: crpX2, crpY2: crpY2 },
    //    datatype: 'json',
    //    success: function (response) {
    //        strCrpImageLink = ROOT+'Magazine/CropPreview?img=' + response;
    //        window.open(strCrpImageLink);

    //        // window.open('../OpenImageForShare.aspx?value=' + imagepath + '&type=' + shareoptions,'popup', 'left=150,top=10,width=750,height=700,scrollbars=yes,status=yes');

    //    },
    //    error: function (response) {

    //    }
    //});

}



function saveCropImage() {
    var canvas = $("#crop_canvas")[0];
    var canvasData = canvas.toDataURL();
    var dataUrl = canvasData.replace('data:image/png;base64,', '');
    //$.ajax({
    //    url: ROOT + 'Index/SaveCropedPage',
    //    type: 'POST',
    //    data: { imageData: dataUrl },
    //    dataType: 'html',
    //    success: function (response) {
    //        var url = ROOT + "Index/CropPreview?img=" + response;
    //        PopupCenter(url, "Share & Download", "800", "800");
    //    }
    //});
     var currentPageNo = parseInt($("#hdn_pageNum").val());
     var displayName = arrPageDisplayNames[currentPageNo - 1];
    
    // var clip_id = new Date().getTime() + '-' + currentPageNo;
    var clip_id = datePath.replace(/\_/g, "-") + '-' + displayName + '-' + new Date().getTime();
    $("#CropModal").attr('clip-id', clip_id).modal('show');
    add_all('sbLinks', currentUrl + '/clip-' + clip_id, urlProductName, clip_id);

    $('#crop-download').attr({ 'href': canvasData, download: datePath + '_' + clip_id+'.jpg' });
}

 


function SaveAndShare(args) {
    var canvas = $("#crop_canvas")[0];
    var clip_id = $(args).attr('clip-id');
    var dataUrl = canvas.toDataURL().replace('data:image/png;base64,', '');
    $.ajax({
        url: ROOT + 'Index/SaveCropedPage',
        type: 'POST',
        data: { imageData: dataUrl, clip_id: 'clip-' + clip_id },
        dataType: 'html',
        success: function (response) {
            var url = ROOT + response;
            //PopupCenter(url, "Share & Download", "800", "800"); 
            PopupCenter($(args).attr('data-href'), "Share & Download", "800", "800");
        }
    });
}

$('#CropModal').on('hidden.bs.modal', function () {
    $('#sbLinks').empty();
})


function PopupCenter(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
}

//=======================================================================//
//----------------------New CROP SCRIPT Ended----------------------------//
//=======================================================================//



//================================================================//
//--------------------CONTENTS BUTTON SCRIPT----------------------//
//================================================================//

function showContentDialog() {
    loadContents();
    $("#TOCModal").on("show.bs.modal", function () {
        var height = $(window).height() - 150;
        $(this).find(".modal-body").css("height", height);

        var pg = $('#hdn_pageNum').val();
        $('#TOCModal a').removeClass('active');
        $('#TOCModal a.page-li-' + pg).addClass('active');
    }).modal('show');
}

function loadContents() {
    $('#TOCdata').html('');
    var htmlSelction = "";
    dayIndex.find('Page').each(function (i) {
        var _this = $(this);
        var secPageNum = _this.attr("secPageNum");
        var sectionTitle = _this.attr("sectionTitle");
        var page_index = arrPageDisplayNames.indexOf(secPageNum); 
        var _page = arrImages[page_index];
        page_index = parseInt(_page.split('_')[3]);
        //page_index = page_index + 1;
        htmlSelction += '<a onclick="return gotoPageFromPageList(' + page_index + ');" href="javascript:void(0)" class="list-group-item list-group-item-info page-li-' + page_index + '" data-toggle="collapse" data-parent="#MainMenu">Page <span>' + secPageNum + '</span></a>';
        });
    $('#TOCdata').append(htmlSelction);

    applySearchOnPages();
}

function applySearchOnPages() {
    $('#txtList').on('keyup', function () { 
        var value = this.value;
        $('#TOCdata a.list-group-item').hide().each(function () {
            if ($(this).text().search(value) > -1) {
                $(this).prevAll('.header').first().add(this).show();
            }
        });
    });
}

function gotoPageFromPageList(pg) { 
    $("#TOCModal").modal('hide');
    $('#TOCModal a').removeClass('active');
    $('#TOCModal a.page-li-'+pg).addClass('active');
    gotoLinkPage(pg);
}

 

$.fn.exists = function () {
    return this.length !== 0;
}


//================================================================//
//--------------------CONTENTS BUTTON SCRIPT----------------------//
//================================================================//

//var isTOC_Loaded = false; 
//function loadContentLinks() {
   
//    if (is_link_xml_exist == 'True') {
//        $.get(Pub_RootPath + '/' + datePath + '/WebLinks.xml', function (d) {
          
//           // var ContetnsPage = $(d).find("Links").attr("page");  //contents page number
        
//            $(d).find("links").each(function (i, v) {
//                var _linksRoot = $(this);
//                var _thisPage = _linksRoot.find('link');
//                var ContentsPage = _linksRoot.attr('page');
//                if (arrCurrentPages.indexOf(ContentsPage) > -1 && $('#' + ContentsPage).attr('toc-added') != 'true') {
//                    _thisPage.each(function (i, regionData) {
//                        var region = $(regionData);
//                        addHighlights(region, ContentsPage);
//                        $('#' + ContentsPage).attr('toc-added', 'true');
//                    });

//                }
//            });
//        }, 'xml');
//    }
//}






//function addHighlights(region, page_id) {
//    var image = new Image();
//    image.src = $('img#' + page_id).attr("src");
//    //var container = $('#' + page_id).parent();
     
//    $(image).load(function () {
//    var pageWidth = this.width,
//        pageHeight = this.height; 
    
//    var type = IsEmptyOrNot(region.attr("type")),
//        LinkAction = region.attr("linkaction"),
//        LinkActionTitle = region.attr("displayname");
            
        
//    var top = (region.attr("top") / pageHeight * 100) + '%',
//        left = (region.attr("left") / pageWidth * 100) + '%',
//        width = (region.attr("width") / pageWidth * 100) + '%',
//        height = (region.attr("height") / pageHeight * 100) + '%';
            
            
//      debugger
//        var reg = $('<div />', { 'class': 'region' });

//        reg.css({ top: top, left: left, width: width, height: height });

//        reg.attr({ 'type': type, 'title': "Goto Page " + LinkActionTitle, 'region-data': LinkAction });

//        var pageElement = $('img#' + page_id).parent();

//        reg.appendTo(pageElement);
//       // $('[data-toggle="tooltip"]').tooltip()
//    });
//}




