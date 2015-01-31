Parse.initialize("DPg9sknVxEzO85lUE3sjksvPYW7Pt0MtFeBAChnG", "Q4w1K5R6UZBdfeIf6EiYoSEjRFDufSE6yjlnF8p8");

var ContactsApp = angular.module('ContactsApp', ['ngRoute']);

ContactsApp.config(function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/contacts.html',
            controller: 'ContactsController',
            resolve: {
                delay: function($q) {}
            }
        })
        .when('/contact/:contactId', {
            templateUrl: 'views/contact.html',
            controller: 'ContactController'
        });

});

ContactsApp.controller('ContactsController', ['$scope', function($scope) {

    var Contact = Parse.Object.extend("Contact");

    $scope.getAllContacts = function() {
        var query = new Parse.Query(Contact);
        query.find({
            success: function(contacts) {
                $scope.contacts = contacts;
                $scope.$apply();
            },
            error: function(object, error) {
                console.log(error);
            }
        });
    };
    $scope.getAllContacts();

    $scope.deleteContact = function(contact) {
        contact.destroy({
            success: function(contact) {
                $scope.getAllContacts();
            },
            error: function(myObject, error) {
                console.log('delete failed');
            }
        });
    };

    $scope.deleteAllContacts = function() {
        var query = new Parse.Query(Contact);
        query.find().then(function(contacts) {
            contacts.forEach(function(contact) {
                contact.destroy({
                    success: function() {
                        console.log('delete contact successful: ' + contact.id);
                        $scope.getAllContacts();
                    },
                    error: function() {
                        console.log('delete contact failed: ' + contact.id);
                    }
                });
            });
        }, function(error) {
            response.error(error);
        });
    }

}]);

ContactsApp.controller('ContactController', ['$scope', '$routeParams', function($scope, $routeParams) {

    $scope.params = $routeParams;
    var Contact = Parse.Object.extend("Contact");
    var parseContactObj = {};
    $scope.contact = {};

    $scope.getContact = function(contactId) {
        if (contactId !== "new") {
            var Contact = Parse.Object.extend("Contact");
            var query = new Parse.Query(Contact);
            query.get(contactId, {
                success: function(contact) {
                    $scope.contact.name = contact.attributes.name;
                    $scope.contact.dob = contact.attributes.dob;
                    $scope.contact.email = contact.attributes.email;
                    $scope.contact.phone = contact.attributes.phone;
                    parseContactObj = contact;
                    $scope.$apply();
                },
                error: function(object, error) {
                    console.log(error);
                }
            });
        }
    };

    $scope.getContact($scope.params.contactId);

    $scope.saveContact = function(contact) {
        if ($scope.params.contactId === "new") {
            parseContactObj = new Contact();
        }
        parseContactObj.set("name", $scope.contact.name);
        parseContactObj.set("dob", $scope.contact.dob);
        parseContactObj.set("email", $scope.contact.email);
        parseContactObj.set("phone", $scope.contact.phone);
        parseContactObj.save(null, {
            success: function(contact) {
                $scope.contact.name = contact.attributes.name;
                $scope.contact.dob = contact.attributes.dob;
                $scope.contact.email = contact.attributes.email;
                $scope.contact.phone = contact.attributes.phone;
                $scope.$apply();
            },
            error: function(contact, error) {
                console.log('save contact failed');
            }
        });
    };

}]);