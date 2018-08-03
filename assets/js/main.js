
$(window).load(function() {
  $('.flexslider').flexslider();
});

$('.button-collapse').sideNav({
            menuWidth: 280, // Default is 300
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true // Choose whether you can drag to open on touch screens
          }
          );
if( $(window).width() < 1200){
  document.getElementById("select").style.display="none";
}
else{
   document.getElementById("search").style.marginLeft="38%";
}
if( $(window).width() < 1200  &&  $(window).width() >1024){
  document.getElementById("search").style.marginLeft="30%";
}
if ( $(window).width() > 1024) {  
 document.getElementById("search").style.display="block";
} 
else {
 document.getElementById("main_head").innerHTML="NITK Consumer's Co-op"; 
 document.getElementById("dis").style.display="block";
 document.getElementById("search").style.marginLeft="30%";
 $("div.img2").css("display", "none");
 $("div.img3").css("display", "none");
 $("div#foot").addClass("center");
}

$("#icon1").click(function(){
  $("#search").fadeToggle("2000");
  document.getElementById("search").focus();
});

function myfocus(){
  if ( $(window).width() > 993) {  
    document.getElementById("search").style.border="2px solid #ccc";
    document.getElementById("search").style.backgroundColor="white";
  } 
  else {
    document.getElementById("search").style.width= "100%" ;
    document.getElementById("search").style.border="2px solid #ccc";
    document.getElementById("search").style.backgroundColor="white";
  }
}

function myblur(){
  if ( $(window).width() > 993) {  
    document.getElementById("search").style.border="1px solid #ccc";
    document.getElementById("search").style.backgroundColor="#006064";
  } 
  else {
    document.getElementById("search").style.display="none";
  }
}

    $(".searchme").on("keyup", function() {
    var g = $(this).val().toLowerCase();
    $("#items #me #she .item_name").each(function() {
        var s = $(this).text().toLowerCase();
        $(this).closest('#items')[ s.indexOf(g) !== -1 ? 'show' : 'hide' ]();
    });
})


    $(document).ready(function() {
    $('select').material_select();
  });
  
function fademe(){
        $("#msg").fadeOut(1000);;
    }


 function log( message ) {
      $( "<div>" ).text( message ).prependTo( "#log" );
      $( "#log" ).scrollTop( 0 );
    }


    var categ = $( "#categoryselect" ).val();

$('.searchher').autocomplete({
        source: function(req,res) {
            $.ajax({
                url: "/autocomplete/"+ req.term+ "/" + $( "#categoryselect" ).val(),
                dataType: "jsonp",
                type: "GET",
                data: {
                    term: req.term,
                },
                success: function(data) {
                    res($.map(data, function(item) {
                      console.log("whats up?");
                      console.log(item);
                        return {
                            label: item.item_name,
                            value: item.item_url,
                        };
                    }));
                },
                error: function(xhr) {
                    alert(xhr.status + ' : ' + xhr.statusText);
                }
            });
        },
        select: function(event, ui) {
            $("#search").val(ui.item.label);
            window.location.assign(ui.item.value);
            $("#search").val(ui.item.label);
        }
    });