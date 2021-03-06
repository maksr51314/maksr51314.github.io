'use strict';

angular.module('myApp.view1', ['ngRoute', 'ui.bootstrap'])

//add config for route provider
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {

//  TODO: add this template for server
    var modelTemplate = {
        group1 : [
            {
                name : 'someName',
                surname: 'someSurname',
                tel : 1,
                email : 'kkk@kkk.com'
            },
            {
                name : 'someName2',
                surname: 'someSurname2',
                tel : 2,
                email : 'qqq@qqq.com'
            }
        ],
        group2 : [
            {
                name : 'someName3',
                surname: 'someSurname3',
                tel : 3
            },
            {
                name : 'someName4',
                surname: 'someSurname4',
                tel : 4
            }
        ]
    };

    var ALL_GPOUPS = 'All groups';

    var VALIDATE_PATTERNS  = {
        name : '0-9',
        surname: '0-9',
        email : '0-9',
        tel : '0-9'
    };

    var contactTemplate = {
        name : '',
        surname: '',
        tel : '',
        email : ''
    };

    /**
     * @constructor
     */
    function SimpleCtrl() {
        /************** definitions **************/
        //data from server
        $scope.model = modelTemplate;

        $scope.optionsGroup = this.fetchOptionsGroup( $scope.model );

        //validate patterns
        $scope.validatePattern = VALIDATE_PATTERNS;

        //default chosen Group & Contact
        $scope.chosenGroup = modelTemplate[ this.getGroups()[0] ];
        $scope.chosenContact = $scope.chosenGroup[ 0 ];

        //all groups
        $scope.groups = this.getGroups();
        $scope.changedGroup = undefined;

        //flags for control active edit states
        $scope.isNewModeActive = false;
        $scope.isNewGroupModeActive = false;

        //default names for group and contact
        $scope.newGroup = '';
        $scope.newContact = {};

        /*************** functions ***************/
        $scope.changeChosenGroupFn= this.changeChosenGroup.bind( this );
        $scope.changeGtoupFn      = this.changeGroup.bind( this );
        $scope.addNewContactFn    = this.addNewContact.bind( this );
        $scope.saveNewContactFn   = this.saveNewContact.bind( this );
        $scope.addNewGroupFn      = this.addNewGroup.bind( this );
        $scope.saveNewGroupFn     = this.saveNewGroup.bind( this );
        $scope.editContactFn      = this.editContact.bind( this );
        $scope.cancelSaveFn       = this.cancelSave.bind( this );
        $scope.deleteContactFn    = this.deleteContact.bind( this );
        $scope.deleteGroupFn      = this.deleteGroup.bind( this );
        $scope.selectNewTabFn     = this.selectNewTab.bind( this );
    }

    /**
     * get array of all groups
     * @returns {Array}
     */
    SimpleCtrl.prototype.getGroups = function() {
        return Object.keys( $scope.model );
    };

    /**
     * change group for contact
     * @param newGroup
     */
    SimpleCtrl.prototype.changeGroup = function( newGroup ) {

        if ( $scope.model[newGroup] === $scope.chosenGroup ) {
            alert('You want to chose the same group');
            return;
        }

        if ( !$scope.model[newGroup] ) $scope.model[newGroup] = [];

        $scope.model[newGroup].push( $scope.chosenContact );

        //delete unused chosenGroup
        $scope.chosenGroup.splice( $scope.chosenGroup.indexOf( $scope.chosenContact ), 1 );

        //reset data
        $scope.chosenGroup = $scope.model[ newGroup ];
        $scope.chosenContact = $scope.chosenGroup[ $scope.chosenGroup.length - 1 ];
        $scope.newGroup = '';
    };

    /**
     * on 'add new contact' mode
     */
    SimpleCtrl.prototype.addNewContact = function() {
        $scope.isNewModeActive = true;
    };

    /**
     * save new contact
     */
    SimpleCtrl.prototype.saveNewContact = function() {
        var template = angular.copy( contactTemplate );

        template.name = $scope.newContact.name;
        template.surname = $scope.newContact.name;
        template.tel = $scope.newContact.name;

        //reset new contact
        $scope.newContact = {};

        if ( $scope.groups.indexOf( $scope.newGroup ) === -1 ) {
            console.log( 'This group doesn\'t exists: ' + $scope.newGroup );
            return;
        }

        if ( !$scope.model[ $scope.newGroup ] ) $scope.model[ $scope.newGroup ] = [];

        $scope.model[ $scope.newGroup ].push( template );

        $scope.isNewModeActive = false;
    };

    /**
     *  on 'add new group' mode
     */
    SimpleCtrl.prototype.addNewGroup = function() {
        $scope.isNewGroupModeActive = true;
    };

    /**
     * save new group
     */
    SimpleCtrl.prototype.saveNewGroup = function() {
        if ( $scope.groups.indexOf( $scope.newGroup ) !== -1 ) {
            console.log( 'User wants to create new not unique group: ' + $scope.newGroup );
            return;
        }

        //added new group to model
        $scope.groups.push( $scope.newGroup );
        $scope.model[ $scope.newGroup ] = [];

        //change modes
        $scope.isNewGroupModeActive = false;

        //reset template for new group
        $scope.newGroup = '';
    };

    /**
     * update default chosen group
     */
    SimpleCtrl.prototype.changeChosenGroup = function() {
        $scope.chosenContact = $scope.chosenGroup[ 0 ];
    };

    /**
     * cancel save mode
     */
    SimpleCtrl.prototype.cancelSave = function() {
        $scope.isNewModeActive = false;
        $scope.isNewGroupModeActive = false;
    };

    /**
    * delete contact
    */
    SimpleCtrl.prototype.deleteContact = function( index ) {
        $scope.chosenGroup.splice( index, 1 );
        $scope.chosenContact = {};
    };

    /**
     * select new TAB
     * @param item
     */
    SimpleCtrl.prototype.selectNewTab = function(item) {
        $scope.chosenContact = item;
    };

    SimpleCtrl.prototype.editContact = function() {
        $scope.isNewModeActive = !$scope.isNewModeActive;
    };

    SimpleCtrl.prototype.fetchOptionsGroup = function( model ) {
        var newOptions = [];

        for ( var key in model ) {
            model[ key ].forEach(function( item ) {
                newOptions.push( item );
            })
        }

        model[ ALL_GPOUPS ] = newOptions;

        return model;
    };

    SimpleCtrl.prototype.deleteGroup = function( index ) {
        delete $scope.model[ $scope.groups[ index ] ];

        $scope.optionsGroup = this.fetchOptionsGroup( $scope.model );
        $scope.chosenGroup = {};
    };

    return new SimpleCtrl();
}]);