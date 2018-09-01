since we do not know that the order db will remain permanant or not,
therefore we save a permanat instance of it in the user's orderlist field.



add id's to the sidenav.ejs according to the categories

ui
link all links
create team page
change footer
copyright to ccc
get list from sir
header align
Remove all all-caps
Add boys co op address
Change Login page similar to IRIS
Put NITK Logo as favicon
Integrate Sign Up with IRIS (Contact Hrishi) -> Long term
Change '/todo' page -> Terrible colours 

Change 'Profile' page


CHANGES

karnataka,surathkal
name as nitk consumer's cooperative society
 enctype="multipart/form-data"



app.post('/track_order', isLoggedIn, function(req, res) {
  console.log(req.body);
  Orders.findOne({ order_id : req.body.order_id } , function(err,result){
    console.log(result);
    if(err) throw err;
    if(result == null){ req.flash('error','no such order id exists'); }
    else{
      Items.findOne({ item_no : req.body.item_no }, function(errr,item){
        item.item_sales -= req.body.item_quantity;
        item.save(function(err){
          if(err) throw err;
          console.log("item removed from sales");
        }); 
      });
      for(var i=0; i<result.orderList.length; i++ ){
        if(result.orderList[i].no == req.body.item_no){
          if(result.orderList.length == 1)
            result.status = "cancelled";
          result.amount = result.amount - result.orderList[i].price*result.orderList[i].quantity;
          result.orderList.splice(i,1);
          result.save(function(err){
           if(err) throw err;
         });
          req.flash('info','your order has been cancelled');
        }
      }
      function getchange(list , done) {
        var iteratorFcn = function(list, done) {
          if(list.order_id == req.body.order_id && list.no == req.body.item_no){
            console.log("condition matched");
            list.status = "cancelled";
            console.log(list);
            console.log(list.status);
            req.user.save(function(err){
            if(err) throw err;
            console.log("status of user history changed");
          });
            doneIteratingFcn();
            return done(null,'done');
          }
        };

        var doneIteratingFcn = function(err) {
          if(err) throw err;
          req.user.save(function(err){
            if(err) throw err;
            console.log("status of user history changed");
          });
          console.log(req.user.local.orderList);
          done(null,'done');
        };
    // iteratorFcn will be called for each element in cart.
    async.forEach( list , iteratorFcn, doneIteratingFcn);
  }
  getchange(req.user.local.orderList , function(err) {
    if(err) {
      throw err;
    }
    req.user.save(function(err){
      if(err) throw err;
      console.log("cancellung saved");
      console.log(req.user.local.orderList);
    })
    req.flash('info','order cancelled successfully.');
    res.redirect('/track_order');
  });
}
});
});

