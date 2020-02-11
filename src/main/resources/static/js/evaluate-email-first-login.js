/* ===================================================================================
 Copyright 2017 Evernote Corporation. All rights reserved.

 evaluate-email-first-login.js

 Javascript class to help create the animation on a 2-step login form.

 Instructions on adding 2-step animation to your login form:
 1. Your form should have at the minimum a username textbox, password container,
 password textbox, login button container, login button, and an extra hidden field
 to make the AJAX callback work.
 2. An example of the extra hidden field:
 <input type="hidden" name="evaluateUsername" id="eventToTrigger" />
 3. Your jsp page, or one the imported files, needs to include the css file
 redesign/global/css/encss/modules/pull_animation.less
 4. The appear-and-disappear pulling animation will be done by container objects around
 the control you want to animate. For example, if you want to make your password
 textbox animate, you need to put a container around your password textbox, such as
 a div or li.
 5. The animated containers need to have "CanBePulledDown" added as a class.
 I was hoping to not require web programmers to put CanBePulledDown onto the web
 controls, but I couldn't make the controls disappear without creating a flicker
 effect. Putting CanBePulledDown on your control will initially render the control
 as visible.
 6. If you want the "pullable" control to initially be visible, add "PulledIntoView"
 as a class along with the class from step #5.
 7. The responseMessage component (not the container to the responseMessage) can have
 "PullableText" added as a class. It does not affect the animation at all. This class
 is only about formatting. This "PullableText" is not necessary.
 8. It's assumed that the username and password textboxes are Stripes controls. So,
 somewhere your js needs to add:
 var usernameStripes = new StripesFieldModifier('#username');
 usernameStripes.setupFieldEventHandler();
 var passwordStripes = new StripesFieldModifier('#password');
 passwordStripes.setupFieldEventHandler();
 =================================================================================== */
