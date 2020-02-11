// Web-49370 make request to Growsumo to confirm username in cookie.
define(['jquery', 'domReady!'], function($) {
  function getGrowsumoUsername(addToDOMFn) {
    $.ajax({
      method: 'GET',
      url: 'https://grsm.io/pr/gpk/pk_TK86G81qlDu89wkbTxgRJUlp02Ww3TLB',
      xhrFields: {
        withCredentials: true
      }
    }).done(addToDOMFn);
  }

  function prefixedReferralCode(code) {
    var splitCode = code.split('-');
    var hasACode = ['ebcc', 'cc', 'cl'].indexOf(splitCode[0]) > 0;
    return hasACode ? code : 'ebcc-' + code;
  }

  return {
    getGrowsumoUsername: getGrowsumoUsername,
    prefixedReferralCode: prefixedReferralCode
  };
});
