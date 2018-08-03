$(document).ready(function(){

  $('a#status').on('click', function(){

      var order_id = $(this).siblings("div.order_id").text();
      var status = document.getElementById(order_id).value;
      

      

      var changestatus = {order_id: order_id , order_status : status};
      $.ajax({
        type: 'POST',
        url: '/orderslist',
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