"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _formiojs = require("formiojs");

var _default = angular.module('formio').directive('formBuilder', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      url: '=?',
      form: '=?',
      options: '<'
    },
    link: function link(scope, element) {
      scope.initBuilder(element[0]);
    },
    controller: ['$scope', function ($scope) {
      var builder = null;
      var builderReady = null;
      var builderElement = null;
      $scope.options = $scope.options || {}; // Initialize the builder.

      $scope.initBuilder = function (element) {
        builderElement = element;
        builderElement.innerHTML = '';
        builder = new _formiojs.Formio.FormBuilder(builderElement, $scope.form, $scope.options);
        builderReady = builder.setDisplay($scope.form.display);
      };

      $scope.$on('buildSidebar', function () {
        if (builder && builder.instance) {
          builder.instance.buildSidebar();
        }
      }); // Detect when the display changes.

      $scope.$watch('form.display', function (display) {
        if (builderReady && display) {
          builderReady.then(function () {
            if (display !== builder.form.display) {
              builder.setDisplay(display);
            }

            if ($scope.url) {
              builder.instance.url = $scope.url;
            }
          });
        }
      });
      $scope.$watch('form', function (form) {
        if (!form || !form.components) {
          return;
        }

        if (builderReady) {
          builderReady.then(function () {
            if (form !== builder.form) {
              builder.setForm(form);
            }

            if ($scope.url) {
              builder.instance.url = $scope.url;
            }
          });
        }
      });
      $scope.$on('$destroy', function () {
        if (builder && builder.instance) {
          builder.instance.destroy(true);
        }
      });
    }],
    template: '<div/>'
  };
});

exports.default = _default;