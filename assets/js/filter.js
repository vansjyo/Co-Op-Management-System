



    $("#filter").on("keyup", function() {
    var g = $(this).val().toLowerCase();
    $("#filter_table #filter_me input.itemname").each(function() {
        var s = $(this).val().toLowerCase();
        $(this).closest('#filter_me')[ s.indexOf(g) !== -1 ? 'show' : 'hide' ]();
    });
});


