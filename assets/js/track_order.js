$(document).ready(function(){


  $('a#cancel_order').on('click', function(){

      var order_id = $(this).parent().siblings("#track_order_id").text();
      var item_no = $(this).parent().siblings("#track_item_no").text();
      var quantity = $(this).parent().siblings("#track_item_quantity").text();
      
      console.log(order_id);
      var cancel_order = {order_id: order_id , item_no:item_no , item_quantity : quantity };

      $.ajax({
        type: 'POST',
        url: '/track_order',
        data: cancel_order ,
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