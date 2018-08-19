import './js/state'
import './css/style.sass';

$( document ).ready(function() {
  $("#logout").on('click', () => {
    confirm("Are you sure?");
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }, function(error) {
      // An error happened.
    });
  })

  $("#avatar").change(function() {
    readURL(this);
  });

});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('#preview').attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}

$( "#login-form" ).submit(function( event ) {
  $.LoadingOverlay('show');
  event.preventDefault();
  var myemail = $('#login-email').val();
  var mypassword = $('#login-password').val();
  firebase.auth().signInWithEmailAndPassword(myemail, mypassword).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if(errorMessage !== ''){
      $.LoadingOverlay('hide');
      toastr["error"](errorMessage)
    }
  });
});

$("#dashboard-form").validate({
  rules: {
    birthday: {
      date: true
    },
    phone: {
      digits: true
    }
  },
  submitHandler: function(form) {
    $.LoadingOverlay("show", {
      image       : "",
      progress    : true,
      progressColor: "#7FDBFF"
    });
      // var form_fields = ['username', 'first_name', 'last_name', 'birthday', 'gender', 'phone', 'address']
      // var data = {};
    // for(var i=0; i < form_fields.length; i++){
    //   data[form_fields[i]] = $('#' + form_fields[i]).val()
    // }
    // Create a root reference
    var storageRef = firebase.storage().ref();
    var file = $('#avatar').get(0).files[0];

    let user = firebase.auth().currentUser;
    var uploadTask = storageRef.child(`/${user}/${user.uid}/avatar`).put(file);
    uploadTask.on('state_changed', function(snapshot){
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) {
      // Handle unsuccessful uploads
    }, function() {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      $.LoadingOverlay("hide");
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        $('#profilePicture').attr('src', downloadURL)
        user.updateProfile({
          photoURL: downloadURL
        }).then(function() {
          // Update successful.
        }).catch(function(error) {
          // An error happened.
        });

      });
    });
  }
})
