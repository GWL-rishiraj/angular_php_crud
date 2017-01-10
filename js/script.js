var app = angular.module('crudapp',[]);
app.controller('crudController', function($scope, $http,$interval) {
  $http.get("api/index.php").then(function (response) {
      $scope.myData = response.data;
  });
  
    $scope.sortby = 'name'
    $scope.sortColumn = 'name'
    $scope.reversSort = false
    $scope.sortthis = function(columnName){
      $scope.reversSort = ($scope.sortColumn == columnName) ? !$scope.reversSort : false;
      $scope.sortColumn = columnName
    }

    $scope.getMessage = function() {
        setTimeout(function() {
            $http.get("api/index.php").then(function (response) {
                $scope.myData = response.data;
            });
            console.log('message:'+$scope.myData);
        }, 1000);
    }
  
    $scope.insertData=function(){
        $scope.getMessage();
        $http.post("api/index.php?insert=1",{'name':$scope.user.name,'age':$scope.user.age,'email':$scope.user.email,'password':$scope.user.password})
      .success(function(data,status,headers,config){
          console.log("data inserted successfully");
          $scope.smessage = "Form submitted";
          $('#myModal').modal('hide');
          //closeModel
      }).error(function() {
            console.log('error in form submission');
            $scope.smessage = "Error Form not submitted";
        });
    }

    $scope.deleteData = function(index) {
      $scope.loading = true;
      $scope.getMessage();
      console.log(index);
      $http.post('api/index.php?delete=1', {
            'id': index
      }).success(function() {
        $scope.loading = false;
         console.log("data deleted successfully");
      }).error(function() {
        console.log('error in delete function');
      });
    }
    $scope.editdata =function(id) {
        $http.get("api/index.php?user="+id).then(function (response) {
                  $scope.editUser = response.data;
                     $scope.editUser.age = parseInt($scope.editUser.age);
                      $('#editModal').modal('show');
              });
    }

    $scope.editUserData=function(){
          $http.post("api/index.php?edit=1",{'id':$scope.editUser.id,'name':$scope.editUser.name,'age':$scope.editUser.age,'email':$scope.editUser.email})
        .success(function(data,status,headers,config){
            console.log("data updated successfully");
            $scope.smessage = "User Edited";
            $scope.getMessage();
            $('#editModal').modal('hide');
            //closeModel
          }).error(function() {
              console.log('error in form submission');
              $scope.smessage = "Error Form not submitted";
          });
      }
    });

app.directive('username', function($q, $timeout,$http) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var usernames = [];
      $http.get("api/index.php?usernames=1").then(function (response) {
                usernames = response.data;
            });
      ctrl.$asyncValidators.username = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty model valid
          return $q.resolve();
        }
        var def = $q.defer();
        $timeout(function() {
          if (usernames.indexOf(modelValue) === -1) {
            def.resolve();
          } else {
            def.reject();
          }
        }, 2000);
        return def.promise;
      };
    }
  };
});

var compairPass = function() {
    return {
        require: "ngModel",
        scope: {
          otherModelValue : "=compairPass"
        },
        link: function(scope, element, attributes, ngModel) {
          ngModel.$validators.compairPass = function(modelValue) {
            return modelValue == scope.otherModelValue;
          };
          scope.$watch("otherModelValue", function() {
            ngModel.$validate();
          });
        } 
    };
};
app.directive("compairPass", compairPass);





 