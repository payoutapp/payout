import GapiIntegration from '@/gapi/gapi-integration'
import * as types from '@/store/mutation-types'
import _ from 'lodash'
import qs from 'querystringify'

export const createNewFile = ({commit, state}, filename) => {
  console.log('Creating new file')
  commit(types.NEW_FILE, filename)

  return new Promise((resolve, reject) => {
    GapiIntegration.saveFile(state.file, filename)
      .then(
        (result) => commit(types.FILE_SAVED, result.result),
        (reason) => commit(types.FILE_NOT_SAVED))
      .then(() => {
        updateWindowUrl(state.file.metadata)
        updateLocalStorage(state.file.metadata)
      })
      .then(() => { resolve(state.file) })
  })
}

export const saveFile = ({commit, state}) => {
  let content = JSON.stringify(state.bills)
  commit(types.EDIT_CONTENT, content)

  console.log('Saving file')
  commit(types.FILE_SAVING)

  return new Promise((resolve, reject) => {
    GapiIntegration.saveFile(state.file)
    .then(
      (result) => {
        commit(types.FILE_SAVED, result.result)
        resolve()
      },
      (reason) => {
        commit(types.FILE_NOT_SAVED)
        reject(reason)
      }
    )
  })
}

let debounceSave = _.debounce(saveFile, 2000)

export const editContent = ({commit, state}, value) => {
  // console.log('Editing file content: ' + value)
  // commit(types.EDIT_CONTENT, value)
  // GapiIntegration.contentText.setText(value)
  commit(types.EDIT_CONTENT, value)
  // GapiIntegration.saveFile(state.file)
  // save file / sync with google realtime api
  debounceSave({commit, state})
  commit(types.FILE_DIRTY)
}

export const updateContent = ({commit, state}, text) => {
  // console.log('Updating realtime file content: ', text)
  commit(types.EDIT_CONTENT, text)
  commit(types.LOAD_BILLS, text)
  // if (type === 'text_inserted') {
  //   commit(types.INSERT_CONTENT, { index, text })
  // } else if (type === 'text_deleted') {
  //   commit(types.DELETE_CONTENT, { index, text })
  // }
}

export const insertItem = ({commit, state}, value) => {
  commit(types.INSERT_BILL, value)
}

export const insertWallet = ({commit, state}, value) => {
  commit(types.INSERT_WALLET, value)
}

export const renameFile = ({commit, state}, filename) => {
  console.log('renaming file')
  GapiIntegration.filenameText.setText(filename)

  // save file / sync with google realtime api
  debounceSave({commit, state})
  commit(types.FILE_DIRTY)
}

export const updateFilename = ({commit, state}, filename) => {
  commit(types.RENAME_FILE, filename)
}

export const loadFile = ({commit, state}, file) => {
  commit(types.LOAD_FILE, file)
  updateWindowUrl(state.file.metadata)
}

export const applyFilter = ({commit, state}, filter) => {
  commit(types.APPLY_FILTER, filter)
}

export const applyTags = ({commit, state}, tags) => {
  commit(types.APPLY_TAGS, tags)
}

export const showCreateWallet = ({commit, state}, value) => {
  commit(types.SHOW_CREATE_WALLET, value)
}

export const showCreateFilter = ({commit, state}, value) => {
  commit(types.SHOW_CREATE_FILTER, value)
}

function updateWindowUrl (fileMetadata) {
  let queryVars = qs.parse(window.location.search)
  queryVars.file = fileMetadata.id
  window.history.pushState({}, fileMetadata.name, (window.location.pathname || '') + qs.stringify(queryVars, true))
}

function updateLocalStorage (fileMetadata) {
  window.localStorage.setItem('fileMetadata.id', fileMetadata.id)
}
