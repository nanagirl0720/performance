/**
 * Copyright 2014-2015 Evernote Corporation. All rights reserved.
 */

define(
  'StripesFieldModifier',
  [
    'jquery',
    'i18n',
    'static/login_files/classnames',
    'templates',
    'text!StripesUtils/requiredDecorator.html'
  ],
  function(
    $,
    i18n,
    classNames,
    templates,
    requiredDecorator
  ) {
  

  /**
   * Stripes form field object that for mananges state change on the individual field.
   *
   * @author alemanski
   */
  var fieldStateClasses = {
    warning: {
      root: 'FieldState FieldState_warning',
      input: 'FieldState-input FieldState_warning-input',
      message: 'FieldState-message FieldState_warning-message'
    },
    error: {
      root: 'FieldState FieldState_error',
      input: 'error FieldState-input FieldState_error-input',
      message: 'error-status FieldState-message FieldState_error-message'
    }
  };

  var FADE_SPEED = 300;
  var ERROR_SELECTOR = 'error';
  /**
   * TODO: this variable and its callsites should be refactored to recognize
   * their general purpose. They work for both error and warning states.
   */
  var ERROR_MESSAGE_SELECTOR = '.error-status, .FieldState_warning-message';
  var DECORATOR_SELECTOR = '.Label-required';
  var REQUIRED_SELECTOR = 'required';

  templates.addTemplate('requiredAbbr', requiredDecorator);

  var getDecorator = function(context) {
    return templates.requiredAbbr(context, true);
  };

  /**
   * StripesFieldModifier constructor.
   *
   * @param field = jQuery object or selector string of the individual form field to apply
   * the hanlders to.
   */
  var StripesFieldModifier = function(field) {
    this.$field = $(field);

    // One of the values in fieldStateClasses
    this.stateClasses = undefined;
  };

  /**
   * Adds the appropiate classes and attributes to the input and its related label to
   * signify it is required are required field. It also adds the markup to visually
   * signify that the field is required when desired.
   *
   * @param fieldLabel = The field's related label
   *
   * @param decorateLabel = boolean on whether to visually signify that the field is
   * required.
   */
  StripesFieldModifier.prototype.setRequired = function(fieldLabel, decorateLabel) {
    var $fieldLabel = $(fieldLabel);

    this.$field.addClass(REQUIRED_SELECTOR);
    this.$field.prop('required', 'required');
    this.$field.attr('aria-required', 'true');

    if (decorateLabel && $fieldLabel.has(DECORATOR_SELECTOR).length < 1) {
      i18n.done(function(intl) {
        var context = {
          required : intl.L('requiredAltText')
        };
        var requiredAbbrHtml = getDecorator(context);
        $fieldLabel.append(requiredAbbrHtml);
        $fieldLabel.addClass(REQUIRED_SELECTOR);
      });
    }
  };

  /**
   * Removes the appropiate classes and attributes from the input that signify it as
   * required. Removes the appropriate class name from the label, and removes the markup
   * that visually signifies that the field is required.
   *
   * @param fieldLabel = DOM object of the field's related label
   */
  StripesFieldModifier.prototype.removeRequired = function(fieldLabel) {
    var $fieldLabel = $(fieldLabel);

    this.$field.removeProp('required');
    this.$field.attr('aria-required', 'false');

    if (this.$field.hasClass(ERROR_SELECTOR)) {
      var $fieldMessage = this.$field.nextAll(ERROR_MESSAGE_SELECTOR).first();
      this.clearState();
    }
    if ($fieldLabel.length > 0) {
      $fieldLabel.children(DECORATOR_SELECTOR).remove();
    }
    $fieldLabel.removeClass(REQUIRED_SELECTOR);
  };

  /**
   * Builds up the fields warning or error message, adds it to the DOM, applies the
   * FieldState classes to the field and it's error message, and then calls the
   * .setupFieldEventHandler() method
   *
   * @param messageString = Required string to be used in building up the
   * fields related message.
   *
   * @param stateType = Required String value of 'warning' or 'error' to select the state
   * type to be applied to the field and it's related parts.
   *
   * @param disableSetupHandler = Optional Boolean used to determine whether to disable
   * .setupFieldEventHandler(), false by default
   */
  StripesFieldModifier.prototype.setState = function(messageString, stateType,
      disableSetupHandler) {
    this.stateClasses = fieldStateClasses[stateType];
    this.$field.addClass(this.stateClasses.input);
    this.renderMessage(messageString);
    if (this.hasState === undefined || this.hasState === false) {
      this.hasState = true;
    }
    if (!disableSetupHandler) {
      this.setupFieldEventHandler();
    }
  };

  /**
   * Wrapper method for setState() that passes the message string though and sets the
   * state as an warning.
   *
   * @param messageString = Required string to be used in building up the
   * fields related message.
   * 
   * @param disableSetupHandler = Optional Boolean that, when set to true, prevents
   * the default behavior of removing the message upon onKeyup and onChange
   */
  StripesFieldModifier.prototype.setWarning = function(messageString, disableSetupHandler) {
    this.setState(messageString, 'warning', disableSetupHandler);
  };

  /**
   * Wrapper method for setState() that passes the message string though and sets the
   * state as an error.
   *
   * @param messageString = Required string to be used in building up the
   * fields related message.
   * 
   * @param disableSetupHandler = Optional Boolean that, when set to true, prevents
   * the default behavior of removing the message upon onKeyup and onChange
   */
  StripesFieldModifier.prototype.setError = function(messageString, disableSetupHandler) {
    this.setState(messageString, 'error', disableSetupHandler);
  };

  /**
   * Removes that FieldState classes from the input and removes the related message
   * from the DOM.
   */
  StripesFieldModifier.prototype.clearState = function() {
    var $fieldMessage = this.$field.nextAll(ERROR_MESSAGE_SELECTOR).first();
    var inputClasses = fieldStateClasses.warning.input + ' '
      + fieldStateClasses.error.input;
    this.$field.removeClass(inputClasses);
    $($fieldMessage).remove();
  };

  StripesFieldModifier.prototype.removeError = function(fieldMessage, statefulField) {
    fieldMessage.animate({
      height: '0px',
      opacity: '0'
      },
      FADE_SPEED,
      function() {
        if (window.parent && window.parent.feedbackErrorRemoveCallback) {
          window.parent.feedbackErrorRemoveCallback();
        } else if (window.feedbackErrorRemoveCallback) {
          window.feedbackErrorRemoveCallback();
        }
        statefulField.clearState();
    });
  };

  /**
   * Set ups onKeyup and onChanges event listening for field. When one of these events
   * is fired it animates out the fieldMessage for field it is called on, and on
   * completion of the animiation it calls the .clearState() method which handles the
   * actual state clearing.
   */
  StripesFieldModifier.prototype.setupFieldEventHandler = function() {
    var $currentField = this.$field;
    var $fieldMessage = $currentField.nextAll(ERROR_MESSAGE_SELECTOR).first();
    var statefulField = this;
    if (this.hasState === undefined || this.hasState === false) {
      this.hasState = true;
    }

    var stateRemovalHandler = function(e) {
      //Don't clear errors on pressing enter
      if (statefulField.hasState === true && e.which != 13) {
        statefulField.removeError($fieldMessage, statefulField);
        statefulField.hasState = false;
      }
    };

    if ($currentField.is('select') || $currentField.is(':checkbox')) {
      $currentField.bind('change', stateRemovalHandler);
    } else {
      $currentField.bind('keyup', stateRemovalHandler);
    }
  };

  /**
   * Build up error or warning and apply it to the DOM.
   *
   * @param messageString = Required String to be used in building up the
   * fields related message.
   *
   * @param stateType = String value of 'warning' or 'error' to select the state
   * type to be applied to the field and it's related parts. Required when the state
   * type has not already been set via .setState(), .setError(), or .setWarning()
   *
   * @TODO (alemanski) Refactor to use more generic selector for in place
   * of `ERROR_MESSAGE_SELECTOR`
   */
  StripesFieldModifier.prototype.renderMessage = function(messageString) {
    var $fieldMessage = this.$field.nextAll(ERROR_MESSAGE_SELECTOR).first();
    if ($fieldMessage.length < 1) {
      var $message = $('<div/>');
      $message.html(messageString);
      $message.addClass(classNames(this.stateClasses.message, this._getQaClassName()));
      $message.insertAfter(this.$field);
    } else {
      $fieldMessage.html(messageString);
    }
  };

  /**
   * This prefix must match CustomTagErrorRenderer.QA_CLASS_PREFIX
   */
  StripesFieldModifier.prototype._getQaClassName = function() {
    return 'qa-ValidationError-' + this.$field.attr('name');
  };

  StripesFieldModifier.fieldStateClasses = fieldStateClasses;

  return StripesFieldModifier;
});
