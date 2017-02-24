


$(document).ready(function () {
    loadBackIssues();
});



function loadBackIssues() { 
    $.get(Pub_RootPath + '/DidXML.xml', function (did) {
        //pagesLength = did.find('FILENAME').length;

        var didXml = $(did);

        $.each(didXml.find('FILENAME'), function () {
            var _this = $(this);
            var _backIssueDate = _this.text(); //dd_mm_yyyy format
            if (datePath != _backIssueDate) {
                //if (process(datePath) > process(_backIssueDate)) {
                var _html = "";
                var issuedate = _backIssueDate.replace(/_/g, "-");   //dd-mm-yyyy format
                currentUrl = currentUrl.slice(-1) == '/' ? currentUrl.slice(0, -1) : currentUrl;
                var issueUrl = currentUrl + '/' + editionId + '/' + issuedate;
                _html = '<a href="' + issueUrl + '" target="_blank" class="thumbnail"><img alt="" src="' + Pub_RootPath + '/' + _backIssueDate + '/thumbnails/' + _backIssueDate + '_001.jpg" /><span style="font-size:14px;">' + issuedate + '</span></a>';
                $('#BackissuesList').prepend(_html);
            }
        });
    }, 'xml');


    function process(date) {
        var parts = date.split("_");
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }


}



function loadRegions(page, element, img) {
  
    objWebLinks.find("links").each(function (i, v) {

        var _linksRoot = $(this);
        var _thisPage = _linksRoot.find('link');
        var ContentsPage = _linksRoot.attr('page');
        var imgOriginalWidth = _linksRoot.attr('width');
        //if (arrCurrentPages.indexOf(ContentsPage) > -1 && $('#' + ContentsPage).attr('toc-added') != 'true') {
        
        if (page == ContentsPage && !$(element).hasClass('region-added')) {
            _thisPage.each(function (i, regionData) {
                var region = $(regionData);
                addRegion(region, element, img, ContentsPage, imgOriginalWidth);
                $('#' + ContentsPage).attr('region-added', 'true');
            });
        }
        //}
    });
    // }, 'xml');
    //}
}




function addRegion1(region, pageElement, img, currentPage, imgOriginalWidth) {
     
    //to get image original sizes
    var image = new Image();
    image.src = $(img).attr('src');


    var data = imageRecalculations(image, imgOriginalWidth); 
    $(image).load(function () {
        var pageWidth = this.width,
        pageHeight = this.height;



        var LinkAction = IsEmptyOrNot(region.attr("linkaction")),
                  LinkActionTitle = region.attr("displayname"),
                   type = IsEmptyOrNot(region.attr("type"));
        var top = 0, left = 0, width = 0, height = 0;

        if (imgOriginalWidth < pageWidth) {
            var ratio = imgOriginalWidth / pageWidth;
            pageHeight = pageHeight * ratio;
            top = (region.attr("top") / ratio) + 'px',
          left = (region.attr("left") / ratio) + 'px',
          width = (region.attr("width") / ratio) + 'px',
          height = (region.attr("height") / ratio) + 'px';
        }
        else {

            var ratio = pageWidth / pageHeight;

            pageWidth = imgOriginalWidth;
            pageHeight = pageWidth / ratio;

            top = (region.attr("top") / pageHeight * 100) + '%',
            left = (region.attr("left") / pageWidth * 100) + '%',
            width = (region.attr("width") / pageWidth * 100) + '%',
            height = (region.attr("height") / pageHeight * 100) + '%';
        }
        //var reg = $('<div />');
        var reg = $('<div />', { 'class': 'region' });
        reg.css({
            top: top,
            left: left,
            width: width,
            height: height,
            'border-right-width': '2px',
            'border-top-width': '2px',
            'z-index': '106'
        }).attr({
            currentPage: currentPage,
            'type': type,
            'region-data': LinkAction
        });

        pageElement.addClass('region-added');

        if (type == 'pagelink') {
            reg.attr({ 'title': "Click to goto Page " + LinkActionTitle });
        }

        if (type == 'email') {
            reg.attr({ 'title': "Click to send an email " + LinkActionTitle });
        }

        if (type == 'websitelink') {
            reg.attr({ 'title': "Click to visit " + LinkActionTitle });
        }

        if (type == 'SlideShow') {
            reg.addClass('highlighter').append('<img style="width:100%;height:100%;" src="' + Pub_RootPath + 'Multimedia' + url + '" alt=""/>');
        }

        else if (type == 'Audio') {
            reg.addClass('audioAd');
        }

        else if (type == 'Video') {
            reg.addClass('videoAd');
        }

        reg.appendTo(pageElement);
    });
}
 


