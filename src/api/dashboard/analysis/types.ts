export type TotalNumberTypes = {
  accessTotalNum: number
  pendUrlNum: number
  suspectCounterfeitNum: number
  pushDataNum: number
  affirmCounterfeitNum: number
  understatementNum: number
  misinformationNum: number
}

export type UserAccessSource = {
  value: number
  name: string
}

export type WeeklyUserActivity = {
  value: number
  name: string
}

export type MonthlySales = {
  name: string
  estimate: number
  actual: number
}
