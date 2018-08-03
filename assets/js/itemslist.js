$(document).ready(function(){

  $('a#edit_item').on('click', function(){

      var itemName = $(this).parent().siblings().children("input.itemname").val();
      var itemNo = $(this).parent().siblings().children("input.itemno").val();
      var itemQuantity = $(this).parent().siblings().children("input.itemquantity").val();
      var itemSales = $(this).parent().siblings().children("input.itemsales").val();
      var itemPrice = $(this).parent().siblings().children("input.itemprice").val();
      var itemCategory = $(this).parent().siblings().children("input.itemcategory").val();
      var itemChange = $(this).parent().siblings().children("input.itemchange").val();

  
      var item = {item_no : itemNo, item_name : itemName, item_price : itemPrice, item_category :itemCategory ,item_quantity :itemQuantity, item_sales :itemSales, item_change : itemChange };
      $.ajax({
        type: 'POST',
        url: '/itemslist',
        data: item ,
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