/// <reference path="./types/index.d.ts" />

interface IUserProfile {
  nickName: string
  avatarUrl?: string
  openid?: string
}

interface ISelectionState {
  industryId?: number
  industryName?: string
  stageKey?: string
  stageName?: string
}

interface IAppOption {
  globalData: {
    envId: string
    userProfile?: IUserProfile
    selection?: ISelectionState
  }
}
