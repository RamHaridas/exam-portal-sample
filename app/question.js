iti.controller('qctrl',function($scope,$http,$mdDialog,$location){
    
    $scope.data = $location.search()
    
    $scope.getFile = function(){
        var file = $scope.myFile
    }

    $scope.deleteQuestion = function(q){
        $scope.statusClick = true
        var confirm = $mdDialog.confirm()
        .title('Would you like to delete this question permenantly?')
        .textContent('This step is irreversible')
        .ariaLabel('Lucky day')
        .targetEvent('confirm')
        .ok('YES')
        .cancel('NO');
  
      $mdDialog.show(confirm).then(function () {
        //yes
        $http.delete(base_url+"question", {params: {id: q.id}}).then(function(respnse){
          console.log(respnse.data)
          $scope.getAllQuestions()
          $scope.statusClick = false
        },function(){
          $scope.getAllQuestions()
          $scope.statusClick = false
        })
      }, function () {
        //no
        $scope.statusClick = false
      });
    }

    $scope.editPopup = function(q){
        $mdDialog.show({
            controller:EditQuestionDialogController,
            templateUrl: '/dialogs/editQuestion.tmpl.html',
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application to prevent interaction outside of dialog
            parent: angular.element(document.body),
            locals:{dataToPass: q},
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
          }).then(function (answer) {
            $scope.getAllQuestions()
          }, function () {
            
          });
    }

    $scope.uploadImage = function(q){
        $mdDialog.show({
            controller:ImageUploadDialogController,
            templateUrl: '/dialogs/uploadImage.tmpl.html',
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application to prevent interaction outside of dialog
            parent: angular.element(document.body),
            locals:{dataToPass: q},
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
          }).then(function (answer) {
            
          }, function () {
            
          });
    }

    $scope.getAllQuestions = function(){
        $http.get(base_url+"question",{params:{
            eid:$scope.data.eid,
            sid:$scope.data.sid,
            did:$scope.data.did,
        }}).then(function(response){
            $scope.questions = response.data.questions
        },function(){alertPopup($scope,$mdDialog,"Error!","Unable to fetch data")})
    }

    $scope.addQuestion = function(){
        //console.log($scope.data.did+","+$scope.data.sid+","+ $scope.data.eid)
        $mdDialog.show({
            controller:QuestionDialogController,
            templateUrl: '/dialogs/questionDialog.tmpl.html',
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application to prevent interaction outside of dialog
            parent: angular.element(document.body),
            locals:{dataToPass: $scope.data},
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
          }).then(function (answer) {
            $scope.getAllQuestions()
          }, function () {});
    }

})


function QuestionDialogController($scope,$http,$mdDialog,$location,dataToPass){
    $scope.mdDialogData = dataToPass 
    console.log($scope.mdDialogData.id)
    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.addQuestion = function(){
        if(!$scope.isNull($scope.ques) || !$scope.isNull($scope.optA) || !$scope.isNull($scope.optB) 
            || !$scope.isNull($scope.optC) || !$scope.isNull($scope.optD) || !$scope.isNull($scope.ans)){
            $scope.mylabel = "Please Fill all fields"
            return;
        }

        $http.post(base_url+"question",{
            "question":$scope.ques,
            "optionA":$scope.optA,
            "optionB":$scope.optB,
            "optionC":$scope.optC,
            "optionD":$scope.optD,
            "answer":$scope.ans,
            "e_id":$scope.mdDialogData.eid,
            "d_id":$scope.mdDialogData.did,
            "sem":$scope.mdDialogData.sid
        }).then(function(response){
            alertPopup($scope,$mdDialog,"Success!","Question Saved Successfuly")
        },function(){
            alertPopup($scope,$mdDialog,"ERROR","SERVER ERROR")
        })

        $mdDialog.hide();
    }
    $scope.isNull = function(val){
        if (val == null){
            return false
        }
        return true;
    }
}
function ImageUploadDialogController($scope,$http,$mdDialog,$location,dataToPass){
    $scope.mdDialogData = dataToPass 

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.upload = function(){
       if(!$scope.file){
           $scope.notice = "Please add image first!"
           return
       }
       var form = new FormData()
       form.append('image',$scope.file)
       form.append('id',$scope.mdDialogData.id)
       
       $http.patch(base_url+"question",form,{
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      }).then(function(response){
        alertPopup($scope,$mdDialog,"MESSAGE",response.msg ? response.msg : "Uploaded Successfully!")
       },function(){alertPopup($scope,$mdDialog,"Error","Upload Failed")})
       $mdDialog.hide();
    }
    //display image after selecting
    $scope.loadImage = function(e){
        $scope.notice = ""
        var reader = new FileReader()
        eve = e
        
        reader.onload = function(eve)  {
            // the result image data
            $scope.url = eve.target.result;
            $scope.$apply();
         }
         $scope.file = e.target.files[0]
         reader.readAsDataURL(e.target.files[0]);
    }
}  
function EditQuestionDialogController($scope,$http,$mdDialog,$location,dataToPass){
    $scope.mdDialogData = dataToPass 

    $scope.ques = $scope.mdDialogData.question
    $scope.optA = $scope.mdDialogData.A
    $scope.optB = $scope.mdDialogData.B
    $scope.optC = $scope.mdDialogData.C
    $scope.optD = $scope.mdDialogData.D
    $scope.ans = $scope.mdDialogData.answer

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.editUpload = function(){
        if(!$scope.isNull($scope.ques) || !$scope.isNull($scope.optA) || !$scope.isNull($scope.optB) 
            || !$scope.isNull($scope.optC) || !$scope.isNull($scope.optD) || !$scope.isNull($scope.ans)){
            $scope.mylabel = "Please Fill all fields"
            return;
        }

        $http.put(base_url+"question",{
            "question":$scope.ques,
            "optionA":$scope.optA,
            "optionB":$scope.optB,
            "optionC":$scope.optC,
            "optionD":$scope.optD,
            "answer":$scope.ans,
            "id":$scope.mdDialogData.id
        }).then(function(response){
            alertPopup($scope,$mdDialog,"Success!","Question Updated Successfuly")
        },function(){
            alertPopup($scope,$mdDialog,"ERROR","SERVER ERROR")
        })

        $mdDialog.hide();
    }

    $scope.isNull = function(val){
        if (val == null){
            return false
        }
        return true
    }
}