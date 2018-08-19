firebase.auth().onAuthStateChanged(function(user) {
  $.LoadingOverlay('hide');
  if (user) {
    console.log('current user: ', user)
    $('#profilePicture').attr('src', user.photoURL)
    $('#dashboard-section').show();
    $('#signup-div').hide();
    $('#login-div').hide();
    name = user.displayName ? user.displayName : user.email;
    $('#hello-user').show()
    $('#currentUser').show().text('Hula ' + name)
  } else {
    $('#dashboard-section').hide();
    $('#login-div').show();
    $('#signup-div').show();
    $('#hello-user').hide()
  }
});
