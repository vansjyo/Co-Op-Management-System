$(document).ready(function(){

  $('a#status').on('click', function(){
var order_email = $(this).parent().siblings("div.order_i").text();
      var order_id = $(this).parent().siblings("div.order_id").text();
      // var order_email = $(this).parent().siblings("div.order_i").text();
      console.log(order_email);
      var status = document.getElementById(order_id).val();
      

      var changestatus = {order_id: order_id , order_status : status , order_email : order_email};

      $.ajax({
        type: 'POST',
        url: '/orderlist',
        data: changestatus ,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });
      return false;
  });

});


// data = data.filter(todo => {
       //     return todo.item.toLowerCase().replace(/ /g, '-') !== req.params.item.toLowerCase();
       // });