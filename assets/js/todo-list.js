$(document).ready(function(){

  $('a#clicktoadd').on('click', function(){

      var cartitem_name = $(this).siblings("span.item_name").text().toLowerCase().replace(/ /g, "-");
      var cartquantity_left= parseInt($(this).siblings("span.quantity_left").text());
      var cartitem_price = parseInt($(this).siblings("span.item_price").text());
      var cartitem_no = $(this).siblings("span.item_no").text();
      

      var todo = {no: cartitem_no ,item: cartitem_name, quantity: cartquantity_left, price: cartitem_price, status :"not available" };

      $.ajax({
        type: 'POST',
        url: '/todo',
        data: todo,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });
      return false;
  });

  $('li#delete').on('click', function(){
    // For some insecure reasons I just had to convert everything to lowercase plus i was pretty paranoid after looking for bugs overnight
      var item = $(this).children("span.first").text().toLowerCase().replace(/ /g, "-");
      var quantity= $(this).children("span.second").text();
      $.ajax({
        type: 'DELETE',
        url: '/todo/' + item + '/' + quantity,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });
  });

});


// data = data.filter(todo => {
       //     return todo.item.toLowerCase().replace(/ /g, '-') !== req.params.item.toLowerCase();
       // });