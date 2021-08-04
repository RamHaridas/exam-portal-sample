

iti.controller('deptctrl',function($scope,$http,$mdDialog,$location){
    $scope.semesters = [1,2,3,4,5,6]
    
    var data = $location.search()
    $scope.goToExam = function(sem){
        
        args = {'sid':sem,'did':data.id}
        $location.path("exam").search(args)
    }
})


iti.controller('examctrl',function($scope,$http,$mdDialog,$location,$route){
    $scope.data = $location.search()
    $scope.exam = []
    $scope.statusClick = false

    //console.log(data.sid+","+data.did)
    $scope.navogateToQuestions = function(exam){
      var args = {
        'sid':$scope.data.sid,
        'did':$scope.data.did,
        'eid':exam.id
      }
      if (!$scope.statusClick){
        $location.path('question').search(args)
      }
    }

    $scope.getCurrExams = function(){
        console.log($scope.data.did+","+$scope.data.sid)
        $scope.exam.splice(0,$scope.exam)
        $http.get(base_url+"exam",{params:{d_id:$scope.data.did,sem:$scope.data.sid}}).then(function(response){
            $scope.exam = response.data.exams
        },function(){alert($scope,$mdDialog,"Error","Failed Fetching Exams")})
    }
    $scope.addNewExam = function (ev) {
        $mdDialog.show({
          controller:DialogController,
          templateUrl: '/views/dialog1.tmpl.html',
          // Appending dialog to document.body to cover sidenav in docs app
          // Modal dialogs should fully cover application to prevent interaction outside of dialog
          parent: angular.element(document.body),
          locals:{dataToPass: $scope.data},
          clickOutsideToClose: true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        }).then(function (answer) {
            $scope.getCurrExams()
        }, function () {
          $scope.statusClick = false
        });
      }

      $scope.editExam = function (exam) {
        $scope.statusClick = true
        $mdDialog.show({
          controller:EditDialogController,
          templateUrl: '/dialogs/editDialog.tmpl.html',
          // Appending dialog to document.body to cover sidenav in docs app
          // Modal dialogs should fully cover application to prevent interaction outside of dialog
          parent: angular.element(document.body),
          locals:{dataToPass: exam},
          clickOutsideToClose: true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        }).then(function (answer) {
            $scope.getCurrExams()
        }, function () {
          $scope.statusClick = false
        });
      }

      $scope.deleteExam = function(exam){
        $scope.statusClick = true
        var confirm = $mdDialog.confirm()
        .title('Would you like to delete the exam permenantly?')
        .textContent('This step is irreversible')
        .ariaLabel('Lucky day')
        .targetEvent('confirm')
        .ok('YES')
        .cancel('NO');
  
      $mdDialog.show(confirm).then(function () {
        //yes
        $http.delete(base_url+"exam", {params: {id: exam.id}}).then(function(respnse){
          console.log(respnse.data)
          $scope.getCurrExams()
          $scope.statusClick = false
        },function(){
          $scope.getCurrExams()
          $scope.statusClick = false
        })
      }, function () {
        //no
        $scope.getCurrExams()
        $scope.statusClick = false
      });
      }
})

function DialogController($scope,$mdDialog,$http,dataToPass) {
    $scope.mdDialogData = dataToPass 
    // console.log($scope.mdDialogData.sid+","+$scope.mdDialogData.did)
    
    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
      $mdDialog.hide(answer);
    };

    $scope.save = function(){
        
        
        if($scope.name == null || $scope.marks == null){
            alertPopup($scope,$mdDialog,"Error","Please fill all fields to save exam")
            return;
        }
        $http.post(base_url+"exam",{
            "sem":$scope.mdDialogData.sid,
            "d_id":$scope.mdDialogData.did,
            "name":$scope.name,
            "marks":$scope.marks
        }).then(function(response){
            alertPopup($scope,$mdDialog,"Message",response.data.msg ? response.data.msg:"Success")
        },function(){
            alertPopup($scope,$mdDialog,"FAILED","SERVER ERROR")
        })
        $mdDialog.hide();
    }
  }


  function EditDialogController($scope,$mdDialog,$http,dataToPass){
    $scope.mdDialogData = dataToPass 
    $scope.name = $scope.mdDialogData.name
    $scope.marks = $scope.mdDialogData.mark
    $scope.hide = function () {
        $mdDialog.hide();
      };
  
      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      $scope.update = function(){
          if($scope.name == null || $scope.marks == null){
              alertPopup($scope,$mdDialog,"ERROR","No field must be left blank")
              return;
          }
          $http.put(base_url+"exam",{
              "id":$scope.mdDialogData.id,
              "name":$scope.name,
              "marks":$scope.marks
            }).then(function(response){
            
          },function(){alertPopup($scope,$mdDialog,"FAILED","SERVER ERROR")})
          $mdDialog.hide()
      }

  }



