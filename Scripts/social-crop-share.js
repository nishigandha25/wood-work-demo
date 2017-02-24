var image_dir = "images";
function add_all(a, b,c, id) {
    //var c = encodeURIComponent(document.title);
    var d =  encodeURIComponent(b);
    add_tool(a, "fa fa fa-facebook", "facebook", "http://www.facebook.com/sharer/sharer.php?u=" + d + "&t=" + c, id);
    add_tool(a, "fa fa-twitter", "twitter", "https://twitter.com/intent/tweet?text=" + c + "&url=" + d, id);
    add_tool(a, "fa fa-delicious", "del.icio.us", "http://del.icio.us/post?url=" + d + "&title=" + c, id);
    //add_tool(a, "fa fa-stumbleupon-circle", "stumbleupon", "http://www.stumbleupon.com/submit?url=" + d + "&title=" + c);
   // add_tool(a, "fa fa-digg", "digg", "http://digg.com/submit?phase=2&url=" + d + "&title=" + c);
    add_tool(a, "fa fa-linkedin", "linkedin", "http://www.linkedin.com/shareArticle?mini=true&url=" + d + "&title=" + c ,id);
    add_tool(a, "fa fa-google-plus", "google plus", "https://plus.google.com/share?url=" + d + "&title=" + c, id)
    add_tool(a, "fa fa-whatsapp", "whatsapp", "whatsapp://send?text=" + d + "&title=" + c, id)
}


function add_tool(a, b, c, d, id) {
    document.getElementById(a).innerHTML = document.getElementById(a).innerHTML +
    '<li class="socialAddButton" id="socialAddButton-' + c + '" lnk_title="'+c+'"> ' +
    '<a target="_blank" onclick="SaveAndShare(this);" clip-id="'+id+'" data-href="' + d + '" class="btn ' + b + '-btn"  title="Share on ' + c + '"><i class="' + b + '"></i></a></li>';

    // $('#socialAddButton-whatsapp').addClass('visible-sm');
    
        $('#socialAddButton-whatsapp').click(function () {
            if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
                alert('Please use a mobile to share this!');
                return false;
            }
        });
     
}



/*
https: //twitter.com/intent/tweet?text=ABN%20Sting%20Operation%20-%20%20Dog%20in%20Tea%20cup&url=http://www.abnandhrajyothy.com/abn-sting-operation-dog-tea-cup
add_tool(a, "twitter", "twitter", "http://twitter.com/intent/session?url=" + d + "&title=" + c);
*/