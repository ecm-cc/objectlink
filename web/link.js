/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

let config;
let dialog;
let snackBar;

window.onload = async () => {
    config = $('#data-container').data('config');
    initMDCElements();
};

function initMDCElements() {
    mdc.list.MDCList.attachTo(document.querySelector('.mdc-list'));
    // mdc.linearProgress.MDCLinearProgress.attachTo(document.querySelector('.mdc-linear-progress'));
    dialog = mdc.dialog.MDCDialog.attachTo(document.querySelector('.mdc-dialog'));
    // [].map.call(document.querySelectorAll('.mdc-text-field'), (el) => new mdc.textField.MDCTextField(el));
    snackBar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
    snackBar.timeoutMs = 10000;
}

function removeLink(documentID, linkedDocumentID) {
    dialog.open();
    dialog.listen('MDCDialog:closed', (reason) => {
        if (reason.detail.action === 'ok') {
            showOverlay();
            $.ajax({
                method: 'DELETE',
                url: '/able-objectlink/link',
                data: {
                    documentID,
                    linkedDocumentID,
                },
            }).done(() => {
                successSnackbar('Die Verlinkung wurde erfolgreich gelöscht.');
                $(`#${linkedDocumentID}`).remove();
            }).fail((err) => {
                console.error(err);
                failSnackbar(`Die Verlinkung konnte aufgrund eines Fehlers nicht gelöscht werden: ${err.responseText ? err.responseText : err}`);
            }).always(() => {
                hideOverlay();
            });
        }
    });
}

/**
 * Shows a gray overlay for loading purposes
 */
function showOverlay() {
    $('#overlay').show();
}

/**
 * Hides a gray overlay when content is loaded
 */
function hideOverlay() {
    $('#overlay').hide();
}

/**
 * Shows a MDC Snackbar, used for errors
 * @param {string} text Text to be shown
 */
function failSnackbar(text) {
    $('.mdc-snackbar__surface').css('background-color', '#B00020');
    $('.mdc-snackbar__label').css('color', '#FFFFFF');
    $('.mdc-snackbar__label').text(text);
    snackBar.open();
    $('.mdc-snackbar__action').on('click', () => { snackBar.close(); });
}

/**
 * Shows a MDC Snackbar, used for the success messages
 * @param {string} text Text to be shown
 */
function successSnackbar(text) {
    $('.mdc-snackbar__surface').css('background-color', '#43A047');
    $('.mdc-snackbar__label').css('color', '#FFFFFF');
    $('.mdc-snackbar__label').text(text);
    snackBar.open();
    $('.mdc-snackbar__action').on('click', () => { snackBar.close(); });
}
