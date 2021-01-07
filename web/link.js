/* eslint-disable no-restricted-globals */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

let config;
let createDialog; let
    deleteDialog;
let snackBar;
let select;

window.onload = async () => {
    config = $('#data-container').data('config');
    initMDCElements();
};

function initMDCElements() {
    [].map.call(document.querySelectorAll('.mdc-list'), (el) => new mdc.list.MDCList(el));
    mdc.linearProgress.MDCLinearProgress.attachTo(document.querySelector('.mdc-linear-progress'));
    createDialog = new mdc.dialog.MDCDialog(document.querySelector('#create-link'));
    deleteDialog = new mdc.dialog.MDCDialog(document.querySelector('#delete-link'));
    mdc.textField.MDCTextField.attachTo(document.querySelector('.mdc-text-field'));
    snackBar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
    snackBar.timeoutMs = 10000;
    select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'));
}

function removeLink(documentID, linkedDocumentID) {
    deleteDialog.open();
    deleteDialog.listen('MDCDialog:closed', (reason) => {
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
                hideOverlay();
            }).fail((err) => {
                console.error(err);
                failSnackbar(`Die Verlinkung konnte aufgrund eines Fehlers nicht gelöscht werden: ${err.message ? err.message : err}`);
            });
        }
    });
}

function search() {
    showOverlay();
    const searchText = $('#search-fulltext').val();
    const category = select.value;
    $.ajax({
        method: 'GET',
        url: `${config.global.host}/dms/r/${config.global.repositoryId}/sr/?objectdefinitionids=%5B%22${category}%22%5D&fulltext=${searchText}`,
        headers: {
            Accept: 'application/hal+json',
            'Content-Type': 'application/hal+json',
        },
    }).done((data) => {
        renderResults(data);
        hideOverlay();
    }).fail((err) => {
        console.error(err);
        failSnackbar(`Die Suche konnte aufgrund eines Fehlers nicht durchgeführt werden: ${err.message ? err.message : err}`);
    });
}

function renderResults(results) {
    $('#result-list').html('');
    results.items.forEach((item) => {
        $('#result-list').append(`
            <li class="mdc-list-item" tabindex="0" id="${item.id}">
            <a class="href_list" href="${item._links.details}" target="dapi_navigate">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">
                    <span class="mdc-list-item__primary-text">
                        ${item.caption}
                    </span>
                    <span class="mdc-list-item__secondary-text">
                        ${item.sortProperty.name} ${item.sortProperty.displayValue}
                    </span>
                </span>
            </a>
            <span class="material-icons icon-right remove-link"
                onclick="addLink('${item.id}')">
                add
            </span>
            </li>
        `);
    });
    if (results.items.length === 0) {
        $('#result-list').append('Es wurden keine Ergebnisse gefunden.');
    }
}

function addLink(remoteDocumentID) {
    createDialog.open();
    createDialog.listen('MDCDialog:closed', (reason) => {
        if (reason.detail.action === 'ok') {
            showOverlay();
            $.ajax({
                method: 'GET',
                url: `${config.global.host}/identityprovider/validate`,
                headers: {
                    Accept: 'application/hal+json',
                    'Content-Type': 'application/hal+json',
                },
            }).done((data) => {
                const ownID = $('.content-wrapper').attr('id');
                const creator = data.id;
                const timestamp = Date.now();
                $.ajax({
                    method: 'POST',
                    url: '/able-objectlink/link',
                    data: {
                        ownID,
                        remoteDocumentID,
                        creator,
                        timestamp,
                    },
                }).done(() => {
                    successSnackbar('Die Verlinkung wurde erfolgreich angelegt, Übersicht wird geladen...');
                    location.reload();
                }).fail((err) => {
                    console.error(err);
                    failSnackbar(`Die Verlinkung konnte aufgrund eines Fehlers nicht angelegt werden: ${err.message ? err.message : err}`);
                });
            }).fail((err) => {
                console.error(err);
                failSnackbar(`Die Verlinkung konnte aufgrund eines Fehlers nicht angelegt werden: ${err.message ? err.message : err}`);
            });
        }
    });
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
