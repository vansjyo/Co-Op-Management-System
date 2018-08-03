var async = require('async');

function getHonorStudentsFrom(stuObjList, callback) {

    var honorStudents = [];

    // The 'async.forEach()' function will call 'iteratorFcn' for each element in
    // stuObjList, passing a student object as the first param and a callback
    // function as the second param. Run the callback to indicate that you're
    // done working with the current student object. Anything you pass to done()
    // is interpreted as an error. In that scenario, the iterating will stop and
    // the error will be passed to the 'doneIteratingFcn' function defined below.
    var iteratorFcn = function(stuObj, done) {

        // If the current student object doesn't have the 'honor_student' property
        // then move on to the next iteration.
        if( !stuObj.honor_student ) {
            done();
            return; // The return statement ensures that no further code in this
                    // function is executed after the call to done(). This allows
                    // us to avoid writing an 'else' block.
        }

        db.collection("students").findOne({'_id' : stuObj._id}, function(err, honorStudent)
        {
            if(err) {
                done(err);
                return;
            }

            honorStudents.push(honorStudent);
            done();
            return;
        });
    };

    var doneIteratingFcn = function(err) {
        // In your 'callback' implementation, check to see if err is null/undefined
        // to know if something went wrong.
        callback(err, honorStudents);
    };

    // iteratorFcn will be called for each element in stuObjList.
    async.forEach(stuObjList, iteratorFcn, doneIteratingFcn);
}


getHonorStudentsFrom(studentObjs, function(err, honorStudents) {
    if(err) {
      // Handle the error
      return;
    }

    // Do something with honroStudents
});