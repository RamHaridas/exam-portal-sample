var iti = angular.module('iti',['ngRoute','ngAnimate','ngMaterial']);

var base_url = "http://127.0.0.1:5000/"
var pages = ["Home"]

iti.config(function($routeProvider,$locationProvider){
    
    $routeProvider
    .when('/',{
        templateUrl:'/views/home.html', 
        controller:'homectrl'
    }).when('/dept',{
      templateUrl:'/views/department.html',
      controller:'deptctrl'
    }).when('/exam',{
      templateUrl:'/views/exam.html',
      controller:'examctrl'
    }).when('/question',{
      templateUrl:'/views/questions.html',
      controller:'qctrl'
    })
    .otherwise({
        redirection:'/views/home.html',
        controller:'homectrl'
    });
});


iti.controller('homectrl',function($scope,$http,$mdDialog,$location){
    $scope.statusClick = false
    function addDepartment (result){
        var data = {name:result}
        $http.post(base_url+"dept",{"name":result}).then(function (response){
          console.log(response.data)
          $scope.getAllExams()
        },function(){
          console.log("FAILED")
        })
      
    }
    $scope.departments = []
    $scope.getAllExams = function(){
      
      $http.get(base_url+"dept").then(function (response){
          $scope.departments = response.data.depts
      },function(){
        //failed to get
      })
    }
    $scope.showPrompt = function () {
      // Appending dialog to document.body to cover sidenav in docs app
      $scope.statusClick = true
      var confirm = $mdDialog.prompt()
        .title('Add Department')
        .textContent('Enter the name of Department')
        .placeholder('Department name')
        .targetEvent("prompt")
        .required(true)
        .ok('ADD')
        .cancel('CANCEL');
  
      $mdDialog.show(confirm).then(function (result) {
        //call http post to add exam
        $scope.statusClick = false
        addDepartment(result)
      }, function () {
        $scope.statusClick = false
      });
    };

    $scope.deletePopup = function(dep) {
      $scope.statusClick = true
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete the department permenantly?')
        .textContent('This step is irreversible')
        .ariaLabel('Lucky day')
        .targetEvent('confirm')
        .ok('YES')
        .cancel('NO');
  
      $mdDialog.show(confirm).then(function () {
        //yes
        $http.delete(base_url+"dept", {params: {id: dep.id}}).then(function(respnse){
          $scope.getAllExams()
          console.log(respnse.data)
          $scope.statusClick = false
        },function(){
          $scope.statusClick = false
        })
      }, function () {
        //no
        $scope.statusClick = false
      });
    };
    
    $scope.editPopup = function (dep){
      $scope.statusClick = true
      var edit = $mdDialog.prompt()
      .title("Edit Department Name")
      .targetEvent("prompt")
      .textContent('Enter the name of Department')
      .placeholder('Department name')
      .required(true)
      .ok("Done")
      .cancel("Cancel");
      
      $mdDialog.show(edit).then(function (result) {
        //call http put to add exam
        $http.put(base_url+"dept",{"id":dep.id,"name":result}).then(function(response){
          $scope.getAllExams()
          $scope.statusClick = false
        },function(){$scope.statusClick = false})
      }, function () {
        $scope.statusClick = false
      });
    }

    $scope.goToDep = function(dep){
      if(!$scope.statusClick){
      $location.path('dept').search(dep);
      }
    }
})


function alertPopup(scope,mdDialog,title,message){
    mdDialog.show(
      mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title(title)
        .textContent(message)
        .ariaLabel('Alert Dialog')
        .ok('OK')
    );
}




