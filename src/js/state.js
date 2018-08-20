function fill_form_dashboard(id){
  var form_fields = ['username', 'first_name', 'last_name', 'birthday', 'gender', 'phone', 'address']
  firebase.database().ref('/users/' + id).once('value').then(function(snapshot) {
    form_fields.forEach( x => $('#' + x).val(snapshot.val()[x]))
  });
}

function logged_in_layout(){
  $('#dashboard-section').show();
  $('#signup-div').hide();
  $('#login-div').hide();
  $('#hello-user').show()
  $('#currentUser').show().text('Hello ' + name)
}

function logged_out_layout(){
  $('#dashboard-section').hide();
  $('#login-div').show();
  $('#signup-div').show();
  $('#currentUser').hide();
  $('#hello-user').hide();
}
firebase.auth().onAuthStateChanged(function(user) {
  $.LoadingOverlay('hide');
  if (user) {
    var name = user.displayName ? user.displayName : user.email;
    if(user.photoURL) $('#profilePicture').attr('src', user.photoURL)
    console.log('current user: ', user)
    logged_in_layout();
    fill_form_dashboard(user.uid);
  } else {
    logged_out_layout();
  }
});
