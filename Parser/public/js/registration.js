

var getTextFromInput = function(id) {
    var element = document.getElementById(id);
    return $(element).val();
}

$(document).ready(function() {
    document.getElementById('user-registration-btn').addEventListener("click", function() {
        var firstName = getTextFromInput('first-name');
        var lastName = getTextFromInput('last-name');
        var cellNumber = getTextFromInput('cell-number');
        var homeNumber = getTextFromInput('home-number');

        $.ajax({
            url: '/user/register',
            type: 'POST',
            data: {
                firstName: firstName,
                lastName: lastName,
                mobile: cellNumber,
                home: homeNumber
            },
            success: function() {
                // do nothing
            },
            dataType: 'json'
        }).done(function() {
                console.log('user saved successfully');
            });
    });


    document.getElementById('clear-users').addEventListener("click", function() {
        $.ajax({
            url: '/user/clear',
            type: 'POST',
            data: {},
            success: function() {}
        }).done(function() {
                console.log('user database cleared successfully');
            })


    });
});


