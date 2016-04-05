import { secureFetch } from '../util/util'

import { fetchProject } from './projects'

// Feed Source Actions

export function requestingFeedSources () {
  return {
    type: 'REQUESTING_FEEDSOURCES'
  }
}

export function receiveFeedSources (projectId, feedSources) {
  return {
    type: 'RECEIVE_FEEDSOURCES',
    projectId,
    feedSources
  }
}

export function fetchProjectFeeds (projectId) {
  return function (dispatch, getState) {
    dispatch(requestingFeedSources())
    const url = '/api/manager/secure/feedsource?projectId=' + projectId
    return secureFetch(url, getState())
      .then(response => response.json())
      .then(feedSources => {
        dispatch(receiveFeedSources(projectId, feedSources))
      })
  }
}

function requestingPublicFeeds () {
  return {
    type: 'REQUESTING_PUBLIC_FEEDS'
  }
}

function receivePublicFeeds (feeds) {
  return {
    type: 'RECEIVE_PUBLIC_FEEDS',
    feeds
  }
}

export function createFeedSource (projectId) {
  return {
    type: 'CREATE_FEEDSOURCE',
    projectId
  }
}

export function savingFeedSource () {
  return {
    type: 'SAVING_FEEDSOURCE'
  }
}

export function saveFeedSource (props) {
  return function (dispatch, getState) {
    dispatch(savingFeedSource())
    const url = '/api/manager/secure/feedsource'
    return secureFetch(url, getState(), 'post', props)
      .then((res) => {
        return dispatch(fetchProject(props.projectId))
      })
  }
}

export function updateFeedSource (feedSource, changes) {
  return function (dispatch, getState) {
    dispatch(savingFeedSource())
    const url = '/api/manager/secure/feedsource/' + feedSource.id
    return secureFetch(url, getState(), 'put', changes)
      .then((res) => {
        //return dispatch(fetchProjectFeeds(feedSource.projectId))
        return dispatch(fetchFeedSource(feedSource.id, true))
      })
  }
}

export function updateExternalFeedResource (feedSource, resourceType, properties) {
  return function (dispatch, getState) {
    console.log('updateExternalFeedResource', feedSource, resourceType, properties);
    dispatch(savingFeedSource())
    const url = `/api/manager/secure/feedsource/${feedSource.id}/updateExternal?resourceType=${resourceType}`
    return secureFetch(url, getState(), 'put', properties)
      .then((res) => {
        return dispatch(fetchFeedSource(feedSource.id, true))
      })
  }
}


export function deletingFeedSource () {
  return {
    type: 'DELETING_FEEDSOURCE'
  }
}

export function deleteFeedSource (feedSource, changes) {
  return function (dispatch, getState) {
    dispatch(deletingFeedSource())
    const url = '/api/manager/secure/feedsource/' + feedSource.id
    return secureFetch(url, getState(), 'delete')
      .then((res) => {
        return dispatch(fetchProjectFeeds(feedSource.projectId))
      })
  }
}

export function requestingFeedSource () {
  return {
    type: 'REQUESTING_FEEDSOURCE'
  }
}

export function receiveFeedSource(feedSource) {
  return {
    type: 'RECEIVE_FEEDSOURCE',
    feedSource
  }
}

export function fetchFeedSource(feedSourceId, fetchVersions) {
  return function (dispatch, getState) {
    console.log('fetchFeedSource', feedSourceId);
    dispatch(requestingFeedSource())
    const url = '/api/manager/secure/feedsource/' + feedSourceId
    return secureFetch(url, getState())
      .then(response => response.json())
      .then(feedSource => {
        console.log('got feedSource', feedSource);
        //dispatch(fetchProject(feedSource.projectId))
        //return feedSource
        dispatch(receiveFeedSource(feedSource))
        if(fetchVersions) dispatch(fetchFeedVersions(feedSource))
      })
  }
}

export function fetchFeedSourceAndProject (feedSourceId, unsecured) {
  return function (dispatch, getState) {
    dispatch(requestingFeedSource())
    const apiRoot = unsecured ? 'public' : 'secure'
    const url = `/api/manager/${apiRoot}/feedsource/${feedSourceId}`
    return secureFetch(url, getState())
      .then(response => response.json())
      .then(feedSource => {
        dispatch(fetchProject(feedSource.projectId, unsecured))
        return feedSource
      })
  }
}