function addRegion(region, pageElement, img, currentPage, imgOriginalWidth) {

    //to get image original sizes
    var image = new Image();
    image.src = $(img).attr('src');



    $(image).load(function () {

        var originalWidth = this.width;
        var originalHeight = this.height;
       

        var _ratio = originalWidth / originalHeight;

        var canvasWidth = imgOriginalWidth;
        var canvasHeight = canvasWidth / _ratio;

        // Figure out the ratio
        var ratioX = parseFloat(canvasWidth) / parseFloat(originalWidth);
        var ratioY = parseFloat(canvasHeight) / parseFloat(originalHeight);

         
        // use whichever multiplier is smaller
        var ratio = ratioX < ratioY ? ratioX : ratioY;

        // now we can get the new height and width
        var newHeight = parseInt(originalHeight * ratio);
        var newWidth = parseInt(originalWidth * ratio);


        // Now calculate the X,Y position of the upper-left corner 
        // (one of these will always be zero)
       // var posX = parseInt((canvasWidth - (originalWidth * ratio)) / 2);
       // var posY = parseInt((canvasHeight - (originalHeight * ratio)) / 2);
      

       

        var LinkAction = IsEmptyOrNot(region.attr("linkaction")),
                  LinkActionTitle = region.attr("displayname"),
                  type = IsEmptyOrNot(region.attr("type")),
                 top = (region.attr("top") / newHeight * 100) + '%',
            left = (region.attr("left") / newWidth * 100) + '%',
            width = (region.attr("width") / newWidth * 100) + '%',
            height = (region.attr("height") / newHeight * 100) + '%';

        var reg = $('<div />', { 'class': 'region' });
        reg.css({
            top: top,
            left: left,
            width: width,
            height: height,
            'border-right-width': '2px',
            'border-top-width': '2px',
            'z-index': '106'
        }).attr({
            currentPage: currentPage,
            'type': type,
            'region-data': LinkAction
            //onclick: 'regionClick(event)'
        });

        pageElement.addClass('region-added');
         
        if (type == 'pagelink') {
            reg.attr({ 'title': "Click to goto Page " + LinkActionTitle });
        }

        if (type == 'email') {
            reg.attr({ 'title': "Click to send an email " + LinkActionTitle });
        }

        if (type == 'websitelink') {
            reg.attr({ 'title': "Click to visit " + LinkActionTitle });
        }

        if (type == 'slideshow') {
            reg.addClass('highlighter').append('<img style="width:100%;height:100%;" src="' + Pub_RootPath + 'Multimedia' + url + '" alt=""/>');
        }

        else if (type == 'audio') {
            reg.addClass('audioAd');
        }
           
        else if (type == 'video') {
            reg.addClass('videoAd');
        }

        reg.appendTo(pageElement);

    });

}


$(document).on('click', '.region', function (event) {
    regionClick(event);
});
 
// Process click on a region

function regionClick(event) {

    if (displaymode == "S") {
        zoomClose();
    }

    var region = $(event.target);
     
    if (region.hasClass('region')) {

        $('.common-container').data().regionClicked = true;

        setTimeout(function () {
            $('.common-container').data().regionClicked = false;
        }, 100);

        var regionType = region.attr('type');

        return processRegion(region, regionType);

    }
    
   

}



// Process the data of every region

function processRegion(region, regionType) {

    data = region.attr('region-data');
    switch (regionType) {
        case 'SlideShow':
            reg.addClass('highlighter').append('<img style="width:100%;height:100%;" src="' + Pub_RootPath + 'Multimedia' + data + '" alt=""/>');
            break;
        case 'audio':

            //displayAudio(data);  //").addClass('audioAd');
            break;
        case 'video':

            displayVideo(data);  //").addClass('videoAd');
            break;
        case 'email':
            openEmail(data);
            break;
        case 'pagelink':
            var pageNo = parseInt(data.split('_')[3]);
            getPage(pageNo);
            break;
        case 'websitelink':
            openURL(data);
            break;

    }

}

function IsEmptyOrNot(element) {
    if (element === undefined)
        return "";
    else
        return element;
}


function displayVideo(data) {
    var dialog = BootstrapDialog.show({
        title: '<i class="fa fa-video-camera" aria-hidden="true"></i>',
        cssClass: 'auto-scroll',
        //size: BootstrapDialog.SIZE_WIDE,
        message: function (dialog) { 
            var $message = ' <div class="embed-responsive embed-responsive-16by9"> <iframe class="embed-responsive-item" src="' + data + '" allowfullscreen=""></iframe> </div>';
            return $message;
        },
        onShow: function (dialogItself) {
            //
        },
         
        onhidden: function (dialogRef) {
            //
        }
    });

}


function openEmail(strTo) {
    window.location.href = "mailto:?To=" + strTo;   //  + "&subject=" + subject;
    //$('#SendEmailModal form .email').val(strTo).attr('readonly',true);
    //$("#SendEmailModal").modal('show'); 
}


function openURL(strPageName) {
    strPageName = strPageName.toLowerCase().indexOf("http://") > 0 ? strPageName : "http://" + strPageName;
    window.open(strPageName.replace(' ', ''), "myURL");
}


function activeThumbCss(p1, p2) {
    var ClassName = '.pg_' + p1 + '_' + p2;
    $('.bottom-thumbs .item').removeClass('page-select');

    $('.bottom-thumbs ' + ClassName).addClass('page-select');
}


function sendMail() {
    $('#SendEmailModal form').on("submit", function () {
        $.ajax({
            url: "Index/SendMail",
            data: $(this).serialize(),
            success: function (d) {
                alert(d);
            }
        });
    });

}


