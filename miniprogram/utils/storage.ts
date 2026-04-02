const SELECTION_KEY = 'selectionState'
const USER_KEY = 'userProfile'
const TASKS_KEY = 'archiveTasks'
const RECORDS_KEY = 'diagnosisRecords'
const FAVORITES_KEY = 'favoriteGuides'

export function getSelectionState() {
  return wx.getStorageSync(SELECTION_KEY) || {}
}

export function setSelectionState(selection: Record<string, any>) {
  wx.setStorageSync(SELECTION_KEY, selection)
}

export function getUserProfile() {
  return wx.getStorageSync(USER_KEY) || null
}

export function setUserProfile(profile: Record<string, any>) {
  wx.setStorageSync(USER_KEY, profile)
}

export function getArchiveTasks() {
  return wx.getStorageSync(TASKS_KEY) || []
}

export function setArchiveTasks(tasks: any[]) {
  wx.setStorageSync(TASKS_KEY, tasks)
}

export function getDiagnosisRecords() {
  return wx.getStorageSync(RECORDS_KEY) || []
}

export function addDiagnosisRecord(record: Record<string, any>) {
  const records = getDiagnosisRecords()
  records.unshift(record)
  wx.setStorageSync(RECORDS_KEY, records.slice(0, 20))
}

export function getFavorites() {
  return wx.getStorageSync(FAVORITES_KEY) || []
}

export function setFavorites(list: any[]) {
  wx.setStorageSync(FAVORITES_KEY, list)
}