define(['require','jquery','actionBean','static/js/keyCode','resolve!i18n','domReady!'],function(require) {
  
  var $ = require('jquery');
  var actionBean = require('actionBean');
  var KeyCode = require('static/js/keyCode');
  var i18n = require('resolve!i18n');
  require('domReady!');

  return {
    /*
     * This should be all you need to call to set up your login form for 2-step animation.
     * The parameters are all expected to be jQuery selections, ex. $('#yourname').
     * For any parameter that doesn't apply to your page, pass in "$([])". Do not pass in
     * null.
     *
     * PARAMETERS:
     * loginForm - The form that your want to submit for username evaluation and login.
     *              This form should contain the username, password, and login button.
     * usernameText - The textbox that receives the username input.
     * passwordDiv - The div, or other container, that has the password textbox. This
     *              control will receive the commands to appear and disappear.
     * passwordText - The textbox that receives the password input.
     * responseMessageDiv - The div, or other container, that has the message text that
     *              has the component that displays any messages that result from an
     *              evaluateUsername event. This control will receive the commands to
     *              appear and disappear.
     * responseMessage - The component that will actually display the messages from
     *              evaluateUsername. The most common message will be "username does not
     *              exist". The parameters "responseMessageDiv" and "responseMessage"
     *              could refer to the same DOM object.
     * submitDiv - The div, or some other container, that has the submit button. This is
     *              the container that will receive the commands to appear and disappear.
     * eventHiddenField - A hidden field that you need to create in order to get the AJAX
     *              callback to work. I'm not sure why this is needed, but it was the only
     *              way to get the login form to work as desired.
     *              Ex.
     *              <input type="hidden" name="evaluateUsername" id="eventToTrigger" />
     * loginButton - The button the user clicks to evaluate the user name and to sign in.
     * rememberMeDiv - The div, or some other container, that contains the checkbox
     *              giving the user a "remember me" option. This is the div that will
     *              receive the commands to appear and disappear.
     * forgotPasswordDiv - The div, or some other container, that contains the link
     *              for "forgot my password'. This is the container that will receive
     *              the commands to appear and disappear.
     * termsDiv - The div, or some other container, that contains the text of terms of
     *              usage. This container will receive commands to appear and disappear.
     * loginButtonTextKey - The resource key that will be the text for the login button.
     *              This parameter should just be a string, unlike the other parameters.
     *              A null value will default to "LoginForm.login"
     * passwordLoginFormSubmitOverride - Sometimes, we don't want to perform a regular
     *              submit when submitting a password. Pass a function to this parameter
     *              to perform an alternative submit action when submitting a password.
     *              An example is on LoggedOutAction.js.
     * prepareForUsernameEvaluationExtension - If there's anything extra you want to do
     *              when preparing a form to be ready for username evaluation, pass a
     *              function to this parameter. The function will have no parameters.
     * usernameEvaluationExtension - If there's anything extra you want to do when
     *              after evaluating a username or email, pass a function to this
     *              parameter. The function should accept a json object as a
     *              parameter - the same parameter defined for
     *              handleJsonFromUsernameEvaluation.
     * TODO jchoi2 7/26/17 this class will be refactored to react so bear with this ugly
     * initiation for now.
     */
    setup: function(loginForm, usernameText, passwordDiv, passwordText,
                    responseMessageDiv, responseMessage,
                    submitDiv, eventHiddenField, loginButton,
                    rememberMeDiv, forgotPasswordDiv, termsDiv, loginButtonTextKey,
                    passwordLoginFormSubmitOverride,
                    prepareForUsernameEvaluationExtension, usernameEvaluationExtension) {

      if (!loginButtonTextKey) {
        loginButtonTextKey = 'LoginForm.login';
      }

      function submitFormToHandleResponseInJavascript() {
        $.ajax({
          type: 'POST',
          url: loginForm.attr('action'),
          data: loginForm.serialize(),
          success: handleJsonFromUsernameEvaluation,
          dataType: 'json',
          error: handleUnexpectedErrorFromUsernameEvaluation
        });
        return false;
      }

      function removeTabStopFromAllRows() {
        // workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1069739
        rememberMeDiv.prop('tabindex', -1);
        forgotPasswordDiv.prop('tabindex', -1);
        passwordDiv.prop('tabindex', -1);
        submitDiv.prop('tabindex', -1);
        responseMessageDiv.prop('tabindex', -1);
        termsDiv.prop('tabindex', -1);
      }

      function changeSubmitEventToHandleUsernameEvaluationResponse() {
        loginForm.off('submit');
        loginForm.submit(submitFormToHandleResponseInJavascript);
        loginButton.val(i18n.L('LoginForm.continue'));
        loginButton.attr('name', 'evaluateUsername');
        eventHiddenField.attr('name', 'evaluateUsername');
        if (actionBean.termsKey) {
          termsDiv.text(i18n.L(actionBean.termsKey, [i18n.L('LoginForm.continue')]));
        }
      }

      function prepareFormForUsernameEvaluationExceptOnTabKeyDown(e) {
        var keyCode = e.keyCode || e.which;

        // Need to prevent Safari auto fill from hiding password textbox
        if (!keyCode) {
          return false;
        }

        if (keyCode !== KeyCode.TAB) {
          prepareFormForUsernameEvaluation();
        }

        return true;
      }

      function preventSafariFromRemovingErrorMessage(e) {
        return e.keyCode || e.which;
      }

      function prepareFormForUsernameEvaluation() {
        changeSubmitEventToHandleUsernameEvaluationResponse();
        hideRow(passwordDiv);
        hideRow(responseMessageDiv);
        hideRow(forgotPasswordDiv);
        showRow(rememberMeDiv);
        showRow(submitDiv);
        showRow(termsDiv);
        passwordText.prop('disabled', true);
        if (prepareForUsernameEvaluationExtension !== null) {
          prepareForUsernameEvaluationExtension();
        }

        // The keyup is to clear any error under the password textbox.
        // The delay is to avoid animation associated with clearing the error because
        // there's already enough animation going on.
        window.setTimeout(
          function() {
            passwordText.keyup();
          }, 1200);
      }

      function prepareFormForPasswordLogin() {
        loginButton.attr('name', 'login');
        eventHiddenField.attr('name', 'login');
        loginButton.val(i18n.L(loginButtonTextKey));
        loginForm.off('submit');
        if (actionBean.termsKey) {
          termsDiv.text(i18n.L(actionBean.termsKey, [i18n.L('LoginForm.login')]));
        }
        if (passwordLoginFormSubmitOverride !== null) {
          loginForm.submit(passwordLoginFormSubmitOverride);
        }
        showRowNow(passwordDiv);
        showRowNow(forgotPasswordDiv);
        showRow(submitDiv);
        showRow(rememberMeDiv);
        showRow(termsDiv);
        passwordText.prop('disabled', false);
        passwordText.focus();
      }

      function displayResponseMessageFromUsernameEvaluation(msg) {
        hideRow(rememberMeDiv);
        hideRow(forgotPasswordDiv);
        hideRow(submitDiv);
        hideRow(termsDiv);

        responseMessage.text(msg);
        showRow(responseMessageDiv);
      }

      function handleUnexpectedErrorFromUsernameEvaluation(e) {
        var newDoc = document.open('text/html', 'replace');
        newDoc.write(e.responseText);
        newDoc.close();
      }

      function hideRow(row) {
        row.removeClass('PulledIntoView PulledIntoViewWithoutDelay');
      }

      function showRow(row) {
        row.addClass('PulledIntoView');
      }

      function showRowNow(row) {
        row.addClass('PulledIntoViewWithoutDelay');
      }

      function handleJsonFromUsernameEvaluation(loginStatusJson) {
        if (loginStatusJson.localizedMessage) {
          changeSubmitEventToHandleUsernameEvaluationResponse();
          displayResponseMessageFromUsernameEvaluation(loginStatusJson.localizedMessage);
          return;
        }

        responseMessage.text('');
        if (loginStatusJson.usePasswordAuth) {
          prepareFormForPasswordLogin();
        } else {
          changeSubmitEventToHandleUsernameEvaluationResponse();
          displayResponseMessageFromUsernameEvaluation(loginStatusJson.displayMessage);
          if (loginStatusJson.redirectURL !== undefined) {
            window.top.location.assign(loginStatusJson.redirectURL);
          }
        }

        if (usernameEvaluationExtension !== null) {
          usernameEvaluationExtension(loginStatusJson);
        }
      }

      removeTabStopFromAllRows();

      usernameText.keydown(prepareFormForUsernameEvaluationExceptOnTabKeyDown);
      passwordText.keydown(preventSafariFromRemovingErrorMessage);

      if (passwordDiv.has('div.error-status').length > 0
        || actionBean.usePasswordAuth) {
        prepareFormForPasswordLogin();
      } else if (actionBean.evaluationMessage) {
        changeSubmitEventToHandleUsernameEvaluationResponse();
        displayResponseMessageFromUsernameEvaluation(actionBean.evaluationMessage);
      } else {
        prepareFormForUsernameEvaluation();
      }
    },

    // TODO jchoi2 7/26/17 This file will be refactored into react. Just doing this
    // clumsy code for now
    hideRow: function(row) {
      row.removeClass('PulledIntoView PulledIntoViewWithoutDelay');
    },

    showRow: function(row) {
      row.addClass('PulledIntoView');
    },

    showRowNow: function(row) {
      row.addClass('PulledIntoViewWithoutDelay');
    },

    isVisible: function(row) {
      return row.hasClass('PulledIntoView') || row.hasClass('PulledIntoViewWithoutDelay');
    }
  };
});