export function fetchPublicFeedSource (feedSourceId) {
  return function (dispatch, getState) {
    dispatch(requestingFeedSource())
    const url = '/api/manager/public/feedsource/' + feedSourceId
    return secureFetch(url, getState())
      .then(response => response.json())
      .then(feedSource => {
        dispatch(receivePublicFeeds())
        return feedSource
      })
  }
}

export function runningFetchFeed () {
  return {
    type: 'RUNNING_FETCH_FEED'
  }
}

export function runFetchFeed (feedSource) {
  return function (dispatch, getState) {
    dispatch(runningFetchFeed())
    const url = `/api/manager/secure/feedsource/${feedSource.id}/fetch`
    return secureFetch(url, getState(), 'post')
      .then(response => response.json())
      .then(result => {
        console.log('fetchFeed result', result)
        dispatch(fetchFeedVersions(feedSource))
      })
  }
}

export function requestingFeedVersions () {
  return {
    type: 'REQUESTING_FEEDVERSIONS'
  }
}

export function receiveFeedVersions (feedSource, feedVersions) {
  return {
    type: 'RECEIVE_FEEDVERSIONS',
    feedSource,
    feedVersions
  }
}

export function fetchFeedVersions (feedSource, unsecured) {
  return function (dispatch, getState) {
    dispatch(requestingFeedVersions())
    const apiRoot = unsecured ? 'public' : 'secure'
    const url = `/api/manager/${apiRoot}/feedversion?feedSourceId=${feedSource.id}`
    return secureFetch(url, getState())
      .then(response => response.json())
      .then(versions => {
        dispatch(receiveFeedVersions(feedSource, versions))
      })
  }
}

// export function requestingPublicFeedVersions () {
//   return {
//     type: 'REQUESTING_PUBLIC_FEEDVERSIONS'
//   }
// }
//
// export function receivePublicFeedVersions (feedSource, feedVersions) {
//   return {
//     type: 'RECEIVE_PUBLIC_FEEDVERSIONS',
//     feedSource,
//     feedVersions
//   }
// }

export function fetchPublicFeedVersions (feedSource) {
  return function (dispatch, getState) {
    dispatch(requestingFeedVersions())
    const url = `/api/manager/public/feedversion?feedSourceId=${feedSource.id}&public=true`
    return secureFetch(url, getState())
      .then(response => response.json())
      .then(versions => {
        dispatch(receiveFeedVersions(feedSource, versions))
      })
  }
}

export function uploadingFeed () {
  return {
    type: 'UPLOADING_FEED'
  }
}

export function uploadFeed (feedSource, file) {
  return function (dispatch, getState) {
    dispatch(uploadingFeed())
    const url = `/api/manager/secure/feedversion?feedSourceId=${feedSource.id}`

    var data = new FormData()
    data.append('file', file)
    //data.append('user', 'hubot')

    return fetch(url, {
      method: 'post',
      headers: { 'Authorization': 'Bearer ' + getState().user.token },
      body: data
    }).then(result => {
      console.log('uploadFeed result', result)
      dispatch(fetchFeedVersions(feedSource))
    })
  }
}

export function deletingFeedVersion () {
  return {
    type: 'DELETING_FEEDVERSION'
  }
}

export function deleteFeedVersion (feedSource, feedVersion, changes) {
  return function (dispatch, getState) {
    dispatch(deletingFeedVersion())
    const url = '/api/manager/secure/feedversion/' + feedVersion.id
    return secureFetch(url, getState(), 'delete')
      .then((res) => {
        return dispatch(fetchFeedVersions(feedSource))
      })
  }
}

export function requestingValidationResult () {
  return {
    type: 'REQUESTING_VALIDATION_RESULT'
  }
}

export function receiveValidationResult (feedSource, feedVersion, validationResult) {
  return {
    type: 'RECEIVE_VALIDATION_RESULT',
    feedSource,
    feedVersion,
    validationResult
  }
}

export function fetchValidationResult (feedSource, feedVersion) {
  return function (dispatch, getState) {
    dispatch(requestingValidationResult())
    const url = `/api/manager/secure/feedversion/${feedVersion.id}/validation`
    return secureFetch(url, getState())
    .then(response => response.json())
    .then(result => {
      dispatch(receiveValidationResult(feedSource, feedVersion, result))
    })
  }
}
