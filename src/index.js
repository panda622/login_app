import './css/style.sass';

$( document ).ready(function() {
  $.LoadingOverlay("show");
  $("#logout").on('click', () => {
    confirm("Are you suree?");
    firebase.auth().signOut().then(function() {
      location.reload();
    }, function(error) {
      // An error happened.
    });
  })

  $("#avatar").change(function() {
    readURL(this);
  });

  $( "#birthday" ).datepicker({
   maxDate: '0',
   dateFormat: 'dd/mm/yy',
   }).on('change', function() {
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

$("#dashboard-form").submit(e => e.preventDefault());
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
      text: "Update Information"
    });
    let user = firebase.auth().currentUser;
    var form_fields = ['username', 'first_name', 'last_name', 'birthday', 'gender', 'phone', 'address']
    let data = {}
    form_fields.forEach( x => {
      return data[x] = $('#' + x).val();
    })
    firebase.database().ref('users/' + user.uid).set(data);
    fill_form_dashboard(user.uid);
    var file = $('#avatar').get(0).files[0];

    $.LoadingOverlay("hide");
    if(file) {
      $.LoadingOverlay("show", {
        image       : "",
        progress    : true,
        text: "Uploading Image",
        progressColor: "#7FDBFF"
      });
      var storageRef = firebase.storage().ref();
      var uploadTask = storageRef.child(`/${user}/${user.uid}/avatar`).put(file);
      uploadTask.on('state_changed', function(snapshot){
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        $.LoadingOverlay("progress", progress);
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
            toastr["success"]("Update Success")
          }).catch(function(error) {
            // An error happened.
            toastr["error"]("Something went wrong :(")
          });

        });
      });
    }
  }
})

$("#sign-up-form").validate({
  messages: {
    'sign-up-password-confirm': {
      equalTo: "Password not match",
    }
  },
  rules: {
    'sign-up-password': {
      required: true,
      minlength: 6
    },
    'sign-up-password-confirm': {
      equalTo: "#sign-up-password",
      required: true,
      minlength: 6
    },
    'sign-up-email': {
      required: true,
      email: true
    }
  },
  submitHandler: function(form) {
    $( "#sign-up-form" ).submit(function( event ) {
      $.LoadingOverlay('show');
      event.preventDefault();
      var myemail = $('#sign-up-email').val();
      var mypassword = $('#sign-up-password').val();
      firebase.auth().createUserWithEmailAndPassword(myemail, mypassword).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if(errorMessage !== ''){
          $.LoadingOverlay('hide');
          toastr["error"](errorMessage)
        }
      });
    });
  }
});
