//#21*
app.post('/track_order', isLoggedIn, function(req, res) {
 console.log(req.body);
  Orders.findOne({ order_id : req.body.order_id } , function(err,result){
    console.log(result);
    if(err) throw err;
    if(result == null){ req.flash('error','no such order id exists'); }
    else{
         async.waterfall([
    function(done) {
      Items.findOne({ item_no : req.body.item_no }, function(errr,item){
        item.item_sales -= req.body.item_quantity;
        item.save(function(err){
          if(err) throw err;
          console.log("item removed from sales");
          done(err,'done');
        }); 
      });
    },
    function(done) {
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
      if(i==result.orderList.length){
        done(err,'done');}
      },
      function(done) {
        function getchange(list , done) {
          console.log(list);
          var iteratorFcn = function(list, done) {
            if(list.order_id == req.body.order_id && list.no == req.body.item_no){
              console.log("condition matched");
              list.status = "cancelled";
              console.log(list);
              console.log(list.status);
            }
            return done(null,list);
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
    });
    req.flash('info','order cancelled successfully.');
  });
  done(err, 'done');
}
], function(err) {
 if (err) return next(err);
 console.log("im here outside now");
 console.log(req.user.local.orderList);
 req.user.save(function(err){
   if(err) throw err;
 });
 res.redirect('/track_order');
});

}
});

});




series([
  function (callback) {
    Items.findOne({ item_no : req.body.item_no }, function(errr,item){
        item.item_sales -= req.body.item_quantity;
        item.save(function(err){
          if(err) throw err;
          console.log("item removed from sales");
        }); 
      });
    // do some stuff ...
    callback(null, 'one');
  },
  function (callback) {
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
    // do some stuff ...
    callback(null, 'two');
  },
  function(callback){
     function getchange(list , done) {
          console.log(list);
          var iteratorFcn = function(list, done) {
            if(list.order_id == req.body.order_id && list.no == req.body.item_no){
              console.log("condition matched");
              list.status = "cancelled";
              console.log(list);
              console.log(list.status);
            }
            return done(null,list);
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
    });
    req.flash('info','order cancelled successfully.');
  });
    callback(null,'three');

  }
],
// optional callback
function (err, results) {
  // the results array will equal ['one','two']
  if (err) return next(err);
 console.log("im here outside now");
 console.log(req.user.local.orderList);
 req.user.save(function(err){
   if(err) throw err;
 });
 res.redirect('/track_order');
})