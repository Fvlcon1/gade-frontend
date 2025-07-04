export type FilterStatus = 'active' | 'inactive' | 'pending'
export type FilterRoles = 'admin' | 'standard'

export interface IMetricCard {
    title : string,
    value : string,
    color : string
    icon : any
}

export interface IUserInfo {
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    role: string,
    last_active: string
    status: string,
    department: string,
    invite_id: number
}